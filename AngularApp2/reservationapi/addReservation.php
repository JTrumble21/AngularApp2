<?php
header('Content-Type: application/json');
require 'connect.php';

$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$area = $_POST['area'] ?? '';
$date = $_POST['date'] ?? '';
$time = $_POST['time'] ?? '';
$imagePath = 'uploads/placeholder.jpeg';

if (!$name || !$phone || !$area || !$date || !$time) {
    echo json_encode(['message' => 'Missing required fields']);
    exit;
}

// Check for duplicate phone
$stmt = $con->prepare("SELECT id FROM reservations WHERE phone = ?");
$stmt->bind_param("s", $phone);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['message' => 'Duplicate phone number detected']);
    exit;
}
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
}

$sql = "INSERT INTO reservations (name, phone, area, date, time, image) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $con->prepare($sql);
$stmt->bind_param("ssssss", $name, $phone, $area, $date, $time, $imagePath);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Reservation added successfully']);
} else {
    echo json_encode(['message' => 'Failed to add reservation']);
}

$stmt->close();
$con->close();
?>
