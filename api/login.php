<?php
require_once('model.php');
header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $post = json_decode(file_get_contents("php://input"), true);
    $username = $post['username'];
    $password = $post['password'];

    if (!is_null($password) && !is_null($username)) {

        $userId = tryLogin($username, $password);

        if (is_null($userId)) {

            header("HTTP/1.1 404 Not Found");
            print("Resource requested not found");
            exit();
        }


        header("Content-type: application/json");
        $output = array(
          'userID' => $userId
        );
        header("Content-type: application/json");
        print(json_encode($output));
        exit();    
    }
}

header("HTTP/1.1 400 Bad Request");
print("Format not recognized");
exit();
?>