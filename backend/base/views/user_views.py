import datetime
from typing import Any
from django.http import JsonResponse

from base.send_email import admin_registration_notification, email_verification_email
from base.serializers import *
from base.models import ConfirmationCode, Product, User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status

def purge_expired_confirmation_codes():
    confirmation_codes = ConfirmationCode.objects.all()
    for code in confirmation_codes:
        if datetime.datetime.now().timestamp() >  code.expiresAt.timestamp():
            try:
                code.delete()
            except:
                print('Error purging expired codes')
                pass

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False) 
    # print(serializer.data)   
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data
    
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    
    if data['password'] != '':
        user.password = make_password(data['password'])
        
    user.save()
    serializer = UserSerializerWithToken(user, many=False)    
    print(serializer.data)
    
    return Response(serializer.data)


@api_view(['POST'])
def registerUser(request):  
    data = request.data
    try:
        print(data)
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
        )
        serializer = UserSerializerWithToken(user, many=False)
        
        return Response(serializer.data)
    except:
        message={'detail':'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs: dict[str, Any]) -> dict[str, str]:
        data = super().validate(attrs)
        
        data['username'] = self.user.username
        data['email'] = self.user.email
        
        serializer = UserSerializerWithToken(self.user).data
        
        for k, v in serializer.items():
            data[k] = v

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    
    return Response('User was deleted')

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)
    
    if user.is_staff or user == request.user:
        data = request.data
        
        user.first_name = data['name']
        user.username = data['email']
        user.email = data['email']
        user.is_staff = data['isAdmin']
        user.is_active = data['isActive']
        user.emailVerified = data['isEmailVerified']
            
        user.save()
        
        serializer = UserSerializer(user, many=False)  
        return Response(serializer.data)
    else:
        return Response(status=401)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_email(request, URL_code):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return Response({"message": "User is not authenticated"}, status=401)

        try:
            print(request.user.email, request.user.id, request.user.confirmation_code.code)
            print(URL_code)
            purge_expired_confirmation_codes()
            user = User.objects.get(id=request.user.id)
            
            account_conditions = [
                user.confirmation_code.code,
                URL_code,
                str(user.confirmation_code.code) == str(URL_code),
                datetime.datetime.now().timestamp() <= user.confirmation_code.expiresAt.timestamp()
            ]
            print(account_conditions)
            
            if all(account_conditions):
                user.emailVerified = True
                user.save()
                print(user.emailVerified)
                admin_registration_notification(user)
                return Response({"message": "Email verified successfully"}, status=200)

            return Response({"message": "Invalid or expired code. Please try again"}, status=400)

        except Exception as e:
            print(f"Error during verification: {e}")
            return Response({"message": "Internal server error"}, status=500)

    return Response(status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_email_send(request):
    if request.method == 'POST':
        try:
            user = request.user
            print(user.confirmation_code.code)
            user.generate_confirmation_code()
            user.save()
            print(user.confirmation_code.code)
            email_verification_email(user)
            return Response({"message":"Email sent successfully"}, status=200)
        except: 
            return Response({"message":"Something went wrong"}, status=500)
            