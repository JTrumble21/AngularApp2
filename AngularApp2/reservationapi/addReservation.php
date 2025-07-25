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

// Upload directory
$uploadDir = 'uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Handle image upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['image']['tmp_name'];
    $originalName = basename($_FILES['image']['name']);
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    // Allowed image types
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (in_array($extension, $allowedExtensions)) {
        $safeName = preg_replace('/[^a-zA-Z0-9._-]/', '', pathinfo($originalName, PATHINFO_FILENAME));
        $uniqueName = time() . '_' . $safeName . '.' . $extension;
        $targetFile = $uploadDir . $uniqueName;

        if (move_uploaded_file($tmpName, $targetFile)) {
            $imagePath = $targetFile;
        } else {
            echo json_encode(['success' => false, 'message' => 'Image upload failed']);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid image type']);
        exit;
    }
} else {
    // No image uploaded; use placeholder
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

