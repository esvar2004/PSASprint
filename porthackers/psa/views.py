from django.shortcuts import render, redirect
from .models import check, freight
from django.http import HttpResponse

# Create your views here.

def add_psa(request):
    if request.method == 'POST':
        # headline = request.POST.get('headline')
        # is_completed = request.POST.get('is_completed', False)  # default False if not provided

        # # Create a new psa entry
        # psa_entry = check.objects.create(
        #     headline=headline,
        #     is_completed=bool(is_completed)
        # )

        freight_entry = freight.objects.create(
            freight_id=request.POST.get('freight_id'),
            user_id=request.POST.get('user_id'),
            cargo_type=request.POST.get('cargo_type'),
            weight=request.POST.get('weight'),
            dimensions=request.POST.get('dimensions'),
            origin=request.POST.get('origin'),
            destination=request.POST.get('destination'),
            pickup_date=request.POST.get('pickup_date'),
            delivery_date=request.POST.get('delivery_date'),
            estimated_delivery_time=request.POST.get('estimated_delivery_time'),
            estimated_cost=request.POST.get('estimated_cost'),
            carbon_emissions=request.POST.get('carbon_emissions'),
            status=request.POST.get('status'),
            freight_priority=request.POST.get('freight_priority'),
            created_at=request.POST.get('created_at'),
            updated_at=request.POST.get('updated_at')
        )

        return HttpResponse(f"Added PSA: {freight_entry.freight_id}")
    return render(request, 'add_psa.html')


def list_freights(request):
    # Retrieve all freight entries from the database
    freight_entries = freight.objects.all()  # Get all entries
    context = {
        'freight_entries': freight_entries  # Pass the entries to the template
    }
    return render(request, 'list_freights.html', context)
