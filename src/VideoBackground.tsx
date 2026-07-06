import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// استایل‌های CSS کامل
// ============================================================
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    background: #000;
    overflow: hidden;
  }
  
  .video-bg-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #000;
    overflow: hidden;
  }
  
  .video-fade {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }
  
  /* ============================================================ */
  /* LIQUID GLASS - افکت شیشه‌ای مایع */
  /* ============================================================ */
  .liquid-glass {
    background: rgba(255, 255, 255, 0.01);
    background-blend-mode: luminosity;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    border-radius: 9999px;
  }
  
  .liquid-glass::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.45) 0%,
      rgba(255,255,255,0.15) 20%,
      rgba(255,255,255,0) 40%,
      rgba(255,255,255,0) 60%,
      rgba(255,255,255,0.15) 80%,
      rgba(255,255,255,0.45) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  
  /* نسخه قوی‌تر برای دکمه‌ها */
  .liquid-glass-strong {
    background: rgba(255, 255, 255, 0.05);
    background-blend-mode: luminosity;
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    border: none;
    box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255, 255, 255, 0.15);
    position: relative;
    overflow: hidden;
    border-radius: 9999px;
  }
  
  .liquid-glass-strong::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.5) 0%,
      rgba(255,255,255,0.2) 20%,
      rgba(255,255,255,0) 40%,
      rgba(255,255,255,0) 60%,
      rgba(255,255,255,0.2) 80%,
      rgba(255,255,255,0.5) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  
  /* ============================================================ */
  /* انیمیشن‌ها */
  /* ============================================================ */
  @keyframes twinkle {
    0%, 100% { 
      opacity: 0.3; 
      transform: scale(1); 
    }
    50% { 
      opacity: 1; 
      transform: scale(1.2); 
    }
  }
  
  .star {
    position: absolute;
    background: white;
    border-radius: 50%;
    animation: twinkle ease-in-out infinite;
    pointer-events: none;
  }
  
  @keyframes float-up {
    0% { 
      transform: translateY(100vh) scale(0); 
      opacity: 0; 
    }
    10% { 
      opacity: 0.6; 
    }
    90% { 
      opacity: 0.6; 
    }
    100% { 
      transform: translateY(-10vh) scale(1); 
      opacity: 0; 
    }
  }
  
  .particle {
    position: absolute;
    background: white;
    border-radius: 50%;
    animation: float-up linear infinite;
    pointer-events: none;
  }
  
  /* ============================================================ */
  /* فونت‌ها */
  /* ============================================================ */
  .font-heading {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
  }
  
  .font-body {
    font-family: 'Barlow', sans-serif;
  }
`;

// ============================================================
// کامپوننت ویدیو پس‌زمینه با Fade
// ============================================================
export const BackgroundVideo: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number | null = null;
    let currentOpacity = 0;
    const FADE_MS = 500;
    const FADE_OUT_LEAD = 0.55;
    let fadingOut = false;

    const fadeTo = (target: number) => {
      if (rafId) cancelAnimationFrame(rafId);
      const startOpacity = currentOpacity;
      const startTime = performance.now();

      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / FADE_MS, 1);
        currentOpacity = startOpacity + (target - startOpacity) * progress;
        setOpacity(currentOpacity);

        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        }
      };
      
      rafId = requestAnimationFrame(animate);
    };

    const handleLoaded = () => {
      setOpacity(0);
      currentOpacity = 0;
      video.play().catch(() => {});
      fadeTo(1);
    };

    const handleTimeUpdate = () => {
      if (!fadingOut && video.duration - video.currentTime <= FADE_OUT_LEAD && video.duration > 0) {
        fadingOut = true;
        fadeTo(0);
      }
    };

    const handleEnded = () => {
      setOpacity(0);
      currentOpacity = 0;
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        fadingOut = false;
        fadeTo(1);
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    video.play().then(() => fadeTo(1)).catch(() => setOpacity(1));

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      preload="auto"
      className="video-fade"
      style={{ opacity }}
      src={src}
    />
  );
};

// ============================================================
// کامپوننت ستاره‌ها
// ============================================================
export const StarField: React.FC<{ count?: number }> = ({ count = 60 }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 300,
    top: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 80 + 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-[1]">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// کامپوننت ذرات شناور
// ============================================================
export const FloatingParticles: React.FC<{ count?: number }> = ({ count = 20 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 10,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// کامپوننت Liquid Glass
// ============================================================
export const LiquidGlass: React.FC<{
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
}> = ({ children, className = '', strong = false }) => {
  return (
    <div className={`${strong ? 'liquid-glass-strong' : 'liquid-glass'} ${className}`}>
      {children}
    </div>
  );
};

// ============================================================
// کامپوننت اصلی - پس‌زمینه کامل
// ============================================================
interface VideoBackgroundProps {
  videoSrc?: string;
  showStars?: boolean;
  showParticles?: boolean;
  starCount?: number;
  particleCount?: number;
  children?: React.ReactNode;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4",
  showStars = true,
  showParticles = true,
  starCount = 60,
  particleCount = 20,
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const style = document.createElement('style');
    style.innerHTML = STYLES;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="video-bg-container">
      {/* لایه 1: ویدیو */}
      <BackgroundVideo src={videoSrc} />
      
      {/* لایه 2: ستاره‌ها */}
      {showStars && <StarField count={starCount} />}
      
      {/* لایه 3: ذرات */}
      {showParticles && <FloatingParticles count={particleCount} />}
      
      {/* لایه 4: محتوا */}
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
};

export default VideoBackground;