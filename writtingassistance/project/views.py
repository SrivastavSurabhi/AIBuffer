from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.http import JsonResponse
import json
from .models import Projects,ProjectPrompts,PromptResponses
from prompt.models import Prompt
from django.db import transaction
from home.constant import *
from pricing.models import *
import ast
from django_datatables_view.base_datatable_view import BaseDatatableView
# def getContext(request):
#     return {"session": request.session.get("user"),
#                 "pretty": json.dumps(request.session.get("user"), indent=4)}


# Create your views here.
class SaveProject(TemplateView):
    template_name = 'dashboard-detail.html'

    def post(self, request, *args, **kwargs):
        formData = json.loads(request.body.decode())
        project_name = formData['project_name']
        prompt_name = formData['prompt_name']
        # prompt_description = formData['prompt_description']
        prompt_fields = formData['prompt_fields']
        responses = formData['response']
        img_response = formData['img_response']
        type = formData['type']
        auth0_u_id = request.session.get("user")['userinfo']
        try:
            user = User.objects.get(auth0_u_id=auth0_u_id['sub'].split('|')[1])
            # context.update({"key": settings.STRIPE_PUBLISHABLE_KEY})
            # return render(request, 'payment.html', context)
        except:
            if auth0_u_id['sub'].split('|')[0] == 'facebook':
                user = User.objects.create(auth0_u_id=auth0_u_id['sub'].split('|')[1], name=auth0_u_id['name'])
            else:
                user = User.objects.create(auth0_u_id=auth0_u_id['sub'].split('|')[1], name=auth0_u_id['name'],
                                email=auth0_u_id['email'])
        if Projects.objects.filter(name = project_name,userId = user, isDeleted = False).exists() and type == False:
            return JsonResponse({"success": False})
        else:
            try:
                promptobj = Prompt.objects.get(promptText=prompt_name.strip(), promptSubCategory=prompt_fields['sub_category'])
            except:
                promptobj = Prompt.objects.get(promptText=prompt_name.strip())
        with transaction.atomic():
            if type == True:
                projects = Projects.objects.get(name = project_name,isDeleted=False)
            else:
                projects = Projects.objects.create(
                            name = project_name,
                            userId = user,
                            createdBy = 1,
                            modifiedBy = 1)

            project_prompts = ProjectPrompts.objects.create(
                            projectId = projects,
                            promptId = promptobj,
                            promptFields = prompt_fields,
                            createdBy = 1,
                            modifiedBy = 1)
            for response in responses:
                PromptResponses.objects.create(
                    promptId = project_prompts,
                    responseType = 1, 
                    response = response,
                    createdBy = 1,
                    modifiedBy = 1)
                
            for img in img_response:
                PromptResponses.objects.create(
                    promptId = project_prompts,
                    responseType = 2,
                    response = img,
                    createdBy = 1,
                    modifiedBy = 1)
        
        return JsonResponse({"success": True})

    def delete(self, request, *args, **kwargs):
        projectId = int(request.body.decode())
        project = Projects.objects.get(projectId = projectId)
        project.isDeleted = True
        project.save()
        prompts = ProjectPrompts.objects.filter(projectId = project)
        for i in prompts:
            i.isDeleted = True
            i.save()
        return JsonResponse({"success": True})


class DeleteProjectPrompt(TemplateView):

    def delete(self, request, *args, **kwargs):
        projectPromptId = int(request.body.decode())
        projectPrompt = ProjectPrompts.objects.get(projectPromptId = projectPromptId)
        projectPrompt.isDeleted = True
        projectPrompt.save()
        return JsonResponse({"success": True})


class DeleteProjectResponse(TemplateView):

    def delete(self, request, *args, **kwargs):
        projectResponseId = int(request.body.decode())
        projectResponse = PromptResponses.objects.get(responseId = projectResponseId)
        projectResponse.isDeleted = True
        projectResponse.save()
        return JsonResponse({"success": True})


class GetProjectsListing(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request, *args, **kwargs):
        auth0_u_id = request.session.get("user")['userinfo']
        try:
            user = User.objects.get(auth0_u_id=auth0_u_id['sub'].split('|')[1])
            # context.update({"key": settings.STRIPE_PUBLISHABLE_KEY})
            # return render(request, 'payment.html', context)
        except:
            if auth0_u_id['sub'].split('|')[0] == 'facebook':
                user = User.objects.create(auth0_u_id=auth0_u_id['sub'].split('|')[1], name=auth0_u_id['name'])
            else:
                user = User.objects.create(auth0_u_id=auth0_u_id['sub'].split('|')[1], name=auth0_u_id['name'],
                                email=auth0_u_id['email'])

        projects_name = Projects.objects.filter(userId=user,isDeleted=False).values('name')
        return JsonResponse({"projects_name": json.dumps(list(projects_name)), "success": True})


