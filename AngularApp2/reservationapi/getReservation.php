<?php
require_once 'connect.php';

$sql = "SELECT id, name, area, date, time, image FROM reservations";
$result = mysqli_query($con, $sql);

$reservations = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $reservations[] = $row;
    }
    header('Content-Type: application/json');
    echo json_encode($reservations);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Database query failed."]);
}

mysqli_close($con);
?>
