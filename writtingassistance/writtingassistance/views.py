import json
from authlib.integrations.django_client import OAuth
from django.shortcuts import render, redirect
from django.urls import reverse
from urllib.parse import quote_plus, urlencode
from django.conf import settings


oauth = OAuth()

oauth.register(
    "auth0",
    client_id=settings.AUTH0_CLIENT_ID,
    client_secret=settings.AUTH0_CLIENT_SECRET,
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f"https://{settings.AUTH0_DOMAIN}/.well-known/openid-configuration",
)


def login(request):
    next_url = request.GET.get('next')
    callback_url = request.build_absolute_uri(reverse("callback"))
    return oauth.auth0.authorize_redirect(
        request, callback_url+'?next={}'.format(next_url)
    )


def callback(request):
    try:
        next_url = request.GET.get('next')
        callback_url = request.build_absolute_uri(reverse("index"))
        token = oauth.auth0.authorize_access_token(request)
        request.session["user"] = token
        if next_url == 'None':
            return redirect(callback_url)
        return redirect(callback_url+'?next={}'.format(next_url))
    except:
        return redirect("dashboard")


def profile(request):
    if request.session.get("user"):
        return render(request, 'profile.html', context={
            "session": request.session.get("user"),
            "pretty": json.dumps(request.session.get("user"), indent=4),
        }, )
    else:
        next_url = request.path
        login_url = reverse('login')
        query_string = urlencode({'next': next_url})
        return redirect(f'{login_url}?{query_string}')


def logout(request):
    request.GET.get('next')
    request.session.clear()

    return redirect(
        f"https://{settings.AUTH0_DOMAIN}/v2/logout?"
        + urlencode(
            {
                "returnTo": request.build_absolute_uri(reverse("index")),
                "client_id": settings.AUTH0_CLIENT_ID,
            },
            quote_via=quote_plus,
        ),
    )


def index(request):
    next_url = request.GET.get('next')
    if request.session.get("user"):
        try:
            return redirect(next_url)
        except:
            return redirect("dashboard")
    else:
        return redirect("dashboard")
