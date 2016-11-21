<?php

require_once('model.php');
header("Access-Control-Allow-Origin: *");

if(empty($_COOKIE)) {
    header("HTTP/1.1 200 Login");
    exit();
}

else {
    
    foreach ($_COOKIE as $cookie_name => $cookie_value) {
    
        $user = User::findByID($cookie_value);
        
        if (!(is_null($user))) {
            $output = array('userID' => $user->getID());
            header("Content-type: application/json");
            header("HTTP/1.1 300 Logged in, Go to homepage");
            print(json_encode($output));
            exit();
        }    
    }
    
    header("HTTP/1.1 200 Cookie doesn't match user");
    exit();  
    
}

header("HTTP/1.1 400 Bad Request");
print("Format not recognized");
exit();
?>
