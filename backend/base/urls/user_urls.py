from django.urls import path
from base.views import user_views as views
from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

urlpatterns = [
    path('', views.getUsers, name='users-all'),
    path('profile/', views.getUserProfile, name='user-profile'),
    path('profile/update/', views.updateUserProfile, name='user-profile-update'),
    path('verify-email/send/', views.verify_email_send, name='verify-email-send'),
    path('verify-email/<str:URL_code>/', views.verify_email, name='verify-email'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('magic-link/get/', views.sendMagicLink, name='magic-link-get'),
    path('magic-link/verify/', views.magicLink, name='magic-link-verify'),
    path('register/', views.registerUser, name='register'),
    path('update/<str:pk>/', views.updateUser, name='user-update'),
    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),
    path('<str:pk>/', views.getUserById, name='get-user-by-id'),
]