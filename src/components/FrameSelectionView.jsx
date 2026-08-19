import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronRight, Clock } from 'lucide-react';
import { usePhotoboothStore } from '../store/usePhotoboothStore';
import { useAudio } from '../hooks/useAudio';

const FRAMES = [
  { id: 'strip1.png', label: 'Frame 1' },
  { id: 'strip2.png', label: 'Frame 2' },
  { id: 'strip3.png', label: 'Frame 3' },
  { id: 'strip4.png', label: 'Frame 4' },
  { id: 'strip5.png', label: 'Frame 5' },
  { id: 'strip6.png', label: 'Frame 6' },
  { id: 'strip7.png', label: 'Frame 7' },
];

export default function FrameSelectionView() {
  const { selectedFrame, setSelectedFrame, setStatus } = usePhotoboothStore();
  const { playClick } = useAudio();
  const [timeLeft, setTimeLeft] = useState(40);
  const [timerSlot, setTimerSlot] = useState(null);

  useEffect(() => {
    setTimerSlot(document.getElementById('header-timer-slot'));
  }, []);

  const handleNext = () => {
    playClick();
    setStatus('Capturing');
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSelectFrame = (frameId) => {
    playClick();
    setSelectedFrame(frameId);
  };

  const timerBadge = (
    <div className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-full shadow-lg">
      <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-zinc-500'}`} />
      <span className={`font-bold text-lg ${timeLeft <= 10 ? 'text-red-500' : 'text-teks-gelap'}`}>
        {timeLeft}s
      </span>
    </div>
  );

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Timer Badge */}
      {timerSlot && createPortal(timerBadge, timerSlot)}

      <div className="flex-none text-center space-y-1 lg:space-y-2">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Pilih Frame Favoritmu</h2>
        <p className="text-zinc-600 text-sm md:text-base">Pilih salah satu desain frame edisi spesial kemerdekaan di bawah ini.</p>
      </div>

      <div className="flex-1 min-h-0 w-full flex items-center justify-center relative">
        {/* Horizontal scroll for all devices to prevent any vertical page scroll */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-8 w-full h-full max-h-[60vh] py-4 px-4 lg:px-8 hide-scrollbar items-center">
          {FRAMES.map((frame) => (
            <button
              key={frame.id}
              onClick={() => handleSelectFrame(frame.id)}
              className={`flex-none h-full max-w-[80vw] aspect-[1/2.5] snap-center relative group overflow-hidden rounded-xl border-4 transition-all duration-300 ${
                selectedFrame === frame.id 
                  ? 'border-merah-merdeka shadow-lg shadow-merah-merdeka/20 scale-100 md:scale-105' 
                  : 'border-zinc-200 hover:border-zinc-400 shadow-sm opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-full h-full bg-zinc-100 relative p-2 flex items-center justify-center">
                <img 
                  src={`/src/assets/images/${frame.id}`} 
                  alt={frame.label}
                  className="w-full h-full object-contain drop-shadow-md"
                />
                {selectedFrame === frame.id && (
                  <div className="absolute inset-0 bg-merah-merdeka/20 flex items-center justify-center">
                    <div className="bg-merah-merdeka text-white p-2 md:p-3 rounded-full shadow-lg">
                      <Check className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                  </div>
                )}
              </div>
              <div className={`absolute bottom-0 w-full p-2 text-xs md:text-sm font-medium ${selectedFrame === frame.id ? 'bg-merah-merdeka text-white' : 'bg-white/90 backdrop-blur text-zinc-700'}`}>
                {frame.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-none w-full px-6 flex justify-center pb-4">
        <button
          onClick={handleNext}
          className="px-8 py-3 md:py-4 w-full md:w-auto md:min-w-[300px] bg-merah-merdeka hover:bg-red-700 text-white font-bold rounded-full transition-all active:scale-95 shadow-2xl shadow-merah-merdeka/40 text-lg flex justify-center items-center gap-2"
        >
          Lanjut ke Kamera
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
