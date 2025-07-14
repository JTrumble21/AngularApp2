<?php
header('Content-Type: application/json');
require 'connect.php';

$sql = "SELECT * FROM reservations ORDER BY id DESC";
$result = $con->query($sql);

$reservations = [];

while ($row = $result->fetch_assoc()) {
    $reservations[] = $row;
}

echo json_encode($reservations);

$con->close();
?>
