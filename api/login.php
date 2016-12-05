<?php
session_start();
require_once('User.php');

header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    
    function check_password($username, $unsalted_password) {
        $usalt = ($username . "-salt-workflow");
        $user = User::findByName($username);
        if(is_null($user)) {
            header("HTTP/1.1 404 Bad Login");
            print("User doesn't exist");
            exit();
        }
        
        if (md5($usalt . $unsalted_password) == $user->getPassword()) {
           return true;
        } 
        
        return false;
    }
            
    $post = json_decode(file_get_contents("php://input"), true);
    $username = $post['username'];
    $password = $post['password'];

    if (check_password($username, $password)) {
        header("Content-type: application/json");

        $_SESSION['username'] = $username;
        $_SESSION['authsalt'] = time();
        $auth_cookie_val = md5($_SESSION['username'] . $_SERVER['REMOTE_ADDR'] . $_SESSION['authsalt']);
        setcookie('workflow_auth', $auth_cookie_val, 0, '/Courses/comp426-f16/users/gregmcd', 'wwwp.cs.unc.edu', true);
	header("HTTP/1.1 200 Good Login");
	$user = User::findByName($username);
	$output = $user->getID();
	print(json_encode($output));
        exit();
    }

    else {
      unset($_SESSION['username']);
      unset($_SESSION['authsalt']);

      header('HTTP/1.1 401 Unauthorized');
      header('Content-type: application/json');
      print(json_encode(false));
      exit();
    }
}

header("HTTP/1.1 400 Bad Request");
print("Format not recognized");
exit();

?>
