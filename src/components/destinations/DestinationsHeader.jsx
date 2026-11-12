export default function DestinationsHeader({ onCreate }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 v-glass p-5">
      <div>
        <h1 className="v-title">إدارة الوجهات السياحية</h1>

        <p className="v-sub mt-1">
          تتبع، إضافة، وتحديث النطاق الجغرافي والربط المناخي المباشر للمنصة
        </p>
      </div>

      <button
        onClick={onCreate}
        className="v-btn v-btn-primary flex items-center justify-center gap-2 text-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        إضافة وجهة جديدة
      </button>
    </div>
  );
}
