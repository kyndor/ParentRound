<?php 

if(isset($_GET['uid']))
{
    require_once 'constant/db.php';
    $school_id = mysqli_real_escape_string($conn,base64_decode($_GET['uid']));
    $school = array();
    $sql = 'SELECT school_name, school_address, school_city, lstate, school_zip FROM schools WHERE school_id = "'.$school_id.'"';
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
     $school = mysqli_fetch_assoc($result);
    }
    
    $connections = 'SELECT * FROM connection WHERE school_id = "'.$school_id.'"';
    $thanks = mysqli_query($conn, $connections);
    $thankscount = mysqli_num_rows($thanks);
    mysqli_close($conn);
    
}


?>
<!DOCTYPE html>
<!-- define angular app -->
<html ng-app="parentRoundApp">
   <head>
       
       <title>Thank your teacher and schools | ParentRound.com</title>
       <meta content="width=device-width,initial-scale=1" name=viewport>
       <meta charset=utf-8>
       <meta content="IE=edge" http-equiv=X-UA-Compatible>
       <meta property='og:title' content="I have thanked <?=ucwords($school['school_name'])?> at thanks.parentround.com" />
       <meta property='og:description' content="Join me with other parents in thanking schools." />
       <meta property='og:type' content="website"/>
       <meta property='og:url' content="http://thanks.parentround.com/share?uid=<?=$_GET['uid']?>"/>
       <meta property='og:image' content="https://thanks.parentround.com/images/logo_square.jpg"/>

       
       
        
      <!-- SCROLLS -->
       <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
       <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
       <link href="https://fonts.googleapis.com/css?family=Lato:300,400" rel="stylesheet">
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/css/bootstrap-select.min.css" />
       <link rel="stylesheet" href="css/style.css" />
       
        <!-- SPELLS -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
              <!--  MouseStats:Begin  -->
<script type="text/javascript">var MouseStats_Commands=MouseStats_Commands?MouseStats_Commands:[]; (function(){function b(){if(void 0==document.getElementById("__mstrkscpt")){var a=document.createElement("script");a.type="text/javascript";a.id="__mstrkscpt";a.src=("https:"==document.location.protocol?"https://ssl":"http://www2")+".mousestats.com/js/5/4/5493193606126665548.js?"+Math.floor((new Date).getTime()/6E5);a.async=!0;a.defer=!0;(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(a)}}window.attachEvent?window.attachEvent("onload",b):window.addEventListener("load", b,!1);"complete"===document.readyState&&b()})(); </script>
       
    </head>
    <!-- define angular controller -->
    <body ng-controller="mainController">
        <nav class="navbar navbar-default">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-navbar-collapse-1" aria-expanded="false">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="/#search-school"><img src="images/parent_round_logo.jpg" alt=""></a>
                </div>
            </div>
        </nav>
        <div id="main">
            <!-- angular templating -->
            <!-- this is where content will be injected -->
            <div ng-view>
                <div class="container page_view">
                    <div class="row rc">
                        <div class="col-sm-10 col-md-8 col-lg-6 cc text-center">
                            <h1 class="referOthertxt">Refer Other</h1>
                            <p class="text-center thankyouCheck"><i class="fa fa-check-circle"></i></p>
                            <h4 class="text-center thankYouTxt">You said Thank You! to</h4>
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="row school_result selected_school">
                                        <div class="col-xs-2">
                                            <img src="images/university@2x.png" alt="" />
                                        </div>
                                        <div class="col-xs-9">
                                            <h4 class="schoolNametxt"><?=$school['school_name']?></h4>
                                            <p class="schoolDescTxt"><span class="schoolAddress"><?=$school['school_address']?>&nbsp;<?=$school['school_zip']?></span><br/><span class="numberofthanks"><?=$thankscount?></span> people said &laquo;Thank You&raquo; already</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="helpTeacherTxt text-center">
                                <h2>Help Teachers and Parents</h2>
                            </div>

                            <div class="row">
                                <div class="col-xs-12 col-sm-8 col-md-5" id="selectandthank">
                                    <h4 id="selectnThanktxt">Select School &amp; Thank Teacher/Parent</h4>
                                </div>
                                <div class="col-sm-3 pull-right">
                                    <button class="btn greyBtn" id="btnFindSchool">Find School</button>
                                </div>
                            </div>
                        </div>        
                    </div>
                </div>
            </div>
        </div>
        <footer>
            <nav class="navbar navbar-default">
                <div class="container">
                    <div class="navbar-header">
                       <a class="navbar-brand" href="/#search-school"><img src="images/parent_round_logo.jpg" alt="" style="width:80%;"></a>
                    </div>
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="https://www.parentround.com/contactus/" class="footerLinks">Contact us</a></li>
                        <li><a href="https://www.parentround.com/login/userterms/" class="footerLinks">Terms of Service</a></li>
                        <li><a href="https://www.parentround.com/login/userprivacy/" class="footerLinks">Privacy Policy</a></li>
                    </ul>
                </div>
            </nav>
            <div class="container footer_txt">
                <p>Our terms of service and privacy policy have changed. <br/> By continuing to use this site, you are agreeing to the new privacy policy and terms of service</p>
                <p class="pull-right">&copy; ParentRound 2017</p>
            </div>
        </footer>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/js/bootstrap-select.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jsSocials/1.5.0/jssocials.min.js"></script>
    </body>
</html>