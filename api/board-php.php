<?php
session_start();

require_once('Board.php');
require_once('User.php');
require_once('authenticate.php');
header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
     /* This is an update, specifically a description change */
     $path_components = explode('/', $_SERVER['PATH_INFO']);

     if ((count($path_components) >= 2) && ($path_components[1] != "")) {
        $board_id = intval($path_components[1]);
        $board = Board::findByID($board_id);
        if(is_null($board)) {
            header("HTTP/1.1 400 Bad Request");
            print("Board doesn't exist");
            exit();
        }
         
        $user_id = $board->getUser_Id();
        $user = User::findByID($user_id);
         
        if($_SESSION['username'] != $user->getName()) {
            header('HTTP/1.1 401 Unauthorized');
  	        exit();
        }
         
        $post = json_decode(file_get_contents("php://input"), true);
        $description = $post['description'];
        $result = $user->setDescription($description); 
        if(!$result) {
            header("HTTP/1.1 500 Intenal Server Error");
            print("Database update failed.");
            exit();
        }
            
        $output = array( 'board_ID' => $board->getID(), 'description' => $description, 'user_ID' => $user_id);
            
        header("Content-type: application/json");
        header("HTTP/1.1 200 OK");
        print(json_encode($output));
        exit();    
     }
       
     else {
        /* This is a board creation */
        $post = json_decode(file_get_contents("php://input"), true);
        $description = $post['description'];
        $user_id = $post['user_ID'];
            
        if (!is_null($description) && !is_null($user_id)) {
            
            $user = User::findByID($user_id);
            
            if (is_null($user)) {
                header("HTTP/1.1 400 Bad Request");
                print("User doesn't exist");
                exit();
            }
            
            if($_SESSION['username'] != $user->getName()) {
                header('HTTP/1.1 401 Unauthorized');
  	            exit();
            }
            
            $new_board = Board::create($description, $user_id);
            if (is_null($new_board)) {
                header("HTTP/1.1 500 Intenal Server Error");
                print("Database insert failed.");
                exit();
            }
            
            $output = array( 'board_ID' => $new_board->getID(), 'description' => $description, 'user_ID' => $user_id);
            
            header("Content-type: application/json");
            header("HTTP/1.1 200 OK");
            print(json_encode($output));
            exit();    
        }   
    }
}

else if ($_SERVER['REQUEST_METHOD'] == "GET") {
    /* This is a delete */
    
    $path_components = explode('/', $_SERVER['PATH_INFO']);
    if ((count($path_components) >= 2) && ($path_components[1] != "")) {
        if(array_key_exists("action", $_GET)){
            if($_GET["action"] == "delete") {
                $board_id = intval($path_components[1]);
                $board = Board::findByID($board_id);
                if(is_null($board)) {
                    header("HTTP/1.1 400 Bad Request");
                    print("Board doesn't exist");
                    exit();
                }

                $user_id = $board->getUser_Id();
                $user = User::findByID($user_id);

                if($_SESSION['username'] != $user->getName()) {
                    header('HTTP/1.1 401 Unauthorized');
                    exit();
                }

                $result = $board->delete();

                if(!$result) {
                    header("HTTP/1.1 500 Intenal Server Error");
                    print("Database update failed.");
                    exit();
                }

                header("HTTP/1.1 200 OK");
                exit(); 
            }
            
            else {
                header("HTTP/1.1 400 Bad Request");
                print("Format not recognized");
                exit();
            }
        }
        
        else {
            $board_id = intval($path_components[1]);
            $board = Board::findByID($board_id);
            if(is_null($board)) {
                header("HTTP/1.1 400 Bad Request");
                print("Board doesn't exist");
                exit();
            }

            $user_id = $board->getUser_Id();
            $user = User::findByID($user_id);

            if($_SESSION['username'] != $user->getName()) {
                header('HTTP/1.1 401 Unauthorized');
                exit();
            }
            
            $output = array( 'board_ID' => $board->getID(), 'description' => $description, 'user_ID' => $user_id);
            
            header("Content-type: application/json");
            header("HTTP/1.1 200 OK");
            print(json_encode($output));
            exit();    
        }
    }
    
    else {
        if(array_key_exists("user_id", $_GET)){
            $user_id = $_GET["user_id"];
            $user = User::findByID($user_id);
            
            if (is_null($user)) {
                header("HTTP/1.1 400 Bad Request");
                print("User doesn't exist");
                exit();
            }

            if($_SESSION['username'] != $user->getName()) {
                header('HTTP/1.1 401 Unauthorized');
                exit();
            }
            
            $board_ids = Board::findByUserID();
            header("Content-type: application/json");
            header("HTTP/1.1 200 OK");
            print(json_encode($board_ids));
            exit();  
        }
    }
    
}

header("HTTP/1.1 400 Bad Request");
print("Format not recognized");
exit();
?>