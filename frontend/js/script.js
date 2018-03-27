// create the module and name it parentRoundApp
var parentRoundApp = angular.module('parentRoundApp', ['ngRoute']);

function addFbSDK(){
    window.fbAsyncInit = function() {
        FB.init({
            appId            : '1227200210641237',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v2.11'
        });
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

// configure our routes
parentRoundApp.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'pages/landing.html',
            controller  : 'mainController'
        })
        
        .when('/signup', {
            templateUrl : 'pages/signup.html',
            controller  : 'signUpController'
        })

        .when('/search-school', {
            templateUrl :   'pages/search-school.html',
            controller  :   'selSchoolController'
        })

        .when('/school-selected', {
            templateUrl :   'pages/school-page.html',
            controller  :   'thankController'
        })

        // route for the about page
        .when('/message-sent', {
            templateUrl : 'pages/final-page.html',
            controller  : 'finalController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : 'pages/contact.html',
            controller  : 'contactController'
        });
});

parentRoundApp.controller('mainController', function($scope, $log, $window) {
    addFbSDK();
    
    $('.facebook_btn').click(function(){
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me?fields=id,name,email', function(fbdata) {
                    console.log(fbdata);
                    logged_in_email = fbdata.email;
                    // call login/signup api
                    $.ajax({
                        url: 'https://thanks.parentround.com/api',
                        headers: {'request_method':'withFacebook'},
                        type: 'post',
                        data: {email: fbdata.email, password: fbdata.id, name: fbdata.name},
                        success: function (result) {
                            res = JSON.parse(result);
                            if(res.success == true) {
                                localStorage.removeItem("jwt_token");
                                localStorage.setItem("jwt_token", res.result["token"]);
                                localStorage.removeItem("logged_in_email");
                                localStorage.setItem("logged_in_email", logged_in_email);
                                $window.location.href = "#/search-school";
                            }
                            else {
                                $('#loginErrTxt').html(res.error);        
                            }
                        }
                    });

                });
            }
            else {
                console.log('User cancelled login or did not fully authorize.');
                $('#loginErrTxt').html('Your login was cancelled');
            }
        }, {scope: 'public_profile, email'});
    });
    
    $('#main').css('border-top','2px solid #7fb127');
    $('#main').css('border-bottom','2px solid #7fb127');
    $('#main').css('padding', '0px');
    $('nav, footer').show();
    $('.loginLink li').empty();
    $('.loginLink li').html('<button id="topRightSignUpLnk">Sign Up</button>');
    $(document).on('click','#topRightSignUpLnk',function(){
        $window.location.href = "#/signup";
    });
    
    $('#forgotPassBtn').click(function(){
        $('#resetErrmsg').text('');
        $('.forgot-modal').modal('show');
    });
    $('#btnForgetPassSend').click(function(){
        email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        emailInput = $('.forgotInp').val();
        if(email_regex.test(emailInput)) {
            $.ajax({
                url: 'https://thanks.parentround.com/api',
                headers: {'request_method':'resetPassword'},
                type: 'post',
                data: {email: emailInput},
                success: function (result) {
                    $('.forgot-modal').modal('hide');
                    $('.success_reset_msg').modal('show');
                }
            });
            
        }
        else {
            $('#resetErrmsg').text('Invalid email');
        }
    });
    
    $('#lnkLogin').click(function(){
        $('#loginErrTxt').html('');
        var email = $.trim($('#inpLoginEmail').val());
        var password = $.trim($('#inpLoginPass').val());

        if(email.length>0 && password.length>0)
        {
            $.ajax({
            url: 'https://thanks.parentround.com/api',
            type: 'post',
            headers: {'request_method':'login'},
            data: {email: email, password: password},
            success: function (result) {
                res = JSON.parse(result);
                if(res.success == true) {
                    localStorage.removeItem("jwt_token");
                    localStorage.setItem("jwt_token", res.result["token"]);
                    localStorage.removeItem("logged_in_email");
                    localStorage.setItem("logged_in_email", email);
                    $window.location.href = "#/search-school";
                }
                else {
                    $('#loginErrTxt').html(res.error);        
                }

            }
            });
        }
        else {
            $('#loginErrTxt').html('Invalid input');
        }
    });
    $(document).ready(function(){
        $(".navbar-collapse").collapse('hide');
    });
    $('#lnkChangeSignUp').click(function(){
        $window.location.href = "#/signup";
    });
});

