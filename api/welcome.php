<?php
session_start();

require_once('authenticate.php');
require_once('User.php');

header("Access-Control-Allow-Origin: *");
header("HTTP/1.1 200 Successfuly logged in");
$username = $_SESSION['username'];
$user = User::findByName($username);
$output = $user->getID();
print(json_encode($output));
exit();
?>
