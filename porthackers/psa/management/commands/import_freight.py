import os
import csv
from datetime import datetime
from django.core.management.base import BaseCommand
from psa.models import freight  # Adjust your_app to your actual app name

class Command(BaseCommand):
    help = 'Imports data from freight.csv into the freight model'

    def handle(self, *args, **kwargs):
        # Get the base directory of your app
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        # Build the full path to the CSV file inside the 'data' folder
        csv_file_path = os.path.join(base_dir, 'data', 'freight.csv')

        # Open and read the CSV file
        with open(csv_file_path, newline='') as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                # Convert date strings to datetime objects
                pickup_date = datetime.strptime(row['pickup_date'], '%Y-%m-%d %H:%M:%S')
                delivery_date = datetime.strptime(row['delivery_date'], '%Y-%m-%d %H:%M:%S')
                created_at = datetime.strptime(row['created_at'], '%Y-%m-%d %H:%M:%S')
                updated_at = datetime.strptime(row['updated_at'], '%Y-%m-%d %H:%M:%S')

                # Create and save the model instance
                freight.objects.create(
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
