from django.contrib import admin
from .models import Projects, ProjectPrompts ,PromptResponses

# Register your models here.
admin.site.register(Projects)
admin.site.register(ProjectPrompts)
admin.site.register(PromptResponses)