import { useImperativeHandle, useRef } from 'react';
import { PlaneIcon } from './icons';
import './FlightScene.css';

// مولّد أرقام شبه عشوائية بنتيجة ثابتة، حتى تبقى النجوم بنفس أماكنها مع كل render
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seeded(42);
const STARS = Array.from({ length: 48 }, () => ({
  x: rand() * 100,
  y: rand() * 100,
  size: 1 + rand() * 2,
  delay: rand() * 6,
  duration: 3 + rand() * 4,
}));

function PlaneBody() {
  return (
    <>
      <span className="plane-trail" />
      <PlaneIcon className="plane-icon" />
    </>
  );
}

/**
 * خلفية النيون: صورة + نجوم + طائرة تعبر الشاشة بشكل دائم.
 * عبر الـ ref بتعطي دالة takeOff() بتخلّي الطائرة تقلع من مكانها الحالي
 * وبترجّع Promise بيخلص لما تختفي الطائرة عن الشاشة.
 */
export default function FlightScene({ ref }) {
  const idleRef = useRef(null);
  const launchRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      async takeOff() {
        const idle = idleRef.current;
        const launch = launchRef.current;
        if (!idle || !launch || typeof launch.animate !== 'function') return;

        // من يفضّل تقليل الحركة: ننتظر نص ثانية وبنكمّل بدون أنيميشن
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return;
        }

        const W = window.innerWidth;
        const H = window.innerHeight;
        const half = launch.offsetWidth / 2;

        // مكان الطائرة الحالية بالضبط (مركزها)
        const rect = idle.getBoundingClientRect();
        let cx = rect.left + rect.width / 2;
        let cy = rect.top + rect.height / 2;

        // إذا كانت الطائرة خارج الشاشة وقت الضغط، نبدأ من نقطة مريحة
        if (cx < W * 0.05 || cx > W * 0.9 || cy < 0 || cy > H) {
          cx = W * 0.18;
          cy = H * 0.62;
        }

        const x0 = cx - half;
        const y0 = cy - half;
        const dx = W + 260 - x0; // المسافة حتى تخرج كلياً من يمين الشاشة

        const frames = [
          { transform: `translate(${x0}px, ${y0}px) rotate(-10deg) scale(1)` },
          {
            transform: `translate(${x0 + dx * 0.3}px, ${y0 - dx * 0.084}px) rotate(-17deg) scale(1.5)`,
            offset: 0.3,
          },
          { transform: `translate(${x0 + dx}px, ${y0 - dx * 0.55}px) rotate(-32deg) scale(3.2)` },
        ];

        idle.style.visibility = 'hidden';
        launch.style.visibility = 'visible';

        const animation = launch.animate(frames, {
          duration: 1500,
          easing: 'cubic-bezier(0.5, 0, 0.85, 0.45)', // تتسارع تدريجياً متل الإقلاع الحقيقي
          fill: 'forwards',
        });

        try {
          await animation.finished;
        } catch {
          // الأنيميشن انلغى (مثلاً المستخدم غادر الصفحة)، ما في شي منعمله
        }
      },
    }),
    [],
  );

  return (
    <>
      <div className="flight-scene" aria-hidden="true">
        <div className="flight-bg" />
        <div className="flight-shade" />
        <div className="flight-blob flight-blob--cyan" />
        <div className="flight-blob flight-blob--magenta" />

        {STARS.map((star, i) => (
          <span
            key={i}
            className="flight-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              '--delay': `${star.delay}s`,
              '--duration': `${star.duration}s`,
            }}
          />
        ))}

        {/* الطائرة الهادئة: track بيحركها بخط مائل، و bob بيعطيها تمايل خفيف */}
        <div className="plane-track">
          <div className="plane-bob">
            <div ref={idleRef} className="plane">
              <PlaneBody />
            </div>
          </div>
        </div>
      </div>

      {/* طائرة الإقلاع: مخفية لحد ما نناديها، وبتكون فوق كل شي بما فيه الكرت */}
      <div ref={launchRef} className="plane plane--launch" aria-hidden="true">
        <PlaneBody />
      </div>
    </>
  );
}
