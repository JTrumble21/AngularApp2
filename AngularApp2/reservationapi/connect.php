<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$user = 'root';
$password = '';
$db = 'Reservations';

$con = new mysqli($host, $user, $password, $db);

if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}
?>
