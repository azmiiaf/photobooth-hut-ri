import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Camera, Loader2 } from 'lucide-react';

export default function DownloadView({ fileName }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { data } = supabase.storage.from('photobooth').getPublicUrl(fileName);
        
        if (data && data.publicUrl) {
          setImageUrl(data.publicUrl);
        } else {
          setError('Foto tidak ditemukan.');
        }
      } catch (err) {
        console.error('Error fetching image:', err);
        setError('Gagal memuat foto.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [fileName]);

  const handleDownload = async () => {
    try {
      // Fetch the image as blob to force download instead of opening in new tab
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback: open in new tab
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-putih-kalem text-teks-gelap flex flex-col font-sans">
      <header className="p-4 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-merah-merdeka" />
            <h1 className="text-xl font-bold tracking-tight">Photobooth 17an</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full max-w-md mx-auto p-4 md:p-8 items-center justify-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-teks-gelap">Foto Kamu Sudah Siap!</h2>
          <p className="text-zinc-600">Silakan unduh foto photobooth edisi kemerdekaan milikmu di bawah ini.</p>
        </div>

        {isLoading ? (
          <div className="w-full aspect-[1/3] bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-merah-merdeka animate-spin" />
          </div>
        ) : error ? (
          <div className="w-full p-8 bg-white rounded-xl border border-red-200 text-center text-red-600">
            {error}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full max-w-[300px] bg-white rounded-xl overflow-hidden shadow-2xl border border-zinc-200 p-2">
              <img src={imageUrl} alt="Photobooth Result" className="w-full h-auto rounded-lg shadow-sm" />
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-4 px-8 bg-merah-merdeka hover:bg-red-700 text-white font-bold rounded-full transition-all active:scale-95 shadow-lg shadow-merah-merdeka/20 text-lg flex justify-center items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Simpan ke Galeri
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
