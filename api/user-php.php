<?php
session_start();

require_once('User.php');
header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
     /* This is an update, specifically password change */
     $path_components = explode('/', $_SERVER['PATH_INFO']);

     if ((count($path_components) >= 2) && ($path_components[1] != "")) {
	require_once('authenticate.php');
        $user_id = intval($path_components[1]);
        $user = User::findByID($user_id);
        if(is_null($user)) {
            header("HTTP/1.1 400 Bad Request");
            print("User doesn't exist");
            exit();
        }

        if($_SESSION['username'] != $user->getName()) {
            header('HTTP/1.1 401 Unauthorized');
  	    exit();
        }
         
        $post = json_decode(file_get_contents("php://input"), true);
        $password = $post['password'];
        $result = $user->setPassword($password); 
        if(!$result) {
            header("HTTP/1.1 500 Intenal Server Error");
            print("Database update failed.");
            exit();
        }
            
        header("HTTP/1.1 200 OK");
        exit();
     }
       
    else {
        /* This is a registration */
        $post = json_decode(file_get_contents("php://input"), true);
        $username = $post['username'];
        $email = $post['email'];
        $password = $post['password'];
        if (!is_null($password) && !is_null($username) && !is_null($email)) {
            $user = User::findByName($username);
            if (!is_null($user)) {
                header("HTTP/1.1 400 Bad Request");
                print("User already exists");
                exit();
            }
            
            $new_user = User::create($username, $email, $password);
            if (is_null($new_user)) {
                header("HTTP/1.1 500 Intenal Server Error");
                print("Database insert failed.");
                exit();
            }
            
            $output = array( 'userID' => $new_user->getID(), 'username' => $username, 'email' => $email);
            
            header("Content-type: application/json");
            header("HTTP/1.1 200 OK");
            print(json_encode($output));
            exit();    
        }
        
     
    }
}

else if ($_SERVER['REQUEST_METHOD'] == "GET" && $_GET['action'] == 'delete') {
    /* This is a delete */
    require_once('authenticate.php');
    $path_components = explode('/', $_SERVER['PATH_INFO']);
    if ((count($path_components) >= 2) && ($path_components[1] != "")) {
        $user_id = intval($path_components[1]);
        $user = User::findbyID($user_id);
        if(is_null($user)) {
            header("HTTP/1.1 400 Bad Request");
            print("User doesn't exist");
            exit();
        }
         
        if($_SESSION['username'] != $user->getName()) {
            header('HTTP/1.1 401 Unauthorized');
  			exit();
        }
        
        $result = $user->delete();
        if(!$result) {
            header("HTTP/1.1 500 Intenal Server Error");
            print("Database update failed.");
            exit();
        }
        header("HTTP/1.1 200 OK");
        exit(); 
    }
}

header("HTTP/1.1 400 Bad Request");
print("Format not recognized");
exit();
?>