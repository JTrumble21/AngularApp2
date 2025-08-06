<?php
header('Content-Type: application/json');
require 'connect.php';

$uploadBaseUrl = 'http://localhost/ANGULARAPP2/AngularApp2/reservationapi/';

$id = $_GET['id'] ?? null;

if ($id) {
    $stmt = $con->prepare("SELECT * FROM reservations WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    $reservation = $result->fetch_assoc();

    if ($reservation) {
        if (!empty($reservation['image']) && strpos($reservation['image'], 'http') !== 0) {
            $reservation['image'] = $uploadBaseUrl . $reservation['image'];
        }
    } else {
        $reservation = new stdClass();
    }

    echo json_encode($reservation);
    $stmt->close();
} else {
    $sql = "SELECT * FROM reservations ORDER BY id ASC";
    $result = $con->query($sql);

    $reservations = [];

    while ($row = $result->fetch_assoc()) {
        if (!empty($row['image']) && strpos($row['image'], 'http') !== 0) {
            $row['image'] = $uploadBaseUrl . $row['image'];
        }
        $reservations[] = $row;
    }

    echo json_encode($reservations);
}

$con->close();
?>
