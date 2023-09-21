from django.contrib import admin
from django.urls import path, include
from authlib.integrations.django_client import OAuth
from django.conf import settings
from . import views


urlpatterns = [
    path("dashboard", views.index, name="index"),
    path("login", views.login, name="login"),
    path("logout", views.logout, name="logout"),
    path("callback", views.callback, name="callback"),
    path("profile", views.profile, name="profile"),
    path('', include('home.urls')),
    path('projects/', include('project.urls')),
    path('admin/', admin.site.urls),
]
