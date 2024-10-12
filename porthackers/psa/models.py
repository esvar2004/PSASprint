from django.db import models

# Create your models here.
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

    HIGH = 'high'
    MEDIUM = 'medium'
    LOW = 'low'
    CHOICES = [
        (HIGH, 'High'),
        (MEDIUM, 'Medium'),
        (LOW, 'Low'),
    ]
    Corrosion_Level = models.CharField(
        max_length=6,
        choices=CHOICES,
        default=MEDIUM,  # You can set a default if needed
    )
    Wind_Speed = models.FloatField()
    Last_Maintenance_Date = models.DateField()
    Failure_Probability = models.FloatField()
    Maintenance_Required = models.BooleanField(default=False)




