var selectedValues = [];
$(document).ready(function(){
    hideImageLoader();
    hideTextLoader();
    let dataid = 0
    if(promptid !== undefined){
        autoFillData()
    }

    var selected = $('.custom-select .select-selected');
    var items = $('.custom-select .select-item');

    selected.click(function(){
        $(this).next('.select-items').toggle();
    });

    items.click(function(){
        selected.val($(this).data('value'));
        selected.html($(this).html());
        $(this).parent().hide();
    });
  
    // Form validations
    $("form").validate({
        rules: {
            description: "required", 
            category: "required", 
            title: "required", 
            mood:"required",
            genre:"required",
            ideas:"required",
            keywords:"required",
            language:"required",
            selected_format:"required"
        },
    });

    //Submit form
    $(document).on('click', '#submit_btn', function(){
        try {
            clearInterval(intervalId);
            // remove all entries from array
            responseArray.splice(0, responseArray.length)
            // $('.result-block').empty()
            $('#pills-saved').empty()
            $('#pills-images .row').empty()
            $('.solo_result:not(.d-none)').remove()
            $('.result_placeholder_text').removeClass('d-none')
            $('.result_placeholder_image').removeClass('d-none')
            $('.result_placeholder_text .result_placeholder_wrap,.result_placeholder_image .result_placeholder_wrap').removeClass('error-box')
            $('.result_placeholder_text .result_placeholder_wrap p,.result_placeholder_image .result_placeholder_wrap p').html(`Your result will appear here....`)
            
        }catch (error) {
            console.log(error);
        }  
        if($("form").valid()){    
            selectedValues.length = 0;
            resolution = $('.img-resolution:checked').val();
            $('input.selected_format:checked').each(function() {
                selectedValues.push($(this).val());
            });
            getSelectedInputData();
        }        
    })

    $(document).on('click', '.convert_to_video', function(){
        window.location = urls.convertToVideo;
        return false;
    })

    $(document).on('click', '.edit_cta button', function(){
        var textarea = $(this).closest('.solo_result').find('.content textarea')
        text = textarea.text()
        textarea.attr('readonly', false).focus()
        textarea.text(text)
    });

    $(document).on('click','.common_btn button', function(){
        $('.common_btn button').removeClass('active');
        $(this).toggleClass('active');
    })

    $(document).on('click', '.result-block .save_cta button', function(){
        currentDiv = $(this).closest('.solo_result').find('.content textarea').val();
        $('#selected_text').val(currentDiv);
        $('.save_as_project_btn').addClass('individual_response').removeClass('save_as_project')
        // if (!currentDiv.hasClass('saved')){
        //     cloneDiv = currentDiv.clone()
        //     currentDiv.addClass('saved')
        //     $('#pills-saved').append(cloneDiv)
        // }
    })

    $(document).on('click', '.copy_cta button', function(){
        var text = $(this).closest('.solo_result').find('.content textarea').val();
        var tempInput = $("<input>");
        $("body").append(tempInput);
        tempInput.val(text).select();
        document.execCommand("copy");
        tempInput.remove();
        $(this).addClass('copied')
        $(this).closest('.solo_result').find(".message").removeClass('d-none');
        setTimeout(function(){
            $(this).closest('.solo_result').find(".message").addClass('d-none');
        }, 10000);
    })

    $(document).on('click', '.result-block .del_cta button', function(){
        responseId = $(this).closest('.solo_result').find('textarea').attr('id')
        dataid = $(this).closest('.solo_result').attr('data-id')
        showDeleteModal(responseId , '' ,'delete_response')
    });

    $(document).on('click', '.delete_response .delete', function(){
        $.each($('div.solo_result'),function(index, value){
            if($(this).attr('data-id') == dataid){
                $(this).remove();
            }
        })
        // $(this).closest('.solo_result').remove();
        if(promptid !== undefined){
            responseId = $("#deleteData").attr('data');
            $.ajax({
                type: "DELETE",
                headers: {'X-CSRFToken': token},
                url: urls.deleteResponses,
                data: responseId,
                processData: false,
                contentType: false,
                beforeSend: function() {
                    showLoader();
                },
                complete: function() {
                    hideLoader();
                },         
                success:function(data) {
                    location.reload();
                },
                error: function() {
                    console.log("Something went wrong please try again")},  
            })
        }
    })

    $(document).on('click', '#pills-images .save_cta button, #pills-images .del_cta button', function(){
        currentDiv = $(this).closest('.solo_result')
        attrName = currentDiv.attr('data-id')
        $('.solo_result[data-id="' + attrName + '"]').removeClass('saved')
        cloneDiv = currentDiv.remove() 
    })   

    $(document).on('click', '#pills-saved .save_cta button, #pills-saved .del_cta button', function(){
        currentDiv = $(this).closest('.solo_result')
        attrName = currentDiv.attr('data-id')
        $('.solo_result[data-id="' + attrName + '"]').removeClass('saved')
        cloneDiv = currentDiv.remove() 
    })   

    $(document).on('change', '.download_cta .download_btn', function(){
        selected_val = $(this).val()        
        selectedInputs = $('.result-block .custom_check input:checked')
        if (selectedInputs.length > 0) {  
            responses = getExportData()
            // PDFheading = responses.text
            PDFsubHeading = responses.subtext
            PDFresponses = (responses.response)
            if( selected_val == Download.PDF ){                            
                    
                    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) {
                        var doc = new jsPDF();

                    // doc.setFontType("bold");
                    // doc.setFontSize(25);
                    // doc.text(20, 20, PDFheading);
                    doc.setFontType("bold");
                    doc.setFontSize(15);
                    doc.text(20, 30, PDFsubHeading);
                    var bodyContent = doc.splitTextToSize(PDFresponses, 250);
                    var pageHeight = doc.internal.pageSize.height;
                    doc.setFontType("normal");
                    doc.setFontSize("12");

                    var y = 50;
                    for (var i = 0; i < bodyContent.length; i++) {
                    if (y+10 > pageHeight) {
                        y = 15;
                        doc.addPage();
                    }
                    doc.text(10, y, bodyContent[i]);
                    y = y + 7;
                    }    
                    doc.save('Responses.pdf');

                        
                        // doc.setFontType("bold");
                        // doc.setFontSize(25);
                        // doc.text(20, 20, PDFheading);
                        // doc.setFontType("bold");
                        // doc.setFontSize(15);
                        // doc.text(20, 30, PDFsubHeading);
                        // var splitTitle = doc.splitTextToSize(PDFresponses, 180);
                        // // doc.text(15, 20, splitTitle);
                        // doc.setFontSize(12);
                        // doc.text(20, 50, splitTitle);
                        // // Save the PDF
                        // doc.save('Responses.pdf');

                    } else {
                        var opt = {
                            margin:       1,
                            filename:     'Responses.pdf',
                            html2canvas:  { scale: 1, scrollY: 0 },
                            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                        };
                        // PDF = '<h1>'+PDFheading+'</h1><br>'+'<h3>'+PDFsubHeading+'</h3><br>'+'<p>'+PDFresponses.replaceAll('\n','<br>')+'</p>'
                        PDF = '<h3>'+PDFsubHeading+'</h3><br>'+'<p>'+PDFresponses.replaceAll('\n','<br>')+'</p>'
                        
                        html2pdf().set(opt).from(PDF).save();
                    }            
                    // downloadPdfFile([{text:PDFheading, bold: true, fontSize: 40}, {text:PDFsubHeading}, {text:PDFresponses}])            

                    // var doc = new jsPDF();
                    // doc.setFontType("bold");
                    // doc.setFontSize(25);
                    // doc.text(20, 20, PDFheading);
                    // doc.setFontType("bold");
                    // doc.setFontSize(15);
                    // doc.text(20, 30, PDFsubHeading);
                    // var splitTitle = doc.splitTextToSize(PDFresponses, 180);
                    // // doc.text(15, 20, splitTitle);
                    // doc.setFontSize(12);
                    // doc.text(20, 50, splitTitle);
                    // // Save the PDF
                    // doc.save('Responses.pdf');

            }
            else if( selected_val == Download.CSV ){
                download_csv_file([responses.responseList])
            }  
        }
        else{
            alert('Please select at least one response')            
        }  
        $(this).find('[value="download"]').prop('disabled', false)
        $(this).val('download')
        $(this).find('[value="download"]').prop('disabled', true)
    });

    $(document).on('change', '.change_language', function(){
        selected_lang = $(this).val()
        currentDiv = $(this).closest('.solo_result')
        attrName = currentDiv.attr('data-id')
        text = currentDiv.find('.content textarea').val()
        response = changeLanguage(text, selected_lang, attrName)
    });
    document.addEventListener("wheel", function(event) {
        if (event.deltaY < 0) {
        //   autoScroll = false
        if($(event.toElement).hasClass('custom_textarea')){
            $(event.toElement).addClass("mousewheelevent")
        }
        }
        else{
            if($(event.toElement).hasClass('custom_textarea')){
                scrollH = $(event.toElement)[0].scrollTop + $(event.toElement)[0].clientHeight
                if (scrollH  == $(event.toElement)[0].scrollHeight){
                    $(event.toElement).removeClass("mousewheelevent")
                }
            } 
        }
      });
    // $('textarea').on("scroll", function(event) {
    //     alert();
    //     console.log(event)
    // });
    let startY; // to track the starting Y position of the touch

    document.addEventListener('touchstart', (e) => {
    // save the starting Y position of the touch
    startY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
    // calculate the change in Y position since the touch started
    const deltaY = e.touches[0].clientY - startY;

    if (deltaY > 0) {
    //   autoScroll = false
    if($(e.target).hasClass('custom_textarea')){
        $(e.target).addClass("mousewheelevent")
    }
    }
    else{
        if($(e.target).hasClass('custom_textarea')){
            scrollH = $(e.target)[0].scrollTop + $(e.target)[0].clientHeight
            if (scrollH  - $(e.target)[0].scrollHeight < 1){
                $(e.target).removeClass("mousewheelevent")
            }
        } 
    }
    // optionally prevent scrolling if needed
    //e.preventDefault();
    });

    // $('.custom_textarea').scroll(function(event) {
    //     console.log(event);
    //   });

    $(document).on('click','.select-image', function(){
        if ($('.select-image:checked')){
            $('.reponse_formats .res').toggleClass('d-none')
        }
    });

    $(document).on('click','.downlad_img', function(){
        var imageUrl = $(this).closest('.response_img').find('img').attr('src');
        console.log($(this).closest('.response_img').find('img').attr('src'))
        var fileName = 'image.jpg';
        const linkSource = imageUrl;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    })
    $(document).on('click','.check_img input', function(){
        if ($(this).is(':checked')){
            $(this).closest('.response_img').addClass('image-selected')
        }
        else{
            $(this).closest('.response_img').removeClass('image-selected')
        }
    });

// $('.check_img input').on('click', function(){
//     if($('.check_img input:checked')){
//         $(this).closest('response_img').addClass('check_img')
//     }
// })
})

