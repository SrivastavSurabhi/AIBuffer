// on scroll js 
$(window).scroll(function () {
  var scroll = $(window).scrollTop();
  if (scroll >= 100) {
      $("body").addClass("stickyHeader");
  }
  else {
      $("body").removeClass("stickyHeader");
  }
})

$(document).ready(function(){
  
  // tabs js
  headerShowHide()

  manageLogin()

  if (getCookie("click")) {
    $('.cookiealert').addClass('d-none')
    // $('body').removeClass('cookie_visible')
  }
  else{
    $('.cookiealert').removeClass('d-none')
    // $('body').addClass('cookie_visible')
  }

  $(document).on('click', '.cookiealert button', function(){
    document.cookie = "click" + "=" + true
    $('.cookiealert').addClass('d-none')
    // $('body').removeClass('cookie_visible')
  })

  // $(document).on('click', '.navbar-nav .nav-item , .ask-list .nav-item', function(){
  //       $('header').addClass('toggle_close')
  // })

  // $(document).on('click', '.navbar-toggler', function(){
  //   $('header').removeClass('toggle_close')
  // })

  $(document).on('click', '.single_block', function(){
    var classesToCheck = ['articleBlock', 'socialMedia', 'writingData', 'keywordResearch', 'ecommerceData', 'websiteData'];
    if ($(this).is(classesToCheck.map(function(className) { return '.' + className; }).join(','))) {
      for (var i = 0; i < classesToCheck.length; i++) {
        if ($(this).hasClass(classesToCheck[i])) {
          anchor = $(this).find('a')
          anchorHref = anchor.attr('href')
          anchor.attr('href', anchorHref+'?'+classesToCheck[i]);
          break;
        }
      }
    }   

  })

  $(document).on('click', '.listing .navbar-nav li a, .popular_category a', function(){
    x = $(this).attr("data-target");
    // window.location.href = '?'+x
    window.history.pushState({}, "", '?'+x);
      headerShowHide()
      // manageBoxSizes()
  })

  $('.fixed_loading').fadeOut().resize();

  $(document).on('click', '#submit', function(){
      if ($('.operation.active').hasClass('text_generation')){
          $('.result-block').addClass('d-none')
          selected_val = $('.text_operation.active')
          if( selected_val.hasClass(TextService.Rewrite) ){
              getTextResponse(TextService.Rewrite)
          }
          else if( selected_val.hasClass(TextService.Continue) ){
              if(!$('.count').val()){
                $('.count_error').removeClass('d-none')
              }
              else{
                $('.count_error').addClass('d-none')
                getTextResponse(TextService.Continue, $('input[name="continue-writing"]:checked').val(), $('.count').val())    
              }
          }
          else if( selected_val.hasClass(TextService.Rephrase) ){
              getTextResponse(TextService.Rephrase, $('.selected_language').val())
          }  
      }  
      else if($('.operation.active').hasClass('image_generation')){
        selected_val = $('.image_operation.active')
          if(selected_val.hasClass(ImageService.Create)){
            getImageResponse(ImageService.Create, $('.count').val()) 
          }
          else if(selected_val.hasClass(ImageService.Variation)){
            getImageResponse(ImageService.Variation, $('.count').val()) 
          }
          else if(selected_val.hasClass(ImageService.Edit)){
            getImageResponse(ImageService.Edit, $('.count').val()) 
          }
          
      }
  });

  $(document).on('click', '.operation', function(){
    active_block = $(this)
    hideAllBlocks()
    $('.operation').removeClass('active')
    active_block.addClass('active')
    if( active_block.hasClass(Operation.Text) ){
        $('.text_options').removeClass('d-none')
        $('.image_options').addClass('d-none')
    }
    if( active_block.hasClass(Operation.Image) ){
        $('.image_options').removeClass('d-none')
        $('.text_options').addClass('d-none')
    }
  })

  //popular category
  $('.popular_category').click(function(){
    var x = $(this).find('a').attr("data-target");
    var className = $(this).find('a').attr("id");
    $('.listing li a').attr('data-target')
    $('.all_data').find('.'+x).show();
    $('.listing').find('.'+className).addClass('active');
    $('.listing li:first-child a').removeClass('active');
    $('.popular_category').addClass('d-none');
    $('.all_data .headline').addClass('d-none');
  });

  //Languages dropdown
  $('.language').append(`                       
    <option value="select" disabled/>Select language</option>
    <option value="Arabic">Arabic</option>                                            
    <option value="Bengali">Bengali</option>                                            
    <option value="Chinese">Chinese</option>                                            
    <option value="Dutch">Dutch</option>                                            
    <option value="English" selected/>English</option>
    <option value="French">French</option>                                            
    <option value="German">German</option>                                            
    <option value="Gujarati">Gujarati</option>                                            
    <option value="Hindi">Hindi</option>                                            
    <option value="Italian">Italian</option>                                            
    <option value="Japanese">Japanese</option>                                            
    <option value="Javanese">Javanese</option>                                            
    <option value="Kannada">Kannada</option>                                            
    <option value="Korean">Korean</option>                                            
    <option value="Malayalam">Malayalam</option>                                            
    <option value="Marathi">Marathi</option>                                            
    <option value="Nepali">Nepali</option>                                            
    <option value="Polish">Polish</option>                                            
    <option value="Portuguese">Portuguese</option>                                            
    <option value="Punjabi">Punjabi</option>                                                                                       
    <option value="Russian">Russian</option>                                            
    <option value="Spanish">Spanish</option>
    <option value="Swedish">Swedish</option>                                            
    <option value="Tamil">Tamil</option>                                            
    <option value="Telugu">Telugu</option>                                            
    <option value="Turkish ">Turkish </option>                                            
    <option value="Ukrainian">Ukrainian</option>                                                                                    
    <option value="Urdu">Urdu</option>
    `);
   
    //category dropdown
  $('.category').append(`
  <option selected disabled>Select Category</option>
  <option value="Arts & Culture">Arts & Culture</option>
  <option value="Business">Business</option>
  <option value="Cars & Automotive">Cars & Automotive</option>
  <option value="Careers & Employment">Careers & Employment</option>
  <option value="Cryptocurrency">Cryptocurrency</option>
  <option value="DIY & Crafts">DIY & Crafts</option>
  <option value="Education">Education</option>
  <option value="Education Technology">Education Technology</option>
  <option value="Entertainment">Entertainment</option>
  <option value="Entrepreneurship">Entrepreneurship</option>
  <option value="Environment">Environment</option>
  <option value="Family & Parenting">Family & Parenting</option>
  <option value="Fashion">Fashion</option>
  <option value="Finance">Finance</option>
  <option value="Food & Beverage">Food & Beverage</option>
  <option value="Gaming">Gaming</option>
  <option value="Health & Fitness">Health & Fitness</option>
  <option value="Home & Garden">Home & Garden</option>
  <option value="Human Resources">Human Resources</option>
  <option value="Interior Design">Interior Design</option>
  <option value="International Relations">International Relations</option>
  <option value="Law & Politics">Law & Politics</option>
  <option value="Lifestyle">Lifestyle</option>
  <option value="Marketing">Marketing</option>
  <option value="Media & Journalism">Media & Journalism</option>
  <option value="Medical & Healthcare">Medical & Healthcare</option>
  <option value="Music">Music</option>
  <option value="Nature & Wildlife">Nature & Wildlife</option>
  <option value="News & Current Events">News & Current Events</option>
  <option value="Parenting & Pregnancy">Parenting & Pregnancy</option>
  <option value="Personal Development">Personal Development</option>
  <option value="Personal Finance">Personal Finance</option>
  <option value="Pets & Animals">Pets & Animals</option>
  <option value="Philosophy">Philosophy</option>
  <option value="Photography">Photography</option>
  <option value="Psychology">Psychology</option>
  <option value="Real Estate">Real Estate</option>
  <option value="Religion & Spirituality">Religion & Spirituality</option>
  <option value="Sales">Sales</option>
  <option value="Science">Science</option>
  <option value="Self-Improvement">Self-Improvement</option>
  <option value="Small Business">Small Business</option>
  <option value="Social Media">Social Media</option>
  <option value="Society & Culture">Society & Culture</option>
  <option value="Sports & Recreation">Sports & Recreation</option>
  <option value="Technology">Technology</option>
  <option value="Travel">Travel</option>
  <option value="Video Games">Video Games</option>
  <option value="Web Development">Web Development</option>
  <option value="Writing & Creativity">Writing & Creativity</option>
  <option value="Others">Others</option>
    `
  );

  $(".change_language").find("option[value='select']").remove();
  $(".change_language option:selected").removeAttr("selected");
  $(".change_language").prepend("<option val='change_language' selected disabled/>Change Language</option>");
  

  $('#prompt_form').append(`
  <div class="reponse_formats">
  <label>Convert to:</label>
  <div class="form-check">
  <input class="selected_format select-text" name="selected_format" type="checkbox" value="text" checked>
  <label class="form-check-label">Text</label>
  </div>
  <div class="form-check">
    <input class="selected_format select-image" name="selected_format" type="checkbox" value="image" >
    <label class="form-check-label">Image</label>
    </div>
    <div class="res d-none">
    <div class="form-check">
    <input class="form-check-input img-resolution" type="radio" name="img-resolution" value="256x256" checked>
    <label class="form-check-label">
      Small(256x256)
    </label>
    </div>
    <div class="form-check">
    <input class="form-check-input img-resolution" type="radio" name="img-resolution" value="512x512">
    <label class="form-check-label">
      Medium(512x512)
    </label>
    </div>
    <div class="form-check">
    <input class="form-check-input img-resolution" type="radio" name="img-resolution" value="1024x1024">
    <label class="form-check-label">
      Large(1024x1024)
    </label>
    </div>
    </div>
  </div>
  <div class="mb-3 responses">
    <label for="response_count" class="form-label ">How many responses you want?</label>
    <input type="number" class="form-control response_count" id="response_count" value="3" max="10">
  </div>  
  <div class="col-sm-12">
    <button type="button" id="submit_btn" class="btn">Submit</button>
  </div>
  `)

  $('.delete').click(function(){
    $('#deleteData').modal('hide')
  })
  $('.close').click(function(){
    $('#deleteData').modal('hide')
  })
})


