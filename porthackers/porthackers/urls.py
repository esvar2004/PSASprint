"""porthackers URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from psa.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('add_freight/', add_freight),
    path('list_freights/', get_freights, name='list_freights'),
    path('list_predictive/', get_predictive, name = 'list_predictive'),
    path('list_logistics/', get_logistics, name = 'list_logistics')
]
