<?php
header('Content-Type: application/json');
require 'connect.php';

// Replace these values with the user info you want to add
$name = 'Jessi';
$status = 'Active';
$employeeNumber = '001';
$plainPassword = 'test';  // The password in plain text

// Hash the password securely
$hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);

// Prepare the insert statement
$stmt = $con->prepare("INSERT INTO employees (Name, Status, employeeNumber, password) VALUES (?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $con->error]);
    exit;
}

$stmt->bind_param("ssss", $name, $status, $employeeNumber, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'User added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Execute failed: ' . $stmt->error]);
}

$stmt->close();
$con->close();