function getFormData(){
    var data = new FormData();
    visibleDiv = $('.sidebar_solo_block')
    if ( visibleDiv.hasClass(Generators.Blog) ){
        title = $('.blog_intro .blogtitle').val()
        description = $('.blog_intro .blogdescription').val()
        tune = $('.blog_intro .tune').val()
        words = $('.blog_intro .quantity').val()?$('.blog_intro .quantity').val():50;
        keyword = $('.blog_intro .keyword').val()
        category = $('.blog_intro .category').val()
        language = $('.blog_intro .language').val()
        response_count = $('.blog_intro .response_count').val()
        data.append('response_count', response_count)
        data.append('title', title)
        data.append('tune', tune)
        data.append('description', description)
        data.append('count', words)
        data.append('keyword', keyword)
        data.append('category', category)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.Tweet) ){
        tweetDescription = $('.tweet_generator .tweetdescription').val()
        language = $('.tweet_generator .language').val()
        response_count = $('.tweet_generator .response_count').val()
        data.append('response_count', response_count)
        data.append('description', tweetDescription)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.Content) ){
        contentDescreption = $('.content_generator .rewrite').val()
        language = $('.content_generator .language').val()
        response_count = $('.content_generator .response_count').val()
        data.append('response_count', response_count)
        data.append('description', contentDescreption)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.Copywrite) ){
        companyName = $('.copywrite_generator .company_name').val()
        contentDescreption = $('.copywrite_generator .copywrite').val()
        language = $('.copywrite_generator .language').val()
        response_count = $('.copywrite_generator .response_count').val()
        data.append('response_count', response_count)
        data.append('company_name', companyName)
        data.append('description', contentDescreption)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.Article) ){
        articleTitle = $('.article_generator .articletitle').val()
        tune = $('.blog_intro .tune').val()
        words = $('.article_generator .quantity').val()?$('.article_generator .quantity').val():50;
        language = $('.article_generator .language').val()
        description = $('.article_generator .description').val()
        response_count = $('.article_generator .response_count').val()
        data.append('response_count', response_count)
        data.append('title', articleTitle)
        data.append('tune', tune)
        data.append('count', words)
        data.append('language', language)
        data.append('description', description)
    }
    if ( visibleDiv.hasClass(Generators.Product) ){
        productTitle = $('.product_description .producttitle').val()
        description = $('.product_description .description').val()
        language = $('.product_description .language').val()
        quantity  = $('.product_description .quantity').val()
        response_count = $('.product_description .response_count').val()
        data.append('response_count', response_count)
        data.append('title', productTitle)
        data.append('description', description)
        data.append('language', language)
        data.append('quantity', quantity)
    }
    if ( visibleDiv.hasClass(Generators.AmazonProduct) ){
        productTitle = $('.amazon_product .producttitle').val()
        description = $('.amazon_product .description').val()
        language = $('.amazon_product .language').val()
        response_count = $('.amazon_product .response_count').val()
        data.append('response_count', response_count)
        data.append('title', productTitle)
        data.append('description', description)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.PageHeading) ){
        pageTitle = $('.page_headline .pagetitle').val()
        description = $('.page_headline .description').val()
        language = $('.page_headline .language').val()
        response_count = $('.page_headline .response_count').val()
        data.append('response_count', response_count)
        data.append('title', pageTitle)
        data.append('description', description)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.Facebook) ){
        productTitle = $('.facebook_ads .producttitle').val()
        description = $('.facebook_ads .description').val()
        language = $('.facebook_ads .language').val()
        response_count = $('.facebook_ads .response_count').val()
        data.append('response_count', response_count)
        data.append('title', productTitle)
        data.append('description', description)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.Instagram) ){
        description = $('.insta_caption .description').val()
        language = $('.insta_caption .language').val()
        response_count = $('.insta_caption .response_count').val()
        data.append('response_count', response_count)
        data.append('description', description)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.FacebookCaptions) ){
        description = $('.facebook_caption .description').val()
        language = $('.facebook_caption .language').val()
        response_count = $('.facebook_caption .response_count').val()
        data.append('response_count', response_count)
        data.append('description', description)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.Hashtags) ){
        description = $('.hashtags_generator .hashtgsdescription').val()
        language = $('.hashtags_generator .language').val()
        response_count = $('.hashtags_generator .response_count').val()
        data.append('response_count', response_count)
        data.append('description', description)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.YouTubeTitle) ){
        description = $('.youtube_title_generator .youtube_video_title').val()
        language = $('.youtube_title_generator .language').val()
        response_count = $('.youtube_title_generator .response_count').val()
        data.append('response_count', response_count)
        data.append('description', description)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.YouTubeDescr) ){
        youtube_title = $('.youtube_descr_generator .youtubetitle').val()
        youtube_descr = $('.youtube_descr_generator .youtubedescr').val()
        language = $('.youtube_descr_generator .language').val()
        quantity = $('.youtube_descr_generator .quantity').val()? $('.youtube_descr_generator .quantity').val():50;
        response_count = $('.youtube_descr_generator .response_count').val()
        data.append('response_count', response_count)
        data.append('youtubetitle', youtube_title)
        data.append('youtubedescr', youtube_descr)
        data.append('language', language)
        data.append('quantity', quantity)
    }
    if ( visibleDiv.hasClass(Generators.YouTubeIdeas) ){
        quantity = $('.youtube_ideas_generator .youtube_video_topic_ideas').val()?$('.youtube_ideas_generator .youtube_video_topic_ideas').val():50;
        language = $('.youtube_ideas_generator .language').val()
        description = $('.youtube_ideas_generator .description').val()
        response_count = $('.youtube_ideas_generator .response_count').val()
        data.append('response_count', response_count)
        data.append('description', description)
        data.append('quantity', quantity)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.YouTubeContent) ){
        description = $('.youtube_content_generator .description').val()
        quantity = $('.youtube_content_generator .quantity').val()?$('.youtube_content_generator .quantity').val():50;
        language = $('.youtube_content_generator .language').val()
        response_count = $('.youtube_content_generator .response_count').val()
        data.append('response_count', response_count)
        data.append('description', description)
        data.append('quantity', quantity)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.SEODescription) ){
        description = $('.seo_meta_desc .description').val()
        pageTitle = $('.seo_meta_desc .pageTitle').val()
        keyword = $('.seo_meta_desc .keyword').val()
        language = $('.seo_meta_desc .language').val()
        response_count = $('.seo_meta_desc .response_count').val()
        data.append('response_count', response_count)
        data.append('description', description)
        data.append('pageTitle', pageTitle)
        data.append('keyword', keyword)
        data.append('language', language)
    }
    if ( visibleDiv.hasClass(Generators.SongWriter) ){
        language = $('.song_writer .language').val()
        genre = $('.song_writer .genre').val()
        mood = $('.song_writer .mood').val()
        quantity = $('.song_writer .quantity').val()
        description = $('.song_writer .song_description').val()
        response_count = $('.song_writer .response_count').val()
        data.append('response_count', response_count)
        data.append('language', language)
        data.append('genre', genre)
        data.append('mood', mood)
        data.append('quantity', quantity)
        data.append('description', description)
    }
    if ( visibleDiv.hasClass(Generators.GenerateKeywords) ){
        description = $('.generate_keyword .description').val()
        response_count = $('.generate_keyword .response_count').val()
        data.append('response_count', response_count)
        data.append('description', description)
    }
    if ( visibleDiv.hasClass(Generators.StoryWriter) ){
        language = $('.story_writer .language').val();
        story_category = $('.story_writer .story_category').val();
        storytitle = $('.story_writer .storytitle').val();
        quantity = $('.story_writer .quantity').val();
        description = $('.story_writer .storydescription').val();
        response_count = $('.story_writer .response_count').val();
        data.append('response_count', response_count)
        data.append('description', description)
        data.append('story_category', story_category)
        data.append('storytitle', storytitle)
        data.append('language', language)
        data.append('quantity', quantity)
    }
    data.append('selectedValues',selectedValues);
    data.append('resolution',resolution)
    return data
}

