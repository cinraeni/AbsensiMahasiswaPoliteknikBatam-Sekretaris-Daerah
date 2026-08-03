<?php
require_once 'koneksi.php';

$all_data = get_data();
$response = [];

// Sort by date DESC, id DESC
usort($all_data, function($a, $b) {
    if ($a['tanggal'] === $b['tanggal']) {
        return $b['id'] <=> $a['id'];
    }
    return strcmp($b['tanggal'], $a['tanggal']);
});

foreach ($all_data as $row) {
    $tanggal = $row['tanggal'];
    if (!isset($response[$tanggal])) {
        $response[$tanggal] = [];
    }
    $response[$tanggal][] = [
        "id" => $row['id'],
        "name" => $row['nama'],
        "status" => $row['status']
    ];
}

echo json_encode($response);
?>