// create the controller and inject Angular's $scope
parentRoundApp.controller('signUpController', function($scope, $log, $window) {
    addFbSDK();
    
    $('.facebook_btn').click(function(){
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me?fields=id,name,email', function(fbdata) {
                    console.log(fbdata);
                    logged_in_email = fbdata.email;
                    $.ajax({
                        url: 'https://thanks.parentround.com/api',
                        headers: {'request_method':'withFacebook'},
                        type: 'post',
                        data: {email: fbdata.email, password: fbdata.id, name: fbdata.name},
                        success: function (result) {
                            res = JSON.parse(result);
                            if(res.success == true) {
                                localStorage.removeItem("jwt_token");
                                localStorage.setItem("jwt_token", res.result["token"]);
                                localStorage.removeItem("logged_in_email");
                                localStorage.setItem("logged_in_email", logged_in_email);
                                $window.location.href = "#/search-school";
                            }
                            else {
                                $('#loginErrTxt').html(res.error);        
                            }
                        }
                    });

                });
            }
            else {
                console.log('User cancelled login or did not fully authorize.');
                $('#signUpErrTxt').html('Your login was cancelled.')
            }
        }, {scope: 'public_profile, email'});
    });
    $('#forgotPassBtn').click(function(){
        $('#resetErrmsg').text('');
        $('.forgot-modal').modal('show');
    });

    $('#btnForgetPassSend').click(function(){
        email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        emailInput = $('.forgotInp').val();
        if(email_regex.test(emailInput)) {
            if(email_regex.test(emailInput)) {
                $.ajax({
                    url: 'https://thanks.parentround.com/api',
                    headers: {'request_method':'resetPassword'},
                    type: 'post',
                    data: {email: emailInput},
                    success: function (result) {
                        $('.forgot-modal').modal('hide');
                        $('.success_reset_msg').modal('show');
                    }
                });

            }
            else {
                $('#resetErrmsg').text('Invalid email');
            }
        }
        else {
            $('#resetErrmsg').text('Invalid email');
        }
    });
    
    
    // create a message to display in our view
    $('#main').css('border','none');
    $('#main').css('padding','0px');
    $('nav, footer').hide();
    $('.loginLink li').empty();
    $('.loginLink li').html('<button id="topRightLoginLnk">Login</button>');
    $(document).on('click','#topRightLoginLnk',function(){
        $window.location.href = "#/";
    });
    //$scope.message = 'Login/signup screen goes here';
    $(document).ready(function(){
        $(".navbar-collapse").collapse('hide');
        window.scrollTo(0,0);
        if($('#recaptcha_here').length){
            grecaptcha.render('recaptcha_here', {
              'sitekey' : '6LdBxzcUAAAAAPLgnlMwZh6b6aTLwCtUOy1kHEUz'
            });
        }
        //$.getScript('https://www.google.com/recaptcha/api.js?
        $('#login_signup, #bg_image').css('min-height',window.innerHeight);
    });
    
    $('#lnkChangeLogin').click(function(){
        //$('.allForm').toggle();
            $window.location.href = "#/";
    });
    
    
    
    $('#lnkSignUp').click(function(){
        $('#signUpErrTxt').html('');
        var email = $.trim($('#inpSignupEmail').val());
        var password = $.trim($('#inpSignUpPass').val());
        var name = $.trim($('#inpSignupName').val());

        if(email.length>0 && password.length>0 && name.length>0) {
            if($('#chkAccept').prop('checked')) {
                var datastring = $("#signUpfrm").serialize();
                $.ajax({
                    url: 'https://thanks.parentround.com/api',
                    headers: {'request_method':'signup'},
                    type: 'post',
                    data: datastring,
                    success: function (result) {
                        res = JSON.parse(result);
                        if(res.success == true) {
                            $('.success-modal').modal('show');
                        }
                        else {
                            err_msg = res.error;
                            if(err_msg.match("^ER_DUP_ENTRY"))
                            $('#signUpErrTxt').html("This email already exists in the system. Please try a different email");  
                            else
                            $('#signUpErrTxt').html(res.error);
                        }

                    }
                });   
            }
            else {
                $('#signUpErrTxt').html('Please accept the terms');
            }
        }
        else {
            $('#signUpErrTxt').html('Invalid input');
        }
    });
    
    $('.success-modal').on('hide.bs.modal', function (e) {
        $window.location.href = '#/';
    })
    
});

