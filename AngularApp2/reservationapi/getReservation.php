<?php
header('Content-Type: application/json');
require 'connect.php';

$id = $_GET['id'] ?? null;

if ($id) {
    // Prepare statement to get one reservation by id
    $stmt = $con->prepare("SELECT * FROM reservations WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    $reservation = $result->fetch_assoc();

    echo json_encode($reservation ?: new stdClass());

    $stmt->close();
} else {
    // Get all reservations ordered by ascending ID
    $sql = "SELECT * FROM reservations ORDER BY id ASC";
    $result = $con->query($sql);

    $reservations = [];

    while ($row = $result->fetch_assoc()) {
        $reservations[] = $row;
    }

    echo json_encode($reservations);
}

$con->close();
?>
