import { getDestinationImageSrc } from '../../utils/destinationImages';

export default function DestinationRow({ destination, onViewDetails, onEdit, onDelete }) {
  const imageSrc = getDestinationImageSrc(destination);

  return (
    <tr className="v-row">
      {/* الصورة + المعلومات */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden v-thumb flex-shrink-0">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={destination.city_name || destination.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center v-faint text-xl">
                🖼️
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="text-sm font-bold v-ink">
              {destination.city_name || destination.name}
            </div>

            <div className="text-xs v-muted mt-1">{destination.country}</div>

            <div className="text-xs v-faint mt-1 truncate max-w-[220px]">
              {destination.description || 'لا يوجد وصف مضاف'}
            </div>
          </div>
        </div>
      </td>

      {/* الدولة */}
      <td className="px-4 py-3 whitespace-nowrap text-sm v-muted">{destination.country}</td>

      {/* المميزات */}
      <td className="px-4 py-3 whitespace-nowrap">
        {destination.is_featured ? (
          <span className="v-badge v-badge--warn">مفضلة 🔥</span>
        ) : (
          <span className="v-badge v-badge--muted">وجهة عادية</span>
        )}
      </td>

      {/* الإحداثيات */}
      <td className="px-4 py-3 whitespace-nowrap text-xs v-muted font-mono">
        {destination.latitude && destination.longitude
          ? `${destination.latitude} , ${destination.longitude}`
          : 'غير مضافة'}
      </td>

      {/* الخيارات */}
      <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
        <div className="flex items-center justify-center gap-1.5">
          <button onClick={() => onViewDetails(destination.id)} className="v-btn-sm v-btn-sm--ok">
            الطقس ☁️
          </button>

          <button onClick={() => onEdit(destination)} className="v-btn-sm v-btn-sm--info">
            تعديل
          </button>

          <button onClick={() => onDelete(destination.id)} className="v-btn-sm v-btn-sm--bad">
            حذف
          </button>
        </div>
      </td>
    </tr>
  );
}
