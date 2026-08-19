import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePhotoboothStore } from '../store/usePhotoboothStore';
import { FRAME_CONFIGS } from '../lib/frameConfigs';
import { Image as ImageIcon, ArrowRight, Clock } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

export default function SelectionView() {
  const { photos, selectedPhotos, togglePhotoSelection, setStatus, selectedFrame } = usePhotoboothStore();
  const frameConfig = FRAME_CONFIGS[selectedFrame];
  const maxPhotos = frameConfig?.maxPhotos || 4;
  const { playClick } = useAudio();
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerSlot, setTimerSlot] = useState(null);

  useEffect(() => {
    setTimerSlot(document.getElementById('header-timer-slot'));
  }, []);

  const handleToggle = (photo) => {
    playClick();
    if (selectedPhotos.includes(photo) || selectedPhotos.length < maxPhotos) {
      togglePhotoSelection(photo);
    }
  };

  const handleContinue = () => {
    playClick();
    setStatus('Composing');
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      if (selectedPhotos.length < maxPhotos) {
        const remainingNeeded = maxPhotos - selectedPhotos.length;
        const availablePhotos = photos.filter(p => !selectedPhotos.includes(p));
        for (let i = 0; i < remainingNeeded && i < availablePhotos.length; i++) {
          togglePhotoSelection(availablePhotos[i]);
        }
      }
      setStatus('Composing');
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, selectedPhotos.length, maxPhotos, photos, selectedPhotos, togglePhotoSelection, setStatus]);


  const timerBadge = (
    <div className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-1 rounded-full shadow-sm">
      <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-zinc-500'}`} />
      <span className={`font-bold text-sm ${timeLeft <= 10 ? 'text-red-500' : 'text-teks-gelap'}`}>
        {timeLeft}s
      </span>
    </div>
  );

  return (
    <div className="relative flex flex-col md:flex-row w-full h-full max-h-full gap-4 md:gap-8 animate-in fade-in zoom-in-95 duration-300 items-start pt-2 md:pt-0">
      {/* Timer Badge */}
      {timerSlot && createPortal(timerBadge, timerSlot)}

      {/* Left side: Photo Selection */}
      <div className="flex-1 flex flex-col min-h-0 space-y-4 w-full h-full order-2 md:order-1">
        <div className="flex-none space-y-1 text-center md:text-left px-4 md:px-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-teks-gelap">Pilih {maxPhotos} Foto Terbaikmu</h2>
          <p className="text-zinc-500 text-sm">
            Telah dipilih {selectedPhotos.length} dari {maxPhotos} foto.
          </p>
        </div>

        {/* Photo Grid (Horizontal on mobile, vertical grid on tablet/desktop) */}
        {/* 1. Scrollable wrapper (constrains height, handles scrolling) */}
        <div className="flex-1 min-h-0 w-full overflow-x-auto md:overflow-x-hidden md:overflow-y-auto hide-scrollbar snap-x snap-mandatory pb-4 md:pb-0 relative">
          
          {/* 2. Grid/Flex layout (unconstrained height on desktop so rows never squish) */}
          <div className="flex md:grid flex-row md:grid-cols-2 gap-4 w-max md:w-full h-full md:h-auto pt-2 px-4 md:px-2 md:pr-4 items-center md:items-start">
            {photos.map((photo, index) => {
              const isSelected = selectedPhotos.includes(photo);
              return (
                <div 
                  key={index} 
                  onClick={() => handleToggle(photo)}
                  className={`flex-none w-[65vw] md:w-full snap-center relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all duration-300 ${
                    isSelected ? 'border-merah-merdeka scale-100 md:scale-[0.98]' : 'border-transparent hover:border-zinc-300 shadow-sm opacity-70 hover:opacity-100 md:opacity-100'
                  }`}
                >
                  <div className="w-full pt-[75%] relative">
                    <img src={photo} alt={`Shot ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-merah-merdeka/20 flex items-center justify-center">
                        <div className="bg-merah-merdeka text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg text-base">
                          {selectedPhotos.indexOf(photo) + 1}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-none w-full px-4 md:px-0 flex justify-center pb-4 md:pb-0 mt-2">
          <button
            onClick={handleContinue}
            disabled={selectedPhotos.length !== maxPhotos}
            className="px-6 md:px-8 py-3 md:py-4 bg-merah-merdeka hover:bg-red-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-bold rounded-full transition-all active:scale-95 text-base md:text-lg flex justify-center items-center gap-2 w-full shadow-xl shadow-merah-merdeka/30"
          >
            {selectedPhotos.length === maxPhotos ? 'Proses Foto' : `Pilih ${maxPhotos} Foto`}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right side: Live Preview */}
      <div className="flex flex-col items-center justify-center bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-zinc-200 shadow-lg md:shadow-xl w-full sm:w-[320px] md:w-[340px] lg:w-[380px] xl:w-[450px] mx-auto flex-none md:sticky md:top-0 h-fit max-h-[50vh] md:max-h-[85vh] order-1 md:order-2 mb-4 md:mb-0">
        <h3 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6 flex items-center gap-2 text-teks-gelap">
          <ImageIcon className="w-5 h-5 text-merah-merdeka" />
          Pratinjau Hasil
        </h3>
        
        {/* The Frame Container */}
        <div className="relative shadow-md overflow-hidden rounded-sm bg-white inline-block border border-zinc-100">
          <img 
            src={`/src/assets/images/${selectedFrame}`} 
            alt="Frame Overlay" 
            className="relative z-10 w-auto h-auto max-w-full max-h-[50vh] lg:max-h-[65vh] pointer-events-none drop-shadow-sm block"
          />

          {/* Background Photos */}
          {frameConfig?.holes.map((hole, index) => {
            const photoSrc = selectedPhotos[index];
            
            // Calculate percentages so they match exactly with the frame image size
            const left = `${(hole.x / frameConfig.width) * 100}%`;
            const top = `${(hole.y / frameConfig.height) * 100}%`;
            const width = `${(hole.width / frameConfig.width) * 100}%`;
            const height = `${(hole.height / frameConfig.height) * 100}%`;
            
            // Adding a slight bleed (e.g. 0.5%) to avoid thin gap lines
            const bleed = 0.5;
            
            return (
              <div 
                key={`hole-${index}`}
                onClick={() => photoSrc && handleToggle(photoSrc)}
                className={`absolute z-0 bg-zinc-100 flex items-center justify-center overflow-hidden transition-all group ${photoSrc ? 'cursor-pointer hover:ring-2 hover:ring-red-500 hover:z-20' : ''}`}
                style={{ 
                  left: `calc(${left} - ${bleed}%)`, 
                  top: `calc(${top} - ${bleed}%)`, 
                  width: `calc(${width} + ${bleed * 2}%)`, 
                  height: `calc(${height} + ${bleed * 2}%)` 
                }}
              >
                {photoSrc ? (
                  <>
                    <img src={photoSrc} className="w-full h-full object-cover group-hover:brightness-50 transition-all" alt={`Preview ${index+1}`} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold bg-red-600 px-3 py-1.5 rounded-full shadow-lg">Lepas</span>
                    </div>
                  </>
                ) : (
                  <span className="text-zinc-400 font-bold opacity-50 text-xl lg:text-2xl">{index + 1}</span>
                )}
              </div>
            );
          })}
        </div>
        
        <p className="text-xs text-zinc-500 mt-4 lg:mt-6 text-center">
          Klik foto pada pratinjau untuk melepasnya.
        </p>
      </div>
    </div>
  );
}
