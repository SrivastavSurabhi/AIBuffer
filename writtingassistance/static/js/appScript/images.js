$(document).ready(function(){    

    // $(document).on('click', '.image_operation', function(){
    //     selected_val = $(this);
    //     $('.image_operation').removeClass('active')
    //     $(this).addClass('active')
    //     if (selected_val.hasClass(ImageService.Create)){
    //         $('.select_image').addClass('d-none')
    //         // $('.text_area').removeClass('d-none')
    //         $('.quantity').removeClass('d-none')
    //         $('.form_field_area h3').removeClass('d-none')
    //     }  
    //     else if(selected_val.hasClass(ImageService.Variation)){
    //         // $('.text_area').addClass('d-none')
    //         $('.select_image').removeClass('d-none')
    //         $('.query-text').addClass('d-none')
    //         $('.form_field_area h3').addClass('d-none')
    //         $('.quantity').removeClass('d-none')
    //     }
    //     else if(selected_val.hasClass(ImageService.Edit)){
    //         // $('.text_area').removeClass('d-none')
    //         $('.select_image').removeClass('d-none')
    //         $('.query-text').removeClass('d-none')
    //         $('.quantity').removeClass('d-none')
    //         $('.form_field_area h3').removeClass('d-none')
    //     }
    // });
    $(document).on('click', '#submit', function(){
        selected_val = $('.options').val();
        getImageResponse(selected_val, $('.count').val()) 
    });
    $(document).on('change', '#choosen_image', function(e){
        const img_data = $(this).prop('files')[0]
        const url = URL.createObjectURL(img_data)
        $('#image_modal').modal("show");
        $("#image-box").html(`<img src="${url}" id="image" style="width:100%;">`)
        initialiseCropper($("img#image")[0]) 
        showHideElement('#crop-btn',true)
        showHideElement('#image-box',true)   
        showHideElement('#confirm-btn',false)   
      })

      $(document).on('change', '.options', function(){
        selected_val = $('.options').val();
        if (selected_val == 'create_image'){
            $('.select_image').addClass('d-none')
            $('.text_area').removeClass('d-none')
        }  
        else if(selected_val == 'create_variation'){
            $('.text_area').addClass('d-none')
            $('.select_image').removeClass('d-none')
        }
        else{
            $('.text_area').removeClass('d-none')
            $('.select_image').removeClass('d-none')
        }
    });
  
      $(document).on('click', '#crop-btn', function(e){
        if(cropper){
          cropper.getCroppedCanvas().toBlob((blob)=>{
          let fileInputElement = $('#choosen_image');
          let file = new File([blob], $('#choosen_image').prop('files')[0].name,{type:"image/*", lastModified:new Date().getTime()});
          let container = new DataTransfer();
          container.items.add(file);
          fileInputElement.prop('files',container.files);
          showHideElement('#crop-btn',false)
          showHideElement('#confirm-btn',true) 
          $('#image-box').html(`<img class="result_img" height="200px" width="200px" src="${URL.createObjectURL($('#choosen_image')[0].files[0])}">`)
          });           
        }    
      })
      $(document).on('click','.savecroppedimg',function(e){
        image_src = $('.result_img').attr('src')
        $('#image_modal').modal("hide");
        $('.selected_img').attr('src',image_src)
        $('.selected_img').attr('height','200px')
        $('.selected_img').attr('width','200px')
    })

    $(document).on('click','.close', function(e){
        $('#image_modal').modal("hide");
    });
})


function getImageResponse(task, quantity){
    var data = new FormData();
    // token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    data.append('task', task)
    data.append('searched_text', $('textarea[name="text"]').val())
    data.append('quantity', quantity?quantity:5)
    data.append('image_size', $('.size_options').val()?$('.size_options').val():"256x256")
    data.append('choosen_image', $('#choosen_image').prop('files')[0])
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': token},
        url: "/get_images_response/",
        data: data,
        processData: false,
        contentType: false,
        dataType: "json",
        beforeSend: function() {
            showLoader();
        },
        complete: function() {
            hideLoader();
        },
        success:function(data) {
            if(data['response_image'] == "Failed"){
                alert("Input image is not valid. Please try with other one.")
            }
            else{
                $('#result_img').empty()
                images = ''
                // if(data['original_image']){
                //     images += `<p>Original Image</p><img class="m-1" height="256px" width="256px" src="/media/`+data['original_image']+`">`
                // }
                $.each(data['response_image'], function(index, value){
                    images += `<img class="m-5" src="${value.url}">`
                })          
                $('#result_img').append(images)
                $('.image-area').removeClass('d-none')
            }
        },
        error: function(data) {
            alert("Something went wrong. Please try again.");
        },
    });
}

function initialiseCropper(imageElement){
    cropper = new Cropper(imageElement, {
      autoCropArea: 1,
      viewMode: 1,
      aspectRatio: 1 / 1,
      scalable: false,
      zoomable: false,
      movable: false,
      minCropBoxWidth: 200,
      minCropBoxHeight: 200,
      })     
  }

function showHideElement(elementId, display){
    if (display == true){
      $(elementId).css('display','flex')
    }
    else{
      $(elementId).css('display','none')
    }
  }
  