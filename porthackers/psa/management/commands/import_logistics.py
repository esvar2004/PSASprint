import os
import csv
from django.core.management.base import BaseCommand
from psa.models import logistic  # Adjust your app name here
from datetime import datetime

class Command(BaseCommand):
    help = 'Imports data from logistics.csv into the logistic model'

    def handle(self, *args, **kwargs):
        # Get the base directory of your app
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # Build the full path to the CSV file inside the 'data' folder
        csv_file_path = os.path.join(base_dir, 'data', 'logistics.csv')

        # Open and read the CSV file
        with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                # Function to handle different date formats
                def parse_date(date_str):
                    try:
                        # Try parsing date with day/month/year format (e.g., 22/10/23)
                        return datetime.strptime(date_str, '%d/%m/%y').date()
                    except ValueError:
                        try:
                            # Fallback to year-month-day (e.g., 2023-10-22) if needed
                            return datetime.strptime(date_str, '%Y-%m-%d').date()
                        except ValueError:
                            # Log or raise an error if date is in an unrecognized format
                            raise ValueError(f"Unrecognized date format: {date_str}")

                # Parse the dates using the helper function
                created_at_date = parse_date(row['created_at'])
                updated_at_date = parse_date(row['updated_at'])

                # Create and save the model instance
                logistic.objects.create(
                    provider_id=int(row['provider_id']),
                    name=row['name'],
                    contact_info=row['contact_info'],
                    eco_certification=row['eco_certification'],
                    sustainability_rating=float(row['sustainability_rating']),
                    average_carbon_emissions=float(row['average_carbon_emissions']),
                    route_origin=row['route_origin'],
                    route_destination=row['route_destination'],
                    created_at=created_at_date,  # Store as DateField
                    updated_at=updated_at_date   # Store as DateField
                )

        self.stdout.write(self.style.SUCCESS('Data imported successfully from logistics.csv'))
