from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.Dashboard.as_view(), name="dashboard"),
    path('get_login_detail', views.get_login_detail, name="get_login_detail"),
    path('new_dashboard/', views.NewDashboard.as_view(), name="new_dashboard"),
    path('get_response/', views.GetResponse.as_view(), name="get_response"),
    path('images/', views.Images.as_view(), name="images"),
    path('get_images_response/', views.Images.as_view(), name="images"),
    # path('dashboard/', views.Dashboard.as_view(), name="dashboard"),
    path('blog/<str:task>', views.Blog.as_view(), name="blog"),
    path('tweet/', views.Twitter.as_view(), name="tweet"),
    path('content/', views.Content.as_view(), name="content"),
    path('copywriting/', views.CopyWriting.as_view(), name="copywriting"),
    path('article/', views.Article.as_view(), name="article"),
    path('product/', views.Product.as_view(), name="product"),
    path('amazon/<str:task>', views.Amazon.as_view(), name="amazon"),
    path('facebook/', views.FacebookAds.as_view(), name="facebook"),
    path('facebook_caption/', views.FacebookCaptions.as_view(), name="facebook_caption"),
    path('page_headline/', views.PageHeading.as_view(), name="page_headline"),
    path('insta/', views.Instagram.as_view(), name="insta"),
    path('hashtags/', views.HashTag.as_view(), name="hashtags"),
    path('quora/', views.Quora.as_view(), name="quora"),
    path('paragraph/', views.Paragraph.as_view(), name="paragraph"),
    path('socialpost/', views.SocialPost.as_view(), name="socialpost"),
    path('youtube_video_title/',views.YoutubeVTitle.as_view(),name="youtube_video_title"),
    path('youtube_vide_descr/',views.YoutubeVDescr.as_view(),name="youtube_vide_descr"),
    path('youtube_video_topic_ideas/',views.YoutubeVIdeas.as_view(),name="youtube_video_topic_ideas"),
    path('youtube_content_generator/',views.YoutubeContentGenerator.as_view(),name="youtube_content_generator"),
    path('seo_meta_desc/',views.SEOMetaDescription.as_view(),name="seo_meta_desc"),
    path('song_writer/',views.SongWriter.as_view(),name="song_writer"),
    path('kids_story/', views.KidsStory.as_view(), name="kids_story"),
    path('ask_buffy/', views.AskMeAnything.as_view(), name="ask_me_anything"),
    path('generate_keyword/',views.Keyword.as_view(),name="generate_keyword"),
    path('change_language/', views.ChangeLanguage.as_view(), name="change_language"),
    path('term/', views.Term.as_view(), name="term"),
    path('getprompts/', views.GetPrompts.as_view(), name="getprompts"),
    path('image_responses/', views.ImageResponses.as_view(), name="image_responses"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
