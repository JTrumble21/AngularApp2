<?php
header('Content-Type: application/json');

require 'connect.php'; // $con (mysqli)

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$name = trim($data['name'] ?? '');
$status = trim($data['status'] ?? '');
$employeeNumber = trim($data['employeeNumber'] ?? '');
$password = trim($data['password'] ?? '');

if (!$name || !$status || !$employeeNumber || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$stmt = $con->prepare("SELECT id FROM employees WHERE EmployeeNumber = ?");
$stmt->bind_param("s", $employeeNumber);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Employee number already exists']);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $con->prepare("INSERT INTO employees (Name, Status, EmployeeNumber, Password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $status, $employeeNumber, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'User registered successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to register user']);
}
