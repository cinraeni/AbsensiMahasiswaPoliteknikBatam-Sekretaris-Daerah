<?php
require_once 'koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['id'])) {
    echo json_encode(["status" => "error", "message" => "ID tidak diberikan."]);
    exit;
}

$id = intval($input['id']);

$delete_query = "DELETE FROM riwayat_absensi WHERE id = $id";

if (mysqli_query($koneksi, $delete_query)) {
    if (mysqli_affected_rows($koneksi) > 0) {
        echo json_encode(["status" => "success", "message" => "Data berhasil dihapus."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menghapus data: ID tidak ditemukan."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Gagal menghapus data: " . mysqli_error($koneksi)]);
}
?>
