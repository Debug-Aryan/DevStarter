from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from django.http import JsonResponse
from .models import Post

# --- Base Views (Re-implemented here to avoid overwriting them during merge) ---
def home(request):
    return render(request, 'main/home.html', {'message': 'Welcome to your Django App!'})

def api_posts(request):
    data = [
        {'id': 1, 'title': 'First Post', 'content': 'This is full-stack Django.'},
        {'id': 2, 'title': 'Batteries Included', 'content': 'Django comes with a lot of features.'},
    ]
    return JsonResponse({'posts': data})

# --- Auth Views ---

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Registration successful.')
            return redirect('home')
        messages.error(request, 'Unsuccessful registration. Invalid information.')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f'You are now logged in as {username}.')
                return redirect('home')
            else:
                messages.error(request, 'Invalid username or password.')
        else:
            messages.error(request, 'Invalid username or password.')
    else:
        form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.info(request, 'You have successfully logged out.')
    return redirect('home')
