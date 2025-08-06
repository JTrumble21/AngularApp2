<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require 'connect.php'; // provides $con as MySQLi connection

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed, use POST']);
    exit;
}

// Read JSON input
$data = json_decode(file_get_contents('php://input'), true);

$employeeNumber = trim($data['employeeNumber'] ?? '');
$password = trim($data['password'] ?? '');

if (!$employeeNumber || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing credentials']);
    exit;
}

// Prepare statement to prevent SQL injection
$stmt = $con->prepare("SELECT id, employeeNumber, name, status, password FROM employees WHERE employeeNumber = ?");
$stmt->bind_param('s', $employeeNumber);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    // Successful login
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'employeeNumber' => $user['employeeNumber'],
            'name' => $user['name'],
            'status' => $user['status']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid employee number or password']);
}
