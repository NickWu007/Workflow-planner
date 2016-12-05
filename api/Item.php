<?php
class Item {
  private $id;
  private $description;
  private $status;
  private $user_id;
  private $board_id;
  private $pomodoros;
  private $completed;
    
  private static function connect() {
    return new mysqli("classroom.cs.unc.edu", "superqd", "upm3XuKe333tZjvY", "superqddb");
  }
    
  public static function create($new_description, $new_status, $new_user_id, $new_board_id, $new_pomodoros,
    $new_completed) {
    $mysqli = Item::connect();
    $result = $mysqli->query("insert into Item values (0, 
      \"" . $new_description . "\", 
      \"" . $new_status . "\" ,
       \"" . $new_user_id . "\",
       \"" . $new_board_id . "\" ,
        \"" . $new_pomodoros . "\" ,
         \"" . $new_completed . "\" 
         )");
    if ($result) {
      $new_id = $mysqli->insert_id;
      return new Item($new_id, $new_description,$new_status, $new_user_id, $new_board_id,$new_pomodoros,
        $new_completed);
    }
    return null;
  }
  
  public static function findByID($id) {
    $mysqli = Item::connect();
    
    $result = $mysqli->query("select * from Item where id = " . $id  );
    if ($result) {
      if ($result->num_rows == 0){
        return null;
      }
      $transaction_info = $result->fetch_array();
      return new Item(
                 $transaction_info['id'],
                 $transaction_info['description'],
                 $transaction_info['status'],
                 $transaction_info['user_id'],
                 $transaction_info['board_id'],
                 $transaction_info['pomodoros'],
                 $transaction_info['completed']
                 );
    }
    return null;
  }
  public static function findByUserAndBoard($user_id,$board_id) {
    $mysqli = Item::connect();
    $result = $mysqli->query("select id from Item where user_id = \"" . $user_id . "\" and board_id = \"" . $board_id . "\"");
    if ($result) {
      if ($result->num_rows == 0){
        return null;
      }
      while($board_id_row = $result->fetch_row()){
      	$board_ids[] = $board_id_row[0];
      }
     return $board_ids;
    }
    return null;
  }
 
  private function __construct($id, $description, $status,$user_id,$board_id,$pomodoros,$completed) {
    $this->id = $id;
    $this->description = $description;
    $this->status = $status;
    $this->user_id = $user_id;
    $this->board_id = $board_id;
    $this->pomodoros = $pomodoros;
    $this->completed = $completed;
  }
  public function getID() {
    return $this->id;
  }
  public function getDescription() {
    return $this->description;
  }
  public function getUser_Id() {
    return $this->user_id;
  }
  public function getBoard_Id() {
    return $this->board_id;
  }
  public function getStatus() {
    return $this->status;
  }
  public function getPomodoros() {
    return $this->pomodoros;
  }
  public function getCompleted() {
    return $this->completed;
  }
  public function setDescription($new_description) {
    
    $this->description = $new_description;
    $mysqli = Item::connect();
    $result = $mysqli->query("update Item set description = \"" . $this->description . "\" where id = " . $this->id);
    return $result;
  }
  public function setStatus($new_status) {
    
    $this->status = $new_status;
    $mysqli = Item::connect();
    $result = $mysqli->query("update Item set status = " . $this->status . " where id = " . $this->id);
    return $result;
  }
  
  public function setPomodoros($new_pomodoros) {
    
    $this->pomodoros = $new_pomodoros;
    $mysqli = Item::connect();
    $result = $mysqli->query("update Item set pomodoros = \"" . $this->pomodoros . "\" where id = " . $this->id);
    return $result;
  }
  public function setCompleted($new_c) {
    
    $this->completed = $new_c;
    $mysqli = Item::connect();
    $result = $mysqli->query("update Item set completed = \"" . $this->completed . "\" where id = " . $this->id);
    return $result;
  }
   
  // private function update() {
  //   $mysqli = Item::connect();
  //   $result = $mysqli->query("update Item set description = \"" . $this->description . "\" where id = " . $this->id);
  //   return $result;
  // }
  
  public function delete() {
    $mysqli = Item::connect();
    $result = $mysqli->query("delete FROM Item where id = " .$this->id);
    return $result;
  }
}
?>
