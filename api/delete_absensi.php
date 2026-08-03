<?php
require_once 'koneksi.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "ID tidak diberikan."]);
    exit;
}

$id = intval($data['id']);

$sql = "DELETE FROM riwayat_absensi WHERE id = $id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Data berhasil dihapus."]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal menghapus data: " . $conn->error]);
}

$conn->close();
?>
