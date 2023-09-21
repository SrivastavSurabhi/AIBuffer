from django.shortcuts import render, HttpResponse, redirect
from django.views.generic import TemplateView
import openai
import json
from django.http import JsonResponse
import http.client
from .constant import *
from django.core.files.storage import default_storage
# import cv2
import os
from dotenv import load_dotenv
from django.urls import reverse
from urllib.parse import urlencode
from django.conf import settings
from pricing.models import *
from prompt.models import *
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
import base64
import requests

def global_settings(request):
    return {
        'CACHE_VERSION': settings.CACHE_VERSION,
    }


load_dotenv()

conn = http.client.HTTPSConnection("api.openai.com")
openai.api_key = os.getenv('CHAT_GPT_KEY')


# def getContext(request):
#     return {"session": request.session.get("user"),
#                 "pretty": json.dumps(request.session.get("user"), indent=4)}


def get_login_detail(request):
    if request.session.get("user"):
        return JsonResponse({"session": request.session.get("user"),
                "pretty": json.dumps(request.session.get("user"), indent=4)})
    else:
        return JsonResponse({"logout": True})


class GetResponse(TemplateView):
    template_name = 'home.html'

    def post(self, request):
        context = {}
        data = json.loads(request.body.decode())
        task = data['task']
        additionalparameter = data['additionalparameter']
        quantity = data['quantity']
        searched_text = data['searched_text']
        if task == Task['Rewrite']:
            prompt_text = "rewrite:" + searched_text +'.'
        elif task == Task['Continue']:
            if additionalparameter == 'lines_count':
                prompt_text = "continue:" + searched_text + " in " + quantity + " lines."
            else:
                prompt_text = "continue:" + searched_text + " in " + quantity + " words."
        elif task == Task['Rephrase']:
            prompt_text = "rephrase:" + searched_text + " in " + additionalparameter +'.'
        elif task == Task['Image']:
            prompt_text = None
            context.update({'response_image': genrate_image(searched_text, int(quantity))})
        else:
            prompt_text = searched_text
        context.update({'response-ques': searched_text, 'response-answer': genrate_response(prompt_text, 3)})
        return JsonResponse(context)


class Images(TemplateView):
    template_name = 'images.html'

    def get(self,request):
        return render(request, self.template_name)

    def post(self, request):
        context = {}
        data = request.POST
        task = data['task']
        quantity = int(data['quantity'])
        image_size = data['image_size']
        try:
            searched_text = data['searched_text']
        except:
            pass
        try:
            image = request.FILES['choosen_image']
            original_image = default_storage.save('image_variations/'+ image.name,image)
            context.update({'original_image':original_image})
        except:
            pass
        if task == 'create_image':
            context.update({'response_image': genrate_image(searched_text, quantity,image_size)})
        elif task == 'create_variation':
            context.update({'response_image': genrate_variations(image, quantity,image_size)})
        else:
            context.update({'response_image': genrate_edited_image(searched_text,image, quantity,image_size)})
        context.update({'response-ques': searched_text})
        return JsonResponse(context)

class ImageResponses(TemplateView):
    template_name = 'dashboard-detail.html'

    def post(self, request):
        context = {}
        quantity = int(request.POST['response_count'])
        image_size = request.POST['resolution']
        # description = request.POST['title'] if request.POST['title'] else request.POST['description']
        try:
            prompt_txt = request.POST['title']
        except:
            prompt_txt =  request.POST['description']
        if prompt_txt == 'undefined':
            prompt_txt =  request.POST['description']
        context.update({'response_image': genrate_image(prompt_txt, quantity,image_size)})
        return JsonResponse(context)


class Dashboard(TemplateView):
    template_name = 'dashboard.html'

    # @method_decorator(cache_page(60*60*2))
    def get(self, request):
        prompts = Prompt.objects.all()
        if request.session.get("user"):
            context = {
                "session": request.session.get("user"),
                "pretty": json.dumps(request.session.get("user"), indent=4),
            }
            auth0_u_id = request.session.get("user")['userinfo']
            try:
                User.objects.get(auth0_u_id=auth0_u_id['sub'].split('|')[1])
                # context.update({"key": settings.STRIPE_PUBLISHABLE_KEY})
                # return render(request, 'payment.html', context)
            except:
                if auth0_u_id['sub'].split('|')[0] == 'facebook':
                    User.objects.create(auth0_u_id=auth0_u_id['sub'].split('|')[1], name=auth0_u_id['name'])
                else:
                    User.objects.create(auth0_u_id=auth0_u_id['sub'].split('|')[1], name=auth0_u_id['name'], email=auth0_u_id['email'])

            context.update({'prompts': prompts})
            return render(request, self.template_name, context)
        else:
            context = {'prompts': prompts}
            return render(request, self.template_name, context)


