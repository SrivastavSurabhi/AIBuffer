// variable name in snake_case
$(document).ready(function(){    
    var query_text_val = $('.query-text').val()
    var quantity_val = $('.count').val()

    $(document).on('click', '.text_operation', function(){
        hideAllBlocks()    
        active_block = $(this)
        active_block.addClass('active')
        if( active_block.hasClass(TextService.Rewrite) ){
            $('.rewrite-block').removeClass('d-none')
        }
        else if( active_block.hasClass(TextService.Continue) ){
            $('.continue-writing-block').removeClass('d-none')
            $('.quantity').removeClass('d-none')
        }
        else if( active_block.hasClass(TextService.Rephrase) ){
            $('.rephrase-block').removeClass('d-none')
        }    
    });

    $(document).on('change', 'input[name="rewrite"]', function(){
        maxchars = 30
        selected_val = $(this).val()
        if( selected_val == ReWrite.Line ){
            $('.query-text').attr('maxlength', 30)
            var tlength = query_text_val.length;
            $('.query-text').val(query_text_val.substring(0, 30));
            remain = maxchars - parseInt(tlength);
            $('.query-text').text(remain);
        }
        else if( selected_val == ReWrite.Paragraph ){
            $('.query-text').attr('maxlength', '')
        }    
    });

    $(document).on('click', 'input[name="export"]', function(){
        export_data = getExportData(query_text_val, quantity_val)
        selected_val = $('input[name="export"]:checked').val()
        if( selected_val == 'csv' ){            
            download_csv_file([export_data.text, export_data.response])
        }
        else if( selected_val == 'pdf' ){            
            download_pdf_file(['Your query: '+export_data.text, 'Response: '+ export_data.response])
        }   
    })
})

// $(document).on('change', 'input[name="continue-writing"]', function(){
//     selected_val = $(this).val()
//     if( selected_val == ContinueWrite.Line ){
        
//     }
//     if( selected_val == ContinueWrite.Word ){
       
//     }    
// });


// function name in camelCase

function getTextResponse(task, additionalParameter, quantity){
    var data = {}
    // token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    data['task'] =  task
    data['searched_text'] = $('textarea[name="text"]').val()
    data['additionalparameter'] = additionalParameter?additionalParameter:null
    data['quantity'] = quantity?quantity:null   
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': token},
        url: "get_response/",
        data: JSON.stringify(data),
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
            $('.result-block').removeClass('d-none')
            if (data['response_image']){
                $('#result_img').empty()
                images = ''
                $.each(data['response_image'], function(index, value){
                    images += `<img class="mr-5" src="${value.url}">`
                })            
                $('#result_img').append(images).removeClass('d-none')
                $('.response').addClass('d-none')
            }
            else{
                $('#result_img').addClass('d-none')
                $('.response').removeClass('d-none')
                $('.response').text(data['response-answer'].trim())
            }
        },
        error: function(data) {
            alert("Something went wrong. Please try again.");
        },
    });
}

function getExportData(query_text_val, quantity_val){    
    active_block = $('.text_operation.active')
    if( active_block.hasClass(TextService.Rewrite) ){
        searched_text = 'Rewrite: '+ query_text_val
        response = $('.response').text()
    }
    else if( active_block.hasClass(TextService.Continue) ){
        searched_text = 'Continue Writing for ' + quantity_val + $('input[name="continue-writing"]').val().split("_count")[0] + ': ' + query_text_val 
        response = $('.response').text()
    }
    else if( active_block.hasClass(TextService.Rephrase) ){
        searched_text = 'Write in ' + $('.selected_language').val() + ': ' + query_text_val
        response = $('.response').text()
    }
    // if( active_block.hasClass(TextService.Image) ){
    //     searched_text = 'Generate ' + quantity_val + ' images : ' + query_text_val
    //     response = $('.image img')
    // } 
    return { 
            'text': searched_text,
            'response': response
          }
}
    
//create a user-defined function to download CSV file   
function download_csv_file(row) {  
  
    //define the heading for each row of the data  
    var csv = 'Query,Response\n';  
      
    //merge the data with CSV  
        csv += row.join(',');  
        csv += "\n";  
     
    var hiddenElement = document.createElement('a');  
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
    hiddenElement.target = '_blank';  
      
    //provide the name for the CSV file to be downloaded  
    hiddenElement.download = 'response.csv';  
    hiddenElement.click();  
}  

function download_pdf_file(row) {
    var dd = {
        content: [row]
    }
    dd.save('response.pdf');
    pdfMake.createPdf(dd).download();
}