function autoFillData(){
    id = promptid
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': token},
        url: urls.autofill+id,
        processData: false,
        contentType: false,
        beforeSend: function() {
            showLoader();
        },
        complete: function() {
            hideLoader();
        },         
        success:function(data) {
            parameters = data.parameters      
            $('.sidebar_solo_block input[name="title"]').val(data.parameters.title);       
            $('.sidebar_solo_block select[name="category"]').val(data.parameters.category);       
            $('.sidebar_solo_block textarea[name="description"]').val(data.parameters.description);
            $('.sidebar_solo_block textarea.description').val(data.parameters.description);
            $('#language').val(data.parameters.language);
            $('#response_count').val(data.parameters.response_count);
            $('#category').val(data.parameters.category)
            $('#keyword').val(data.parameters.keyword)
            $('#quantity').val(data.parameters.quantity)
            $('#genre').val(data.parameters.genre)
            $('#mood').val(data.parameters.mood)  
            $('#tune').val(data.parameters.tune)  
            $('.company_name').val(data.parameters.company_name)  
            $('.selected_format').prop('checked',false);
            if(data.parameters.response_text_check){
                $('.select-text').prop('checked',true)
            }
            if(data.parameters.response_image_check){
                $('.select-image').prop('checked',true);
                $('.reponse_formats .res').removeClass('d-none');
                $('.img-resolution').prop('checked',false);
                $('input[value="'+data.parameters.resolution+'"]').prop('checked', true);
            }
            
            let responsesFormat = []
            // console.log(data.responses) 
            $('.result_placeholder_text').addClass('d-none')
            $('.result_placeholder_image').addClass('d-none')
            $.each(data.responses, function(index, item){
                if (item.responseType == 1){
                    responsesFormat.push(1)
                    appendResult(item.response, index+1, true, item.responseId)
                }
                else if(item.responseType == 2){
                    responsesFormat.push(2)
                    appendImageResult(item.response,item.responseId)
                }
                else{
                    appendResult(item.response, index+1, true, item.responseId)
                }
            }) 

            if ($.inArray(1, responsesFormat) !== -1 && $.inArray(2, responsesFormat) === -1) {
                $('#pills-images-tab').addClass('d-none')
            } else if($.inArray(2, responsesFormat) !== -1 && $.inArray(1, responsesFormat) === -1){
                $('#pills-text-tab').addClass('d-none')
                $('#pills-text').removeClass('active show')
                $('#pills-images-tab, #pills-images').addClass('active show')
            }            
            
            $('.change_language, .download_btn, .save-btn, .result-block .buttons button').prop('disabled',false);

            // appendResult(item, num) 
        },
        error: function() {
            console.log()        },  
    })
}