class NewDashboard(TemplateView):
    template_name = 'dashboard_new.html'

    def get(self, request):
        if request.session.get("user"):
            context = {
                "session": request.session.get("user"),
                "pretty": json.dumps(request.session.get("user"), indent=4),
            }
            auth0_u_id = request.session.get("user")['userinfo']
            try:
                User.objects.get(auth0_u_id=auth0_u_id['sub'].split('|')[1])
                # context.update({"key": settings.STRIPE_PUBLISHABLE_KEY})
                # return render(request, 'payment.html', context)
            except:
                User.objects.create(auth0_u_id=auth0_u_id['sub'].split('|')[1], name=auth0_u_id['name'], email=auth0_u_id['email'])
            return render(request, self.template_name, context)
        else:
            return render(request, self.template_name,)


class AskMeAnything(TemplateView):
    template_name = 'ask-me-anything.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': 'AskMeAnything'}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        searched_text = str(request.body.decode())
        possible_txt = ['hi','hii','hiii','hello','hey','Hi','Hii','Hiii','Hello','Hey','Hi there','Howdy']
        greetings = ['Good Morning','good morning','Good morning','Good Evening','good evening','Good evening','Good Afternoon','Good afternoon','good afternoon']
        if searched_text in possible_txt:
            searched_text = 'hello there'
        elif searched_text in greetings:
            searched_text = searched_text + '!'
        else:
            searched_text = "Prompt:" + searched_text + '.'#No need to start with punctuation marks.'
        return JsonResponse({"success":True,'text':genrate_response(searched_text, 1)})


class Blog(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request, task):
        if request.session.get("user"):
            context = {'category': Prompts['Blog'], 'subcategory': task}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request, task):
        title = request.POST['title']        
        count = request.POST['count']
        keyword = request.POST['keyword']
        category = request.POST['category']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        if task == 'generator':
            tune = request.POST['tune']
            prompt_text = 'Generate a blog whose title is "' + title + '" which lie in "' + category + '" category, write in "' + tune +  ' tone" and use keywords "' + keyword + \
                          '"Write this blog in exact '+ count +' words in '+language+' language. It is important to write blog under '+count+' words.'
        elif task == 'idea':
            description = request.POST['description']
            prompt_text = 'Generate a blog topic idea related to the topic "'+description+'". Write in '+language+' language.'
        else:
            description = request.POST['description']
            prompt_text = 'Write blog ' + task + ' using title ' + title + ' in ' + count + ' words using keyword: ' + keyword + \
                      ', category: ' + category + ' and blog description is: ' + description + '. Write in ' + language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text, response_count)})


class Twitter(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['Tweet']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write tweet for ' + description + '. Write in ' + language + ' language with less than 250 characters only.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text, response_count)})


