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

class TopPredictive(models.Model):
    Equipment_ID = models.CharField(max_length=255, unique=True)
    Operation_Hours = models.IntegerField()
    Load_Capacity = models.IntegerField()
    Port_Country = models.CharField(max_length=255)
    Failures_Last_6_Months = models.IntegerField()
    Avg_Repair_Time = models.FloatField()
    Temperature = models.FloatField()
    Corrosion_Level = models.CharField(
        max_length=6,
        choices=CHOICES,
        default='medium',
    )
    Wind_Speed = models.FloatField()
    Last_Maintenance_Date = models.DateField()
    Failure_Probability = models.FloatField()

class freight(models.Model):
    freight_id = models.IntegerField(unique=True)
    user_id = models.IntegerField()
    cargo_type = models.CharField(max_length=255)
    weight = models.FloatField() #sfds
    dimensions = models.CharField(max_length=255)
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    pickup_date = models.DateTimeField()  # Change to DateTimeField
    delivery_date = models.DateTimeField()  # Change to DateTimeField
    estimated_delivery_time = models.IntegerField()
    estimated_cost = models.FloatField()
    carbon_emissions = models.FloatField() #sfdf
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

class TopFreight(models.Model):
    freight_id = models.IntegerField(unique=True)
    user_id = models.IntegerField()
    cargo_type = models.CharField(max_length=255)
    weight = models.FloatField() #sfds
    dimensions = models.CharField(max_length=255)
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    pickup_date = models.DateField()  # Change to DateTimeField
    delivery_date = models.DateField()  # Change to DateTimeField
    estimated_delivery_time = models.IntegerField()
    estimated_cost = models.FloatField()
    carbon_emissions = models.FloatField() #sfdf
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
    created_at = models.DateField()  # Change to DateTimeField
    updated_at = models.DateField()  # Change to DateTimeField

class logistic(models.Model):
    provider_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    contact_info = models.CharField(max_length=255)
    eco_certification = models.CharField(max_length=255)
    sustainability_rating = models.FloatField() #
    average_carbon_emissions = models.FloatField() #
    route_origin = models.CharField(max_length=255) #
    route_destination = models.CharField(max_length=255) #
    created_at = models.DateField() 
    updated_at = models.DateField()  

class TopLogistic(models.Model):
    provider_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    contact_info = models.CharField(max_length=255)
    eco_certification = models.CharField(max_length=255)
    sustainability_rating = models.FloatField() #
    average_carbon_emissions = models.FloatField() #
    route_origin = models.CharField(max_length=255) #
    route_destination = models.CharField(max_length=255) #
    created_at = models.DateField() 
    updated_at = models.DateField() 



