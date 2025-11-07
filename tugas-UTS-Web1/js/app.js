/**
 * File: app.js
 * Bertanggung jawab untuk logika umum: Greeting, Render Dashboard Grid, Detail Modal, dan Logout.
 * Disesuaikan untuk menggunakan styling icon (fas fa-eye) pada tombol katalog.
 * PENYESUAIAN: Menambahkan fungsi Pencarian (Search Filter)
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Elemen Modal (Diambil dari dashboard.html) ---
    const bookDetailModal = document.getElementById('book-detail-modal');
    const closeDetailBtn = document.querySelector('.detail-close-btn');
    const modalBeliBtn = document.getElementById('modal-beli-btn');
    const searchInput = document.getElementById('search-input'); 

    // --- 1. Logika Greeting ---
    function showGreeting() {
        const greetingElement = document.getElementById('greeting-message');
        const user = JSON.parse(localStorage.getItem('currentUser'));

        if (greetingElement && user) {
            const hour = new Date().getHours();
            let greeting;
            
            if (hour >= 4 && hour < 11) { greeting = "Selamat Pagi "; } 
            else if (hour >= 11 && hour < 15) { greeting = "Selamat Siang "; } 
            else if (hour >= 15 && hour < 18) { greeting = "Selamat Sore "; } 
            else { greeting = "Selamat Malam "; }

            greetingElement.textContent = `${greeting}, ${user.nama}`;
        }
    }
    showGreeting();

    // --- 2. Logika Render Grid Buku (Dashboard/Katalog) ---
    const bookGrid = document.getElementById('book-grid');

    /**
     * Merender daftar buku ke grid.
     * @param {Array} booksToRender - Array buku yang akan ditampilkan (hasil filter atau semua).
     */
    function renderKatalogGrid(booksToRender) { // 👈 Menerima parameter buku
        if (!bookGrid || typeof dataKatalogBuku === 'undefined') return; 

        bookGrid.innerHTML = ''; // Kosongkan grid
        
        if (booksToRender.length === 0) {
             bookGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; padding-top: 20px;">Tidak ada buku yang ditemukan. Coba kata kunci lain.</p>';
             return;
        }

        booksToRender.forEach(buku => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            
            // Klik pada item BUKU akan membuka modal detail
            bookItem.onclick = () => showBookDetail(buku.kodeBarang); 

            bookItem.innerHTML = `
                <img 
                    src="${buku.cover}" 
                    alt="Cover ${buku.namaBarang}" 
                    class="book-cover-img"
                    onerror="this.onerror=null;this.src='assets/img/placeholder.png';"
                >
                <div class="book-title" title="${buku.namaBarang}">${buku.namaBarang}</div>
                
                <button class="book-action-button">
                    <i class="fas fa-eye"></i> Lihat Detail
                </button>
            `;
            
            bookGrid.appendChild(bookItem);
        });
    }

    // Panggil pertama kali untuk menampilkan semua buku
    // (Jika dataKatalogBuku sudah dimuat dari data.js)
    if (typeof dataKatalogBuku !== 'undefined') {
        renderKatalogGrid(dataKatalogBuku); 
    }
    
    // ----------------------------------------------------
    // --- 3. Logika Pencarian Buku (Search Filter) -------
    // ----------------------------------------------------
    
    function filterBooks() {
        if (typeof dataKatalogBuku === 'undefined') return;

        const searchTerm = searchInput.value.toLowerCase().trim();
        
        const filteredBooks = dataKatalogBuku.filter(buku => 
            buku.namaBarang.toLowerCase().includes(searchTerm) ||
            buku.kodeBarang.toLowerCase().includes(searchTerm) ||
            buku.jenisBarang.toLowerCase().includes(searchTerm)
        );

        // Render ulang grid dengan hasil filter
        renderKatalogGrid(filteredBooks);
    }

    // Event Listener untuk Search Input
    if (searchInput) {
        searchInput.addEventListener('keyup', filterBooks); // Panggil filter saat mengetik
        searchInput.addEventListener('input', filterBooks); // Panggil filter saat input berubah (termasuk paste)
    }


    // --- 4. Logika Menampilkan Detail Buku (Modal) ---
    window.showBookDetail = function(kodeBarang) {
        const buku = dataKatalogBuku.find(b => b.kodeBarang === kodeBarang);
        
        if (!buku) {
            alert("Detail buku tidak ditemukan.");
            return;
        }
        
        // Set atribut src pada tag <img> cover di modal
        document.getElementById('detail-cover-img').src = buku.cover; 
        document.getElementById('detail-cover-img').alt = `Cover ${buku.namaBarang}`;

        // Isi konten modal
        document.getElementById('detail-judul').textContent = buku.namaBarang;
        document.getElementById('detail-kode').textContent = buku.kodeBarang;
        document.getElementById('detail-harga').textContent = formatRupiah(buku.harga);
        document.getElementById('detail-jenis').textContent = buku.jenisBarang;
        document.getElementById('detail-edisi').textContent = buku.edisi;
        document.getElementById('detail-stok').textContent = buku.stok;
        
        // Teks Keterangan (Contoh/Dummy)
        document.getElementById('detail-keterangan').textContent = 
            `Buku ajar ${buku.namaBarang}, edisi ${buku.edisi}, merupakan sumber utama mata kuliah ${buku.kodeBarang}. Saat ini tersedia ${buku.stok} kopi di gudang.`;

        // Atur tombol Beli
        modalBeliBtn.textContent = (buku.stok > 0) ? `Beli Sekarang (${formatRupiah(buku.harga)})` : 'Stok Habis';
        modalBeliBtn.disabled = (buku.stok <= 0);
        modalBeliBtn.dataset.kode = buku.kodeBarang;
        
        // Tampilkan Modal
        bookDetailModal.style.display = 'block';
    }


    // --- 5. Logika Tombol Aksi "Beli Sekarang" di Modal ---
    if (modalBeliBtn) {
        modalBeliBtn.addEventListener('click', function() {
            const kode = this.dataset.kode;
            const buku = dataKatalogBuku.find(b => b.kodeBarang === kode);

            if (buku && buku.stok > 0) {
                window.addToCart(kode);
                bookDetailModal.style.display = 'none'; // Tutup modal
            } else {
                alert("Maaf, stok buku habis.");
            }
        });
    }

    // --- 6. Logika Tambah ke Keranjang (Harus Global/Window) ---
    window.addToCart = function(kodeBarang) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.kodeBarang === kodeBarang);
        const buku = dataKatalogBuku.find(b => b.kodeBarang === kodeBarang);
        
        if (!buku || buku.stok <= 0) {
            alert("Maaf, stok buku ini habis.");
            return;
        }
        
        if (existingItem) {
            existingItem.jumlah += 1;
        } else {
            cart.push({
                kodeBarang: buku.kodeBarang,
                namaBarang: buku.namaBarang,
                harga: buku.harga,
                jumlah: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`"${buku.namaBarang}" ditambahkan ke keranjang!`);
    }

    // --- 7. Logika Modal Close ---
    if (closeDetailBtn) {
        closeDetailBtn.onclick = function() {
            bookDetailModal.style.display = 'none';
        }
    }

    // Tutup modal jika klik di luar area modal
    window.onclick = function(event) {
        if (event.target === bookDetailModal) {
            bookDetailModal.style.display = "none";
        }
    }


    // --- 8. Logika Logout (Bottom Nav) ---
    const logoutBtnNav = document.getElementById('logout-btn-nav');
    if (logoutBtnNav) {
        logoutBtnNav.addEventListener('click', function(e) {
            e.preventDefault(); 
            if (confirm("Apakah Anda yakin ingin logout?")) {
                localStorage.removeItem('currentUser'); 
                localStorage.removeItem('cart'); 
                window.location.href = 'login.html'; 
            }
        });
    }

    // Catatan: Pastikan fungsi formatRupiah() ada di file lain (misal: data.js) atau Anda definisikan di sini.
    // Contoh formatRupiah sederhana:
    if (typeof formatRupiah === 'undefined') {
        window.formatRupiah = function(angka) {
            const numberString = angka.toString();
            const sisa = numberString.length % 3;
            let rupiah = numberString.substr(0, sisa);
            const ribuan = numberString.substr(sisa).match(/\d{3}/g);
            
            if (ribuan) {
                const separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }
            return 'Rp ' + rupiah;
        }
    }
});