$(document).ready(function(){
    $('body').addClass('ask_me_anything_body');
    typeWelcomeText()

    document.addEventListener("wheel", function(event) {
        console.log("wheel");
        if (event.deltaY < 0) {
          autoScroll = false
        }
      });
    

    let startY; // to track the starting Y position of the touch

    document.addEventListener('touchstart', (e) => {
    // save the starting Y position of the touch
    startY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
    // calculate the change in Y position since the touch started
    const deltaY = e.touches[0].clientY - startY;

    if (deltaY > 0) {
        // user has moved finger downwards
        console.log('Down');
        autoScroll = false
    } 
    // optionally prevent scrolling if needed
    e.preventDefault();
    });


    num = 0

    $(document).on('click','.search_btn_small',function(){
        $('.section-one').addClass('section-mb')
        searched_text = $('.serchbox .search_box').val();
        if (searched_text){
            $(this).closest('.serchbox').addClass('d-none');
                appendSearchedText(searched_text)
                if (!$('.loader_'+num).is(":visible")) {
                    sendAjaxRequest(searched_text)
            }
            if($(this).closest('.textareaposition').find('textarea').hasClass('centered-box')){
                $('.bigsearch').removeClass('d-none')
                $('.askme-sect').addClass('ask_any_chat')
            }
    
        }
        
        
    })

    $(document).on('click','.search_btn_large',function(){
    // $('.search_btn_large').click(function(){
        searched_text = $('.bigsearch .search_box').val()
        if(searched_text){
            appendSearchedText(searched_text)
            if (!$('.loader_'+num).is(":visible")) {
                sendAjaxRequest(searched_text)
            }
        }
    })

    $(document).on('click','.search_area .regenerate',function(){
        searched_text =  $('.questions').last().text()
        if (!$('.loader_'+num).is(":visible")) {
            $('.loader_'+num).fadeIn().resize();
            sendAjaxRequest(searched_text, 'regenerate')
        }
    })

    $(document).on('keydown','.serchbox textarea',function(event){
    // $(".serchbox textarea").on("keydown", function(event) {
        
        if (event.keyCode === 13 && interval === 0 && !event.shiftKey && !$('.loader_'+num).is(":visible")) {
            event.preventDefault();
            searched_text = $('.serchbox .search_box').val()
            if (searched_text){
                $(this).closest('.serchbox').addClass('d-none')
                appendSearchedText(searched_text)
                sendAjaxRequest(searched_text)
                if($(this).hasClass('centered-box')){
                    $('.section-one').addClass('section-mb');
                    $('.bigsearch').removeClass('d-none');
                    $('.askme-sect').addClass('ask_any_chat')
                }
            }
            }
        
            if (event.keyCode == 13 && event.shiftKey) {
              event.preventDefault();
              $(this).val($(this).val() + "\n");
              this.style.height = "auto";
              this.style.height = (this.scrollHeight) + "px";
            }
            
        });  
       

    $(document).on('keydown','.bigsearch textarea',function(event){
    // $(".bigsearch textarea").on("keydown", function(event) {
        
        if (event.keyCode === 13 && interval === 0 && !event.shiftKey && !$('.loader_'+num).is(":visible")) {
            event.preventDefault();
            searched_text = $('.bigsearch .search_box').val()
            if (searched_text){
                appendSearchedText(searched_text)
                sendAjaxRequest(searched_text)
            }
            }
        
            if (event.keyCode == 13 && event.shiftKey) {
              event.preventDefault();
              $(this).val($(this).val() + "\n");
              this.style.height = "auto";
              this.style.height = (this.scrollHeight) + "px";
            }
            // $('.bigsearch .search_area').removeClass('d-none')
        });
    });

    $(document).on('click','.answer-wrap .copy-wrap button.download_btn',function(){
        response = $(this).closest('.answer-wrap').find('.answer_txt .answer_area').text()
        if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) {
            var doc = new jsPDF();        
            var bodyContent = doc.splitTextToSize(response, 250);
            var pageHeight = doc.internal.pageSize.height;
            doc.setFontType("normal");
            doc.setFontSize("12");

            var y = 15;
            for (var i = 0; i < bodyContent.length; i++) {
            if (y+10 > pageHeight) {
                y = 15;
                doc.addPage();
            }
            doc.text(10, y, bodyContent[i]);
            y = y + 7;
            }    
            doc.save('Response.pdf');
        }
        else{
        var opt = {
            margin:1,
            filename:'Response.pdf',
            html2canvas:  { scale: 1, scrollY: 0 },
            jsPDF:{ unit: 'in', format: 'letter', orientation: 'portrait' }
        };

            html2pdf().set(opt).from(response.replaceAll('\n','<br>')).save();
        };
    });

    $(document).on('click','.copy_cta .copy_btn',function(){
        $(this).toggleClass('show-copy');
        var $temp = $("<textarea>"); 
        $("body").append($temp); 
        $temp.val($(this).closest('.copy-wrap').closest('.answer-wrap').find('.answer_area').text()).select(); 
        document.execCommand("copy"); 
        $temp.remove(); 
    });

    $(document).on('mouseout','.copy_cta .copy_btn', function(){
        $(this).removeClass('show-copy');
    })
    


