<?php
$_POST_DATA = '{"name":"Cindy Anggraeni", "status":"Hadir"}';
$ch = curl_init('http://127.0.0.1/absensi-project/api/save_absensi.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $_POST_DATA);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Host: absensi-project.test']);
$result = curl_exec($ch);
echo "Result: " . $result;
?>
