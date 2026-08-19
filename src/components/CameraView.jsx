import React, { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Webcam from 'react-webcam';
import { usePhotoboothStore } from '../store/usePhotoboothStore';
import { Camera, RefreshCw, Clock } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

const TOTAL_SHOTS = 8;
const COUNTDOWN_SECONDS = 5;

export default function CameraView() {
  const webcamRef = useRef(null);
  const { addPhoto, setStatus } = usePhotoboothStore();
  const { playCapture, playClick } = useAudio();
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [idleTimeLeft, setIdleTimeLeft] = useState(15);
  const [timerSlot, setTimerSlot] = useState(null);

  useEffect(() => {
    setTimerSlot(document.getElementById('header-timer-slot'));
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      playCapture();
      addPhoto(imageSrc);
      setShotsTaken(prev => prev + 1);
      
      // Flash effect
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500);
    }
  }, [webcamRef, addPhoto, playCapture]);

  // Handle capture sequence
  useEffect(() => {
    let timer;
    if (isCapturing && shotsTaken < TOTAL_SHOTS) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      } else if (countdown === 0) {
        capture();
        if (shotsTaken + 1 < TOTAL_SHOTS) {
          setCountdown(COUNTDOWN_SECONDS);
        } else {
          setIsCapturing(false);
          setTimeout(() => setStatus('Selecting'), 1000);
        }
      }
    }
    return () => clearTimeout(timer);
  }, [isCapturing, countdown, shotsTaken, capture, setStatus]);

  // Handle idle timer
  useEffect(() => {
    if (isCapturing || shotsTaken > 0) return;
    
    if (idleTimeLeft <= 0) {
      startCapture();
      return;
    }
    const timer = setTimeout(() => setIdleTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [idleTimeLeft, isCapturing, shotsTaken]);

  const startCapture = () => {
    playClick();
    setShotsTaken(0);
    setCountdown(COUNTDOWN_SECONDS);
    setIsCapturing(true);
  };

  const toggleCamera = () => {
    playClick();
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const timerBadge = !isCapturing && shotsTaken === 0 && (
    <div className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-1 rounded-full shadow-sm">
      <Clock className={`w-4 h-4 ${idleTimeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-zinc-500'}`} />
      <span className={`font-bold text-sm ${idleTimeLeft <= 5 ? 'text-red-500' : 'text-teks-gelap'}`}>
        {idleTimeLeft}s
      </span>
    </div>
  );

  return (
    <div className="relative flex-1 flex flex-col items-center w-full max-w-2xl mx-auto space-y-4">
      {/* Idle Timer Badge */}
      {timerSlot && timerBadge && createPortal(timerBadge, timerSlot)}

      <div className="flex justify-between items-center w-full px-2">
        <h3 className="text-xl font-semibold text-teks-gelap">Ambil Foto</h3>
        <p className="text-zinc-500">{shotsTaken} / {TOTAL_SHOTS} Foto</p>
      </div>
      
      <div className="relative w-full aspect-[4/3] bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-300 shadow-xl flex items-center justify-center">
        {/* Flash Overlay */}
        {showFlash && <div className="absolute inset-0 bg-white z-50 flash-animation"></div>}
        
        {/* Countdown Overlay */}
        {isCapturing && countdown > 0 && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40">
            <span className="text-8xl md:text-9xl font-bold text-white drop-shadow-2xl">
              {countdown}
            </span>
          </div>
        )}

        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode, aspectRatio: 4/3 }}
          className="w-full h-full object-cover"
          mirrored={facingMode === "user"}
        />
      </div>

      <div className="flex gap-4 w-full">
        <button 
          onClick={toggleCamera}
          disabled={isCapturing}
          className="p-4 bg-white border border-zinc-300 hover:bg-zinc-100 disabled:opacity-50 text-zinc-700 rounded-full shadow-sm transition-colors flex items-center justify-center flex-shrink-0"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
        
        <button
          onClick={startCapture}
          disabled={isCapturing}
          className="flex-1 py-4 bg-merah-merdeka hover:bg-red-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-bold rounded-full shadow-lg shadow-merah-merdeka/20 transition-all active:scale-95 text-lg flex justify-center items-center gap-2"
        >
          {isCapturing ? 'Sedang Memotret...' : (
            <>
              <Camera className="w-5 h-5" />
              Mulai Auto-Capture
            </>
          )}
        </button>
      </div>
    </div>
  );
}
