<?php
require_once 'koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['name']) || !isset($input['status'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
    exit;
}

$nama = $input['name'];
$status = $input['status'];
$tanggal = date('Y-m-d'); // Hari ini

$all_data = get_data();

// Cek apakah sudah absen hari ini
foreach ($all_data as $row) {
    if ($row['nama'] === $nama && $row['tanggal'] === $tanggal) {
        echo json_encode(["status" => "error", "message" => "$nama sudah melakukan absensi hari ini."]);
        exit;
    }
}

// Cari ID tertinggi
$max_id = 0;
foreach ($all_data as $row) {
    if ($row['id'] > $max_id) $max_id = $row['id'];
}

$new_id = $max_id + 1;
$all_data[] = [
    "id" => $new_id,
    "nama" => $nama,
    "tanggal" => $tanggal,
    "status" => $status,
    "created_at" => date('Y-m-d H:i:s')
];

save_data($all_data);

echo json_encode(["status" => "success", "message" => "Absensi berhasil disimpan."]);
?>
