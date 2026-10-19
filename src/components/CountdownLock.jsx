import React, { useState, useEffect, useRef } from 'react';
import countdownSong from '../assets/countdownSong.mp3'; // Add your countdown track here

const CountdownLock = ({ onUnlock }) => {
  const targetDate = new Date('2026-10-20T03:00:59+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [btnPos, setBtnPos] = useState({ top: '80%', left: '50%' });
  const [toast, setToast] = useState('');
  const audioRef = useRef(null);

  // Background audio during countdown lock
  useEffect(() => {
    audioRef.current = new Audio(countdownSong);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2; // Low volume (20%)

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
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        if (audioRef.current) audioRef.current.pause();
        onUnlock();
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onUnlock]);

  const handleHover = () => {
    const randomTop = Math.floor(Math.random() * 50 + 20) + '%';
    const randomLeft = Math.floor(Math.random() * 60 + 20) + '%';
    setBtnPos({ top: randomTop, left: randomLeft });
  };

  const handleClick = () => {
    setToast("Wait ma'am, until the countdown ends! 🤫❤️");
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-[#8b0000] text-white flex flex-col items-center justify-center p-6 select-none">
      
      {/* Toast Alert Header */}
      <div className="h-12 mb-4 flex items-center justify-center">
        {toast && (
          <div className="bg-white text-[#8b0000] font-bold px-6 py-2 rounded-full shadow-2xl border-2 border-[#f1a5b1] text-sm md:text-base animate-bounce">
            {toast}
          </div>
        )}
      </div>

      {/* Spacious Outer Card Box */}
      <div className="bg-[#a31414] border-2 border-[#f1a5b1] rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl relative z-10">
        <h2 className="font-dancingScript text-4xl md:text-6xl text-[#ffebee] mb-4 drop-shadow-md">
          Hold On, Dear Preets!
        </h2>
        <p className="font-sriracha text-base md:text-xl text-[#ffcdd2] mb-10 tracking-wide">
          Your special surprise unlocks in:
        </p>

        {/* Inner Time Boxes */}
        <div className="grid grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'DAYS', val: timeLeft.days },
            { label: 'HOURS', val: timeLeft.hours },
            { label: 'MINS', val: timeLeft.minutes },
            { label: 'SECS', val: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#6b0000] py-5 px-3 md:py-6 rounded-2xl border border-[#d13852] shadow-inner flex flex-col items-center justify-center">
              <span className="block text-3xl md:text-5xl font-bold font-mono text-white tracking-wider">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs text-[#ffcdd2] font-semibold tracking-widest mt-2">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Runaway Open Button */}
      <button
        onMouseEnter={handleHover}
        onTouchStart={handleHover}
        onClick={handleClick}
        style={{
          position: 'fixed',
          top: btnPos.top,
          left: btnPos.left,
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.2s ease-out',
        }}
        className="z-50 bg-white hover:bg-[#fff5f6] text-[#8b0000] font-bold px-8 py-3 rounded-full shadow-2xl border-2 border-[#f1a5b1] cursor-pointer text-lg font-sriracha tracking-wide"
      >
        Open ✨
      </button>
    </div>
  );
};

export default CountdownLock;