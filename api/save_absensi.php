<?php
require_once 'koneksi.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['name']) || !isset($data['status'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
    exit;
}

$nama = $conn->real_escape_string($data['name']);
$status = $conn->real_escape_string($data['status']);
$tanggal = date('Y-m-d'); // Hari ini

// Cek apakah sudah absen hari ini
$checkSql = "SELECT id FROM riwayat_absensi WHERE nama = '$nama' AND tanggal = '$tanggal'";
$result = $conn->query($checkSql);

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "$nama sudah melakukan absensi hari ini."]);
    exit;
}

$sql = "INSERT INTO riwayat_absensi (nama, tanggal, status) VALUES ('$nama', '$tanggal', '$status')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Absensi berhasil disimpan."]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal menyimpan absensi: " . $conn->error]);
}

$conn->close();
?>
