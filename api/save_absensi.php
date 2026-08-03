<?php
require_once 'koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['name']) || !isset($input['status'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
    exit;
}

$nama = mysqli_real_escape_string($koneksi, $input['name']);
$status = mysqli_real_escape_string($koneksi, $input['status']);
$tanggal = date('Y-m-d'); // Hari ini

// Cek apakah sudah absen hari ini
$cek_query = "SELECT id FROM riwayat_absensi WHERE nama = '$nama' AND tanggal = '$tanggal'";
$cek_result = mysqli_query($koneksi, $cek_query);

if (mysqli_num_rows($cek_result) > 0) {
    echo json_encode(["status" => "error", "message" => "$nama sudah melakukan absensi hari ini."]);
    exit;
}

// Simpan data
$insert_query = "INSERT INTO riwayat_absensi (nama, tanggal, status) VALUES ('$nama', '$tanggal', '$status')";

if (mysqli_query($koneksi, $insert_query)) {
    echo json_encode(["status" => "success", "message" => "Absensi berhasil disimpan."]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal menyimpan absensi: " . mysqli_error($koneksi)]);
}
?>
