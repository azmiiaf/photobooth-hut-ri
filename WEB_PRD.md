# Product Requirements Document (PRD)
**Project Name:** Karang Taruna Darma Bakti - Web Photobooth  
**Version:** 1.0  
**Tech Stack:** React, Supabase, TailwindCSS, HTML5 Canvas  

## 1. Pendahuluan
### 1.1 Tujuan
Membangun versi *web-based* dari aplikasi Photobooth 17 Agustus Karang Taruna Darma Bakti. Aplikasi web ini memungkinkan masyarakat untuk berpartisipasi dalam perayaan kemerdekaan secara virtual dari perangkat mereka sendiri (laptop, tablet, atau smartphone) menggunakan kamera bawaan (webcam).

### 1.2 Target Pengguna
- Warga dan pemuda Karang Taruna Darma Bakti.
- Masyarakat umum yang ingin merayakan 17 Agustus secara virtual.

## 2. Fitur Utama (Core Features)

### 2.1 Akses Kamera (Webcam)
- Aplikasi harus dapat meminta izin (permission) dan mengakses kamera perangkat melalui browser (`react-webcam`).
- Tampilan kamera (mirror mode untuk kamera depan) disesuaikan secara dinamis.

### 2.2 Sesi Foto (Virtual Capture)
- **Countdown:** Hitung mundur 5-4-3-2-1 sebelum setiap jepretan.
- **Auto Capture:** Mengambil 8 foto secara otomatis berturut-turut.
- **Flash Effect:** Animasi *white flash* saat foto diambil.

### 2.3 Pemilihan Foto & Frame
- **Pilih 4 dari 8:** Pengguna menyeleksi 4 foto terbaik dari 8 hasil jepretan.
- **Pemilihan Frame:** Menyediakan opsi desain frame (misal: Strip 1 & Strip 2 bertema 17 Agustus).

### 2.4 Komposisi Gambar (Image Processing)
- Menggunakan **HTML5 Canvas** untuk menempelkan 4 foto pilihan ke belakang desain frame PNG transparan berukuran 600x1800px.
- Sistem harus meng-crop otomatis foto (cover fit) agar tidak distorsi.

### 2.5 Cloud Storage & Galeri (Supabase)
- **Upload:** Menyimpan hasil akhir (komposisi) ke Supabase Storage.
- **Generate URL:** Memberikan tautan publik agar pengguna dapat mengunduh foto mereka.
- **Public Gallery (Opsional):** Halaman galeri untuk melihat semua foto yang diambil oleh pengguna lain (jika diizinkan).

## 3. Desain & UX
- **Tema:** Gelap (Dark Theme) dengan aksen Merah Kemerdekaan (`#C8102E`).
- **Typography:** Plus Jakarta Sans.
- **Responsive:** Harus dapat berjalan lancar di tampilan Mobile (portrait) maupun Desktop (landscape).

## 4. Metrik Keberhasilan (Success Metrics)
- Pengguna dapat menyelesaikan 1 sesi foto (dari mulai hingga download URL) dalam waktu kurang dari 2 menit.
- Aplikasi web berjalan mulus tanpa lag saat memproses Canvas API di perangkat mobile menengah.
