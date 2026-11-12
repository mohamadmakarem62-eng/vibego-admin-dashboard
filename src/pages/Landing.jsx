import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-between p-8 overflow-hidden bg-slate-950 select-none">
      {/* الخلفية الثابتة - تقرأ تلقائياً من مجلد public مباشرة */}
      <div
        className="absolute inset-0 bg-cover bg-[center_60%] scale-105"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />

      {/* طبقة حماية لونية (Overlay) لضمان تباين النصوص وتناسق الألوان */}
      <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/20 to-black/80" />

      {/* الجزء العلوي: اسم التطبيق بتنسيق فخم ومتسع */}
      <header className="relative z-10 mt-20 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-[0.25em] text-beige drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] font-sans mr-[-0.25em]">
          VIBEGO
        </h1>
        <p className="text-yellow-400 font-bold tracking-[0.4em] mt-4 text-xs md:text-sm uppercase opacity-90 mr-[-0.4em]">
          Smart Travel & Tourism Portal
        </p>
      </header>

      {/* المنتصف: زر الدخول التفاعلي مع السهم الأنيق */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1">
        <Link
          to="/login"
          className="group bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-12 py-5 rounded-full text-xl shadow-[0_15px_30px_rgba(251,191,36,0.3)] flex items-center gap-4 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        >
          <span>Log in</span>

          {/* سهم متحرك يندفع للأمام عند تمرير الماوس */}
          <svg
            className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>

      {/* تذييل الصفحة بسيط للحفاظ على المظهر العام النظيف */}
      <div className="relative z-10 mb-6 text-white/30 text-xs tracking-widest uppercase">
        © 2026 VIBEGO. All Rights Reserved.
      </div>
    </div>
  );
}
