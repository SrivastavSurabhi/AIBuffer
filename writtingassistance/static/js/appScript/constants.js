Operation = {
    Text: 'text_generation',
    Image: 'image_generation',
}

TextService = {
    Rewrite: 'rewrite',
    Continue: 'continue',
    Rephrase: 'rephrase',
}

ImageService = {
    Create: 'create_image',
    Variation: 'create_variation',
    Edit: 'edit_image',
    
}

ReWrite = {
    Line: 'line_to_line',
    Paragraph: 'paragraph',
}

ContinueWrite = {
    Word: 'words_count',
    Line: 'lines_count',
}

Generators = {
    Blog: 'blog_intro',
    Tweet: 'tweet_generator',
    Hashtags: 'hashtags_generator',
    Quora: 'quora',
    Paragraph: 'paragraph',
    SocialPost: 'socialpost',
    Content: 'content_generator',
    Copywrite: 'copywrite_generator',
    Article: 'article_generator',
    Product: 'product_description',
    AmazonProduct: 'amazon_product',
    Facebook: 'facebook_ads',
    PageHeading: 'page_headline',
    Instagram: 'insta_caption',
    SEODescription: 'seo_meta_desc',
    YouTubeTitle: 'youtube_title_generator',
    YouTubeDescr: 'youtube_descr_generator',
    YouTubeIdeas: 'youtube_ideas_generator',
    YouTubeContent: 'youtube_content_generator',
    SongWriter: 'song_writer',
    FacebookCaptions: 'facebook_caption',
    GenerateKeywords: 'generate_keyword',
    StoryWriter: 'story_writer',
    AskMeAnything:'ask_me_anything'
}

Download = {
    PDF: 'pdf',
    CSV: 'csv'
}

urls = {
    changeLanguage: '/change_language/',
    AskMeAnything:'/ask_buffy/',
    saveProject:'/projects/save_project/',
    getProject: '/projects/get_projects',
    getLoginDetails: '/get_login_detail',
    logout: '/logout',
    login: '/login',
    allProjects: '/projects/all_projects',
    autofill: '/projects/autofill_detail/',
    allPrompts: '/getprompts',
    deleteProjectPrompt:'/projects/delete_project_prompt/',
    deleteProject:'/projects/delete_project/',
    deleteResponses:'/projects/delete_responses/',
    imageResponse:'/image_responses/',
}
dataTableUrls ={
    projectDataTableUrl : '/projects/project_datatable/',
    projectPromptDataTableUrl: (projectId = 0) => `/projects/project_prompt_datatable/${projectId}`,
}

paths = {
    user: '/static/images/user.png',
}

const basicDataTableProperties = {   
    searching: true,
    processing: true,
    serverSide: true,
    stateSave: false,
    responsive: true,
    oLanguage: {
       sZeroRecords: "No data found",
       sProcessing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
    },
 }
 