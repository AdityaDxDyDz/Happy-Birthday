import React, { useState, useEffect, useRef } from 'react';
import countdownSong from '../assets/countdownSong.mp3'; 
import bgImage from '../assets/bg-image.jpg';

const CountdownLock = ({ onUnlock }) => {
  const targetDate = new Date('2026-10-20T23:59:59+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [btnPos, setBtnPos] = useState({ top: '70%', left: '50%' });
  const [toast, setToast] = useState('');
  const audioRef = useRef(null);

  // Force body background to dark red while lock screen is active
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#8b0000';
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  useEffect(() => {
    audioRef.current = new Audio(countdownSong);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const enableAudio = () => {
          if (audioRef.current) {
            audioRef.current.volume = 0.2;
            audioRef.current.play().catch(() => {});
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
    const randomTop = Math.floor(Math.random() * 25 + 60) + '%';
    const randomLeft = Math.floor(Math.random() * 40 + 30) + '%';
    setBtnPos({ top: randomTop, left: randomLeft });
  };

  const handleClick = () => {
    setToast("Wait ma'am, until the countdown ends! 🤫❤️");
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div 
      className="fixed inset-0 w-vw h-vh min-h-screen z-[99999] text-white flex flex-col items-center justify-center p-4 select-none bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundColor: '#8b0000',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        width: '100vw'
      }}
    >
      {/* Dark overlay covering 100% of the viewport */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-4">
        
        {/* Toast Alert Header */}
        <div className="h-12 mb-2 flex items-center justify-center">
          {toast && (
            <div className="bg-white text-[#8b0000] font-bold px-6 py-2 rounded-full shadow-2xl border-2 border-[#f1a5b1] text-sm md:text-base animate-bounce">
              {toast}
            </div>
          )}
        </div>

        {/* Card Container */}
        <div className="bg-[#a31414]/90 border-2 border-[#f1a5b1] rounded-3xl p-6 md:p-10 w-full text-center shadow-2xl backdrop-blur-sm">
          <h2 className="font-dancingScript text-3xl md:text-5xl text-[#ffebee] mb-3 drop-shadow-md">
            Hold On, Dear Preets!
          </h2>
          <p className="font-sriracha text-sm md:text-lg text-[#ffcdd2] mb-8 tracking-wide">
            Your special surprise unlocks in:
          </p>

          {/* Time Boxes */}
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {[
              { label: 'DAYS', val: timeLeft.days },
              { label: 'HOURS', val: timeLeft.hours },
              { label: 'MINS', val: timeLeft.minutes },
              { label: 'SECS', val: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#6b0000] py-4 px-2 md:py-6 rounded-2xl border border-[#d13852] shadow-inner flex flex-col items-center justify-center">
                <span className="block text-2xl md:text-4xl font-bold font-mono text-white tracking-wider">
                  {String(item.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] md:text-xs text-[#ffcdd2] font-semibold tracking-widest mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
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
          transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        className="z-50 bg-white hover:bg-[#fff5f6] text-[#8b0000] font-bold px-8 py-3 rounded-full shadow-2xl border-2 border-[#f1a5b1] cursor-pointer text-lg font-sriracha tracking-wide"
      >
        Open ✨
      </button>
    </div>
  );
};

export default CountdownLock;