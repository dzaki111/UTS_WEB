document.addEventListener('DOMContentLoaded', function() {
    const trackingForm = document.getElementById('tracking-form');
    const trackingResult = document.getElementById('tracking-result');
    const noResult = document.getElementById('no-result');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const perjalananList = document.getElementById('perjalanan-list');

    trackingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const doNumber = document.getElementById('do-number').value.trim();
        const trackingData = dataTrackingPengiriman[doNumber];

        trackingResult.classList.add('hidden');
        noResult.classList.add('hidden');
        
        if (trackingData) {
            // Tampilkan hasil
            document.getElementById('do-number-display').textContent = trackingData.nomorDO;
            document.getElementById('pemesan-name').textContent = trackingData.nama;
            document.getElementById('delivery-status').textContent = trackingData.status;

            // Update Progress Bar
            const progress = trackingData.progress || 0;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}% - ${trackingData.status}`;

            // Atur warna berdasarkan status (Kreativitas)
            if (progress === 100) {
                progressBar.style.backgroundColor = 'var(--success-color)';
            } else if (progress > 0) {
                progressBar.style.backgroundColor = 'var(--warning-color)';
            } else {
                progressBar.style.backgroundColor = 'var(--danger-color)';
            }

            // Detail
            document.getElementById('detail-ekspedisi').textContent = trackingData.ekspedisi;
            document.getElementById('detail-tgl-kirim').textContent = trackingData.tanggalKirim;
            document.getElementById('detail-jenis-paket').textContent = trackingData.paket;
            document.getElementById('detail-total-bayar').textContent = trackingData.total;

            // Riwayat Perjalanan (Tabel/List)
            perjalananList.innerHTML = '';
            trackingData.perjalanan.forEach(log => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${log.waktu}</strong>: ${log.keterangan}`;
                perjalananList.appendChild(li);
            });

            trackingResult.classList.remove('hidden');
        } else {
            noResult.classList.remove('hidden');
        }
    });
});