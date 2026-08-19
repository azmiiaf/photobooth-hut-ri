import React, { useEffect, useRef } from 'react';
import { usePhotoboothStore } from '../store/usePhotoboothStore';
import { Loader2 } from 'lucide-react';
import { FRAME_CONFIGS } from '../lib/frameConfigs';

export default function ComposingView() {
  const { selectedPhotos, selectedFrame, setFinalImage, setStatus } = usePhotoboothStore();
  const canvasRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const composeImage = async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const config = FRAME_CONFIGS[selectedFrame];
        if (!config) {
          throw new Error(`No config found for frame: ${selectedFrame}`);
        }

        const ctx = canvas.getContext('2d');
        const SCALE_FACTOR = 0.4; // Shrink to 40% for 6x faster mobile rendering
        const CANVAS_WIDTH = config.width * SCALE_FACTOR;
        const CANVAS_HEIGHT = config.height * SCALE_FACTOR;
        
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        // 1. Draw Background (White)
        ctx.fillStyle = '#FFFFFF'; 
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Scale the context so all original coordinates work perfectly
        ctx.scale(SCALE_FACTOR, SCALE_FACTOR);

        // 2. Load and draw user photos
        const loadImg = (src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            // Add crossOrigin just in case
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
          });
        };

        for (let i = 0; i < selectedPhotos.length; i++) {
          const img = await loadImg(selectedPhotos[i]);
          const hole = config.holes[i];
          if (!hole) continue; // Safety check
          
          const photoWidth = hole.width;
          const photoHeight = hole.height;
          
          // Calculate crop to fill (matching photoWidth/photoHeight)
          const targetRatio = photoWidth / photoHeight;
          const imgRatio = img.width / img.height;
          
          let sx, sy, sWidth, sHeight;
          if (imgRatio > targetRatio) {
            sHeight = img.height;
            sWidth = sHeight * targetRatio;
            sx = (img.width - sWidth) / 2;
            sy = 0;
          } else {
            sWidth = img.width;
            sHeight = sWidth / targetRatio;
            sx = 0;
            sy = (img.height - sHeight) / 2;
          }

          // Add a slight overlap/bleed (5px) so there are no empty gaps around edges
          const bleed = 5;
          const dx = hole.x - bleed;
          const dy = hole.y - bleed;
          const dw = photoWidth + (bleed * 2);
          const dh = photoHeight + (bleed * 2);

          // Draw image clipped to rect
          ctx.save();
          ctx.beginPath();
          ctx.rect(dx, dy, dw, dh);
          ctx.clip();
          ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dw, dh);
          ctx.restore();
        }

        // 3. Draw Overlay/Frame Template
        try {
          const frameImg = await loadImg(`/images/${selectedFrame}`);
          ctx.drawImage(frameImg, 0, 0, config.width, config.height);
        } catch(e) { 
          console.error('Failed to load frame image, using fallback', e);
          // Fallback text drawing if no frame image
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.font = 'bold 40px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('DIRGAHAYU REPUBLIK INDONESIA', config.width / 2, 80);
          
          ctx.font = '24px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('Karang Taruna Darma Bakti', config.width / 2, config.height - 60);
          ctx.fillText('17 Agustus 2026', config.width / 2, config.height - 30);
    
          // Add a subtle border
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 10;
          ctx.strokeRect(10, 10, config.width - 20, config.height - 20);
        }

        // Export as JPEG for massive performance boost on mobile
        const finalDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        if (isMounted) {
          setFinalImage(finalDataUrl);
          
          // Simulate slight delay so user sees "Memproses..."
          setTimeout(() => {
            if (isMounted) setStatus('Uploading');
          }, 500);
        }
      } catch (err) {
        console.error("Fatal error during composition:", err);
        // Fallback to result view without final image if something goes catastrophically wrong
        if (isMounted) {
          alert('Terjadi kesalahan saat menyatukan foto. Pastikan koneksi internet stabil.');
          setStatus('Result');
        }
      }
    };

    composeImage();
    return () => { isMounted = false; };
  }, [selectedPhotos, selectedFrame, setFinalImage, setStatus]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
      <div className="w-20 h-20 bg-merah-merdeka/20 rounded-full flex items-center justify-center animate-pulse">
        <Loader2 className="w-10 h-10 text-merah-merdeka animate-spin" />
      </div>
      <h2 className="text-2xl font-bold">Menyatukan Foto...</h2>
      <p className="text-zinc-400">Tunggu sebentar, kami sedang membuat photobooth strip kamu.</p>
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
