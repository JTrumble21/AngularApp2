<?php
require 'connect.php';

$id = $_POST['id'] ?? '';

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing reservation ID']);
    exit;
}

$stmt = $con->prepare("DELETE FROM reservations WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Reservation deleted.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Delete failed.']);
}

$stmt->close();
$con->close();
?>
