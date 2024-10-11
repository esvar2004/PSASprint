from django.db import models

# Create your models here.
class psa(models.Model):
    headline = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)