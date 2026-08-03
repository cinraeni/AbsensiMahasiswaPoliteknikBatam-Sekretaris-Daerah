<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$host = 'localhost';
$user = 'root';
$password = ''; // Default laragon/XAMPP tanpa password
$database = 'db_absensi';

$koneksi = mysqli_connect($host, $user, $password, $database);

if (!$koneksi) {
    die(json_encode(["status" => "error", "message" => "Koneksi database gagal: " . mysqli_connect_error()]));
}
?>
