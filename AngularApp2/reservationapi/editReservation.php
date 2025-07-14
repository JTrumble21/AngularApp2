<?php
require_once 'connect.php';

$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$area = $_POST['area'] ?? '';
$date = $_POST['date'] ?? '';
$time = $_POST['time'] ?? '';
$imagePath = '';

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing reservation ID']);
    exit;
}

// Handle image upload if present
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/';
    $filename = basename($_FILES['image']['name']);
    $targetFile = $uploadDir . time() . '_' . $filename;
    
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $imagePath = $targetFile;
    }
}

if ($imagePath) {
    $stmt = $con->prepare("UPDATE reservations SET name=?, area=?, date=?, time=?, image=? WHERE id=?");
    $stmt->bind_param("sssssi", $name, $area, $date, $time, $imagePath, $id);
} else {
    $stmt = $con->prepare("UPDATE reservations SET name=?, area=?, date=?, time=? WHERE id=?");
    $stmt->bind_param("ssssi", $name, $area, $date, $time, $id);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Reservation updated.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Update failed.']);
}

$stmt->close();
$con->close();
?>