class ProjectsAPI(TemplateView):
    template_name = 'all-projects.html'

    def get(self, request, *args, **kwargs):
        # context = getContext(request)
        auth0_u_id = request.session.get("user")['userinfo']
        try:
            user = User.objects.get(auth0_u_id=auth0_u_id['sub'].split('|')[1])
            # context.update({"key": settings.STRIPE_PUBLISHABLE_KEY})
            # return render(request, 'payment.html', context)
        except:
            if auth0_u_id['sub'].split('|')[0] == 'facebook':
                user = User.objects.create(auth0_u_id=auth0_u_id['sub'].split('|')[1], name=auth0_u_id['name'])
            else:
                user = User.objects.create(auth0_u_id=auth0_u_id['sub'].split('|')[1], name=auth0_u_id['name'],
                                       email=auth0_u_id['email'])

        projects_name = Projects.objects.filter(userId=user,isDeleted=False).values('projectId', 'name')
        context = {'projects': projects_name}
        return render(request, self.template_name, context)


class ProjectDetail(TemplateView):
    template_name = 'project-detail.html'

    def get(self, request, projectId, *args, **kwargs):
        # context = getContext(request)
        # try:
        #     prompt = ProjectPrompts.objects.get(projectId=projectId)
        #     response = PromptResponses.objects.filter(promptId=prompt)
        # except:
        prompt = ProjectPrompts.objects.filter(projectId=projectId, isDeleted =False).values('promptId__promptText', 'projectPromptId')
        # response = PromptResponses.objects.filter(promptId__in=prompt)
        # context = {'prompt': prompt, 'response': response}
        context = {'prompts': list(prompt)}
        return render(request, self.template_name, context)
    # context = {}
    #     try:
    #         prompt = ProjectPrompts.objects.get(projectId=projectId)
    #         category = prompt.promptId.promptName
    #         context.update({'category': category})
    #         response = PromptResponses.objects.filter(promptId=prompt)
    #     except:
    #         prompt = ProjectPrompts.objects.filter(projectId=projectId)
    #         for p in prompt:
    #             response = PromptResponses.objects.filter(promptId=p)
    #     context.update({'prompt': ast.literal_eval(prompt.promptFields), 'response': response})
    #     return render(request, self.t


class PromptDetail(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request, promptId, *args, **kwargs):
        prompt = ProjectPrompts.objects.get(projectPromptId=promptId, isDeleted = False)
        # prompt = Prompt.objects.get(promptId=promptId)
        # response = PromptResponses.objects.filter(promptId=project)
        # context = {'prompt': prompt, 'response': response}
        # return render(request, self.template_name, context)
        if request.session.get("user"):
            context = {'category': prompt.promptId.promptName, 'promptid': prompt.projectPromptId, 'promptUrl':  prompt.promptId.promptPostUrl}
            try:
                context.update({'subcategory': ast.literal_eval(prompt.promptFields)['sub_category']})
            except:
                pass
            return render(request, self.template_name, context)
        else:
            return redirect('dashboard')


class AutofillDetail(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request, promptId, *args, **kwargs):
        prompt = ProjectPrompts.objects.get(projectPromptId=promptId, isDeleted = False)
        parameters = ast.literal_eval(prompt.promptFields)
        responses = PromptResponses.objects.filter(promptId=prompt,isDeleted=False).values('responseId','response','responseType')
        return JsonResponse({'parameters': parameters, 'responses': list(responses)})


class ProjectDataTable(BaseDatatableView):
    order_columns = ["projectId","name","createdOnUtc"]

    def get_initial_queryset(self):
        if self.request.session.get("user")['userinfo']['sub'].split('|')[0] == 'facebook':
            uid = self.request.session.get("user")['userinfo']['sub'].split('|')[1]
            projects = Projects.objects.filter(userId__auth0_u_id=uid, isDeleted=False).order_by('-projectId')
        else:
            email = self.request.session.get("user")['userinfo']['email']
            projects = Projects.objects.filter(userId__email = email, isDeleted=False).order_by('-projectId')
        return projects

    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]')
        if search:
            qs = qs.filter(name__icontains=search)
        return qs

    def prepare_results(self, qs):
        json_data = []
        for item in qs:
            json_data.append({
                "id": item.projectId,
                "name": item.name,
                "created_date":item.createdOnUtc.date(),
            })

        return json_data


class ProjectPromptsDataTable(BaseDatatableView):
    order_columns = ["projectPromptId","promptId__promptText","createdOnUtc", "promptId__category"]

    def get_initial_queryset(self, *args,**kwargs):
        projects = ProjectPrompts.objects.filter(projectId=self.kwargs['projectId'], isDeleted=False).order_by('-projectPromptId')
        return projects

    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]')
        if search:
            qs = qs.filter(promptId__promptText__icontains=search)
        return qs

    def prepare_results(self, qs):
        json_data = []
        for item in qs:
            json_data.append({
                "id": item.projectPromptId,
                "name": item.promptId.promptText,
                "created_date":item.createdOnUtc.date(),
                "category":item.promptId.category
            })

        return json_data