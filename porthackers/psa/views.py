from django.shortcuts import render, redirect
from .models import check, freight, predictive, TopPredictive, TopFreight, TopLogistic
from django.http import HttpResponse, JsonResponse

def get_predictive(request):
    if request.method == 'GET':
        country = request.GET.get('port_country')
        print(country)
        try:
            if country:
                # Filter by the specified country
                predictive_entries = TopPredictive.objects.filter(Port_Country=country)
            else:
                # Get all entries if no country specified
                predictive_entries = TopPredictive.objects.all()

            data_list = list(predictive_entries.values())  # Convert queryset to list of dicts
            return JsonResponse(data_list, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


def add_freight(request):
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


def get_freights(request):
    if request.method == 'GET':
        try:
            freight_entries = TopFreight.objects.all()
            data_list = list(freight_entries.values())  # Convert queryset to list of dicts
            return JsonResponse(data_list, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

def get_freights2(request):
    if request.method == 'GET':
        try:
            origin = request.GET.get('origin')  # Get the 'origin' parameter from the query string

            # Filter freights based on the origin if provided
            if origin:
                freight_entries = freight.objects.filter(origin=origin)
            else:
                freight_entries = freight.objects.all()

            data_list = list(freight_entries.values())  # Convert queryset to list of dicts
            return JsonResponse(data_list, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)