<?php
class Board {
  private $id;
  private $description;
  private $user_id;
    
  private static function connect() {
    return new mysqli("classroom.cs.unc.edu", "superqd", "upm3XuKe333tZjvY", "superqddb");
  }
    
  public static function create($new_description, $new_user_id) {
    $mysqli = Board::connect();
    $result = $mysqli->query("insert into Board values (0, \"" . 
                           $new_description . "\", \"" . $new_user_id . "\")");
    if ($result) {
      $new_id = $mysqli->insert_id;
      return new Board($new_id, $new_description, $new_user_id);
    }
    return null;
  }
  
  public static function findByID($id) {
    $mysqli = Board::connect();
    
    $result = $mysqli->query("select * from Board where id = " . $id );
    if ($result) {
      if ($result->num_rows == 0){
        return null;
      }
      $transaction_info = $result->fetch_array();
      return new Board($transaction_info['id'],
                 $transaction_info['description'],
                 $transaction_info['user_id']);
    }
    return null;
  }
  public static function findByUserID($user_id) {
    $mysqli = Board::connect();
    $result = $mysqli->query("select id from Board where user_id = " . $user_id );
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

  private function __construct($id, $description, $user_id) {
    $this->id = $id;
    $this->description = $description;
    $this->user_id = $user_id;
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

  public function setDescription($new_description) {
    
    $this->description = $new_description;
    // Implicit style updating
    return $this->update();
  }
  private function update() {
    $mysqli = Board::connect();
    $result = $mysqli->query("update Board set description = \"" . $this->description . "\" where id = " . $this->id);
    return $result;
  }
  
  public function delete() {
    $mysqli = Board::connect();
    $result = $mysqli->query("delete FROM Board where id = " .$this->id);
    return $result;
  }
}
?>
