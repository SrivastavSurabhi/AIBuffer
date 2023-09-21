//new page..........

var num = 0
var html = ""

$(document).ready(function(){
    // $.ajax({
    //     type: "GET",
    //     headers: {'X-CSRFToken': token},
    //     url: urls.allPrompts,
    //     processData: false,
    //     contentType: false,
    //     beforeSend: function() {
    //         showLoader();
    //     },
    //     complete: function() {
    //         hideLoader();
    //     },         
    //     success:function(data) {
    //         repeatDiv(data.prompts)
    //         $('.ch-masonry.all_data').append(html)
            activeHeader()
        // },
        // error: function() {
        //     console.log()        },  
    // })

    $(document).on('click', '.ch-masonry__item', function(){
    // $('.ch-masonry__item').click(function() {
        window.location = $(this).attr('url');
        return false;
    });
})

function repeatDiv(promptsObj){
    $.each(promptsObj, function(index, item){
        // if (index == 0){
        //     html += `<div class="ch-masonry">`
        // }
        // if (index % 8 == 0 && index != 0){
        //     num = 0 
        //     html += `</div>
        //             <div class="ch-masonry">`               
        // }
        num += 1    
        appendDiv(num, index+1, item)
    })
}

function appendDiv(num, index, item){   
    if(num == 1 || num == 7){
        boxNum = 1
    }
    else if(num == 2 || num == 8){
        boxNum = 4
    }
    else{
        boxNum = 2
    }
    html +=`<div class="ch-masonry__item box-wrap bg-grey single_block bg-1 ${item.category}" url=${item.promptGetUrl} style="background-image: url(${item.backImage})">
                <div class="text-data">
                    <div class="image ">
                        <img src="${item.frontImage}">
                    </div>
                    <div class="content">
                        <h6>${item.promptText}</h6>
                        <p>${item.description}</p>
                    </div>
                </div>
            </div>`
}