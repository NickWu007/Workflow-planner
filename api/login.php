<?php
session_start();

header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    
    function check_password($username, $password) {
        $fd = fopen('hidden/passwords.txt', 'r');
        while ($next_line = fgets($fd)) {
            list($uname, $usalt, $uhash) = explode(' ', trim($next_line));
            if ($uname == $username) {
                if (md5($usalt . $password) == $uhash) {
	               fclose($fd);
	               return true;
                }
            }
        }
        
    fclose($fd);
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

        /* Add code here to return user id of person that logged in */
        
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
