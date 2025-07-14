<?php
require_once 'connect.php';

$name = $_POST['name'] ?? '';
$area = $_POST['area'] ?? '';
$date = $_POST['date'] ?? '';
$time = $_POST['time'] ?? '';

$imagePath = 'uploads/placeholder.jpeg'; // Default placeholder

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/';
    $filename = basename($_FILES['image']['name']);
    $targetFile = $uploadDir . time() . '_' . $filename;
    
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $imagePath = $targetFile;
    }
}

$stmt = $con->prepare("INSERT INTO reservations (name, area, date, time, image) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $name, $area, $date, $time, $imagePath);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Reservation added.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Insert failed.']);
}

$stmt->close();
$con->close();
?>
