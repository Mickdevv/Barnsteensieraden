from typing import Any
from django.shortcuts import render
from django.http import JsonResponse

from base.serializers import *
from base.models import Product
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status

# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    return JsonResponse("hello", safe=False)



@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)    
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    data = request.POST
    product = Product.objects.create(
        user=user,
        name=data['name'],
        price=data['price'],
        brand=data['brand'],
        countInStock=0,
        category=data['category'],
        description=data['description'],
    )
    product.save()
    
    serializer = ProductSerializer(product, many=False)    
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.POST
    product = Product.objects.get(_id=pk)
    product.name=data['name']
    product.price=data['price']
    product.brand=data['brand']
    product.countInStock=['countInStock']
    product.category=data['category']
    product.description=data['description']
    product.save()
    
    serializer = ProductSerializer(product, many=False)    
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Product deleted')

