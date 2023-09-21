$(document).ready(function(){
    $(document).on("change", "input[type='checkbox']", function() {
        if($('.custom_check input').is(':checked') == true){
            $('.all_tabs .save-btn').prop('disabled',false)
        }
        else{
            $('.all_tabs .save-btn').prop('disabled',true)
        }
    });
    $("#project_names").validate({
        rules: {
            existing_project:"required",
            new_project:"required"
        },
    });
    var validators =$("#project_names").validate();

    $(document).on("click", ".save_project button", function() {
        if ($(this).hasClass('save-btn')){
            $('.save_as_project_btn').addClass('save_as_project').removeClass('individual_response')
        }
        selectedInputs = $('.custom_check input:checked')
        if(selectedInputs.length > 0 || $(this).parent().hasClass('save_cta')){
            $('#saveProjectPopup').modal('show')
            if ($(this).closest('.save_cta').length == 0){
                $('#selected_text').val('');
            }       
            $.ajax({
                type: "GET",
                headers: {'X-CSRFToken': token},
                url: urls.getProject,
                processData: false,
                contentType: false,
                beforeSend: function() {
                    showLoader();
                },
                complete: function() {
                    hideLoader();
                },         
                success:function(data) {
                    projects = JSON.parse(data['projects_name'])
                    $('#new_project .project_name').val('');
                    $('#existing_project .project_name').val('');
                    $('.project_name option').remove()
                    $('#existing_project .project_name').append(`
                        <option value="">Select previous projects</option>
                        `)
                    $.each(projects, function(index,value){
                        $('#existing_project .project_name').append(`
                        <option>`+value['name']+`</option>
                        `)
                    })
                },
                error: function() {
                    alert("Something went wrong. Please try again.");
                },  
            })
        }
        else{
            alert("Please select at least one response");
            
        }
    });

    $(document).on("click", ".individual_response", function(){
        data = getPromptData()
        responseList = []
        responses = ''
        if ($('#selected_text').val() != '') {  
        visibleDiv = $('.sidebar_solo_block')
        if (responseList.length == 0){
            responseList.push($('#selected_text').val());
        }
        data['response'] = responseList;
        saveProject(data,validators)
    }
    })



    $(document).on("click", ".save_as_project", function() {
        data = getPromptData()
        selectedInputs = $('.custom_check input:checked')
        responseList = []
        imageResponseList = []
        responses = ''
        if (selectedInputs.length > 0 | $('#selected_text').val() != '') {  
            $.each(selectedInputs, function(){
                dataId = $(this).attr("data-id")
                textareaText = $('.solo_result[data-id="' + dataId + '"]').find('.content textarea').val()
                imgResponse = $(this).closest('.response_img').find('img').attr('src')
                if (textareaText){
                    responseList.push(textareaText)
                }
                if (imgResponse){
                    imageResponseList.push(imgResponse)
                } 
            })

            visibleDiv = $('.sidebar_solo_block')
            if (responseList.length == 0 && $('#selected_text').val() !== ''){
                responseList.push($('#selected_text').val());
            }
            data['response'] = responseList;
            data['img_response'] = imageResponseList;
            saveProject(data,validators)
        }
        else{
            alert('Please select at least one response')            
        } 
    })
})

function getPromptData(){
    data = {}
    prompt_fields = {}
    data['prompt_fields'] = prompt_fields
    data['project_name'] = $('#new_project').is(':visible')? $('#new_project .project_name').val() : $('#existing_project .project_name').val();
    data['type'] = $('#new_project').is(':visible')? false : true;
    data['prompt_name'] = $('.sidebar_solo_block .title').text();
    data['prompt_description'] = $('.sidebar_solo_block .subtitle').text();
    visibleDiv = $('.sidebar_solo_block')
    if ( visibleDiv.hasClass(Generators.Blog) ){
        subCategory = visibleDiv.find('form').attr('action').split('blog/')[1]
        prompt_fields['sub_category'] = subCategory
    }
    if (  visibleDiv.hasClass(Generators.AmazonProduct) ){
        subCategory = visibleDiv.find('form').attr('action').split('amazon/')[1]
        prompt_fields['sub_category'] = subCategory
    }
    prompt_fields['description'] = $('.sidebar_solo_block textarea[name="description"]').val()? $('.sidebar_solo_block textarea[name="description"]').val(): $('.sidebar_solo_block textarea.description').val();
    prompt_fields['language'] = $('#language').val();
    prompt_fields['response_count'] = $('#response_count').val();
    prompt_fields['tune'] = $('#tune').val();
    prompt_fields['category'] = $('#category').val() ? $('#category').val() :"" ;
    prompt_fields['keyword']=$('#keyword').val() ? $('#keyword').val(): "" ;
    prompt_fields['quantity']=$('#quantity').val() ? $('#quantity').val(): "" ;
    prompt_fields['genre']=$('#genre').val() ? $('#genre').val(): "" ;
    prompt_fields['mood']=$('#mood').val() ? $('#mood').val(): "" ;
    prompt_fields['company_name'] = $('.company_name').val()?$('.company_name').val():""; 
    prompt_fields['title'] = $('.sidebar_solo_block input[name="title"]').val();
    prompt_fields['category'] = $('.sidebar_solo_block select[name="category"]').val();   
    prompt_fields['response_text_check'] = $('input.select-text').is(':checked');   
    prompt_fields['response_image_check'] = $('input.select-image').is(':checked');   
    prompt_fields['resolution'] = $('.img-resolution:checked').val();  
    return data
}

function saveProject(data,validators){
    if($("#project_names").valid()){
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': token},
        url: urls.saveProject,
        data: JSON.stringify(data),
        processData: false,
        contentType: false,
        beforeSend: function() {
            showLoader();
        },
        complete: function() {
            hideLoader();
        },         
        success:function(data) {
            if(data['success']){
                $('#saveProjectPopup').modal('hide');
                $('.modal-backdrop').removeClass('modal-backdrop');
                // alert("Your project is successfully saved.");
                showDeleteModal('' , '' ,'confirmationPopup')
            }
            else{
                validators.showErrors({"new_project":'Project name already exists.'})
            }
        },
        error: function() {
            alert("Something went wrong. Please try again.");
        },  
    });
    }
    }