function manageLogin(){
  // token = document.getElementsByName("csrfmiddlewaretoken")[0].value; 
  $.ajax({
    type: "GET",
    headers: {'X-CSRFToken': token},
    url: urls.getLoginDetails,
    processData: false,
    contentType: false,
    beforeSend: function() {
        showLoader();
    },
    complete: function() {
        hideLoader();
    },         
    success:function(data) {
      if(data.session){
        if (data.session.userinfo.picture){
          imgPath = data.session.userinfo.picture
        }
        else {
          imgPath = paths.user
        }        
        $('.listing .prof-list').append(`
          <li class="nav-item dropdown profile-list">
              <a class="nav-link dropdown-toggle t-list" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <figure class="profile-icon"><img class="profile_img" src="${imgPath}"> </figure>
              </a>
              <ul class="dropdown-menu">            
                  <li><a class="dropdown-item" href="${urls.allProjects}">Projects</a></li>
                  <li><a class="dropdown-item" href="${urls.logout}">Logout</a></li>
              </ul>
          </li>`)
      }
      else{
        $('.listing .prof-list').append(`<li class="login-warp"><a class="login-singup" href="${urls.login}">Login/Signup</a></li>`)
      }
    },
    error: function() {
      $('.listing .prof-list').append(`<li class="login-warp"><a class="login-singup" href="${urls.login}">Login/Signup</a></li>`)
    },  
  })
}