function scrollToBottom()
{
    if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
        // const divHeight = document.querySelector('#your-div-id').offsetHeight;
        const divHeight = $(".askme-sect .display_section").height()
        // scroll down to the height of the div
        window.scrollTo({
            top: divHeight,
            behavior: 'smooth' // optional, for smooth scrolling
        });
    }
    else{
    $([document.documentElement, document.body, document.scrollingElement, window]).scrollTop($(".askme-sect .display_section").height())
    }
}

function typeAnswer(answer) {
    answerWord = answer.split(' ')
    var i = 0;
    interval = setInterval(function() {  
        $('.display_section .answer_'+num+' .answer_txt .answer_area').append(answerWord[i]+ ' ');
        i++;

        $('.regenerate').addClass('d-none')
        $('.stop-generating').removeClass('d-none')
        $('.search_btn').addClass('d-none')
        $('.copy-wrap').addClass('d-none');
        
        // document.addEventListener('visibilitychange', function() {
        //     if(document.hidden) {
        //         // tab is now inactive
        //         // temporarily clear timer using clearInterval() / clearTimeout()
        //     }
        //     else {
                if(autoScroll){
                    scrollToBottom();            
                }
        //     }
        // });

        // if(autoScroll){
        //     scrollToBottom();            
        // }

        //clearInterval 
        if (i >= answerWord.length) {
            clearInterval(interval);
            hideShowItems()
            $('.stop-generating').addClass('d-none');
        }
    }, 100);

    //Stop generating response
    $(document).on('click','.search_area .stop-generating',function(){
        clearInterval(interval);
        $(this).addClass('d-none');
        hideShowItems()
    });

    //textarea auto height
    $(document).on('input','textarea',function(){
    // $("textarea").on("input", function() {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
        if (this.style.height.split('px')[0] > 100){
            this.style.overflow = "auto";
        }
        else{
            this.style.overflow = "hidden";
        }        
      });
}

function hideShowItems(){
    interval = 0
    $('.regenerate').removeClass('d-none');
    $('.search_btn').removeClass('d-none');
    $('.copy-wrap').removeClass('d-none');
}

function appendSearchedText(searched_text){
    $('.display_section').append(`
    <div class="row question-wrap">
    
    <div class="questions question_`+ (num+1) +` offset-lg-1 col-lg-11 col-md-10 offset-sm-2 col-sm-10 offset-2 col-10 justify-content-end d-flex""><div class="answrap"><div class="user_logo"><img height="50px" src="${$('.profile_img').attr('src')}"></div>`+searched_text+`</div></div>
    </div>
    `);
    autoScroll = true
    scrollToBottom()    
} 


