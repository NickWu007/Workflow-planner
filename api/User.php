<?php
class User {
  private $id;
  private $name;
  private $email;
  private $password;
  private static function connect() {
    return new mysqli("classroom.cs.unc.edu", "superqd", "upm3XuKe333tZjvY", "superqddb");
  }
    
  public static function create($name, $email, $password) {
    $mysqli = User::connect();
    $result = $mysqli->query("insert into User values (0, \"" . 
                           $name . "\", \"" . $password . "\", \"" . $email . "\")");
    if ($result) {
      $new_id = $mysqli->insert_id;
      return new User($new_id, $name, $email, $password);
    }
    return null;
  }
  
  public static function findByID($id) {
    $mysqli = User::connect();
    
    $result = $mysqli->query("select * from User where id = \"" . $id . "\"");
    if ($result) {
      if ($result->num_rows == 0){
        return null;
      }
      $transaction_info = $result->fetch_array();
      return new User($transaction_info['id'],
                 $transaction_info['username'],
                 $transaction_info['email'],
                 $transaction_info['password']);
    }
    return null;
  }
  public static function findByName($name) {
    $mysqli = User::connect();
    $result = $mysqli->query("select * from User where username = \"" . $name . "\"");
    if ($result) {
      if ($result->num_rows == 0){
        return null;
      }
      $transaction_info = $result->fetch_array();
      return new User($transaction_info['id'],
                 $transaction_info['username'],
                 $transaction_info['email'],
                 $transaction_info['password']);
    }
    return null;
  }
  public static function findByEmail($email) {
    $mysqli = User::connect();
    $result = $mysqli->query("select * from User where email = \"" . $email . "\"");
    if ($result) {
      if ($result->num_rows == 0){
        return null;
      }
      $transaction_info = $result->fetch_array();
      return new User($transaction_info['id'],
                 $transaction_info['username'],
                 $transaction_info['email'],
                 $transaction_info['password']);
    }
    return null;
  }
  private function __construct($id, $name, $email, $password) {
    $this->id = $id;
    $this->name = $name;
    $this->email = $email;
    $this->password = $password;
  }
  public function getID() {
    return $this->id;
  }
  // TODO: use the owner's id to retrieve the appropriate owner object from the Owner ORM class and return that.
  public function getName() {
    // We'll just return the owner's id here.
    return $this->name;
  }
  public function getEmail() {
    return $this->email;
  }
  public function getPassword() {
    return $this->password;
  }
  public function setPassword($new_password) {
    
    $this->password = $new_password;
    // Implicit style updating
    return $this->update();
  }
  private function update() {
    $mysqli = User::connect();
    $result = $mysqli->query("update User set password = \"" . $this->password . "\" where id = " . $this->id);
    return $result;
  }
  
  public function delete() {
    $mysqli = User::connect();
    $result = $mysqli->query("delete FROM User where id = \"$this->id\"");
    return $result;
  }
}
?>
