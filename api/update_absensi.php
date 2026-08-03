<?php
require_once 'koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['id']) || !isset($input['status'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
    exit;
}

$id = intval($input['id']);
$status = $input['status'];

$all_data = get_data();
$found = false;

foreach ($all_data as &$row) {
    if ($row['id'] === $id) {
        $row['status'] = $status;
        $found = true;
        break;
    }
}

if ($found) {
    save_data($all_data);
    echo json_encode(["status" => "success", "message" => "Data berhasil diperbarui."]);
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak ditemukan."]);
}
?>
