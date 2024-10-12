import os
import csv
from django.core.management.base import BaseCommand
from psa.models import predictive

class Command(BaseCommand):
    help = 'Imports data from CSV into the predictive model'

    def handle(self, *args, **kwargs):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        csv_file_path = os.path.join(base_dir, 'data', 'equipment_data.csv')

        with open(csv_file_path, newline='') as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                # Create a new instance of the predictive model
                predictive.objects.create(
                    Equipment_ID=row['Equipment_ID'],
                    Operation_Hours=int(row['Operation_Hours']),
                    Load_Capacity=int(row['Load_Capacity']),
                    Port_Country=row['Port_Country'],
                    Failures_Last_6_Months=int(row['Failures_Last_6_Months']),
                    Avg_Repair_Time=float(row['Avg_Repair_Time']),
                    Temperature=float(row['Temperature']),
                    Corrosion_Level=row['Corrosion_Level'],
                    Wind_Speed=float(row['Wind_Speed']),
                    Last_Maintenance_Date=row['Last_Maintenance_Date'],
                    Failure_Probability=float(row['Failure_Probability']),
                    Maintenance_Required=row['Maintenance_Required'].lower() == 'yes'
                )

        self.stdout.write(self.style.SUCCESS('Data imported successfully from CSV'))
