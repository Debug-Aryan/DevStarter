from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.views.generic import TemplateView
from django.views.generic.edit import FormView


class HomeView(TemplateView):
    template_name = "main/home.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["message"] = "Welcome to your Django App!"
        return context


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = "main/dashboard.html"


class RegisterView(FormView):
    template_name = "registration/register.html"
    form_class = UserCreationForm
    success_url = reverse_lazy("dashboard")

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        messages.success(self.request, "Account created. You are now logged in.")
        return super().form_valid(form)


def api_posts(request):
    data = [
        {"id": 1, "title": "First Post", "content": "This is full-stack Django."},
        {
            "id": 2,
            "title": "Batteries Included",
            "content": "Django comes with a lot of features.",
        },
    ]
    return JsonResponse({"posts": data})

