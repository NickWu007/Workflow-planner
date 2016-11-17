<?php

$user_list = array();

$user_list[] = array('id' => 1,
                     'username' => 'Nick Wu',
                     'password' => '1234');

$user_list[] = array('id' => 2,
                     'username' => 'Derek Chen',
                     'password' => '1234');

$user_list[] = array('id' => 3,
                     'username' => 'Kathryn Rendell',
                     'password' => '1234');

$user_list[] = array('id' => 4,
                     'username' => 'Greg McDonagh',
                     'password' => '1234');

function getUserList() {
  global $user_list;
  return $user_list;
}

function tryLogin($username, $password) {
  global $user_list;

  foreach ($user_list as $idx => $user) {
    if ($user['username'] == $username && $user['password'] == $password) {
      return $user['id'];
    }
  }
  return NULL;
}

?>