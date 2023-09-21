from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('save_project/', views.SaveProject.as_view(), name="save_project"),
    path('get_projects/', views.GetProjectsListing.as_view(), name="get_projects"),
    path('all_projects/', views.ProjectsAPI.as_view(), name="all_projects"),
    path('project_detail/<int:projectId>', views.ProjectDetail.as_view(), name="project_detail"),
    path('prompt_detail/<int:promptId>', views.PromptDetail.as_view(), name="prompt_detail"),
    path('autofill_detail/<int:promptId>', views.AutofillDetail.as_view(), name="autofill_detail"),
    path('delete_project_prompt/', views.DeleteProjectPrompt.as_view(), name="delete_project_prompt"),
    path('delete_project/', views.SaveProject.as_view(), name="delete_project"),
    path('delete_responses/', views.DeleteProjectResponse.as_view(), name="delete_responses"),
    path('project_datatable/', views.ProjectDataTable.as_view(), name="project_datatable"),
    path('project_prompt_datatable/<int:projectId>', views.ProjectPromptsDataTable.as_view(), name="project_prompt_datatable"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
