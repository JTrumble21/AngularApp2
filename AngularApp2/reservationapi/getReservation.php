<?php
require_once 'connect.php';

$sql = "SELECT id, name, area, date, time FROM reservations";
$result = mysqli_query($con, $sql);

$reservations = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $row['image'] = 'http://localhost/AngularApp2/AngularApp2/reservationapi/uploads/placeholder.jpeg'; // FULL URL
        $reservations[] = $row;
    }
    echo json_encode($reservations);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Database query failed."]);
}
?>
