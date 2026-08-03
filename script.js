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
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (isWeekend) return;

        const name = document.getElementById('employee-name').value;
        const status = document.querySelector('input[name="status"]:checked').value;

        if (!name) {
            showAlert('Silakan pilih nama karyawan.', 'error');
            return;
        }

        saveAttendance(name, status);
        form.reset();
        showAlert('Absensi berhasil disimpan!', 'success');
        
        // Reset selected styling if needed or rely on radio default
    });

    function saveAttendance(name, status) {
        const todayStr = currentDate.toISOString().split('T')[0];
        let data = JSON.parse(localStorage.getItem('absensiData')) || {};
        
        if (!data[todayStr]) {
            data[todayStr] = [];
        }

        // Cek apakah sudah absen hari ini
        const alreadyAbsen = data[todayStr].find(item => item.name === name);
        
        if (alreadyAbsen) {
            showAlert(`${name} sudah melakukan absensi hari ini.`, 'error');
            return;
        }

        const newRecord = {
            name,
            status
        };

        data[todayStr].push(newRecord);
        localStorage.setItem('absensiData', JSON.stringify(data));
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
