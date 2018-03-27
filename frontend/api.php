<?php 

$headers = apache_request_headers();

if (isset($headers['request_method']) && !empty($headers['request_method'])) {
    $url = "https://thanks.parentround.com:6117/".$headers['request_method'];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_URL,$url);
    if (isset($headers['x-access-token']) && !empty($headers['x-access-token'])) {
        curl_setopt($ch,CURLOPT_HTTPHEADER,array('x-access-token: '.$headers['x-access-token']));
    }
    $fields_string = '';
    //get all post values
    foreach($_POST as $key=>$value) {
        $fields_string .= $key.'='.urlencode($value).'&'; 
    }
    rtrim($fields_string, '&');
    
    curl_setopt($ch,CURLOPT_POST, count($_POST));
    curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
    
    $tmp = curl_exec($ch);
    curl_close($ch);
    echo $tmp;
    
    
}
else {
    echo "No request method";
}

/*
$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_URL, "https://thanks.parentround.com:6117");
$tmp = curl_exec($ch);
curl_close($ch);
if (empty($tmp)){
  print "Nothing returned from url.<p>";
}
else{
  print $tmp;
}

if (isset($_POST["method"]) && !empty($_POST["method"])) {

}
else {
echo "";
}*/
?>
