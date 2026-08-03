<?php
require_once 'koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['id']) || !isset($input['status'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
    exit;
}

$id = intval($input['id']);
$status = mysqli_real_escape_string($koneksi, $input['status']);

$update_query = "UPDATE riwayat_absensi SET status = '$status' WHERE id = $id";

if (mysqli_query($koneksi, $update_query)) {
    if (mysqli_affected_rows($koneksi) > 0) {
        echo json_encode(["status" => "success", "message" => "Data berhasil diperbarui."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Data tidak ditemukan atau tidak ada perubahan."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Gagal memperbarui data: " . mysqli_error($koneksi)]);
}
?>