function appendImageResult(image_response, responseId){
    $('#pills-images .row').append(
        `<div class="col-lg-4 col-md-6 col-sm-6 col-12">
        <div class=" response_img" id="${responseId}"><a href="${image_response}" target="_blank" download><img src="${image_response}"></a><label class="container-wrap custom_check check_img"><input type="checkbox">
        <span class="checkmark"></span><button class="downlad_img"><i class="fas fa-download"></i></button>
        </label></div></div>`
        )
}

function appendResult(item, num, autofill=false,responseId){
    if (autofill){
        if(num && !($('.solo_result[data-id="' + num+ '"]').length > 0)) {
            cloneDiv = $('.solo_result.d-none').clone()
            cloneDiv.removeClass('d-none').attr("data-id", num)
            cloneDiv.find('.custom_check input').attr("data-id", num)            
            $('.result-block').append(cloneDiv)
            $('.solo_result[data-id="' + num+ '"]').find('textarea').val(item).attr('id',responseId)
        }
    }
    else{        
        if(num && !($('.solo_result[data-id="' + num+ '"]').length > 0)) {
            cloneDiv = $('.solo_result.d-none').clone()
            cloneDiv.removeClass('d-none').attr("data-id", num)
            cloneDiv.find('.custom_check input').attr("data-id", num)
            $('.result-block').append(cloneDiv)
        }
        currentDiv =  $('.solo_result[data-id="' + num + '"]')
        textarea = currentDiv.find('.content textarea')
        if($(textarea).hasClass('mousewheelevent')){          
        }
        else
        {
            textarea.scrollTop(textarea.prop("scrollHeight"))
        }
        if(item.charIndexToBeDisplayed < item.response.length) {
                textarea.val(textarea.val() + item.response.charAt(item.charIndexToBeDisplayed));
            item.charIndexToBeDisplayed++;    
        } 
        else{
            currentDiv.find($('.change_language, .download_btn, .save-btn, .result-block .buttons button')).prop('disabled',false);
            currentDiv.addClass('success-div')
            textarea.addClass("mousewheelevent")
        }

        var test = responseArray.find(function(item){
            return item.charIndexToBeDisplayed < item.response.length
        })

        if(test === undefined){
            currentDiv.addClass('success-div');
            clearInterval(intervalId);     
            $('.change_language, .download_btn, .save-btn, .result-block .buttons button').prop('disabled',false);       
        }
    }
}

