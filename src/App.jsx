import { usePhotoboothStore } from "./store/usePhotoboothStore";
import { Camera, Image as ImageIcon, Download, Check } from "lucide-react";

// Placeholder components - will be implemented in next steps
import CameraView from "./components/CameraView";
import FrameSelectionView from "./components/FrameSelectionView";
import SelectionView from "./components/SelectionView";
import ComposingView from "./components/ComposingView";
import ResultView from "./components/ResultView";
import DownloadView from "./components/DownloadView";
import { useAudio } from "./hooks/useAudio";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const downloadFileName = urlParams.get("download");

  if (downloadFileName) {
    return <DownloadView fileName={downloadFileName} />;
  }

  const { status, resetSession } = usePhotoboothStore();
  const { playClick } = useAudio();

  const handleStartSession = () => {
    playClick();
    usePhotoboothStore.getState().setStatus("FrameSelection");
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-putih-kalem text-teks-gelap flex flex-col font-sans">
      {/* Header */}
      {status !== "Idle" && (
        <header className="p-4 md:p-6 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              playClick();
              resetSession();
            }}
            role="button"
          >
            <Camera className="w-6 h-6 text-merah-merdeka group-hover:scale-110 transition-transform" />
            <h1 className="text-xl font-bold text-teks-gelap">
              Photobooth <span className="font-light text-zinc-400">|</span> Darma Bakti
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div id="header-timer-slot"></div>
            <div className="text-sm font-medium px-3 py-1 bg-zinc-200 rounded-full text-zinc-700 capitalize">
              {status}
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 md:p-8 lg:px-12 justify-center overflow-y-auto hide-scrollbar">
        {status === "Idle" && (
          <div className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-8 lg:gap-16 animate-in fade-in zoom-in duration-700 py-10 relative w-full mx-auto">
            
            {/* Background Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 lg:left-3/4 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl aspect-square bg-merah-merdeka/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"></div>

            {/* Left Content: Typography & Button */}
            <div className="flex-1 space-y-8 relative z-40 flex flex-col items-center lg:items-start lg:max-w-xl">
              {/* Special Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-sm text-sm font-semibold text-merah-merdeka">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-merah-merdeka"></span>
                </span>
                Edisi Spesial 17 Agustus
              </div>

              {/* Typography */}
              <div className="space-y-4 w-full">
                <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-teks-gelap leading-[1.1] drop-shadow-sm">
                  Abadikan <br className="hidden lg:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-merah-merdeka to-red-600">
                    Momen Kemerdekaan
                  </span>
                </h2>
                <p className="text-zinc-600 max-w-md mx-auto lg:mx-0 text-lg md:text-xl font-medium leading-relaxed">
                  Buat photobooth strip keren ala studio dengan frame spesial dari Karang Taruna Darma Bakti.
                </p>
              </div>

              {/* CTA Button */}
              <div className="relative z-40 w-full max-w-sm mx-auto lg:mx-0 mt-8">
                <button
                  onClick={handleStartSession}
                  className="group relative px-8 py-5 bg-red-600 text-white font-bold rounded-2xl transition-all duration-300 active:scale-95 shadow-2xl overflow-hidden flex items-center gap-3 hover:-translate-y-1 w-full justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-merah-merdeka to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Camera className="w-6 h-6 relative z-10" />
                  <span className="text-xl relative z-10">Mulai Sekarang</span>
                  <div className="absolute right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-10 font-bold">
                    →
                  </div>
                </button>
              </div>
            </div>

            {/* Right Content: Hero Illustration */}
            <div className="flex-1 shrink-0 relative w-full min-h-[400px] lg:min-h-[500px] flex items-center justify-center group cursor-default z-30 mt-12 lg:mt-0">
               {/* Left Frame */}
               <div className="absolute w-32 sm:w-36 lg:w-44 bg-white p-2 pb-10 rounded-md shadow-xl transform -rotate-6 -translate-x-20 lg:-translate-x-28 translate-y-8 border border-zinc-200 z-10 transition-all duration-500 ease-out group-hover:-rotate-12 group-hover:-translate-x-32 group-hover:scale-105">
                 <img src="/images/strip1.webp?v=3" className="w-full h-auto object-contain bg-zinc-100 rounded-sm" alt="Frame 1" />
               </div>
               
               {/* Right Frame */}
               <div className="absolute w-32 sm:w-36 lg:w-44 bg-white p-2 pb-10 rounded-md shadow-xl transform rotate-6 translate-x-20 lg:translate-x-28 translate-y-8 border border-zinc-200 z-10 transition-all duration-500 ease-out group-hover:rotate-12 group-hover:translate-x-32 group-hover:scale-105">
                 <img src="/images/strip2.webp?v=3" className="w-full h-auto object-contain bg-zinc-100 rounded-sm" alt="Frame 2" />
               </div>

               {/* Center Frame */}
               <div className="absolute w-36 sm:w-44 lg:w-56 bg-white p-2 sm:p-3 pb-12 sm:pb-16 rounded-md shadow-2xl transform -translate-y-4 border border-zinc-200 z-20 transition-all duration-500 ease-out group-hover:-translate-y-8 group-hover:scale-110">
                 <img src="/images/strip4.webp?v=3" className="w-full h-auto object-contain bg-zinc-100 rounded-sm" alt="Frame Main" />
               </div>
               
               {/* Center Camera Badge on Main Frame */}
               <div className="absolute z-30 bottom-4 sm:bottom-8 lg:bottom-12 bg-merah-merdeka text-white p-4 sm:p-5 lg:p-6 rounded-full shadow-xl shadow-merah-merdeka/50 border-4 border-white transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                 <Camera className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
               </div>
            </div>

          </div>
        )}

        {status === "FrameSelection" && <FrameSelectionView />}
        {status === "Capturing" && <CameraView />}
        {status === "Selecting" && <SelectionView />}
        {status === "Composing" && <ComposingView />}
        {(status === "Uploading" || status === "Completed") && <ResultView />}
      </main>

      <div className="hidden" aria-hidden="true">
        {['strip1.webp', 'strip2.webp', 'strip3.webp', 'strip4.webp', 'strip5.webp', 'strip6.webp', 'strip7.webp'].map((frame) => (
          <img key={frame} src={`/images/${frame}?v=3`} alt={`preload-${frame}`} decoding="sync" />
        ))}
      </div>
    </div>
  );
}

export default App;
