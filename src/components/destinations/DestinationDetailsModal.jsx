function WeatherTile({ weather }) {
  return (
    <div className="v-tile v-tile--info p-4 flex items-center justify-between">
      <div>
        <span className="text-xs font-bold v-accent">حالة الطقس المباشرة</span>

        <h4 className="text-xl font-bold v-ink mt-1">{weather.city}</h4>

        <p className="text-2xl font-black v-accent mt-2">{weather.temperature}°C</p>

        <p className="text-xs v-muted mt-1">
          يحس كأنه {weather.feels_like}°C • الرطوبة {weather.humidity}%
        </p>

        <p className="text-sm font-semibold v-ink-2 mt-2">{weather.description}</p>
      </div>

      {weather.icon && (
        <img src={weather.icon} alt="Weather Icon" className="w-20 h-20 v-tile-icon rounded-full" />
      )}
    </div>
  );
}

function MapTile({ map }) {
  return (
    <div className="v-tile p-4 space-y-2">
      <span className="text-xs font-bold v-faint block">الموقع المرجعي على الخرائط</span>

      <p className="text-sm font-medium v-ink-2">
        الإحداثيات الحالية:
        <span className="font-mono text-xs mr-2">
          {map.latitude},{map.longitude}
        </span>
      </p>

      <a
        href={map.map_url}
        target="_blank"
        rel="noopener noreferrer"
        className="v-btn v-btn-ghost v-btn--compact mt-3 block text-center w-full text-xs"
      >
        🗺️ فتح الموقع الجغرافي على Google Maps بشكل حي
      </a>
    </div>
  );
}

export default function DestinationDetailsModal({ loading, weather, map, onClose }) {
  return (
    <div className="v-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="v-modal w-full max-w-md overflow-hidden">
        <div className="v-modal-head v-modal-head--ok px-6 py-4 flex justify-between items-center">
          <h3 className="text-base font-bold">الربط الجغرافي والمناخي الخارجي</h3>

          <button onClick={onClose} className="v-close font-bold text-xl">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {loading ? (
            <div className="text-center py-6 text-sm v-muted">
              جاري الاتصال بـ OpenWeatherMap والمزودات الخارجية الحية...
            </div>
          ) : (
            <>
              {weather ? (
                <WeatherTile weather={weather} />
              ) : (
                <div className="text-xs v-alert v-alert-error">
                  لم يتمكن النظام من سحب معلومات الطقس الحالية للمدينة.
                </div>
              )}

              {map && map.map_url ? (
                <MapTile map={map} />
              ) : (
                <div className="text-xs v-alert v-alert-warn">
                  إحداثيات خطوط الطول والعرض غير متوفرة لهذه الوجهة.
                </div>
              )}
            </>
          )}

          <div className="pt-2 flex justify-end">
            <button onClick={onClose} className="v-btn v-btn-ghost text-sm w-full">
              إغلاق النافذة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
