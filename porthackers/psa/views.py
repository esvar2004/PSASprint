from django.shortcuts import render, redirect
from .models import psa
from django.http import HttpResponse

# Create your views here.

def add_psa(request):
    if request.method == 'POST':
        headline = request.POST.get('headline')
        is_completed = request.POST.get('is_completed', False)  # default False if not provided

        # Create a new psa entry
        psa_entry = psa.objects.create(
            headline=headline,
            is_completed=bool(is_completed)
        )
        return HttpResponse(f"Added PSA: {psa_entry.headline}")
    return render(request, 'add_psa.html')
