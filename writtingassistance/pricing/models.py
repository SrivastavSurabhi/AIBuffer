from django.db import models


class User(models.Model):
    auth0_u_id = models.CharField(max_length=20)
    name = models.CharField(max_length=30)
    email = models.EmailField(max_length=50, unique=True)