<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$json_file = __DIR__ . '/data.json';

// Inisialisasi file json jika belum ada
if (!file_exists($json_file)) {
    file_put_contents($json_file, json_encode([]));
}

function get_data() {
    global $json_file;
    $content = file_get_contents($json_file);
    return json_decode($content, true) ?: [];
}

function save_data($data) {
    global $json_file;
    file_put_contents($json_file, json_encode($data, JSON_PRETTY_PRINT));
}
?>
