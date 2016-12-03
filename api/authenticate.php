<?php

$present = false;
foreach ($_COOKIE as $cookie_name => $cookie_value) {
	if($cookie_name == "workflow_auth") {
		$present = true;
		if ($cookie_value != md5($_SESSION['username'] . $_SERVER['REMOTE_ADDR'] . $_SESSION['authsalt'])) {
 			header('HTTP/1.1 401 Unauthorized');
  			exit();
		}
	}
}

if ($present == false) {
	header('HTTP/1.1 401 Unauthorized');
  	exit();

}
?>