// function appendResult(item, num){
//     if(num && !($('.solo_result[data-id="' + num+ '"]').length > 0))
//     {
//         cloneDiv = $('.solo_result.d-none').clone()
//         cloneDiv.removeClass('d-none').attr("data-id", num)
//         cloneDiv.find('.custom_check input').attr("data-id", num)
//         $('.result-block').append(cloneDiv)
//     }
//     textarea = $('.solo_result[data-id="' + num + '"]').find('.content textarea')
   
//     if(item.charIndexToBeDisplayed < item.response.length) {
//         textarea.val(textarea.val() + item.response.charAt(item.charIndexToBeDisplayed));
//         item.charIndexToBeDisplayed++;    
//     } 

//     var test = responseArray.find(function(item){
//         return item.charIndexToBeDisplayed < item.response.length
//     })

//     if(test === undefined){
//         clearInterval(intervalId);
//         $('.change_language').prop('disabled',false);
//         $('.download_btn').prop('disabled',false);
//     }
//     }

function downloadPdfFile(row) {
    var dd = {
        content: [row]
    }
    pdfMake.createPdf(dd).download('response.pdf');
}

function getExportData(){  
    visibleDiv = $('.sidebar_solo_block')
    if ( visibleDiv.hasClass(Generators.Blog) ){
        searched_text = $('.'+Generators.Blog).find('.title').text().trim()         
        // response =    
    }
    if ( visibleDiv.hasClass(Generators.Tweet) ){
        searched_text = $('.'+Generators.Tweet).find('.title').text().trim() 
        // response =    
    }
    if ( visibleDiv.hasClass(Generators.Content) ){
        searched_text = $('.'+Generators.Content).find('.title').text().trim() 
        // response =    
    }
    if ( visibleDiv.hasClass(Generators.Article) ){
        searched_text = $('.'+Generators.Article).find('.title').text().trim() 
        // response =    
    }
    if ( visibleDiv.hasClass(Generators.Product) ){
        searched_text = $('.'+Generators.Product).find('.title').text().trim() 
        // response =
    }
    if ( visibleDiv.hasClass(Generators.PageHeading) ){
        searched_text = $('.'+Generators.PageHeading).find('.title').text().trim() 
        // response =
    }
    if ( visibleDiv.hasClass(Generators.Facebook) ){
        searched_text = $('.'+Generators.Facebook).find('.title').text().trim() 
        // response =
    }
    if ( visibleDiv.hasClass(Generators.Instagram) ){
        searched_text = $('.'+Generators.Instagram).find('.title').text().trim() 
        // response =
    }
    if ( visibleDiv.hasClass(Generators.SEODescription) ){
        searched_text = $('.'+Generators.SEODescription).find('.title').text().trim() 
        // response =
    }
    if ( visibleDiv.hasClass(Generators.SongWriter) ){
        searched_text = $('.'+Generators.SongWriter).find('.title').text().trim() 
    }
    if ( visibleDiv.hasClass(Generators.GenerateKeywords) ){
        searched_text = $('.'+Generators.GenerateKeywords).find('.title').text().trim() 
    }
    if ( visibleDiv.hasClass(Generators.YouTubeContent) ){
        searched_text = $('.'+Generators.YouTubeContent).find('.title').text().trim() 
    }
    if ( visibleDiv.hasClass(Generators.FacebookCaptions) ){
        searched_text = $('.'+Generators.FacebookCaptions).find('.title').text().trim() 
    }
    if ( visibleDiv.hasClass(Generators.Copywrite) ){
        searched_text = $('.'+Generators.Copywrite).find('.title').text().trim() 
    }
    if ( visibleDiv.hasClass(Generators.AmazonProduct) ){
        searched_text = $('.'+Generators.AmazonProduct).find('.title').text().trim() 
    }
    if ( visibleDiv.hasClass(Generators.Hashtags) ){
        searched_text = $('.'+Generators.Hashtags).find('.title').text().trim() 
    }
    if ( visibleDiv.hasClass(Generators.YouTubeTitle) ){
        searched_text = $('.'+Generators.YouTubeTitle).find('.title').text().trim() 
    }
    if ( visibleDiv.hasClass(Generators.YouTubeDescr) ){
        searched_text = $('.'+Generators.YouTubeDescr).find('.title').text().trim() 
    }
    if ( visibleDiv.hasClass(Generators.YouTubeIdeas) ){
        searched_text = $('.'+Generators.YouTubeIdeas).find('.title').text().trim() 
    }
    if ( visibleDiv.hasClass(Generators.StoryWriter) ){
        searched_text = $('.'+Generators.StoryWriter).find('.title').text().trim() 
    }
    subtext = $('.description').val() ? $('.description').val() : ""

    selectedInputs = $('.result-block .custom_check input:checked')
    responseList = []
    responses = ''
    $.each(selectedInputs, function(){
        dataId = $(this).attr("data-id")
        textareaText = $('.solo_result[data-id="' + dataId + '"]').find('.content textarea').val()
        responses += textareaText + '\n\n'
        responseList.push(textareaText.replaceAll(",", ";").replaceAll("\n", ";"))
    })
    
    return { 
            'text': searched_text,
            'subtext': subtext,
            'response': responses,
            'responseList': responseList,
          }
}

