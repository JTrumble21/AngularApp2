<?php
header('Content-Type: application/json');

require 'connect.php'; // $con (mysqli)

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$employeeNumber = trim($data['employeeNumber'] ?? '');
$password = trim($data['password'] ?? '');

if (!$employeeNumber || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing credentials']);
    exit;
}

$stmt = $con->prepare("SELECT * FROM employees WHERE EmployeeNumber = ?");
$stmt->bind_param("s", $employeeNumber);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['Password'])) {
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'employeeNumber' => $user['EmployeeNumber'],
            'name' => $user['Name'],
            'status' => $user['Status']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}
