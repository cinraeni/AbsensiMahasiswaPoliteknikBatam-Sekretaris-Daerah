<?php
require_once 'koneksi.php';

$sql = "SELECT id, nama, tanggal, status FROM riwayat_absensi ORDER BY tanggal DESC, id DESC";
$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $tanggal = $row['tanggal'];
        
        if (!isset($data[$tanggal])) {
            $data[$tanggal] = [];
        }
        
        $data[$tanggal][] = [
            "id" => $row['id'],
            "name" => $row['nama'],
            "status" => $row['status']
        ];
    }
}

echo json_encode($data);
$conn->close();
?>