async function getData(data){
  try{
    // token = document.getElementsByName("csrfmiddlewaretoken")[0].value;   
        
    const GPTresponse = await $.ajax({        
        type: "POST",
        headers: {'X-CSRFToken': token},
        url:  $('.blog_intro form').attr('action') ? $('.blog_intro form').attr('action') : promptUrl,
        data: data,
        processData: false,
        contentType: false, 
        beforeSend: function() {
            showTextLoader();
        },
        complete: function() {
            hideTextLoader();
        },
        error: function() {
            alert('Something went wrong. Please try again.')
        }
    });
    response = GPTresponse.text
    console.log(response)

    if(response)
    {
        $.each(response,function(index, item){
            responseArray.push({response: item.text.trim(), charIndexToBeDisplayed: 0})
        })
        $('.result_placeholder_text').addClass('d-none')
    }
    else{
        $('.result_placeholder_text .result_placeholder_wrap').addClass('error-box').removeClass('d-none')
        $('.result_placeholder_text .result_placeholder_wrap p').html(`<i class="fas fa-exclamation-triangle"></i> We're experiencing exceptionally high demand. Please hang tight as we work on scaling our system.`)
    }

    if(responseArray && responseArray.length > 0){
        // autoScroll = true
        intervalId = setInterval(() => { 
            $.each(responseArray, function(index, item){
                $('.change_language').prop('disabled',true);
                $('.download_btn').prop('disabled',true);
                $('.save-btn').prop('disabled',true);
                appendResult(item, index+1, false)
            })       
        }, 50);  
    }

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(".tab-content").offset().top
        }, 2000);
    }

  }catch(error){
    console.log(error);
  }
  }

  if(jQuery.inArray('image', selectedValues) !== -1) {
    if (jQuery.inArray('text',selectedValues) === -1){
        // $('#pills-text').removeClass('active show')
        $('#pills-images').addClass('active show')
        $('#pills-text-tab').addClass('d-none')
    }
    if (jQuery.inArray('image',selectedValues) === -1){
        $('#pills-text').removeClass('active show')
        $('#pills-images').addClass('active show')
        $('#pills-text-tab').addClass('d-none')
    }
}



