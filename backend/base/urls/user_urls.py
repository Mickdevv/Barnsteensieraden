from django.urls import path
from base.views import user_views as views
from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

urlpatterns = [
    path('', views.getUsers, name='users-all'),
    path('profile/', views.getUserProfile, name='user-profile'),
    path('profile/update/', views.updateUserProfile, name='user-profile-update'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.registerUser, name='register'),
    path('update/<str:pk>/', views.updateUser, name='user-update'),
    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),
    path('<str:pk>/', views.getUserById, name='get-user-by-id'),
]