import json
from typing import Any
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

import stripe
from base.serializers import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from datetime import datetime
from django.views import View
from django.utils import timezone

from base.models import Product, Order, OrderItem, ShippingAddress, User
from base.serializers import ProductSerializer, OrderSerializer


stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    data = json.loads(request.body)
    payment_intent_id = data.get('paymentIntentId')
    client_secret = data.get('clientSecret')
    order_id = data.get('orderId')
    
    try:
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        # print(str(payment_intent))
        order = Order.objects.get(_id=order_id)
        # print(str(payment_intent))
        # print(payment_intent.amount_received, str(int(order.totalPrice*100)))
        if payment_intent.client_secret == client_secret and payment_intent.status == 'succeeded' and str(payment_intent.amount_received) == str(int(order.totalPrice*100)):
            # Handle successful payment here (e.g., update order status)
            if not order.isPaid:
                order.paidAt = timezone.now() 
                order.isPaid = True
                order.save()
              
                for item in order.orderitem_set.all():
                    product = item.product
                    product.countInStock -= item.qty
                    product.save()
                    
            return JsonResponse({'paymentResult': payment_intent}, status=200)
        else:
            return JsonResponse({'error': 'Error handling payment. Please try again or contact our team'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            order_id = data.get('orderId')
            order = Order.objects.get(_id=order_id)
            order.update_total_price()
            
            amount = int(order.totalPrice*100)
            currency = 'eur'

            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                payment_method_types=["ideal", "card"], 
            )

            return JsonResponse({
                'clientSecret': intent['client_secret']
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=403)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    if user.emailVerified:
        data = request.data
        orderItems = data['orderItems']
        
        if orderItems and len(orderItems) == 0:
            return Response({'detail':'No order items'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            order = Order.objects.create(
                user = user,
                paymentMethod = data['paymentMethod'],
                shippingPrice = data['shippingPrice'],
                # itemsPrice = data['itemsPrice'],
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
                
            #     product.countInStock -= item.qty
                # product.save()
                
            order.update_total_price()
            

            serializer = OrderSerializer(order, many=False)
            
        return Response(serializer.data)
    else:
        return Response({"error":"You must verify your email address before placing an order"})

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
    
# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def updateOrderToPaid(request, pk):
#     order = Order.objects.get(_id=pk)
#     if request.user == order.user:
#         order.isPaid=True
#         order.paidAt=timezone.now() 
#         order.save()
    
#     return Response('Order paid')    

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)
    print(order._id)
    
    order.isDelivered=True
    order.deliveredAt=timezone.now() 
    order.save()
    
    return Response('Order delivered')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

