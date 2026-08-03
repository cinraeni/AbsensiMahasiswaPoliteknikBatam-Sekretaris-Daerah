CREATE DATABASE IF NOT EXISTS absensi_db;
USE absensi_db;

CREATE TABLE IF NOT EXISTS absensi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    tanggal DATE NOT NULL,
    status ENUM('Hadir', 'Izin', 'Sakit', 'Alpa') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
