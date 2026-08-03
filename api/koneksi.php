<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$host = 'localhost';
$user = 'root';
$pass = ''; // Default laragon password is empty
$db = 'db_absensi';

// Membuat koneksi TANPA database terlebih dahulu
$conn = new mysqli($host, $user, $pass);

// Memeriksa koneksi
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Koneksi ke MySQL gagal: " . $conn->connect_error]));
}

// Buat database jika belum ada
$sql_db = "CREATE DATABASE IF NOT EXISTS `$db`";
if ($conn->query($sql_db) === FALSE) {
    die(json_encode(["status" => "error", "message" => "Gagal membuat database: " . $conn->error]));
}

// Pilih database tersebut
$conn->select_db($db);

// Otomatis membuat tabel jika belum ada
$sql_table = "CREATE TABLE IF NOT EXISTS riwayat_absensi (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    tanggal DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql_table) === FALSE) {
    die(json_encode(["status" => "error", "message" => "Gagal membuat tabel: " . $conn->error]));
}
?>
