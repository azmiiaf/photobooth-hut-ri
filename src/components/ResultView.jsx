import React, { useEffect, useState } from 'react';
import { usePhotoboothStore } from '../store/usePhotoboothStore';
import { supabase } from '../lib/supabase';
import { Download, Share2, RefreshCw, Loader2, Check, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAudio } from '../hooks/useAudio';

export default function ResultView() {
  const { status, finalImage, publicUrl, setPublicUrl, setUploadedFileName, uploadedFileName, setStatus, resetSession } = usePhotoboothStore();
  const [error, setError] = useState(null);
  const { playClick } = useAudio();

  useEffect(() => {
    const uploadImage = async () => {
      if (status !== 'Uploading' || !finalImage) return;

      const autoDownload = () => {
        const link = document.createElement('a');
        link.href = finalImage;
        link.download = `Photobooth_17an_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      try {
        // Convert Base64 DataURL to Blob
        const res = await fetch(finalImage);
        const blob = await res.blob();
        
        // Generate unique filename
        const fileName = `pb_17an_${Date.now()}.png`;

        // Upload to Supabase
        const { data, error: uploadError } = await supabase
          .storage
          .from('photobooth')
          .upload(fileName, blob, {
            contentType: 'image/png',
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: publicUrlData } = supabase
          .storage
          .from('photobooth')
          .getPublicUrl(fileName);

        setPublicUrl(publicUrlData.publicUrl);
        setUploadedFileName(fileName);
        setStatus('Completed');
        
        // Auto-download as backup
        setTimeout(autoDownload, 500);

      } catch (err) {
        console.error("Upload failed:", err);
        setError(`Gagal upload (${err.message || err.toString()}). Foto otomatis disimpan ke perangkat ini.`);
        setStatus('Completed'); 
        
        // Auto-download as backup even on failure
        setTimeout(autoDownload, 500);
      }
    };

    uploadImage();
  }, [status, finalImage, setPublicUrl, setUploadedFileName, setStatus]);

  const handleDownload = () => {
    // Trigger local download
    const link = document.createElement('a');
    link.href = finalImage;
    link.download = `Photobooth_17an_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadUrl = uploadedFileName ? `${window.location.origin}/?download=${uploadedFileName}` : '';

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full h-full animate-in fade-in zoom-in-95 duration-300">
      {/* Preview Section */}
      <div className="flex-1 flex justify-center items-center lg:items-start min-h-0">
        <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl border border-zinc-200 flex items-center justify-center p-2">
          <img src={finalImage} alt="Final Photobooth" className="w-auto h-auto max-w-full max-h-[70vh] lg:max-h-[75vh] block" />
          
          {status === 'Uploading' && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
              <Loader2 className="w-10 h-10 animate-spin text-merah-merdeka mb-4" />
              <p className="font-medium">Memproses Foto...</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Section */}
      <div className="flex-1 flex flex-col justify-center space-y-4">
        {status === 'Completed' ? (
          <>
            <div className="flex flex-col items-center text-center space-y-1 w-full">
              <div className="inline-flex items-center justify-center p-2 bg-green-500/10 rounded-full mb-2">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900">Selesai!</h2>
              <p className="text-zinc-600 text-sm max-w-sm">
                Foto kamu berhasil diproses. Kamu bisa menyimpannya sekarang.
              </p>
              {error && <p className="text-red-500 text-sm max-w-sm">{error}</p>}
            </div>
            
            <div className="space-y-2 pt-2 border-t border-zinc-200 flex flex-col items-center">
              {publicUrl ? (
                <div className="flex flex-col items-center justify-center space-y-3 bg-white p-4 rounded-xl border border-zinc-200 shadow-lg w-full max-w-[280px]">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-merah-merdeka" />
                    <h3 className="font-bold text-base text-zinc-900">Scan untuk Simpan</h3>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 shadow-inner">
                    <QRCodeSVG value={downloadUrl} size={140} />
                  </div>
                  <p className="text-xs text-zinc-500 text-center">
                    Arahkan kamera HP ke QR ini.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200 w-full max-w-[280px]">
                  <p className="text-xs text-zinc-600 text-center">QR Code tidak tersedia. Foto disimpan otomatis.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center lg:text-left space-y-2 opacity-50">
            <h2 className="text-xl font-bold text-zinc-900">Menyimpan...</h2>
            <p className="text-sm text-zinc-600">Mohon tunggu sebentar.</p>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={() => { playClick(); resetSession(); }}
            className="w-full py-3 bg-red-700 border-2 border-zinc-300 hover:border-zinc-400 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-sm text-lg flex justify-center items-center gap-2"
          >
            SELESAI
          </button>
        </div>
      </div>
    </div>
  );
}
