import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, ArrowUpRight, User, 
  Shield, LogOut, Rocket,  CheckCircle2 
} from 'lucide-react';

// ============================================================
// استایل‌ها
// ============================================================
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap');
  
  * { box-sizing: border-box; }
  body { background: #000; margin: 0; }
  
  .liquid-glass {
    background: rgba(255,255,255,0.01);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
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
  
  .font-heading {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
  }
  
  .font-body {
    font-family: 'Barlow', sans-serif;
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  @keyframes confetti-fall {
    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  
  .confetti {
    position: absolute;
    animation: confetti-fall linear forwards;
    pointer-events: none;
  }
`;

// ============================================================
// تابع بررسی قدرت رمز عبور
// ============================================================
const checkPasswordStrength = (password: string) => {
  let strength = 0;
  const feedback = [];

  if (password.length === 0) {
    return { strength: 0, label: '', color: '', feedback: [] };
  }

  if (password.length >= 8) {
    strength += 1;
    feedback.push('✓ حداقل 8 کاراکتر');
  } else {
    feedback.push('✗ حداقل 8 کاراکتر نیاز است');
  }

  if (/[A-Z]/.test(password)) {
    strength += 1;
    feedback.push('✓ حرف بزرگ');
  } else {
    feedback.push('✗ حرف بزرگ (A-Z)');
  }

  if (/[a-z]/.test(password)) {
    strength += 1;
    feedback.push('✓ حرف کوچک');
  } else {
    feedback.push('✗ حرف کوچک (a-z)');
  }

  if (/[0-9]/.test(password)) {
    strength += 1;
    feedback.push('✓ عدد');
  } else {
    feedback.push('✗ عدد (0-9)');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 1;
    feedback.push('✓ کاراکتر خاص (!@#$)');
  } else {
    feedback.push('✗ کاراکتر خاص (!@#$)');
  }

  let label, color;
  if (strength <= 2) {
    label = 'ضعیف';
    color = '#ef4444';
  } else if (strength <= 3) {
    label = 'متوسط';
    color = '#f59e0b';
  } else if (strength <= 4) {
    label = 'خوب';
    color = '#3b82f6';
  } else {
    label = 'قوی';
    color = '#10b981';
  }

  return { strength, label, color, feedback };
};

// ============================================================
// کامپوننت ستاره‌ها
// ============================================================
const StarField = () => {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// کامپوننت ویدیو پس‌زمینه
// ============================================================
const BackgroundVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number | null = null;
    let currentOpacity = 0;
    const FADE_MS = 500;

    const fadeTo = (target: number) => {
      if (rafId) cancelAnimationFrame(rafId);
      const startOpacity = currentOpacity;
      const startTime = performance.now();

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / FADE_MS, 1);
        currentOpacity = startOpacity + (target - startOpacity) * progress;
        setOpacity(currentOpacity);

        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        }
      };
      rafId = requestAnimationFrame(animate);
    };

    video.addEventListener('loadeddata', () => {
      video.play().catch(() => {});
      fadeTo(1);
    });

    video.addEventListener('ended', () => {
      fadeTo(0);
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        fadeTo(1);
      }, 100);
    });

    video.play().then(() => fadeTo(1)).catch(() => setOpacity(1));

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      loop
      className="absolute inset-0 w-full h-full object-cover"
      style={{ opacity }}
      src={src}
    />
  );
};

// ============================================================
// کامپوننت Confetti
// ============================================================
const Confetti = () => {
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
    color: ['#fff', '#ffd700', '#ff6b6b', '#4ecdc4', '#a78bfa'][Math.floor(Math.random() * 5)],
    size: Math.random() * 8 + 4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// صفحه اصلی
// ============================================================
export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'success'>('login');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
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

  const handleLoginSuccess = (email: string, name: string) => {
    setUserEmail(email);
    setUserName(name);
    setCurrentPage('success');
  };

  const handleLogout = () => {
    setCurrentPage('login');
    setUserEmail('');
    setUserName('');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <BackgroundVideo src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4" />
      <StarField />

      <AnimatePresence mode="wait">
        {currentPage === 'login' ? (
          <LoginPage key="login" onLoginSuccess={handleLoginSuccess} />
        ) : (
          <SuccessPage 
            key="success" 
            userEmail={userEmail} 
            userName={userName}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// صفحه لاگین
// ============================================================
const LoginPage = ({ onLoginSuccess }: { onLoginSuccess: (email: string, name: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = checkPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const name = email.split('@')[0] || 'کاربر';
      onLoginSuccess(email, name);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 flex items-center justify-center min-h-screen p-4"
    >
      <motion.div
        initial={{ y: 30, filter: 'blur(15px)' }}
        animate={{ y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="flex justify-center mb-8"
        >
          <div className="liquid-glass w-16 h-16 flex items-center justify-center">
            <span className="text-4xl text-white font-heading">
              <img src="../src/assets/react.svg" alt="" />
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="liquid-glass !rounded-[2rem] p-8"
        >
          <h1 className="text-4xl text-white font-heading text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-amber-400 text-sm text-center mb-8 font-body">
            وارد حساب کاربری خود شوید
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-white/60 mb-2 font-body">ایمیل</label>
              <div className="liquid-glass !rounded-xl">
                <div className="flex items-center h-14 px-4">
                  <Mail size={18} className="text-white/40 flex-shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="flex-1 bg-transparent border-none outline-none text-white pl-3 font-body text-lg sm:text-2xl"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-2 font-body">رمز عبور</label>
              <div className="liquid-glass !rounded-xl">
                <div className="flex items-center h-12 sm:h-14 px-3 sm:px-4">
                  <Lock size={18} className="text-white/40 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent border-none outline-none text-white pl-2 sm:pl-3 text-base sm:text-2xl font-body"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/40 hover:text-white p-2 sm:p-0 hover:bg-white/10 rounded-full transition-colors flex-shrink-0 ml-1"
                    aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
                  >
                    {showPassword ? <EyeOff size={20} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={20} className="sm:w-[18px] sm:h-[18px]" />}
                  </button>
                </div>
              </div>

              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: passwordStrength.color }}
                      />
                    </div>
                    <span 
                      className="text-xs font-body font-medium min-w-[50px] text-right"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-xs font-body">
                    {passwordStrength.feedback.map((item, index) => (
                      <div
                        key={index}
                        className={`${item.startsWith('✓') ? 'text-green-400' : 'text-white/40'}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 liquid-glass !rounded-full flex items-center justify-center gap-2 text-white font-body font-medium"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Rocket size={18} />
                  </motion.div>
                  <span>در حال ورود...</span>
                </>
              ) : (
                <>
                  <span>ورود به حساب</span>
                  <ArrowUpRight size={18} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// صفحه موفقیت
// ============================================================
const SuccessPage = ({ 
  userEmail, 
  userName,
  onLogout 
}: { 
  userEmail: string;
  userName: string;
  onLogout: () => void;
}) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 flex items-center justify-center min-h-screen p-4"
    >
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.8, filter: 'blur(20px)' }}
        animate={{ scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', duration: 0.8 }}
          className="flex justify-center mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <CheckCircle2 size={48} className="text-green-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl text-white font-heading mb-4">
            خوش آمدید!
          </h1>
          <p className="text-white/80 text-lg font-body">
            <span className="font-semibold text-white">{userName}</span>، شما با موفقیت وارد شدید
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="liquid-glass !rounded-[2rem] p-6 space-y-4 mb-6"
        >
          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-white/50 font-body">نام کاربری</div>
              <div className="text-white font-body font-medium">{userName}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Mail size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-white/50 font-body">ایمیل</div>
              <div className="text-white font-body font-medium">{userEmail}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-white/50 font-body">وضعیت</div>
              <div className="text-green-400 font-body font-medium">✓ فعال و ایمن</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 h-12 liquid-glass !rounded-full flex items-center justify-center gap-2 text-white font-body font-medium"
          >
            <Rocket size={18} />
            <span>شروع کاوش</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="flex-1 h-12 liquid-glass !rounded-full flex items-center justify-center gap-2 text-white font-body font-medium"
          >
            <LogOut size={18} />
            <span>خروج</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};