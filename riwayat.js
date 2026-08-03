import { db } from './firebase-config.js';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('all-history');
    const filterMonth = document.getElementById('filter-month');
    
    // Elemen Modal Edit
    const editModal = document.getElementById('edit-modal');
    const editInfo = document.getElementById('edit-info');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const saveEditBtn = document.getElementById('save-edit-btn');
    
    let currentEditDate = null;
    let currentEditId = null;
    let currentEditName = null;

    let data = {};
    let dates = [];

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

    // Fungsi mengambil data dari server
    async function loadData() {
        try {
            const q = query(collection(db, "riwayat_absensi"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            
            data = {};
            querySnapshot.forEach((docSnap) => {
                const record = docSnap.data();
                const id = docSnap.id;
                const dateStr = record.tanggal;
                
                if (!data[dateStr]) data[dateStr] = [];
                data[dateStr].push({
                    id: id,
                    name: record.nama,
                    status: record.status
                });
            });
            
            dates = Object.keys(data).sort((a, b) => new Date(b) - new Date(a));
            renderHistory(filterMonth.value);
        } catch (error) {
            console.error('Error fetching data:', error);
            historyContainer.innerHTML = '<p style="text-align:center; color:red; padding: 1rem 0;">Gagal mengambil data dari Firebase. Pastikan konfigurasi Firebase sudah benar.</p>';
        }
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
            groupDiv.className = 'history-group glass-panel';
            
            groupDiv.innerHTML = `
                <div class="history-date">${formattedDate}</div>
                <ul class="attendance-list">
                    ${records.map((record) => {
                        let statusClass = '';
                        if (record.status === 'Hadir') statusClass = 'hadir';
                        else if (record.status === 'Izin' || record.status === 'Tidak Hadir') statusClass = 'tidak-hadir';
                        else if (record.status === 'Sakit') statusClass = 'sakit';

                        return `
                            <li>
                                <div class="info">
                                    <strong>${record.name}</strong> 
                                </div>
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <span class="status-badge ${statusClass}">${record.status}</span>
                                    <div class="action-btns">
                                        <button class="btn-small btn-edit" data-date="${dateStr}" data-id="${record.id}" data-name="${record.name}" data-status="${record.status}">Edit</button>
                                        <button class="btn-small btn-delete" data-date="${dateStr}" data-id="${record.id}" data-name="${record.name}">Hapus</button>
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

    // Panggil loadData pertama kali
    loadData();

    // Event Listener untuk Filter
    filterMonth.addEventListener('change', (e) => {
        renderHistory(e.target.value);
    });

    // Event Listener untuk Tombol Edit dan Hapus
    historyContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            
            if (confirm(`Apakah Anda yakin ingin menghapus data absensi ${name}?`)) {
                try {
                    await deleteDoc(doc(db, "riwayat_absensi", id));
                    loadData(); // Refresh data
                } catch (error) {
                    console.error('Error deleting:', error);
                    alert('Gagal menghapus data.');
                }
            }
        }
        
        if (e.target.classList.contains('btn-edit')) {
            currentEditDate = e.target.getAttribute('data-date');
            currentEditId = e.target.getAttribute('data-id');
            currentEditName = e.target.getAttribute('data-name');
            const currentStatus = e.target.getAttribute('data-status');

            editInfo.textContent = `Nama: ${currentEditName} | Tanggal: ${currentEditDate}`;
            
            // Set radio button ke status saat ini
            const radioStatus = document.querySelector(`input[name="edit-status"][value="${currentStatus}"]`);
            if (radioStatus) radioStatus.checked = true;
            
            editModal.classList.remove('hidden');
        }
    });

    // Event Listener untuk Modal Edit
    cancelEditBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    saveEditBtn.addEventListener('click', async () => {
        const selectedRadio = document.querySelector('input[name="edit-status"]:checked');
        if (!selectedRadio) return;

        const newStatus = selectedRadio.value;
        saveEditBtn.textContent = 'Menyimpan...';
        saveEditBtn.disabled = true;
        
        try {
            await updateDoc(doc(db, "riwayat_absensi", currentEditId), {
                status: newStatus
            });
            editModal.classList.add('hidden');
            loadData(); // Refresh data
        } catch (error) {
            console.error('Error updating:', error);
            alert('Gagal memperbarui data.');
        } finally {
            saveEditBtn.textContent = 'Simpan Perubahan';
            saveEditBtn.disabled = false;
        }
    });
});