class Content(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['Content']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text ='Rephrase in '+language+' language:'+ description +'.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text, response_count)})


class CopyWriting(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['Copywrite']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        company_name = request.POST['company_name']
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Please write a copywrite for '+ company_name +\
            ' company and the description of my product:' + description  + \
            '. Write in '+ language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class Article(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['Article']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        title = request.POST['title']
        words = request.POST['count']
        tune = request.POST['tune']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write an article on: "' + title + '" under ' + words + ' words in ' + tune +\
                      'tone. Write in ' + language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text, response_count)})


class Product(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['Product']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        title = request.POST['title']
        description = request.POST['description']
        quantity = request.POST['quantity']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text ='Write product description by using title "' +title+'" and description "'\
             + description  + '". Write description under '+quantity+' words in '+language+ ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class Amazon(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request, task):
        if request.session.get("user"):
            context = {'category': Prompts['AmazonProduct'], 'subcategory': task}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request, task):
        title = request.POST['title']
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        if title == 'undefined':
            prompt_text = 'Write Amazon ' + task + ' using description:' + description \
                 + '. Write in '+ language + ' language.'
        else:
            prompt_text = 'Write Amazon ' + task + ' using title: ' + title +\
                ' and description:' + description  + '. Write in '+ language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class FacebookAds(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['Facebook']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        title = request.POST['title']
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write facebook ads using product title: ' + title + \
        ' and product description:' + description +'. Write in '+language +' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class FacebookCaptions(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['FacebookCaptions']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write facebook caption using description:"' + description + \
            '" .Write in ' + language +'language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class PageHeading(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['PageHeading']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        title = request.POST['title']
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write landing page headlines using title: ' + title + \
            ' and description:' + description  + '. Write in '+ language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class Instagram(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['Instagram']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write instagram caption using description:"' + description + \
            '". Write in ' + language +'language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class HashTag(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['Hashtags']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write trending hashtags in '+ language +' language for this:"' + description +'."'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class Quora(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['Quora']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write Quora Answers for description:' + description  + \
            '. Write in '+ language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class Paragraph(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['Paragraph']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write Paragraph using description:' + description  +\
             '. Write in '+ language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class SocialPost(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['SocialPost']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write Social Post using description:' + description  + \
            '. Write in '+ language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class YoutubeVTitle(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['YouTubeTitle']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write youtube video title for description:' + description +\
            '. Write in '+language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class YoutubeVDescr(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['YouTubeDescr']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        title = request.POST['youtubetitle']
        description = request.POST['youtubedescr']
        quantity = request.POST['quantity']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write a '+quantity+'-word description in ' + language + ' language for a youtube video whose title is: "' + title +\
            '".  The description should provide an overview of the video content.You can use this description for more "'+ description +'".'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class YoutubeVIdeas(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['YouTubeIdeas']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        # quantity = request.POST['quantity']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write a youtube video topic idea related to "'\
            +description+'". Write in '+language+' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class YoutubeContentGenerator(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['YouTubeContent']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        quantity = request.POST['quantity']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text ='Write youtube video content for description "'+description+ '" within '\
            + quantity +' words in '+language+' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class SEOMetaDescription(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['SEODescription']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        pageTitle = request.POST['pageTitle']
        keyword = request.POST['keyword']
        response_count = int(request.POST['response_count'])
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write SEO Meta description for "' + description + \
            '" title "' + pageTitle + '" keyword "' + keyword  + '". Write in '\
            + language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class SongWriter(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['SongWriter']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        genre = request.POST['genre']
        mood = request.POST['mood']
        words = int(request.POST['quantity'])
        response_count = int(request.POST['response_count'])
        description = request.POST['description']
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write a '+ genre +' song in '+ mood +' mood using description: "' \
        + description +'". Write exact '+ str(words) +' words in '+ language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class KidsStory(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['StoryWriter']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        category = request.POST['story_category']
        storytitle = request.POST['storytitle']
        quantity = request.POST['quantity']
        response_count = int(request.POST['response_count'])
        description = request.POST['description']
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Write a '+ category +' story under '+ quantity +' word by using title "'+ storytitle +'" and by using description:' \
        + description +'. Write story in '+ language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text,response_count)})


class Keyword(TemplateView):
    template_name = 'dashboard-detail.html'

    def get(self, request):
        if request.session.get("user"):
            context = {'category': Prompts['GenerateKeywords']}
            return render(request, self.template_name, context)
        else:
            next_url = request.path
            login_url = reverse('login')
            query_string = urlencode({'next': next_url})
            return redirect(f'{login_url}?{query_string}')

    def post(self, request):
        description = request.POST['description']
        response_count = int(request.POST['response_count'])
        prompt_text = 'Create keywords : '+description +'.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text, response_count)})


def genrate_response(prompt_text, response_count):
    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt_text,
            temperature=1,
            max_tokens=1024,
            top_p=1,
            n=response_count,
        ).choices
        return response
    except:
        return False


def genrate_image(prompt_text, quantity, image_size):
    try:
        imageObject = []
        response = openai.Image.create(
            prompt=prompt_text,
            n=quantity,
            size=image_size
        ).data
        for i in response:
            imageObject.append(base64.b64encode(requests.get(i.url).content).decode())
        return imageObject
    except:
        return False


def genrate_variations(image, quantity,image_size):
    try:
        response = openai.Image.create_variation(
                image=open('media/image_variations/'+image.name, "rb"),
                n=quantity,
                size=image_size
                ).data
    except:
        # image1 = cv2.imread('media/image_variations/'+image.name,)
        # image1 = cv2.cvtColor(image1, cv2.COLOR_RGB2RGBA)
        # cv2.imwrite("media/"+image.name , image1)
        # response = openai.Image.create_variation(
        #     image=open('media/' + image.name, "rb"),
        #     n=quantity,
        #     size=image_size
        # ).data
        response = "Failed"
    return response


def genrate_edited_image(prompt_text, image,quantity,image_size):
    try:
        response = openai.Image.create_edit(
        image=open('media/image_variations/'+image.name, "rb"),
        # mask=open('cartoon1.png', "rb"),
        prompt=prompt_text,
        n= quantity,
        size=image_size
        ).data
    except:
        # image1 = cv2.imread('media/image_variations/'+image.name)
        # image1 = cv2.cvtColor(image1, cv2.COLOR_RGB2RGBA)
        # cv2.imwrite("media/"+image.name , image1)
        # response = openai.Image.create_edit(
        # image=open('media/'+image.name, "rb"),
        # prompt=prompt_text,
        # n= quantity,
        # size="256x256"
        # ).data
        response = "Failed"
    return response


class ChangeLanguage(TemplateView):
    template_name = 'dashboard-detail.html'

    def post(self, request):
        text = request.POST['text']
        language = request.POST['language'] if request.POST['language'] else 'English'
        prompt_text = 'Convert text: ' + text + 'into' + language + ' language.'
        return JsonResponse({"success": True, 'text': genrate_response(prompt_text, 1)})


class Term(TemplateView):
    template_name = 'term.html'

    def get(self, request):
        return render(request, self.template_name)


class GetPrompts(TemplateView):
    template_name = 'term.html'

    def get(self, request):
        prompts = Prompt.objects.all().values('promptText', 'category', 'description', 'promptPostUrl', 'frontImage',
                                              'backImage', 'promptGetUrl')
        return JsonResponse({"success": True, 'prompts': list(prompts)})
