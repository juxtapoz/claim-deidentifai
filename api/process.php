<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

function detectPHI($text) {
    $patterns = [
        'name' => '/[A-Z][a-z]+ [A-Z][a-z]+/',
        'ssn' => '/\b\d{3}-\d{2}-\d{4}\b/',
        // ... other patterns
    ];
    
    // Similar logic to Python implementation
    return $matches;
}

if ($_FILES['file']) {
    $content = file_get_contents($_FILES['file']['tmp_name']);
    $result = detectPHI($content);
    echo json_encode(['status' => 'success', 'data' => $result]);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
} 