function sendAjaxRequest(searched_text,response){
    if (searched_text.length > 0 && searched_text !== '' ){
        $('.search_box').val('');
        $('.container h1').hide(); 
        if (response === undefined){  
            $('.textareaposition .search_box').height("50px");                                 
            num = num + 1
            $('.display_section').append(`
                <div class="row answer-wrap answer_`+num+`">
                    <div class=" col-lg-10 col-md-10 col-sm-10 col-10 ans_div_parent justify-content-end d-flex"><div class="answer_txt">
                        <div class="fixed_loading-answer loader_`+num+`">
                            <div class="fixed_loading_inset-answer">
                                <div class="spinner">
                                    <div class="rect1"></div>
                                    <div class="rect2"></div>
                                    <div class="rect3"></div>
                                    <div class="rect4"></div>
                                    <div class="rect5"></div>
                                </div>
                            </div>                        
                        </div>
                        <div class="logo"><img  src="../static/images/ai-icon.png"></div>
                        <div class="answer_area"></div>
                        <div class="copy-wrap   d-none">
                <div class="copy_cta">
                    <button class="copy_btn"><i class="fas fa-clone"></i><p class="copied-text"><span class="arrow"></span>Copied</p></button>
                    <button class="download_btn"><i class="fas fa-download"></i> </button>
                </div>
                    </div>
                    
                </div>
                </div>
               
            `);
            $('.loader_'+num).fadeIn().resize();
        }
        else{
            $('.display_section .answer_'+num+' .answer_txt .answer_area').text('');
        }       
        $.ajax({
            type: "POST",
            headers: {'X-CSRFToken': token},
            url:  urls.AskMeAnything,
            data: searched_text,
            processData: false,
            contentType: false, 
            beforeSend: function() { 
                // $('.loader_'+num).fadeIn().resize();              
                $('.search_box').prop('readonly',true);
                $('.regenerate').addClass('d-none');
            },
            complete: function() {
                // $('.loader_'+num).fadeOut().resize();
                $('.search_box').prop('readonly',false);                
            },
            success:function(data) {  
                $('.loader_'+num).fadeOut().resize();
                if (data.text){                     
                    $('.display_section .answer_'+num+' .answer_txt').removeClass('error-chat');
                    responseData = data['text'][0].text
                    console.log(responseData)
                    separator = '|';
                    if (responseData.split(separator).length > 1) {                        
                        responseData = data['text'][0].text
                        rows = responseData.trim().split('\n');
                        //numColumns = responseData.trim().split('\n')[0].split(separator);                        
                        table = "<table class='response-border'>";
                        for (i=0; i< rows.length ; i++) {
                            row = rows[i].trim().replace(/^\||\|$/g, '');
                            if (i != 1){
                                table = table + "<tr>"
                                coldata = row.split(separator).map(header => header.trim())
                                for ( j=0; j< coldata.length; j++){  
                                        table = table + "<td>"+coldata[j] +"</td>"
                                }
                                table = table + "</tr>"
                            }
                        }
                        table = table + "</table>";
                        $('.display_section .answer_'+num+' .answer_txt .answer_area').append(table);
                    }
                    // else if (/\t|,/.test(responseData) && /\n/.test(responseData)) {
                    //     str = responseData
                    //     // Split rows by line break and columns by tab or comma
                    //     var rows = str.trim().split('\n').map(function(row) {
                    //       return row.trim().split(/\t|,/);
                    //     });
                    
                    //     // Generate HTML table code
                    //     var html = '<table>';
                    //     rows.forEach(function(row) {
                    //       html += '<tr>';
                    //       row.forEach(function(cell) {
                    //         html += '<td>' + cell + '</td>';
                    //       });
                    //       html += '</tr>';
                    //     });
                    //     html += '</table>';
                    //     return html;
                    //   }
                    else{
                        autoScroll = true
                        typeAnswer($.trim(data['text'][0].text)) 
                    }
                }
                else{
                    $('.display_section .answer_'+num+' .answer_txt').addClass('error-chat')
                    $('.error-chat div.answer_area').html(`<i class="fas fa-exclamation-triangle"></i>`)
                    typeAnswer(" We're experiencing exceptionally high demand. Please hang tight as we work on scaling our system.")
                    $('.regenerate').removeClass('d-none');
                }            
            },
            error: function() {
                // $('.display_section').append(`
                // <div class="row answer_wrap answer_`+num+`" style="color:red;">
                // <div class="logo col-1"><img height="50px" src="../static/images/logo_icon.png"></div>
                // <div class="answer_txt col-10">network error</div>
                // </div>`);
                sendAjaxRequest(searched_text, 'regenerate')
            }
        })
    }
}

function typeWelcomeText() {
    placeholderText = "Hi I'm Buffy! Ask me anything......"
    var i = 0;
    setTimeout(() => {
        interval = setInterval(function() { 
        $('.centered-box').attr('placeholder',function() {
            return $(this).attr('placeholder') + placeholderText.charAt(i);}
        );
        i++;        

        //clearInterval 
        if (i >= placeholderText.length) {
            clearInterval(interval);
            interval = 0
        }
    }, 30);
}, 1000);
}