from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import Product, OrderItem, Order, ShippingAddress, Review, User
from rest_framework_simplejwt.tokens import RefreshToken
        
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'
        
    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data
        
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'
        
class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        
    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data
        
    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data
    
    def get_shippingAddress(self, obj):
        try: 
            address = ShippingAddressSerializer(obj.shippingaddress, many=False).data
        except:
            address = False
        return address
        
class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    emailVerified = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields =  ['_id', 'email', 'name', 'isAdmin', 'is_active', 'emailVerified']

    def get_name(self, obj):
        # Custom logic to get name or email
        return obj.first_name if obj.first_name else obj.email

    def get__id(self, obj):
        # Correct method name to fetch _id
        return obj.id

    def get_isAdmin(self, obj):
        # Return whether the user is an admin (staff member)
        return obj.is_staff

    def get_emailVerified(self, obj):
        # Return whether the email is verified
        return obj.emailVerified
        

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    emailVerified = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['_id', 'email', 'name', 'isAdmin', 'token', 'is_active', 'emailVerified']
        
    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
    
    def get_name(self, obj):
        # Custom logic to get name or email
        return obj.first_name if obj.first_name else obj.email

    def get__id(self, obj):
        # Correct method name to fetch _id
        return obj.id

    def get_isAdmin(self, obj):
        # Return whether the user is an admin (staff member)
        return obj.is_staff

    def get_emailVerified(self, obj):
        # Return whether the email is verified
        return obj.emailVerified
