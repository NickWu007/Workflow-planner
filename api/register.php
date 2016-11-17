<?php
require_once('model.php');

header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $post = json_decode(file_get_contents("php://input"), true);
    $username = $post['username'];
    $password = $post['password'];

    if (!is_null($password) && !is_null($username)) {

        $userId = addUser($username, $password);

        if (is_null($userId)) {

            header("HTTP/1.1 400 Bad Request");
            print("User already exists");
            exit();
        }


        $output = array(
          'userID' => $userId
        );
        header("Content-type: application/json");
        header("HTTP/1.1 200 OK");
        print(json_encode($output));
        exit();    
    }
}

header("HTTP/1.1 400 Bad Request");
print("Format not recognized");
exit();

?>