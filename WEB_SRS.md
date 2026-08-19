# Software Requirements Specification (SRS)
**Project Name:** Karang Taruna Darma Bakti - Web Photobooth  
**Version:** 1.0  
**Tech Stack:** React, Supabase, TailwindCSS, HTML5 Canvas  

## 1. Arsitektur Sistem (System Architecture)

### 1.1 Frontend (React.js)
- **Framework:** React (menggunakan Vite untuk build tool yang cepat).
- **Styling:** TailwindCSS untuk desain komponen yang *responsive* dan fleksibel.
- **State Management:** React Context API atau Zustand untuk melacak status sesi (Idle, Capturing, Selecting, Composing, Uploading, Completed).
- **Camera API:** Pustaka `react-webcam` untuk mengatur stream video dan mengambil *screenshot* dari perangkat pengguna.
- **Image Processing:** HTML5 `<canvas>` API murni. Pemrosesan dilakukan di sisi klien (*client-side*) untuk menghindari beban *server* yang berat.

### 1.2 Backend (Supabase)
- **Supabase Storage:** Tempat penyimpanan (bucket) *public* untuk gambar PNG hasil akhir.
- **Supabase Database (PostgreSQL):** Tabel `sessions` untuk menyimpan metadata (misalnya ID Sesi, Waktu Dibuat, URL Gambar).
- **Autentikasi (Opsional):** Supabase Anonymous Auth untuk melacak pengguna unik tanpa mengharuskan login email.

## 2. Kebutuhan Fungsional (Functional Requirements)

### 2.1 Modul Kamera
- **REQ-CAM-01:** Sistem harus bisa mendeteksi ketersediaan kamera.
- **REQ-CAM-02:** Sistem harus meminta izin `getUserMedia` sebelum mengaktifkan kamera.
- **REQ-CAM-03:** Sistem harus mengizinkan pengguna memilih kamera depan atau belakang (jika diakses melalui smartphone).

### 2.2 Modul Pengambilan Gambar
- **REQ-CAP-01:** Sistem melakukan *looping* otomatis untuk mengambil 8 jepretan foto.
- **REQ-CAP-02:** Setiap jepretan harus diawali dengan hitung mundur visual (3 detik atau 5 detik).
- **REQ-CAP-03:** Hasil jepretan sementara disimpan dalam memori (*blob/base64*).

### 2.3 Modul Pemrosesan Canvas
- **REQ-CAN-01:** Sistem harus memuat aset *frame overlay* (berformat PNG berukuran 600x1800).
- **REQ-CAN-02:** Sistem memotong (*crop-to-fill*) 4 foto yang dipilih agar sesuai dengan 4 kotak koordinat pada frame.
- **REQ-CAN-03:** Sistem me-render foto *di bawah* (z-index lebih rendah) dari lapisan PNG overlay pada elemen Canvas, lalu mengekspornya menjadi satu file `image/png`.

### 2.4 Modul Supabase & Jaringan
- **REQ-NET-01:** Hasil gambar dari Canvas diunggah ke Supabase Storage menggunakan `supabase.storage.from('photobooth').upload()`.
- **REQ-NET-02:** Sistem harus menangani kemungkinan *error* saat *upload* (misal: koneksi terputus).
- **REQ-NET-03:** Sistem mengembalikan URL publik (*public URL*) untuk file yang berhasil diunggah.

## 3. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 3.1 Performa
- Proses manipulasi Canvas tidak boleh memakan waktu lebih dari 3 detik pada perangkat smartphone spesifikasi menengah.
- *Bundle size* aplikasi web harus dijaga di bawah 2MB agar waktu pemuatan (load time) cepat di koneksi internet lambat.

### 3.2 Keamanan & Privasi
- Aplikasi harus mematuhi kebijakan privasi dasar: foto mentah (raw photos) yang tidak dipilih oleh pengguna harus segera dihapus dari memori *browser* dan **tidak pernah** diunggah ke server.
- Akses Supabase Storage harus diamankan menggunakan aturan RLS (Row Level Security) sehingga hanya pengguna yang membuat gambar yang bisa memperbarui atau menghapusnya.

### 3.3 Kompatibilitas Browser
- Harus berfungsi baik pada browser modern berbasis Chromium (Chrome, Edge), Firefox, dan Safari (termasuk Safari iOS yang sering memiliki batasan izin kamera).
