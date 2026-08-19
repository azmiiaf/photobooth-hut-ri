import { useCallback } from 'react';

export const useAudio = () => {
  const playSound = useCallback((soundName) => {
    try {
      const audio = new Audio(`/audio/${soundName}.mp3`);
      audio.play().catch(e => console.error("Audio play failed", e));
    } catch (error) {
      console.error("Error creating audio instance:", error);
    }
  }, []);

  const playClick = useCallback(() => playSound('button_click'), [playSound]);
  const playCapture = useCallback(() => playSound('capture'), [playSound]);
  const playSelectionCompleted = useCallback(() => playSound('selection_completed'), [playSound]);

  return { playClick, playCapture, playSelectionCompleted };
};