parentRoundApp.controller('selSchoolController', function($scope, $log, $window){
    $('#main').css('border-top','2px solid #7fb127');
    $('#main').css('border-bottom','2px solid #7fb127');
    $('#main').css('padding','20px');
    $('nav, footer').show();
    $('.loginLink li').empty();
    $('.loginLink li').html('<button id="btnYourEmail">'+localStorage.getItem('logged_in_email')+'</button>&nbsp;|&nbsp;<button id="topRightEmailLnk">Logout</button>');
    $(document).on('click','#topRightEmailLnk',function(){
        event.preventDefault(); $('.logout_confirmation').modal('show');
    });
    
    
    function searchSchool(school_name, school_zip, page="1") {
        token = localStorage.getItem("jwt_token");
        $('#searchPlaceHolderTxt').html('Searching. Please wait');
        $.ajax({
            url: 'https://thanks.parentround.com/api',
            type: 'post',
            headers: {"x-access-token":token,"request_method":'getSchools'},
            data: {school_name: school_name, school_zip: school_zip, page: page},
            success: function (result) {
                $('#scrollableResult').empty();
                res = JSON.parse(result);
                if(res.success == true && res.result.data.length>0) {
                    $('#searchPlaceHolderTxt').html('');
                    for(i=0;i<res.result.data.length;i++) {
                        html = '<div class="row school_result" data-school_name="'+res.result.data[i].school_name+'" data-school_id="'+res.result.data[i].school_id+'" data-school_thanks="'+res.result.data[i].connection+'" data-school_address = "'+res.result.data[i].school_address+' '+res.result.data[i].school_city+' '+res.result.data[i].school_zip+'"><div class="col-xs-2 col-sm-2"><img src="images/university@2x.png" alt="" /></div><div class="col-xs-8 col-sm-9"><h4 class="schoolNametxt">'+res.result.data[i].school_name+'</h4><p class="schoolDescTxt"><span class="schoolAddress">'+res.result.data[i].school_address+' '+res.result.data[i].school_city+' '+res.result.data[i].school_zip+'</span><br/><span class="numberofthanks">'+res.result.data[i].connection+'</span> people said &laquo;Thank You&raquo; already</p></div><div class="col-xs-1 col-sm-1 checkSchool"><i class="fa fa-check-circle" aria-hidden="true"></i></div></div>';

                        $('#scrollableResult').append(html);
                    }
                    $('#search_total').text('Page '+res.result.currentPage+' of '+res.result.totalPages);
                    
                    $('#first_btn').data('paginate',1);
                    $('#prev_btn').data('paginate',res.result.currentPage-1);
                    $('#next_btn').data('paginate',res.result.currentPage+1);
                    $('#last_btn').data('paginate',res.result.totalPages);
                    
                    //hide pagination if single page result
                    if(res.result.totalPages>1)
                        $('.pager').show();
                    else
                        $('.pager').hide();
                    
                    $('.btn_pagination').removeClass('disabled');
                    //disable first and prev if on single page
                    if(res.result.currentPage == 1)
                        $('.previous .btn_pagination').addClass('disabled');
                    
                    //disable last and next if on last page
                    if(res.result.currentPage == res.result.totalPages)
                        $('.next .btn_pagination').addClass('disabled');
                }
                else {
                    $('#scrollableResult').empty();
                    $('#searchPlaceHolderTxt').html('No results found!'); 
                }
            }
        });
    }
    
    $('.btn_pagination').click(function(){
        page = $(this).data('paginate');
        var school_name = $('#schoolNameInp').val();
        var school_zip = $('#zipInp').val();
        searchSchool(school_name, school_zip, page);
    });
    
    var timer;
    $('#schoolNameInp, #zipInp').on("keyup",function(){
        clearTimeout(timer);
        var ms = 800;
        var school_name = $('#schoolNameInp').val();
        var school_zip = $('#zipInp').val();
        timer = setTimeout(function(){
            if(school_name.length==0 && school_zip.length == 0) {
                $('#scrollableResult').html('<div class="row school_result"><div class="col-xs-2"><img src="images/university@2x.png" alt=""></div><div class="col-xs-9 placeholder_progress"><p>Search results will appear here </p></div></div>');
            }
            else if(school_name.length>3 || school_zip.length>3) {
                searchSchool(school_name, school_zip);
            }
            else {
                $('#searchPlaceHolderTxt').html('Enter 4 or more charachters');
            }    
        }, ms);
    });
    
    //$('.school_result').click(function(){
    $(document).on('click','.school_result',function(event){
        event.preventDefault();
        $('.checkSchool').hide();
        $('.selected_school').removeClass('selected_school');
        $(this).addClass('selected_school');
        $(this).find('.checkSchool').show();
        $('#btnThankSchool').css('background','#7fb127');
        $('#btnThankSchool').prop("disabled", false);
        
        localStorage.removeItem("school_name");
        localStorage.setItem("school_name", $(this).data('school_name'));
        localStorage.removeItem("school_id");
        localStorage.setItem("school_id", $(this).data('school_id'));
        localStorage.removeItem("school_address");
        localStorage.setItem("school_address", $(this).data('school_address'));
        localStorage.removeItem("school_thanks");
        localStorage.setItem("school_thanks", $(this).data('school_thanks'));
        
        
    });
    
    $('#btnThankSchool').click(function(){
        $window.location.href = "#/school-selected";
    });
    
    $(document).ready(function(){
        $(".navbar-collapse").collapse('hide');
        window.scrollTo(0,0);
        if(localStorage.getItem("jwt_token")===null)
            $window.location.href = "#/";
    });
});


