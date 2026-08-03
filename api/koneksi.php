<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$host = 'localhost';
$user = 'root';
$pass = ''; // Sesuaikan jika menggunakan hosting
$db = 'db_absensi'; // Sesuaikan jika menggunakan hosting

try {
    $conn = new mysqli($host, $user, $pass);
    if ($conn->connect_error) {
        die(json_encode(["status" => "error", "message" => "Koneksi ke MySQL gagal: " . $conn->connect_error]));
    }
} catch (Exception $e) {
    die(json_encode(["status" => "error", "message" => "Koneksi ke MySQL gagal. Pastikan database berjalan. Error: " . $e->getMessage()]));
}

// Coba pilih database
if (!$conn->select_db($db)) {
    // Jika tidak ada, coba buat (mungkin gagal di hosting karena hak akses)
    $sql_db = "CREATE DATABASE IF NOT EXISTS `$db`";
    if ($conn->query($sql_db) === FALSE) {
        die(json_encode(["status" => "error", "message" => "Gagal memilih/membuat database '$db'. Jika Anda di hosting, buat database secara manual. Error: " . $conn->error]));
    }
    $conn->select_db($db);
}

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
