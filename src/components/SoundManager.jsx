import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

import homeSong from '../assets/song1.mp3';
import loveLetterSong from '../assets/song2.mp3';
import testSong from '../assets/song3.mp3';

const soundMap = {
  '/': homeSong,
  '/love-letter': loveLetterSong,
  '/test': testSong,
};

const SoundManager = () => {
  const location = useLocation();
  const audioRef = useRef(null);

  useEffect(() => {
    const currentTrack = soundMap[location.pathname] || homeSong;

    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.2; // 20% low volume
    } else {
      audioRef.current.pause();
      audioRef.current.src = currentTrack;
      audioRef.current.volume = 0.2;
    }

    const startAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    };

    // Attempt direct play
    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: Start music on the first tap/click anywhere on the screen
        window.addEventListener('click', startAudio, { once: true });
        window.addEventListener('touchstart', startAudio, { once: true });
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };
  }, [location.pathname]);

  return null;
};

export default SoundManager;