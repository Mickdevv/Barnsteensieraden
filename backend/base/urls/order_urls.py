from django.urls import path
from base.views import order_views as views


urlpatterns = [
    path('', views.getOrders, name='orders'),
    path('add/', views.addOrderItems, name='order-items-add'),
    path('my-orders/', views.getMyOrders, name='my-orders'),
    path('create-payment-intent/', views.create_payment_intent, name='create-payment-intent'),
    path('verify-payment/', views.verify_payment, name='verify-payment'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name='deliver'),
]