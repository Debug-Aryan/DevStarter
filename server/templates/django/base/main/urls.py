from django.urls import path

from .views import HomeView, DashboardView, api_posts

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('api/posts/', api_posts, name='api_posts'),
]

