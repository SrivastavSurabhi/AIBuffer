from django.db import models
from prompt.models import Prompt
from pricing.models import *

# Create your models here.


class Projects(models.Model):
    projectId = models.BigAutoField(primary_key=True)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=2000, null=True, blank=True)
    createdBy = models.IntegerField()
    createdOnUtc = models.DateTimeField(auto_now_add=True)
    modifiedBy = models.IntegerField()
    modifiedOnUtc = models.DateTimeField(auto_now=True)
    isDeleted = models.BooleanField(default=False)


class ProjectPrompts(models.Model):
    projectPromptId = models.BigAutoField(primary_key=True)
    projectId = models.ForeignKey(Projects, on_delete=models.CASCADE)
    promptId = models.ForeignKey(Prompt, on_delete=models.CASCADE)
    promptFields = models.CharField(max_length=65535, null=True, blank=True)
    createdBy = models.IntegerField()
    createdOnUtc = models.DateTimeField(auto_now_add=True)
    modifiedBy = models.IntegerField()
    modifiedOnUtc = models.DateTimeField(auto_now=True)
    isDeleted = models.BooleanField(default=False)


class PromptResponses(models.Model):
    responseId = models.BigAutoField(primary_key=True)
    responseType = models.IntegerField(null=True, blank=True)
    promptId = models.ForeignKey(ProjectPrompts, on_delete=models.CASCADE) #Project prompt id
    response = models.CharField(max_length=65535, null=True, blank=True)
    language = models.CharField(max_length=200, null=True, blank=True)
    createdBy = models.IntegerField()
    createdOnUtc = models.DateTimeField(auto_now_add=True)
    modifiedBy = models.IntegerField()
    modifiedOnUtc = models.DateTimeField(auto_now=True)
    isDeleted = models.BooleanField(default=False)


