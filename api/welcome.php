<?php
session_start();

require_once('authenticate.php');

header("Access-Control-Allow-Origin: *");
header("HTTP/1.1 300 Successfuly logged in");

/* Add code here to return the user id of the person that logged in */

exit();
?>
