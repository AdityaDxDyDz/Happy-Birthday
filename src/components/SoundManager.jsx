import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

import homeSong from '../assets/Khat (Unreleased Verse) 💌 Navjot Ahuja Heartfelt Status 🎶.mp3';
import loveLetterSong from '../assets/Ishq naina tere .... Instagram viral version song @Rb.10-Mysterious.mp3';
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
      audioRef.current.volume = 0.2; // Sets low volume (20%)
    } else {
      audioRef.current.pause();
      audioRef.current.src = currentTrack;
      audioRef.current.volume = 0.2; // Keeps low volume on route change
    }

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const enableAudio = () => {
          if (audioRef.current) {
            audioRef.current.volume = 0.2;
            audioRef.current.play();
          }
          window.removeEventListener('click', enableAudio);
          window.removeEventListener('touchstart', enableAudio);
        };
        window.addEventListener('click', enableAudio);
        window.addEventListener('touchstart', enableAudio);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [location.pathname]);

  return null;
};

export default SoundManager;