async function getImageData(data){
    try{
        const GPTimageresponse = await $.ajax({        
        type: "POST",
        headers: {'X-CSRFToken': token},
        url:  urls.imageResponse,
        data: data,
        processData: false,
        contentType: false, 
        beforeSend: function() {
            showImageLoader();
        },
        complete: function() {
            hideImageLoader();
        },
        error: function() {
            alert('Something went wrong. Please try again.')
        }
        });
        image_response = GPTimageresponse.response_image
        console.log(image_response)
        if(image_response){
            // $('#pills-images').append(`<div class="row"></div>`)
            $('#pills-images .row').empty();
            $('.result_placeholder_image').addClass('d-none')
            $.each(image_response, function(index, item){
                $('#pills-images .row').append(
                    `<div class="col-lg-4 col-md-6 col-sm-6 col-12">
                <div class=" response_img" ><a href="data:image/png;base64,${item}" target="_blank" download><img src="data:image/png;base64,${item}"></a><label class="container-wrap custom_check check_img"><input type="checkbox">
                <span class="checkmark"></span><button class="downlad_img"><i class="fas fa-download"></i></button>
                </label></div></div>`
                    )
            });
        }
        else{
            $('.result_placeholder_image .result_placeholder_wrap').addClass('error-box').removeClass('d-none')
            $('.result_placeholder_image .result_placeholder_wrap p').html(`<i class="fas fa-exclamation-triangle"></i> It looks like this request may not follow our Terms of Use.`)
        }
    }
    catch(error){
        console.log(error);
      }
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }

