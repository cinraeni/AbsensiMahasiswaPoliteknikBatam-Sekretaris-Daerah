import { db } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const dateDisplay = document.getElementById('current-date');
    const form = document.getElementById('attendance-form');
    const submitBtn = document.getElementById('submit-btn');
    const alertBox = document.getElementById('alert-message');
    
    // Inisialisasi Data
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
    
    // Format Tanggal
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = currentDate.toLocaleDateString('id-ID', options);

    // Cek apakah hari ini Senin-Jumat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
        // Nonaktifkan form jika akhir pekan
        showAlert('Absensi hanya dibuka pada hari kerja (Senin - Jumat).', 'error');
        disableForm();
    }

    // Set nilai default input tanggal ke hari ini
    const tanggalInput = document.getElementById('tanggal');
    if (tanggalInput) {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        tanggalInput.value = localISOTime.split('T')[0];
    }

    // Handle Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (isWeekend) return;

        const name = document.getElementById('employee-name').value;
        const status = document.querySelector('input[name="status"]:checked').value;
        let tanggal = document.getElementById('tanggal') ? document.getElementById('tanggal').value : null;

        if (!tanggal) {
            const tzoffset = (new Date()).getTimezoneOffset() * 60000; 
            tanggal = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];
        }

        if (!name) {
            showAlert('Silakan pilih nama karyawan.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan...';

        await saveAttendance(name, status, tanggal);
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Absensi';
    });

    async function saveAttendance(name, status, tanggal) {
        try {
            // Cek apakah sudah absen di tanggal ini
            const q = query(collection(db, "riwayat_absensi"), where("nama", "==", name), where("tanggal", "==", tanggal));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                showAlert(`${name} sudah melakukan absensi pada tanggal ini.`, 'error');
                return;
            }

            // Simpan data ke Firestore
            await addDoc(collection(db, "riwayat_absensi"), {
                nama: name,
                status: status,
                tanggal: tanggal,
                createdAt: new Date().toISOString()
            });

            form.reset();
            
            // Setel ulang tanggal ke hari ini setelah reset
            if (tanggalInput) {
                const tzoffset = (new Date()).getTimezoneOffset() * 60000;
                tanggalInput.value = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];
            }

            showAlert('Absensi berhasil disimpan.', 'success');
        } catch (error) {
            console.error('Error:', error);
            showAlert('Terjadi kesalahan saat menyimpan data.', 'error');
        }
    }

    function showAlert(message, type) {
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        
        setTimeout(() => {
            if (!isWeekend) {
                alertBox.className = 'alert hidden';
            }
        }, 3000);
    }

    function disableForm() {
        document.getElementById('employee-name').disabled = true;
        document.querySelectorAll('input[name="status"]').forEach(input => input.disabled = true);
        submitBtn.disabled = true;
    }
});
