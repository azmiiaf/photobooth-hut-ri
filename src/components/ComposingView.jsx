import React, { useEffect, useRef } from 'react';
import { usePhotoboothStore } from '../store/usePhotoboothStore';
import { Loader2 } from 'lucide-react';
import { FRAME_CONFIGS } from '../lib/frameConfigs';

export default function ComposingView() {
  const { selectedPhotos, selectedFrame, setFinalImage, setStatus } = usePhotoboothStore();
  const canvasRef = useRef(null);

  useEffect(() => {
    const composeImage = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const config = FRAME_CONFIGS[selectedFrame];
      if (!config) {
        console.error("No config found for frame:", selectedFrame);
        return;
      }

      const ctx = canvas.getContext('2d');
      const CANVAS_WIDTH = config.width;
      const CANVAS_HEIGHT = config.height;
      
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      // 1. Draw Background (White)
      ctx.fillStyle = '#FFFFFF'; 
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 2. Load and draw user photos
      const loadImg = (src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
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
        // In FrameSelectionView we used selectedFrame which already includes .png (e.g. 'strip1.png')
        const frameImg = await loadImg(`/images/${selectedFrame}`);
        ctx.drawImage(frameImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      } catch(e) { 
        console.error('Failed to load frame image, using fallback', e);
        // Fallback text drawing if no frame image
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.font = 'bold 40px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('DIRGAHAYU REPUBLIK INDONESIA', CANVAS_WIDTH / 2, 80);
        
        ctx.font = '24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Karang Taruna Darma Bakti', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 60);
        ctx.fillText('17 Agustus 2026', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 30);
  
        // Add a subtle border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 10;
        ctx.strokeRect(10, 10, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20);
      }

      // Export
      const finalDataUrl = canvas.toDataURL('image/png');
      setFinalImage(finalDataUrl);
      
      // Simulate slight delay so user sees "Memproses..."
      setTimeout(() => {
        setStatus('Uploading');
      }, 1500);
    };

    composeImage();
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
