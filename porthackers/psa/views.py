from django.shortcuts import render, redirect
from .models import check, freight, predictive, TopPredictive, TopFreight, TopLogistic, logistic
from django.http import HttpResponse, JsonResponse

import numpy as np
# from rest_framework.response import Response
# from rest_framework.decorators import api_view
from tensorflow.keras.models import load_model

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


# def get_freights(request):
#     if request.method == 'GET':
#         try:
#             freight_entries = TopFreight.objects.all()
#             data_list = list(freight_entries.values())  # Convert queryset to list of dicts
#             return JsonResponse(data_list, safe=False)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

def get_freights(request):
    if request.method == 'GET':
        try:
            origin = request.GET.get('origin')  # Get the 'origin' parameter from the query string

            # Filter freights based on the origin if provided
            if origin:
                freight_entries = TopFreight.objects.filter(origin=origin)
            else:
                freight_entries = TopFreight.objects.all()

            data_list = list(freight_entries.values())  # Convert queryset to list of dicts
            return JsonResponse(data_list, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

def get_logistics(request):
    if request.method == 'GET':
        try:
            freight_entries = TopLogistic.objects.all()
            data_list = list(freight_entries.values())  # Convert queryset to list of dicts
            return JsonResponse(data_list, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

def get_freights_in_transit(request):
    if request.method == 'GET':
        try:
            # Filter freights with status "in_transit" and only select origin and destination fields
            freight_entries = TopFreight.objects.filter(status="in_transit").values('origin', 'destination')
            data_list = list(freight_entries)  # Convert queryset to list of dicts with selected fields
            return JsonResponse(data_list, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


import numpy as np
import requests
from django.http import JsonResponse
from django.conf import settings
import os
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)

logger = logging.getLogger(__name__)

# Load the pre-trained model
model_path = os.path.join(settings.BASE_DIR, 'psa', 'management', 'data', 'trained_model.h5')
model = load_model(model_path)

# from django.http import JsonResponse
# from .models import TopFreight, TopLogistic
# import pandas as pd
# import numpy as np
# from .ai import SustainableFreightRecommender  # Import the AI model class
# import sqlite3


# # Recursive function to convert all NumPy data types to native Python types
# def convert_to_serializable(obj):
#     if isinstance(obj, np.ndarray):
#         return obj.tolist()  # Convert NumPy arrays to lists
#     elif isinstance(obj, pd.DataFrame):
#         return obj.to_dict(orient='records')  # Convert DataFrames to dict
#     elif isinstance(obj, pd.Series):
#         return obj.to_list()  # Convert Pandas Series to list
#     elif isinstance(obj, np.int64) or isinstance(obj, np.int32):
#         return int(obj)
#     elif isinstance(obj, np.float64) or isinstance(obj, np.float32):
#         return float(obj)
#     elif isinstance(obj, dict):
#         return {key: convert_to_serializable(value) for key, value in obj.items()}
#     elif isinstance(obj, list):
#         return [convert_to_serializable(item) for item in obj]
#     elif isinstance(obj, tuple):
#         return tuple(convert_to_serializable(item) for item in obj)
#     else:
#         return obj

# # View to return predictive freight recommendations
# def predict_from_api(request):
#     recommender = SustainableFreightRecommender()  # Initialize the AI model

#     # Fetch data from the TopFreight and TopLogistic models
#     freight_data = list(TopFreight.objects.all().values())
#     logistic_data = list(TopLogistic.objects.all().values())

#     # Convert data to DataFrames
#     freight_df = pd.DataFrame(freight_data)
#     logistic_df = pd.DataFrame(logistic_data)

#     # Preprocess the data using the AI model's preprocess_data method
#     freight_features, provider_features = recommender.preprocess_data(freight_df, logistic_df)

#     # Build and load the model (you may want to load a pre-trained model)
#     model = recommender.build_model(freight_features.shape[1], provider_features.shape[1])

#     # Get the first available freight to make a prediction (for example)
#     available_freight = freight_df[freight_df['status'] == 'available']
#     if available_freight.empty:
#         return JsonResponse({"error": "No available freights for prediction."}, status=404)

#     selected_freight_id = available_freight.iloc[0]['freight_id']
#     #logger.info(selected_freight_id)

#     # Generate recommendations using the AI model
#     recommendations = recommender.recommend_matches(
#         freight_features, provider_features,
#         freight_id=selected_freight_id,
#         freight_df=freight_df,
#         logistics_provider_df=logistic_df,
#         top_n=3
#     )

#     # Convert recommendations to a JSON-serializable format using the recursive function
#     serializable_recommendations = convert_to_serializable(recommendations)

#     # Return the recommendations as a JSON response
#     return JsonResponse(serializable_recommendations, safe=False)




# from django.http import JsonResponse
# import numpy as np
# import pandas as pd
# from .ai import SustainableFreightRecommender  # Assuming ai.py is in the same directory

# # Recursive function to convert all NumPy data types to native Python types
# def convert_to_serializable(obj):
#     # Same as before...
#     pass

# # View to return predictive freight recommendations
# def predict_from_api(request):
#     recommender = SustainableFreightRecommender()  # Initialize the AI model

#     # Try loading the pre-trained model
#     try:
#         model = recommender.load_model()  # Load the saved model
#     except FileNotFoundError:
#         return JsonResponse({"error": "Model not found. Please train the model first."}, status=500)

#     # Fetch data from the TopFreight and TopLogistic models
#     freight_data = list(TopFreight.objects.all().values())
#     logistic_data = list(TopLogistic.objects.all().values())

#     # Convert data to DataFrames
#     freight_df = pd.DataFrame(freight_data)
#     logistic_df = pd.DataFrame(logistic_data)

#     # Preprocess the data using the AI model's preprocess_data method
#     freight_features, provider_features = recommender.preprocess_data(freight_df, logistic_df)

#     # Get the first available freight to make a prediction (for example)
#     available_freight = freight_df[freight_df['status'] == 'available']
#     if available_freight.empty:
#         return JsonResponse({"error": "No available freights for prediction."}, status=404)

#     selected_freight_id = available_freight.iloc[0]['freight_id']

#     # Generate recommendations using the pre-trained AI model
#     recommendations = recommender.recommend_matches(
#         freight_features, provider_features,
#         freight_id=selected_freight_id,
#         freight_df=freight_df,
#         logistics_provider_df=logistic_df,
#         top_n=3
#     )

#     # Convert recommendations to a JSON-serializable format using the recursive function
#     serializable_recommendations = convert_to_serializable(recommendations)

#     # Return the recommendations as a JSON response
#     return JsonResponse(serializable_recommendations, safe=False)

from django.http import JsonResponse
from .models import TopFreight, TopLogistic
import pandas as pd
import numpy as np
from .ai import SustainableFreightRecommender  # Import the AI model class
import sqlite3

# Recursive function to convert all NumPy data types to native Python types
def convert_to_serializable(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()  # Convert NumPy arrays to lists
    elif isinstance(obj, pd.DataFrame):
        return obj.to_dict(orient='records')  # Convert DataFrames to dict
    elif isinstance(obj, pd.Series):
        return obj.to_list()  # Convert Pandas Series to list
    elif isinstance(obj, np.int64) or isinstance(obj, np.int32):
        return int(obj)
    elif isinstance(obj, np.float64) or isinstance(obj, np.float32):
        return float(obj)
    elif isinstance(obj, dict):
        return {key: convert_to_serializable(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(item) for item in obj]
    elif isinstance(obj, tuple):
        return tuple(convert_to_serializable(item) for item in obj)
    else:
        return obj

# View to return predictive freight recommendations based on freight_id from URL
def predict_from_api(request, freight_id):
    # Initialize the AI model
    recommender = SustainableFreightRecommender()

    # Fetch data from the TopFreight and TopLogistic models
    freight_data = list(TopFreight.objects.all().values())
    logistic_data = list(TopLogistic.objects.all().values())

    # Convert data to DataFrames
    freight_df = pd.DataFrame(freight_data)
    logistic_df = pd.DataFrame(logistic_data)

    # Check if the requested freight_id exists in the dataset
    if not freight_df[freight_df['freight_id'] == int(freight_id)].empty:
        selected_freight = freight_df[freight_df['freight_id'] == int(freight_id)].iloc[0]
        logger.info(selected_freight)
    else:
        return JsonResponse({"error": f"No freight found with freight_id {freight_id}."}, status=404)

    # Preprocess the data using the AI model's preprocess_data method
    freight_features, provider_features = recommender.preprocess_data(freight_df, logistic_df)

    # Build and load the model (you may want to load a pre-trained model)
    model = recommender.build_model(freight_features.shape[1], provider_features.shape[1])
    history = recommender.train_model(freight_features, provider_features)

    # Generate recommendations using the AI model for the specific freight ID
    recommendations = recommender.recommend_matches(
        freight_features, provider_features,
        freight_id=selected_freight['freight_id'],
        freight_df=freight_df,
        logistics_provider_df=logistic_df,
        top_n=3
    )

    # Prepare the response with provider details
    response = []
    for rec in recommendations:
        provider = logistic_df.iloc[rec['provider_idx']]  # Get provider details from DataFrame
        provider_details = {
            "Provider Name": provider['name'],
            "Provider ID": provider['provider_id'],  # Replace with actual field names from your model
            "Route Origin": provider['route_origin'],
            "Route Destination": provider['route_destination'],
            "Sustainability Rating": provider['sustainability_rating'],
            "Average Carbon Emissions": provider['average_carbon_emissions'],
            "Sustainability Score": rec['sustainability_score'],
            "Speed Score": rec['speed_score'],
            "Combined Score": rec['combined_score']
        }
        response.append(provider_details)

    # Convert response to a JSON-serializable format using the recursive function
    serializable_response = convert_to_serializable(response)

    # Return the recommendations as a JSON response
    return JsonResponse(serializable_response, safe=False)
