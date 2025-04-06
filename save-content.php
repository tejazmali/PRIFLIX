<?php
/**
 * Save Content PHP Script
 * Handles updating the content-data.js file with new content
 */

// Set headers to prevent caching
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-Type: application/json');

// Error reporting for debugging (remove in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Function to validate the request
function validateRequest() {
    // Check for POST request
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        return [false, 'Invalid request method'];
    }
    
    // Get the raw POST data
    $rawData = file_get_contents('php://input');
    if (!$rawData) {
        return [false, 'No data received'];
    }
    
    // Decode the JSON data
    $data = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return [false, 'Invalid JSON: ' . json_last_error_msg()];
    }
    
    // Check required fields
    if (!isset($data['content']) || !isset($data['filename'])) {
        return [false, 'Missing required fields'];
    }
    
    // Validate filename for security
    if ($data['filename'] !== 'content-data.js') {
        return [false, 'Invalid filename'];
    }
    
    return [true, $data];
}

// Function to save content to file
function saveContent($filename, $content) {
    // Ensure the content-data.js file is in the same directory
    $filePath = __DIR__ . '/' . $filename;
    
    // Attempt to write the content to the file
    $result = file_put_contents($filePath, $content);
    
    if ($result === false) {
        return [false, 'Failed to write to file. Check permissions.'];
    }
    
    return [true, 'Content updated successfully'];
}

// Main process
list($isValid, $dataOrError) = validateRequest();
if (!$isValid) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $dataOrError]);
    exit;
}

// Save content to file
list($saveSuccess, $saveMessage) = saveContent($dataOrError['filename'], $dataOrError['content']);
if (!$saveSuccess) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $saveMessage]);
    exit;
}

// Return success response
echo json_encode(['success' => true, 'message' => $saveMessage]); 