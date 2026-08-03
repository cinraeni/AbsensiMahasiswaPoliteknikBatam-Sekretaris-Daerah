<?php
require_once 'koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['id'])) {
    echo json_encode(["status" => "error", "message" => "ID tidak diberikan."]);
    exit;
}

$id = intval($input['id']);
$all_data = get_data();
$initial_count = count($all_data);

$all_data = array_filter($all_data, function($row) use ($id) {
    return $row['id'] !== $id;
});
$all_data = array_values($all_data); // Reset keys

if (count($all_data) < $initial_count) {
    save_data($all_data);
    echo json_encode(["status" => "success", "message" => "Data berhasil dihapus."]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal menghapus data: ID tidak ditemukan"]);
}
?>
