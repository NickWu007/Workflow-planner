<?php
session_start();

require_once('User.php');
require_once('Board.php');
require_once('Item.php');
require_once('authenticate.php');
header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
     /* This is an update*/
     $path_components = explode('/', $_SERVER['PATH_INFO']);

     if ((count($path_components) >= 2) && ($path_components[1] != "")) {
        $item_id = intval($path_components[1]);
        $item = Item::findByID($item_id);
        if(is_null($item)) {
            header("HTTP/1.1 400 Bad Request");
            print("Item doesn't exist");
            exit();
        }
         
        $user_id = $item->getUser_Id();
        $user = User::findByID($user_id);
         
        if($_SESSION['username'] != $user->getName()) {
            header('HTTP/1.1 401 Unauthorized');
  	        exit();
        }
         
        $post = json_decode(file_get_contents("php://input"), true);
         
        if(array_key_exists("description", $post)){ 
            $description = $post['description'];
            $result = $item->setDescription($description); 
            if(!$result) {
                header("HTTP/1.1 500 Intenal Server Error");
                print("Database update failed.");
                exit();
            }
        }
         
        if(array_key_exists("status", $post)){ 
            $status = $post['status'];
            $result = $item->setStatus($status); 
            if(!$result) {
                header("HTTP/1.1 500 Intenal Server Error");
                print("Database update failed.");
                exit();
            }
        }
         
        if(array_key_exists("pomodoros", $post)){ 
            $pomodoros = $post['pomodoros'];
            $result = $item->setPomodoros($pomodoros); 
            if(!$result) {
                header("HTTP/1.1 500 Intenal Server Error");
                print("Database update failed.");
                exit();
            }
        }
         
        if(array_key_exists("completed", $post)){ 
            $completed = $post['completed'];
            $result = $item->setCompleted($completed); 
            if(!$result) {
                header("HTTP/1.1 500 Intenal Server Error");
                print("Database update failed.");
                exit();
            }
        }
            
        $output = array( 'item_ID' => $item->getID(), 'description' => $item->getDescription(), 'status' => $item->getStatus(), 'user_ID' => $item->getUser_Id(), 'board_ID' => $item->getBoard_Id(), 'pomodoros' => $item->getPomodoros(), 'completed' => $item->getCompleted());
            
        header("Content-type: application/json");
        header("HTTP/1.1 200 OK");
        print(json_encode($output));
        exit();    
     }
       
     else {
        /* This is a board creation */
        $post = json_decode(file_get_contents("php://input"), true);
        
        $description = $post['description'];
        $status = $post['status'];
        $user_id = $post['user_ID'];
        $board_id = $post['board_ID'];
        $pomodoros = $post['pomodoros'];
        $completed = $post['completed'];
            
        if (!is_null($description) && !is_null($user_id) && !is_null($status) && !is_null($board_id) && !is_null($pomodoros) && !is_null($completed)) {
            
            $user = User::findByID($user_id);
            $board = Board::findByID($board_id);
            
            if (is_null($user)) {
                header("HTTP/1.1 400 Bad Request");
                print("User doesn't exist");
                exit();
            }
            
            if (is_null($board)) {
                header("HTTP/1.1 400 Bad Request");
                print("Board doesn't exist");
                exit();
            }
            
            if($_SESSION['username'] != $user->getName()) {
                header('HTTP/1.1 401 Unauthorized');
  	            exit();
            }
  
            $new_item = Item::create($description, $status, $user_id, $board_id, $pomodoros, $completed);
            if (is_null($new_item)) {
                header("HTTP/1.1 500 Intenal Server Error");
                print("Database insert failed.");
                exit();
            }

            $output = array( 'item_ID' => $new_item->getID(), 'description' => $new_item->getDescription(), 'status' => $new_item->getStatus(), 'user_ID' => $new_item->getUser_Id(), 'board_ID' => $new_item->getBoard_Id(), 'pomodoros' => $new_item->getPomodoros(), 'completed' => $new_item->getCompleted());
            
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
                $item_id = intval($path_components[1]);
                $item = Item::findByID($item_id);
                if(is_null($item)) {
                    header("HTTP/1.1 400 Bad Request");
                    print("Item doesn't exist");
                    exit();
                }

                $user_id = $item->getUser_Id();
                $user = User::findByID($user_id);

                if($_SESSION['username'] != $user->getName()) {
                    header('HTTP/1.1 401 Unauthorized');
                    exit();
                }

                $result = $item->delete();

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
            $item_id = intval($path_components[1]);
            $item = Item::findByID($item_id);
            if(is_null($item)) {
                header("HTTP/1.1 400 Bad Request");
                print("Item doesn't exist");
                exit();
            }

            $user_id = $item->getUser_Id();
            $user = User::findByID($user_id);

            if($_SESSION['username'] != $user->getName()) {
                header('HTTP/1.1 401 Unauthorized');
                exit();
            }
            
            $output = array( 'item_ID' => $item->getID(), 'description' => $item->getDescription(), 'status' => $item -> getStatus(), 'user_ID' => $item->getUser_Id(), 'board_ID' => $item->getBoard_Id(), 'pomodoros' => $item->getPomodoros(), 'completed' => $item->getCompleted());
            
            header("Content-type: application/json");
            header("HTTP/1.1 200 OK");
            print(json_encode($output));
            exit();    
        }
    }
    
    else {
        if(array_key_exists("user_id", $_GET) && array_key_exists("board_id", $_GET)){
            $user_id = $_GET["user_id"];
            $board_id = $_GET["board_id"];
            $user = User::findByID($user_id);
            $board = Board::findByID($board_id);
            
            if (is_null($user)) {
                header("HTTP/1.1 400 Bad Request");
                print("User doesn't exist");
                exit();
            }
            
            if (is_null($board)) {
                header("HTTP/1.1 400 Bad Request");
                print("Board doesn't exist");
                exit();
            }

            if($_SESSION['username'] != $user->getName()) {
                header('HTTP/1.1 401 Unauthorized');
                exit();
            }
            
            if($board->getUser_Id() != $user_id)
            {
                header('HTTP/1.1 401 Unauthorized');
                exit();
            }
            
            $item_ids = Item::findByUserAndBoard($user_id, $board_id);
            header("Content-type: application/json");
            header("HTTP/1.1 200 OK");
            print(json_encode($item_ids));
            exit();  
        }
    }
    
}

header("HTTP/1.1 400 Bad Request");
print("Format not recognized");
exit();
?>