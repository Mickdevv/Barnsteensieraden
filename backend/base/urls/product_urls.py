from django.urls import path
from base.views import product_views as views
from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

urlpatterns = [
    path('', views.getProducts, name='products'),
    path('create/', views.createProduct, name='product-create'),
    path('delete/<str:pk>/', views.deleteProduct, name='product-delete'),
    path('update/<str:pk>/', views.updateProduct, name='product-update'),
    path('<str:pk>/', views.getProduct, name='product'),
]