async function changeLanguage(text, language, num){
    try{
        // token = document.getElementsByName("csrfmiddlewaretoken")[0].value;  
        var data = new FormData();
        data.append('text', text)
        data.append('language', language)
        const response = await $.ajax({
            type: "POST",
            headers: {'X-CSRFToken': token},
            url: urls.changeLanguage,
            data: data,
            processData: false,
            contentType: false,
            beforeSend: function() {
                showLoader();
            },
            complete: function() {
                hideLoader();
            },            
        });
        $('.solo_result[data-id="' + num + '"]').find('.content textarea').val(response.text[0].text.trim())
        return response.text[0].text.trim()
    }catch(error){
        return text;
  }
}

//create a user-defined function to download CSV file   
function download_csv_file(row) {  
  
    var csv = 'Response\n';  
    var universalBOM = "\uFEFF";
    csv += row.join(',');  
     
    var hiddenElement = document.createElement('a');  
    hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(universalBOM+csv);  
    hiddenElement.target = '_blank';  
      
    //provide the name for the CSV file to be downloaded  
    hiddenElement.download = 'response.csv';  
    hiddenElement.click();  
}  

function getSelectedInputData(){
    data = getFormData()
    if (jQuery.inArray('text',selectedValues) !== -1){
        getData(data)
        if (jQuery.inArray('image',selectedValues) === -1){
            $('#pills-text').addClass('active show')
            $('#pills-text-tab').removeClass('d-none')
            $('#pills-images').removeClass('active show')
            $('#pills-images-tab').addClass('d-none')
        }
        else{
            $('#pills-text-tab').removeClass('d-none').addClass('active')
            $('#pills-text').addClass('active show')
        }
    }
    if (jQuery.inArray('image',selectedValues) !== -1){
        getImageData(data)
        if (jQuery.inArray('text',selectedValues) === -1){
            $('#pills-text').removeClass('active show')
            $('#pills-images').addClass('active show')
            $('#pills-text-tab').addClass('d-none')
            $('#pills-images-tab').removeClass('d-none').addClass('active')
        }
        else{
            $('#pills-images').removeClass('active show')
            $('#pills-images-tab').removeClass('d-none').removeClass('active')
        }
    }
}