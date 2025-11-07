document.addEventListener('DOMContentLoaded', function() {
    
    const katalogBody = document.getElementById('katalog-body');
    const addStokForm = document.getElementById('add-stok-form');

    // Pastikan data Katalog tersedia
    if (typeof dataKatalogBuku === 'undefined') {
        console.error("Data katalog buku tidak ditemukan. Pastikan data.js dimuat.");
        return;
    }

    // --- 1. Fungsi Render Tabel Stok ---
    function renderStokTable() {
        katalogBody.innerHTML = ''; 

        dataKatalogBuku.forEach(buku => {
            const row = katalogBody.insertRow();
            row.innerHTML = `
                <td>${buku.kodeBarang}</td>
                <td><img src="${buku.cover}" alt="Cover ${buku.namaBarang}" class="cover-thumb"></td>
                <td>${buku.namaBarang}</td>
                <td>${buku.jenisBarang}</td>
                <td class="text-center">${buku.edisi}</td>
                <td class="text-center">${buku.stok}</td>
                <td class="text-right">${formatRupiah(buku.harga)}</td>
                <td class="text-center">
                    <button class="action-button-icon btn-small btn-success" onclick="alert('Fungsi Edit untuk ${buku.kodeBarang} akan ditambahkan.')">Edit</button>
                </td>
            `;
        });
    }

    // --- 2. Logika Tambah Stok Baru ---
    if (addStokForm) {
        addStokForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const newKode = document.getElementById('new-kode').value.toUpperCase();
            
            // Validasi: Cek duplikasi kode
            if (dataKatalogBuku.some(b => b.kodeBarang === newKode)) {
                alert("Kode Barang sudah ada di katalog. Gunakan kode lain atau edit stok yang sudah ada.");
                return;
            }

            const newBuku = {
                kodeBarang: newKode,
                namaBarang: document.getElementById('new-nama').value,
                jenisBarang: document.getElementById('new-jenis').value,
                edisi: parseInt(document.getElementById('new-edisi').value),
                stok: parseInt(document.getElementById('new-stok').value),
                harga: parseFloat(document.getElementById('new-harga').value),
                cover: document.getElementById('new-cover').value,
            };

            // Tambahkan ke data global (Simulasi penyimpanan)
            dataKatalogBuku.push(newBuku);
            
            // Simpan perubahan ke Local Storage (jika Anda menggunakannya)
            // Asumsi dataKatalogBuku disimpan di Local Storage
            localStorage.setItem('dataKatalogBuku', JSON.stringify(dataKatalogBuku));
            
            // Render ulang tabel dan reset form
            renderStokTable();
            addStokForm.reset();
            alert(`Buku "${newBuku.namaBarang}" berhasil ditambahkan ke katalog!`);
        });
    }

    // Panggil fungsi untuk mengisi tabel saat halaman dimuat
    renderStokTable();
});