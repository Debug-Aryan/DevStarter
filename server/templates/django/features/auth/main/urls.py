from django.urls import path
from . import views

urlpatterns = [
    # Keep base routes
    path('', views.home, name='home'),
    path('api/posts/', views.api_posts, name='api_posts'),
    
    # Auth routes
    path('accounts/login/', views.login_view, name='login'),
    path('accounts/register/', views.register_view, name='register'),
    path('accounts/logout/', views.logout_view, name='logout'),
]
