const ICONS = {
  coverage: [
    'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
    'M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  ],
  trips: [
    'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  ],
  bookings: [
    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-5 7h3m-3 4h3m-6-4h.01M9 16h.01',
  ],
  revenue: [
    'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  ],
};

function StatCard({ label, value, valueClass = '', tile, paths }) {
  return (
    <div className="v-glass p-5 flex items-center justify-between">
      <div>
        <p className="v-stat-label">{label}</p>

        <h4 className={['v-stat-value', valueClass, 'mt-1'].filter(Boolean).join(' ')}>{value}</h4>
      </div>

      <div className={`v-icon-tile v-icon-tile--${tile}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {paths.map((d) => (
            <path key={d} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="التغطية الجغرافية"
        value={`${stats.destinations_coverage} وجهة`}
        tile="cyan"
        paths={ICONS.coverage}
      />
      <StatCard
        label="الرحلات النشطة"
        value={`${stats.total_trips} رحلة مبرمجة`}
        tile="violet"
        paths={ICONS.trips}
      />
      <StatCard
        label="الحجوزات المؤكدة"
        value={`${stats.active_bookings} حجز`}
        tile="emerald"
        paths={ICONS.bookings}
      />
      <StatCard
        label="العائدات الإجمالية"
        value={`$${Number(stats.total_revenue).toLocaleString()}`}
        valueClass="v-stat-value--money"
        tile="amber"
        paths={ICONS.revenue}
      />
    </div>
  );
}
