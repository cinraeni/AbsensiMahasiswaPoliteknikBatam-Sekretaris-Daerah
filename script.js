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

    // Handle Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (isWeekend) return;

        const name = document.getElementById('employee-name').value;
        const status = document.querySelector('input[name="status"]:checked').value;

        if (!name) {
            showAlert('Silakan pilih nama karyawan.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan...';

        await saveAttendance(name, status);
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Absensi';
    });

    async function saveAttendance(name, status) {
        try {
            const response = await fetch('api/save_absensi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, status })
            });

            const result = await response.json();

            if (result.status === 'success') {
                form.reset();
                showAlert(result.message, 'success');
            } else {
                showAlert(result.message, 'error');
            }
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