function headerShowHide(){    
  if (window.location.pathname === '/' || window.location.pathname === '/dashboard/') {    
    $('.navbar-nav .nav-item .nav-link').attr('href', "#" );       
    // $('.single_block').css("display", "none");    
    $('.all_data .headline').addClass('d-none');
  }
  else{    
    $('.navbar-nav .nav-item .nav-link').each(function(){
        var href = '/?' + $(this).attr('data-target');
        $(this).attr('href', href);
    });
  }
  activeHeader()
}

function activeHeader(){ 
  url = window.location.href.split('?')
  if (url[1] && url[1]!='all' && url[1]!='all#'){
    $('.popular_category').addClass('d-none');
    x = url[1].split('#')[0]
    element = $('.listing a[data-target="'+x+'"]')
    $(element).addClass('active');
    $(element).parent('li').siblings('li').find('a').removeClass('active');
    $('.single_block').addClass('d-none')
    $('.all_data').find('.'+x).removeClass('d-none');
    $('.headline_categories').text(element.text());
  }
  else if (location.pathname && location.pathname!='/' ) {  
    element = $('.listing a')
    $(element).removeClass('active');
  }
  else{
    $('.headline_categories').text('All Topics')
    $('.popular_category').removeClass('d-none');
    $('.listing li a').removeClass('active')
    $('.listing a[data-target="all"]').addClass('active')
    $('.single_block').removeClass('d-none');
  }
}

function hideAllBlocks(){
    $('.rewrite-block').addClass('d-none')
    $('.continue-writing-block').addClass('d-none')
    $('.rephrase-block').addClass('d-none')
    $('.quantity').addClass('d-none')
    $('.text_operation').removeClass('active')
    $('.result-block').addClass('d-none')
    $('.query-text').attr('maxlength', '')
}

function hideLoader(){
  $('.fixed_loading').fadeOut().resize();
}

function showLoader(){
  $('.fixed_loading').fadeIn().resize();
}

//Tabs inside save project pop up
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function showDeleteModal(id, name, className)
{
  $("#deleteData").modal('show').attr('data', id).addClass(className)
  if (className === "delete_response"){
    $("#popup_msg").html('Are you sure you want to delete?')
  }
  else if (className === 'confirmationPopup') {
    $("#popup_msg").html(`<figure class="sucess-icon"><img src="/static/images/tick.png"></figure>Your project is saved successfully.`)
    $('.confirmation').html(``)
  }
  else{
    $("#popup_msg").html('Are you sure you want to delete<strong> '+ name+'?</strong>')
  }
}

function hideImageLoader(){
  $('.loader_image').fadeOut().resize();
}

function showImageLoader(){
  $('.loader_image').fadeIn().resize();
}
function hideTextLoader(){
  $('.loader_text').fadeOut().resize();
}

function showTextLoader(){
  $('.loader_text').fadeIn().resize();
}