parentRoundApp.controller('thankController', function($scope, $log, $window){
    $('#main').css('border-top','2px solid #7fb127');
    $('#main').css('border-bottom','2px solid #7fb127');
    $('#main').css('padding','20px');
    $('nav, footer').show();
    token = localStorage.getItem("jwt_token");
    $('#btn_go_back').click(function(){
        $window.location.href = "#/search-school";
    });
    
    $('.loginLink li').empty();
    $('.loginLink li').html('<button id="btnYourEmail">'+localStorage.getItem('logged_in_email')+'</button>&nbsp;|&nbsp;<button id="topRightEmailLnk">Logout</button>');
    $(document).on('click','#topRightEmailLnk',function(){
        event.preventDefault(); $('.logout_confirmation').modal('show');
    });
    $('input[name="whom2thank"]').click(function(){
        if($('#rdoParent').is(':checked')) {
            $('#thankParentForm').show();
            $('#thankTeacherForm').hide();
            $('#thankSchoolForm').hide();
            $('#ribbonTxt').text('Say Thanks to Parents');
            $('#choose_peopletxt').text('Choose People From the List Who You Want to Thank');
            $('.btnThankSubmit').attr('id','btnThankParent');   
        }
        if($('#rdoTeacher').is(':checked')) {
            $('#thankParentForm').hide();
            $('#thankTeacherForm').show();
            $('#thankSchoolForm').hide();
            $('#ribbonTxt').text('Say Thanks to Teacher');
            $('.btnThankSubmit').attr('id','btnThankTeacher'); 
        }
        if($('#rdoSchool').is(':checked')) {
            $('#thankParentForm').hide();
            $('#thankTeacherForm').hide();
            $('#thankSchoolForm').show();
            $('#ribbonTxt').text('Say Thanks to Whole School');
            $('.btnThankSubmit').attr('id','btnThankSchool'); 
        }
        
    });
    
    $('.btnThankSubmit').click(function(){
        $('#thankErrMessage').html('');
        var captcha = $('[name="g-recaptcha-response"]').val();
        var school_id = localStorage.getItem('school_id');
        email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

        if($('#rdoParent').is(':checked')) {
            var to_email = $.trim($('#inpParentEmail').val());
            var to_name = $.trim($('#inpParentName').val());
            var msg_id = $('#parentMessage').val();
            var msg_type = 'parent';
            data = {thank_to_email: to_email, to_name: to_name, msg_id: msg_id, msg_type: msg_type, school_id: school_id, 'g-recaptcha-response': captcha};
            if(email_regex.test(to_email))
                sendThanks(data);
            else
                $('#thankErrMessage').html('Please enter a valid email');
        }
        else if ($('#rdoTeacher').is(':checked')) {
            var to_email = $.trim($('#inpTeacherEmail').val());
            var to_name = $.trim($('#inpTeacherName').val());
            var msg_id = $('#teacherMessage').val();
            var msg_type = 'teacher';
            data = {thank_to_email: to_email, to_name: to_name, msg_id: msg_id, msg_type: msg_type, school_id: school_id, 'g-recaptcha-response': captcha};
            if(email_regex.test(to_email))
                sendThanks(data);
            else
                $('#thankErrMessage').html('Please enter a valid email');
        }
        else if ($('#rdoSchool').is(':checked')) {
            var to_email = '';
            var to_name = '';
            var msg_id = $('#schoolMessage').val();
            var msg_type = 'school';
            data = {msg_id: msg_id, msg_type: msg_type, school_id: school_id, 'g-recaptcha-response': captcha};
            sendThanks(data);
        }
        
        function sendThanks(data) {
            $.ajax({
                url: 'https://thanks.parentround.com/api',
                type: 'post',
                headers: {"x-access-token":token,"request_method":"thanks"},
                data: data,
                success: function (result) {
                    res = JSON.parse(result);
                    if(res.success == true) {
                        console.log('redirecting');
                        $window.location.href = "#/message-sent";
                    }
                    else {
                        err_msg = res.error;
                        if(err_msg.match('\"thank_to_email'))
                            $('#thankErrMessage').html("Please enter a valid email id");
                        else if (err_msg.match('msg_id must'))
                            $('#thankErrMessage').html("Please select a message");
                        else if (err_msg.match('to_name is'))
                            $('#thankErrMessage').html("Please enter the name");
                        else
                        $('#thankErrMessage').html(res.error);        
                    }

                }
            });    
        }
    });
//    $(document).on('click','.lnkSelectPerson',function(){
    $('.lnkSelectPerson').click(function(event){
        event.preventDefault();
        
        $('.selected_person').find('.selected_image').hide();
        $('.selected_person').find('img').css('background','#414141');
        $('.selected_person').removeClass('selected_person');

        $(this).addClass('selected_person');
        $(this).find('.selected_image').show();
        $(this).find('img').css('background','#649C30');
    });
    
    $(document).ready(function(){
        $(".navbar-collapse").collapse('hide');
        window.scrollTo(0,0);
        if(localStorage.getItem("jwt_token")===null)
            $window.location.href = "#/";
        $('#rdoParent').click();
        if($('#recaptcha_here').length){
            grecaptcha.render('recaptcha_here', {
              'sitekey' : '6LdBxzcUAAAAAPLgnlMwZh6b6aTLwCtUOy1kHEUz'
            });
        }
        //$.getScript('https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit');
        
        //getschool
        var school_name = localStorage.getItem("school_name");
        var school_id = localStorage.getItem("school_id");
        var school_thanks = localStorage.getItem("school_thanks");
        
        $('.headerSchoolName').text(school_name);
        $('#thanks_num').text(school_thanks + ' Thanks');
        
        $.ajax({
            url: 'https://thanks.parentround.com/api',
            type: 'post',
            headers: {"x-access-token":token,"request_method":"getMessages"},
            success: function (result) {
                res = JSON.parse(result);
                if(res.success == true) {
                    for(i=0;i<res.result.length;i++) {
                        option = '<option value="'+res.result[i].msg_id+'">'+res.result[i].message_text+'</option>';
                        if (res.result[i].message_type == "teacher") {
                            $('#teacherMessage').append(option);    
                        }
                        else if (res.result[i].message_type == "parent") {
                            $('#parentMessage').append(option);
                        }
                        else if (res.result[i].message_type == "school") {
                            $('#schoolMessage').append(option);
                        }
                    }
                    //$('#schoolMessage').append('<option value="1">Thanks</option>');
                    $('select').selectpicker({
                        width:'100%',
                        title:'Your Thank You Message'
                    });
                }
            }
        });
    });
 
});

