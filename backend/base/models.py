from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import datetime
from random import getrandbits
from django.db import models
from django.db.models import Sum

# Create your models here.
class ConfirmationCode(models.Model):
    @staticmethod
    def generate_code():
        return str(getrandbits(128))
        
    def __str__(self) -> str:
        return str(self.expiresAt)
    
    expiresAt = models.DateTimeField()
    code = models.CharField(max_length=200, default=generate_code)
    
class MagicLink(models.Model):
    @staticmethod
    def generate_code():
        return str(getrandbits(128))
        
    def __str__(self) -> str:
        return str(self.expiresAt)
    
    expiresAt = models.DateTimeField()
    code = models.CharField(max_length=200, default=generate_code)

class User(AbstractUser):
    emailVerified = models.BooleanField(default=False)
    confirmation_code = models.OneToOneField(ConfirmationCode, on_delete=models.DO_NOTHING, null=True)
    magic_link = models.OneToOneField(MagicLink, on_delete=models.DO_NOTHING, null=True, blank=True)
    
    def generate_confirmation_code(self):
        self.confirmation_code = ConfirmationCode.objects.create(code=getrandbits(128), expiresAt=(timezone.now() + datetime.timedelta(minutes=15)))
        self.save()
    
class Product(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, default='/default_image.PNG')
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)
    numReviews = models.PositiveIntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.PositiveIntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return self.name
    
class Review(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.PositiveIntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return str(self.rating)
    
class Order(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return str(self.createdAt)
    
    def update_total_price(self):
        # Sum the price of all items in this order
        items_total = float(self.orderitem_set.aggregate(total=Sum('price'))['total'] or 0)

        # Calculate the total price with tax and shipping
        tax = self.taxPrice or 0
        shipping = self.shippingPrice or 0
        self.totalPrice = items_total + float(shipping) + float(tax)

        # Save the updated totalPrice to the database
        self.save()
    

    
class OrderItem(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.PositiveIntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    
    def __str__(self) -> str:
        return str(self.name)
    
class ShippingAddress(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postcode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    name = models.CharField(max_length=200)
    
    def __str__(self) -> str:
        return str(self.address)