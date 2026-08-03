<?php
require_once 'koneksi.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id']) || !isset($data['status'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
    exit;
}

$id = intval($data['id']);
$status = $conn->real_escape_string($data['status']);

$sql = "UPDATE riwayat_absensi SET status = '$status' WHERE id = $id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Data berhasil diperbarui."]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal memperbarui data: " . $conn->error]);
}

$conn->close();
?>
