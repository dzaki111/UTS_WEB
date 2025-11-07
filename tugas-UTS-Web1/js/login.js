document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const passwordModal = document.getElementById('password-modal');
    const daftarModal = document.getElementById('daftar-modal');

    // Logika Login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('password').value;
        
        const user = dataUsers.find(u => u.email === emailInput && u.password === passwordInput);

        if (user) {
            // Jika berhasil, simpan info user (session emulation)
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert(`Selamat datang, ${user.nama}! Login berhasil.`);
            window.location.href = 'dashboard.html';
        } else {
            alert("email/password yang anda masukkan salah");
        }
    });

    // Logika Modal
    document.getElementById('lupa-password-btn').addEventListener('click', () => {
        passwordModal.style.display = 'block';
    });

    document.getElementById('daftar-btn').addEventListener('click', () => {
        daftarModal.style.display = 'block';
    });

    // Menutup modal
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    // Menutup modal jika klik di luar
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    }
});