document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('all-history');
    const filterMonth = document.getElementById('filter-month');
    
    // Elemen Modal Edit
    const editModal = document.getElementById('edit-modal');
    const editInfo = document.getElementById('edit-info');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const saveEditBtn = document.getElementById('save-edit-btn');
    
    let currentEditDate = null;
    let currentEditIndex = null;
    let currentEditName = null;

    const data = JSON.parse(localStorage.getItem('absensiData')) || {};
    let dates = Object.keys(data).sort((a, b) => new Date(b) - new Date(a)); // Sort terbaru di atas

    // Buat daftar bulan dari bulan saat ini hingga April 2027
    const startDate = new Date(); 
    const endDate = new Date(2027, 3, 4); // Bulan index 3 adalah April

    // Set ke hari pertama bulan ini agar aman saat looping
    let currentLoopDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (currentLoopDate <= endDate) {
        const year = currentLoopDate.getFullYear();
        const monthNum = String(currentLoopDate.getMonth() + 1).padStart(2, '0');
        const monthKey = `${year}-${monthNum}`;
        const monthName = currentLoopDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        
        const option = document.createElement('option');
        option.value = monthKey;
        option.textContent = monthName;
        filterMonth.appendChild(option);

        // Tambah 1 bulan
        currentLoopDate.setMonth(currentLoopDate.getMonth() + 1);
    }

    // Fungsi Render
    function renderHistory(filterKey = 'all') {
        historyContainer.innerHTML = '';
        
        // Filter tanggal sesuai bulan
        const filteredDates = dates.filter(dateStr => {
            if (filterKey === 'all') return true;
            
            const d = new Date(dateStr);
            const currentKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            return currentKey === filterKey;
        });

        if (filteredDates.length === 0) {
            historyContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 1rem 0;">Belum ada riwayat absensi pada periode ini.</p>';
            return;
        }

        filteredDates.forEach(dateStr => {
            const dateObj = new Date(dateStr);
            const formattedDate = dateObj.toLocaleDateString('id-ID', {
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            });

            const records = data[dateStr];
            
            const groupDiv = document.createElement('div');
            groupDiv.className = 'history-group';
            
            groupDiv.innerHTML = `
                <div class="history-date">${formattedDate}</div>
                <ul class="attendance-list">
                    ${records.map((record, index) => {
                        let statusClass = '';
                        if (record.status === 'Hadir') statusClass = 'hadir';
                        else if (record.status === 'Izin') statusClass = 'izin';
                        else if (record.status === 'Sakit') statusClass = 'sakit';

                        return `
                            <li>
                                <div class="info">
                                    <strong>${record.name}</strong> 
                                </div>
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <span class="status-badge ${statusClass}">${record.status}</span>
                                    <div class="action-btns">
                                        <button class="btn-small btn-edit" data-date="${dateStr}" data-index="${index}" data-name="${record.name}" data-status="${record.status}">Edit</button>
                                        <button class="btn-small btn-delete" data-date="${dateStr}" data-index="${index}" data-name="${record.name}">Hapus</button>
                                    </div>
                                </div>
                            </li>
                        `;
                    }).join('')}
                </ul>
            `;

            historyContainer.appendChild(groupDiv);
        });
    }

    // Render pertama kali (Semua Bulan)
    renderHistory();

    // Event Listener untuk Filter
    filterMonth.addEventListener('change', (e) => {
        renderHistory(e.target.value);
    });

    // Event Listener untuk Tombol Edit dan Hapus
    historyContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const dateStr = e.target.getAttribute('data-date');
            const index = parseInt(e.target.getAttribute('data-index'));
            const name = e.target.getAttribute('data-name');
            
            if (confirm(`Apakah Anda yakin ingin menghapus data absensi ${name} pada tanggal tersebut?`)) {
                data[dateStr].splice(index, 1);
                
                // Jika array kosong, hapus key dari objek
                if (data[dateStr].length === 0) {
                    delete data[dateStr];
                    dates = Object.keys(data).sort((a, b) => new Date(b) - new Date(a));
                }
                
                localStorage.setItem('absensiData', JSON.stringify(data));
                renderHistory(filterMonth.value);
            }
        }
        
        if (e.target.classList.contains('btn-edit')) {
            currentEditDate = e.target.getAttribute('data-date');
            currentEditIndex = parseInt(e.target.getAttribute('data-index'));
            currentEditName = e.target.getAttribute('data-name');
            const currentStatus = e.target.getAttribute('data-status');

            editInfo.textContent = `Nama: ${currentEditName} | Tanggal: ${currentEditDate}`;
            
            // Set radio button ke status saat ini
            document.querySelector(`input[name="edit-status"][value="${currentStatus}"]`).checked = true;
            
            editModal.classList.remove('hidden');
        }
    });

    // Event Listener untuk Modal Edit
    cancelEditBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    saveEditBtn.addEventListener('click', () => {
        const selectedRadio = document.querySelector('input[name="edit-status"]:checked');
        if (!selectedRadio) return;

        const newStatus = selectedRadio.value;
        
        // Update data
        data[currentEditDate][currentEditIndex].status = newStatus;
        localStorage.setItem('absensiData', JSON.stringify(data));
        
        editModal.classList.add('hidden');
        renderHistory(filterMonth.value);
    });
});
