from django.db import models


# Create your models here.
class Prompt(models.Model):
    promptId = models.BigAutoField(primary_key=True)
    promptName = models.CharField(max_length=200)  # contants
    promptText = models.CharField(max_length=2000, null=True, blank=True)  # user will see
    category = models.CharField(max_length=2000, null=True, blank=True)  # tabs
    # frontImage = models.FileField(upload_to='static/images/prompts', default='static/images/logo.png')  # related
    # backImage = models.FileField(upload_to='static/images/prompts', default='static/images/logo.png')  # background
    frontImage = models.CharField(max_length=2000, null=True, blank=True, default='logo.png')  # related
    backImage = models.CharField(max_length=2000, null=True, blank=True, default='logo.png')  # background
    description = models.CharField(max_length=2000, null=True, blank=True)  # user will see
    promptSubCategory = models.CharField(max_length=200, null=True, blank=True)  # used for blog & amazon
    promptPostUrl = models.CharField(max_length=300, null=True, blank=True)  # when data entered for generating response
    promptGetUrl = models.CharField(max_length=300, null=True, blank=True)  # from dashboard to inner page
    createdBy = models.IntegerField()
    createdOnUtc = models.DateTimeField(auto_now_add=True)
    modifiedBy = models.IntegerField()
    modifiedOnUtc = models.DateTimeField(auto_now=True)
    isDeleted = models.BooleanField(default=False)