<?php
header('Content-Type: application/json');
require 'connect.php';  // Make sure this sets $con properly

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$status = $data['status'] ?? '';
$employeeNumber = $data['employeeNumber'] ?? '';
$password = $data['password'] ?? '';

if (!$name || !$status || !$employeeNumber || !$password) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Check if employee number already exists
$stmt = $con->prepare("SELECT id FROM employees WHERE employee_number = ?");
$stmt->bind_param("s", $employeeNumber);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Employee number already exists']);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $con->prepare("INSERT INTO employees (name, status, employee_number, password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $status, $employeeNumber, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to register user']);
}
?>
