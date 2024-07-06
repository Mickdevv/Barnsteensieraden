from typing import Any
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

from base.serializers import *
from base.models import Product
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, OrderSerializer

from datetime import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data['orderItems']
    
    if orderItems and len(orderItems) == 0:
        return Response({'detail':'No order items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        order = Order.objects.create(
            user = user,
            paymentMethod = data['paymentMethod'],
            shippingPrice = data['shippingPrice'],
            totalPrice = data['totalPrice'],
        )
        shippingAddress = ShippingAddress.objects.create(
            order = order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postcode=data['shippingAddress']['postcode'],
            country=data['shippingAddress']['country'],
            name=data['shippingAddress']['name'],
        )
        
        for i in orderItems:
            product = Product.objects.get(_id=i['product'])
            
            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty = i['qty'],
                price = i['price'],
                image=product.image.url,
            )
            
            product.countInStock -= item.qty
            product.save()
        
        serializer = OrderSerializer(order, many=False)
        
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(_id=pk)
        if user == order.user or user.is_staff:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return HttpResponse('Unauthorized', status=401)
    except:
        return HttpResponse('Order does not exist', status=400)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)
    
    order.isPaid=True
    order.paidAt=datetime.now()
    order.save()
    
    return Response('Order paid')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)