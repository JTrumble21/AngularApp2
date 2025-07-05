<?php
// Debugging Code
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include database connection
require_once 'connect.php';

// Initialize array to hold reservations
$reservations = [];

$sql = "SELECT id, name, area, date, time FROM reservations";

$result = mysqli_query($con, $sql);

// Check and build response
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $reservations[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'area' => $row['area'],
            'date' => $row['date'],
            'time' => $row['time']
        ];
    }
    echo json_encode($reservations);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Database query failed."]);
}
?>
