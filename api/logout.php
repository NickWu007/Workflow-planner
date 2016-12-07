<?php
header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN'] . "");
header("Access-Control-Allow-Credentials : true");
session_start();

unset($_SESSION['username']);
unset($_SESSION['authsalt']);

header('Content-type: application/json');
print(json_encode(true));
?>
