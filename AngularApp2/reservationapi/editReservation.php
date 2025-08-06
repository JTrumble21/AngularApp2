<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require 'connect.php';

$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$area = $_POST['area'] ?? '';
$date = $_POST['date'] ?? '';
$time = $_POST['time'] ?? '';
$imagePath = 'uploads/placeholder.jpeg';

if (!$id || !$name || !$phone || !$area || !$date || !$time) {
    echo json_encode(['message' => 'Missing required fields']);
    exit;
}

// Get current reservation to retrieve existing image path
$stmt = $con->prepare("SELECT image FROM reservations WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$existingReservation = $result->fetch_assoc();
$currentImage = $existingReservation ? $existingReservation['image'] : $imagePath;
$stmt->close();

// Handle image upload
if (!empty($_FILES['image']['name'])) {
    $targetDir = "uploads/";
    $fileName = basename($_FILES["image"]["name"]);
    $targetFilePath = $targetDir . $fileName;

    if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
        $imagePath = $targetFilePath;
    } else {
        echo json_encode(['message' => 'Failed to move uploaded image']);
        exit;
    }
} elseif (!empty($_POST['image'])) {
    $imagePath = $_POST['image'];
} else {
    $imagePath = $currentImage;
}

// Update reservation
$sql = "UPDATE reservations SET name = ?, phone = ?, area = ?, date = ?, time = ?, image = ? WHERE id = ?";
$stmt = $con->prepare($sql);
$stmt->bind_param("ssssssi", $name, $phone, $area, $date, $time, $imagePath, $id);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Reservation updated successfully']);
} else {
    echo json_encode(['message' => 'Failed to update reservation']);
}

$stmt->close();
$con->close();
?>
