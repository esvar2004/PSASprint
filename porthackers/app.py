from django.shortcuts import render
import numpy as np
import requests  # To call the backend APIs
from tensorflow.keras.models import load_model

# Load the trained model
model = load_model('./trained_model.h5')

def make_prediction(request):
    if request.method == 'POST':
        # Fetch logistics data from the backend
        logistics_response = requests.get('psa/list_logistics/')
        freights_response = requests.get('psa/list_freights/')
        
        # Assuming the backend returns data in JSON format
        logistics_data = logistics_response.json()
        freights_data = freights_response.json()

        # # Assuming the backend returns data in JSON format
        # logistics_data = logistics_response.json()
        # freights_data = freights_response.json()

        # # You can also check for the response status
        # print("Logistics Response Status:", logistics_response.status_code)
        # print("Freights Response Status:", freights_response.status_code)

        # Process the data - Modify this according to the structure of your API response
        # Example assuming the logistics and freights data have the needed features
        freight_input = freights_data[0]['weight', 'carbon_emissions', 'pickup_date', 'delivery_date']  # Adjust to actual feature
        provider_input = logistics_data[0]['sustainability_rating', 'average_carbon_emissions']  # Adjust to actual feature
        
        # Prepare the input data (this may vary based on your model)
        input_data = [np.array([freight_input]), np.array([provider_input])]
        
        # Make prediction using the loaded model
        sustainability_score, speed_score = model.predict(freights_data, provider_input)
        
        # Process the output as needed
        context = {
            'sustainability_score': sustainability_score[0][0],
            'speed_score': speed_score[0][0],
        }
        
        # Render a template with the results (replace 'prediction_results.html' with your template)
        return render(request, 'prediction_results.html', context)
    
    # Render a form if it's a GET request (replace 'prediction_form.html' with your form template)
    return render(request, 'prediction_form.html')
