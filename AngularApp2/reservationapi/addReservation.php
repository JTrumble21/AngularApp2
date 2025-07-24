<?php
header('Content-Type: application/json');
require 'connect.php';

$name = $_POST['name'] ?? '';
$area = $_POST['area'] ?? '';
$date = $_POST['date'] ?? '';
$time = $_POST['time'] ?? '';
$imagePath = '';

if (!$name || !$area || !$date || !$time) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$uploadDir = 'uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Handle image upload if provided
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $filename = basename($_FILES['image']['name']);
    // Sanitize filename to avoid unexpected characters
    $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
    $targetFile = $uploadDir . time() . '_' . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $imagePath = $targetFile;
    } else {
        // If upload fails, fallback to placeholder image
        $imagePath = 'uploads/placeholder.jpeg';
    }
} else {
    // No image uploaded, use placeholder image
    $imagePath = 'uploads/placeholder.jpeg';
}

$stmt = $con->prepare("INSERT INTO reservations (name, area, date, time, image) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $name, $area, $date, $time, $imagePath);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Reservation added.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database insert failed']);
}

$stmt->close();
$con->close();
?>
