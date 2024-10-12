from django.db import models

# Create your models here.
HIGH = 'high'
MEDIUM = 'medium'
LOW = 'low'

AVAIL = 'available'
TRANS = 'in_transit'
DELIV = 'delivered'

CHOICES = [
    (HIGH, 'High'),
    (MEDIUM, 'Medium'),
    (LOW, 'Low'),
]
STATUS = [
    (AVAIL, 'available'),
    (TRANS, 'in_transit'),
    (DELIV, 'delivered'),
]
class check(models.Model):
    headline = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)

class predictive(models.Model):
    Equipment_ID = models.CharField(max_length=255, unique=True)
    Operation_Hours = models.IntegerField()
    Load_Capacity = models.IntegerField()
    Port_Country = models.CharField(max_length=255)
    Failures_Last_6_Months = models.IntegerField()
    Avg_Repair_Time = models.FloatField()
    Failures_Last_6_Months = models.FloatField()
    Temperature = models.FloatField()
    Corrosion_Level = models.CharField(
        max_length=6,
        choices=CHOICES,
        default=MEDIUM,  # You can set a default if needed
    )
    Wind_Speed = models.FloatField()
    Last_Maintenance_Date = models.DateField()
    Failure_Probability = models.FloatField()
    Maintenance_Required = models.BooleanField(default=False)

class freight(models.Model):
    freight_id = models.IntegerField(unique=True)
    user_id = models.IntegerField()
    cargo_type = models.CharField(max_length=255)
    weight = models.FloatField()
    dimensions = models.CharField(max_length=255)
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    pickup_date = models.DateTimeField()  # Change to DateTimeField
    delivery_date = models.DateTimeField()  # Change to DateTimeField
    estimated_delivery_time = models.IntegerField()
    estimated_cost = models.FloatField()
    carbon_emissions = models.FloatField()
    status = models.CharField( 
        max_length=10,
        choices=STATUS,
        default=TRANS
    )
    freight_priority = models.CharField(
        max_length=6,
        choices=CHOICES,
        default=MEDIUM,  # You can set a default if needed
    )
    created_at = models.DateTimeField()  # Change to DateTimeField
    updated_at = models.DateTimeField()  # Change to DateTimeField



