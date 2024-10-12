import os
import csv
from datetime import datetime
from django.core.management.base import BaseCommand
from psa.models import TopLogistic  # Ensure the correct model is imported

class Command(BaseCommand):
    help = 'Imports data from logistics.csv into the TopLogistic model'

    def handle(self, *args, **kwargs):
        # Get the base directory of your app
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # Build the full path to the CSV file inside the 'data' folder
        csv_file_path = os.path.join(base_dir, 'data', 'logistics_new_data.csv')

        # Open and read the CSV file
        with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                # Convert date strings to datetime.date objects
                created_at = datetime.strptime(row['created_at'], '%d-%m-%Y %H:%M').date()
                updated_at = datetime.strptime(row['updated_at'], '%d-%m-%Y %H:%M').date()

                # Create and save the model instance
                TopLogistic.objects.create(
                    provider_id=int(row['provider_id']),
                    name=row['name'],
                    contact_info=row['contact_info'],
                    eco_certification=row['eco_certification'],
                    sustainability_rating=float(row['sustainability_rating']),
                    average_carbon_emissions=float(row['average_carbon_emissions']),
                    route_origin=row['route_origin'],
                    route_destination=row['route_destination'],
                    created_at=created_at,  # Store as DateField
                    updated_at=updated_at   # Store as DateField
                )

        self.stdout.write(self.style.SUCCESS('Data imported successfully from logistics.csv'))
