from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('api/posts/', views.api_posts, name='api_posts'),
]
