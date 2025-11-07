document.addEventListener('DOMContentLoaded', function() {
    const cartBody = document.getElementById('cart-body');
    const grandTotalElement = document.getElementById('grand-total');
    const checkoutForm = document.getElementById('checkout-form');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    const biayaKirim = 20000;

    // Ambil data keranjang dari localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Inisialisasi data pemesan dari user yang login (jika ada)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('nama-pemesan').value = currentUser.nama;
        document.getElementById('email-pemesan').value = currentUser.email;
    }

    // Fungsi merender keranjang
    function renderCart() {
        cart = JSON.parse(localStorage.getItem('cart')) || []; // Refresh cart
        cartBody.innerHTML = '';
        let subtotalBarang = 0;

        if (cart.length === 0) {
            cartBody.innerHTML = '<tr><td colspan="6" class="text-center">Keranjang belanja Anda kosong.</td></tr>';
            grandTotalElement.textContent = formatRupiah(0);
            return;
        }

        cart.forEach(item => {
            const subtotal = item.harga * item.jumlah;
            subtotalBarang += subtotal;

            const row = cartBody.insertRow();
            row.insertCell().textContent = item.kodeBarang;
            row.insertCell().textContent = item.namaBarang;
            row.insertCell().textContent = formatRupiah(item.harga);
            
            // Input jumlah yang bisa diubah (manipulasi DOM dan data)
            const inputJumlah = document.createElement('input');
            inputJumlah.type = 'number';
            inputJumlah.value = item.jumlah;
            inputJumlah.min = 1;
            inputJumlah.classList.add('cart-quantity-input');
            inputJumlah.dataset.kode = item.kodeBarang;
            
            const cellJumlah = row.insertCell();
            cellJumlah.appendChild(inputJumlah);
            
            row.insertCell().textContent = formatRupiah(subtotal);
            
            const btnHapus = document.createElement('button');
            btnHapus.textContent = 'Hapus';
            btnHapus.classList.add('btn-danger', 'btn-small');
            btnHapus.onclick = () => removeItem(item.kodeBarang);
            row.insertCell().appendChild(btnHapus);
        });

        const grandTotal = subtotalBarang + biayaKirim;
        grandTotalElement.textContent = formatRupiah(grandTotal);
    }

    // Fungsi hapus item
    function removeItem(kodeBarang) {
        cart = cart.filter(item => item.kodeBarang !== kodeBarang);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        alert('Item berhasil dihapus dari keranjang.');
    }
    
    // Fungsi update jumlah item
    cartBody.addEventListener('change', function(e) {
        if (e.target.classList.contains('cart-quantity-input')) {
            const kode = e.target.dataset.kode;
            let newJumlah = parseInt(e.target.value);

            if (isNaN(newJumlah) || newJumlah < 1) {
                newJumlah = 1;
                e.target.value = 1;
            }

            const itemIndex = cart.findIndex(item => item.kodeBarang === kode);
            if (itemIndex > -1) {
                cart[itemIndex].jumlah = newJumlah;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        }
    });

    // Logika Clear Cart
    clearCartBtn.addEventListener('click', () => {
        if (confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) {
            localStorage.removeItem('cart');
            renderCart();
        }
    });

    // Logika Checkout Form
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Pemesanan gagal. Keranjang Anda masih kosong.");
            return;
        }

        const nama = document.getElementById('nama-pemesan').value;
        const totalBayar = grandTotalElement.textContent;
        
        alert(`Pemesanan berhasil! \n\nNama: ${nama}\nTotal Pembayaran: ${totalBayar} (Termasuk ongkir)\n\nNomor DO fiktif Anda: 202300XX. Silakan cek di menu Tracking Pengiriman.`);
        
        // Simulasikan penghapusan keranjang setelah pemesanan
        localStorage.removeItem('cart');
        renderCart();
        checkoutForm.reset();
    });

    renderCart();
});