import React, { useState, useEffect, useRef } from 'react';
import { Sun, CloudRain, Snowflake, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WEATHER_STATES = ['night', 'snow', 'rain', 'sun'] as const;
type WeatherState = (typeof WEATHER_STATES)[number];

// Star for night sky
interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
  baseAlpha: number;
}

// Cloud blob for sun theme
interface Cloud {
  x: number;
  y: number;
  w: number;
  h: number;
  drift: number;
}

const WeatherSystem = () => {
  const [weather, setWeather] = useState<WeatherState>(() => {
    if (typeof window === 'undefined') return 'night';
    const saved = localStorage.getItem('theme-preference');
    return WEATHER_STATES.includes(saved as WeatherState) ? (saved as WeatherState) : 'night';
  });

  useEffect(() => {
    localStorage.setItem('theme-preference', weather);
  }, [weather]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | undefined;
    let particles: Array<{ x: number; y: number; speed: number; size: number; drift: number }> = [];
    let stars: Star[] = [];
    let clouds: Cloud[] = [];
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initClouds();
    };

    const initStars = () => {
      stars = [];
      const count = 120 + Math.floor(Math.random() * 60);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.85,
          size: Math.random() * 1.5 + 0.5,
          phase: Math.random() * Math.PI * 2,
          baseAlpha: 0.3 + Math.random() * 0.7,
        });
      }
    };

    const initClouds = () => {
      clouds = [];
      const cloudCount = 4;
      for (let i = 0; i < cloudCount; i++) {
        clouds.push({
          x: (Math.random() * canvas.width * 1.2) - canvas.width * 0.1,
          y: canvas.height * (0.05 + Math.random() * 0.35),
          w: 120 + Math.random() * 180,
          h: 40 + Math.random() * 50,
          drift: 0.02 + Math.random() * 0.03,
        });
      }
    };

    const initParticles = () => {
      particles = [];
      const count = weather === 'snow' ? 100 : weather === 'rain' ? 150 : 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: (weather === 'snow' ? 1 : 15) + Math.random() * 5,
          size: (weather === 'snow' ? 2 : 15) + Math.random(),
          drift: (Math.random() - 0.5) * (weather === 'snow' ? 2 : 0),
        });
      }
    };

    const drawNightSky = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      // Stars with twinkle
      stars.forEach((star) => {
        const twinkle = 0.4 + 0.6 * Math.sin(time + star.phase);
        const alpha = star.baseAlpha * twinkle;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Moon (top-right area)
      const moonX = canvas.width * 0.82;
      const moonY = canvas.height * 0.18;
      const moonR = Math.min(canvas.width, canvas.height) * 0.08;

      const moonGradient = ctx.createRadialGradient(
        moonX - moonR * 0.3,
        moonY - moonR * 0.3,
        0,
        moonX,
        moonY,
        moonR
      );
      moonGradient.addColorStop(0, 'rgba(255, 248, 230, 0.98)');
      moonGradient.addColorStop(0.6, 'rgba(240, 235, 220, 0.95)');
      moonGradient.addColorStop(1, 'rgba(220, 215, 200, 0.7)');
      ctx.fillStyle = moonGradient;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // Soft glow around moon
      const glowGradient = ctx.createRadialGradient(
        moonX,
        moonY,
        moonR * 0.5,
        moonX,
        moonY,
        moonR * 2.5
      );
      glowGradient.addColorStop(0, 'rgba(255, 248, 230, 0.15)');
      glowGradient.addColorStop(1, 'rgba(255, 248, 230, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Small crater
      ctx.fillStyle = 'rgba(200, 195, 180, 0.4)';
      ctx.beginPath();
      ctx.arc(moonX + moonR * 0.35, moonY - moonR * 0.2, moonR * 0.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawSunAndClouds = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.008;

      // Sun (top-right)
      const sunX = canvas.width * 0.78;
      const sunY = canvas.height * 0.2;
      const sunR = Math.min(canvas.width, canvas.height) * 0.18;

      const sunGradient = ctx.createRadialGradient(
        sunX,
        sunY,
        0,
        sunX,
        sunY,
        sunR
      );
      sunGradient.addColorStop(0, 'rgba(255, 255, 220, 1)');
      sunGradient.addColorStop(0.4, 'rgba(255, 230, 150, 0.95)');
      sunGradient.addColorStop(0.7, 'rgba(255, 180, 80, 0.4)');
      sunGradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fill();

      // Clouds (soft white ellipses, drifting)
      const isLight = document.documentElement.getAttribute('data-theme') === 'sun' || document.documentElement.getAttribute('data-theme') === 'snow';
      const cloudColor = isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.25)';
      clouds.forEach((c) => {
        const x = (c.x + time * canvas.width * c.drift) % (canvas.width + c.w * 2) - c.w;
        ctx.fillStyle = cloudColor;
        ctx.beginPath();
        ctx.ellipse(x, c.y, c.w * 0.5, c.h * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + c.w * 0.3, c.y - c.h * 0.2, c.w * 0.35, c.h * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + c.w * 0.6, c.y, c.w * 0.4, c.h * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = weather === 'snow' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(100, 150, 255, 0.5)';
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.5)';
      ctx.lineWidth = 1;

      particles.forEach((p) => {
        if (weather === 'snow') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          p.x += p.drift;
          p.y += p.speed;
        } else if (weather === 'rain') {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + p.size);
          ctx.stroke();
          p.y += p.speed;
        }
        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
      });
    };

    const animate = () => {
      if (weather === 'night') {
        drawNightSky();
      } else if (weather === 'sun') {
        drawSunAndClouds();
      } else if (weather === 'snow' || weather === 'rain') {
        renderParticles();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    if (weather === 'snow' || weather === 'rain') initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId !== undefined) cancelAnimationFrame(animationFrameId);
    };
  }, [weather]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', weather);
  }, [weather]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[5] pointer-events-none"
      />
      <AnimatePresence>
        {weather === 'sun' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[4] bg-gradient-to-b from-amber-50/30 via-transparent to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 p-2 rounded-full bg-black/70 backdrop-blur-xl border border-white/10 flex gap-1 shadow-2xl">
        <button
          onClick={() => setWeather('night')}
          className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${weather === 'night' ? 'bg-white/25 text-white shadow-lg' : 'text-white/45 hover:text-white'}`}
          aria-label="Night — Moon & Stars"
        >
          <Moon size={20} />
        </button>
        <button
          onClick={() => setWeather('snow')}
          className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${weather === 'snow' ? 'bg-white/25 text-white shadow-lg' : 'text-white/45 hover:text-white'}`}
          aria-label="Snow"
        >
          <Snowflake size={20} />
        </button>
        <button
          onClick={() => setWeather('rain')}
          className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${weather === 'rain' ? 'bg-white/25 text-white shadow-lg' : 'text-white/45 hover:text-white'}`}
          aria-label="Rain"
        >
          <CloudRain size={20} />
        </button>
        <button
          onClick={() => setWeather('sun')}
          className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${weather === 'sun' ? 'bg-amber-400/30 text-amber-200 shadow-lg shadow-amber-500/20' : 'text-white/45 hover:text-amber-200'}`}
          aria-label="Sun — Sun & Clouds"
        >
          <Sun size={20} />
        </button>
      </div>
    </>
  );
};

export default WeatherSystem;
