import { useCallback, useRef } from 'react';

type SoundType = 'achievement' | 'success' | 'click' | 'add' | 'delete' | 'error';

// Sound frequencies and patterns for different effects
const SOUND_CONFIGS: Record<SoundType, { frequencies: number[]; durations: number[]; type: OscillatorType }> = {
  achievement: {
    frequencies: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6 - triumphant chord
    durations: [100, 100, 100, 200],
    type: 'sine'
  },
  success: {
    frequencies: [440, 554.37, 659.25], // A4, C#5, E5 - pleasant confirmation
    durations: [80, 80, 120],
    type: 'sine'
  },
  click: {
    frequencies: [800],
    durations: [30],
    type: 'square'
  },
  add: {
    frequencies: [400, 600], // Rising tone
    durations: [60, 80],
    type: 'sine'
  },
  delete: {
    frequencies: [400, 300], // Falling tone
    durations: [60, 80],
    type: 'sine'
  },
  error: {
    frequencies: [200, 150],
    durations: [100, 150],
    type: 'sawtooth'
  }
};

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    // Check if sounds are enabled
    const enabled = localStorage.getItem('linkmax_sounds_enabled') !== 'false';
    if (!enabled) return;

    try {
      const ctx = getAudioContext();
      const config = SOUND_CONFIGS[type];
      
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      let startTime = ctx.currentTime;
      
      config.frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(freq, startTime);
        
        // Create envelope
        const duration = config.durations[index] / 1000;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
        
        startTime += duration * 0.7; // Slight overlap for smoother sound
      });
    } catch (error) {
      // Silently fail if audio is not available
      console.debug('Sound effect unavailable:', error);
    }
  }, [getAudioContext]);

  const playAchievement = useCallback(() => playSound('achievement'), [playSound]);
  const playSuccess = useCallback(() => playSound('success'), [playSound]);
  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playAdd = useCallback(() => playSound('add'), [playSound]);
  const playDelete = useCallback(() => playSound('delete'), [playSound]);
  const playError = useCallback(() => playSound('error'), [playSound]);

  const toggleSounds = useCallback((enabled: boolean) => {
    localStorage.setItem('linkmax_sounds_enabled', String(enabled));
  }, []);

  const isSoundsEnabled = useCallback(() => {
    return localStorage.getItem('linkmax_sounds_enabled') !== 'false';
  }, []);

  return {
    playSound,
    playAchievement,
    playSuccess,
    playClick,
    playAdd,
    playDelete,
    playError,
    toggleSounds,
    isSoundsEnabled
  };
}