parentRoundApp.controller('finalController', function($scope, $log, $window) {
    
    $('#main').css('border-top','2px solid #7fb127');
    $('#main').css('border-bottom','2px solid #7fb127');
    $('#main').css('padding','20px');
    $('nav, footer').show();
    $('.loginLink li').empty();
    $('.loginLink li').html('<button id="btnYourEmail">'+localStorage.getItem('logged_in_email')+'</button>&nbsp;|&nbsp;<button id="topRightEmailLnk">Logout</button>');
    $(document).on('click','#topRightEmailLnk',function(){
        event.preventDefault(); $('.logout_confirmation').modal('show');
    });
    
    $(document).ready(function(){
        var school_name = localStorage.getItem("school_name");
        var school_thanks = parseInt(localStorage.getItem("school_thanks"))+1;
        var school_address = localStorage.getItem('school_address');
        $("meta[property='og\\:title']").attr("content", 'I have Thanked '+school_name+' at thanks.parentround.com" />');
        
        
        $(".navbar-collapse").collapse('hide');
        window.scrollTo(0,0);
        if(localStorage.getItem("jwt_token")===null)
            $window.location.href = "#/";
        
        
        $('.schoolNametxt').text(school_name);
        $('.schoolAddress').text(school_address);
        $('.numberofthanks').text(school_thanks);
        
        $("#sharing_icons").jsSocials({
            showLabel: false,
            showCount: false,
            shares: ["email", "twitter", "facebook", "googleplus", "linkedin", "pinterest", "stumbleupon", "whatsapp"]
        });
    });
    $('#btnFindSchool').click(function(){
        $window.location.href = "#/search-school";
    })
});