import os
import csv
from datetime import datetime
from django.core.management.base import BaseCommand
from psa.models import TopFreight  # Ensure the correct model is imported

class Command(BaseCommand):
    help = 'Imports data from freight.csv into the TopFreight model'

    def handle(self, *args, **kwargs):
        # Get the base directory of your app
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # Build the full path to the CSV file inside the 'data' folder
        csv_file_path = os.path.join(base_dir, 'data', 'freight_final_data.csv')

        # Open and read the CSV file
        with open(csv_file_path, newline='') as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                # Convert date strings to datetime.date objects
                pickup_date = datetime.strptime(row['pickup_date'], '%Y-%m-%d %H:%M:%S').date()
                delivery_date = datetime.strptime(row['delivery_date'], '%Y-%m-%d %H:%M:%S').date()
                created_at = datetime.strptime(row['created_at'], '%d-%m-%Y %H:%M').date()
                updated_at = datetime.strptime(row['updated_at'], '%d-%m-%Y %H:%M').date()

                # Create and save the model instance
                TopFreight.objects.create(
                    freight_id=int(row['freight_id']),
                    user_id=int(row['user_id']),
                    cargo_type=row['cargo_type'],
                    weight=float(row['weight']),
                    dimensions=row['dimensions'],
                    origin=row['origin'],
                    destination=row['destination'],
                    pickup_date=pickup_date,
                    delivery_date=delivery_date,
                    estimated_delivery_time=int(row['estimated_delivery_time']),
                    estimated_cost=float(row['estimated_cost']),
                    carbon_emissions=float(row['carbon_emissions']),
                    status=row['status'],
                    freight_priority=row['freight_priority'],
                    created_at=created_at,
                    updated_at=updated_at
                )

        self.stdout.write(self.style.SUCCESS('Data imported successfully from freight.csv'))
