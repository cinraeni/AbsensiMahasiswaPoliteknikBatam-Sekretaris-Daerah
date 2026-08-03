<?php
require_once 'koneksi.php';

$query = "SELECT * FROM riwayat_absensi ORDER BY tanggal DESC, id DESC";
$result = mysqli_query($koneksi, $query);

$response = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $tanggal = $row['tanggal'];
        if (!isset($response[$tanggal])) {
            $response[$tanggal] = [];
        }
        $response[$tanggal][] = [
            "id" => (int)$row['id'],
            "name" => $row['nama'],
            "status" => $row['status']
        ];
    }
}

echo json_encode($response);
?>
