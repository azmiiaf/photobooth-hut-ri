import { create } from 'zustand'
import { FRAME_CONFIGS } from '../lib/frameConfigs'

export const usePhotoboothStore = create((set) => ({
  status: 'Idle', // 'Idle' | 'FrameSelection' | 'Capturing' | 'Selecting' | 'Composing' | 'Uploading' | 'Completed'
  photos: [], // Array of 8 photo blobs/base64
  selectedPhotos: [], // Array of exactly 4 selected photos
  selectedFrame: 'strip1.png', // Default frame
  finalImage: null, // Final composed canvas image
  publicUrl: null, // Supabase public URL
  uploadedFileName: null, // Unique file name in Supabase

  setStatus: (status) => set({ status }),
  
  addPhoto: (photo) => set((state) => ({ 
    photos: [...state.photos, photo] 
  })),
  
  clearPhotos: () => set({ photos: [], selectedPhotos: [], finalImage: null, publicUrl: null }),
  
  togglePhotoSelection: (photo) => set((state) => {
    const isSelected = state.selectedPhotos.includes(photo);
    if (isSelected) {
      return { selectedPhotos: state.selectedPhotos.filter(p => p !== photo) };
    }
    
    const maxPhotos = FRAME_CONFIGS[state.selectedFrame]?.maxPhotos || 4;
    
    if (state.selectedPhotos.length < maxPhotos) {
      return { selectedPhotos: [...state.selectedPhotos, photo] };
    }
    return state;
  }),

  setSelectedFrame: (frame) => set({ selectedFrame: frame }),
  
  setFinalImage: (image) => set({ finalImage: image }),
  
  setPublicUrl: (url) => set({ publicUrl: url }),

  setUploadedFileName: (fileName) => set({ uploadedFileName: fileName }),

  resetSession: () => set({
    status: 'Idle',
    photos: [],
    selectedPhotos: [],
    finalImage: null,
    publicUrl: null,
    uploadedFileName: null
  })
}))
