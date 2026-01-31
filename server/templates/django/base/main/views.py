from django.shortcuts import render
from django.http import JsonResponse
from .models import Post

def home(request):
    return render(request, 'main/home.html', {'message': 'Welcome to your Django App!'})

def api_posts(request):
    # Return dummy data or real data if DB is migrated & populated
    # For a starter template, let's return some static dummy data to ensure it works out of the box
    data = [
        {'id': 1, 'title': 'First Post', 'content': 'This is full-stack Django.'},
        {'id': 2, 'title': 'Batteries Included', 'content': 'Django comes with a lot of features.'},
    ]
    return JsonResponse({'posts': data})
