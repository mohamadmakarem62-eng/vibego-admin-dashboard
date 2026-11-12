function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold v-label mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function DestinationFormModal({
  isEditing,
  formData,
  imagePreview,
  onFieldChange,
  onImageChange,
  onSubmit,
  onClose,
}) {
  return (
    <div className="v-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="v-modal w-full max-w-lg overflow-hidden">
        <div className="v-modal-head px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold v-ink">
            {isEditing ? 'تعديل بيانات الوجهة السياحية' : 'إضافة وجهة سياحية جديدة'}
          </h3>

          <button onClick={onClose} className="v-close font-bold text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="اسم المدينة / الوجهة *">
              <input
                type="text"
                required
                className="v-input text-sm"
                value={formData.city_name}
                onChange={(e) => onFieldChange('city_name', e.target.value)}
              />
            </Field>

            <Field label="الدولة التابعة لها *">
              <input
                type="text"
                required
                className="v-input text-sm"
                value={formData.country}
                onChange={(e) => onFieldChange('country', e.target.value)}
              />
            </Field>
          </div>

          {/* صورة الوجهة */}
          <div>
            <label className="block text-sm font-semibold v-label mb-2">صورة الوجهة</label>

            <label className="v-dropzone block h-44 w-full cursor-pointer overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center v-faint">
                  <span className="text-3xl mb-2">🖼️</span>

                  <span className="text-sm font-medium">اختر صورة من مجلد public/destinations</span>

                  <span className="text-xs mt-1">JPG / PNG / WEBP</span>
                </div>
              )}

              <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
            </label>
          </div>

          {/* الوصف */}
          <Field label="شرح وصفي عن الوجهة الجغرافية">
            <textarea
              rows="3"
              className="v-input text-sm"
              value={formData.description}
              onChange={(e) => onFieldChange('description', e.target.value)}
            />
          </Field>

          {/* الإحداثيات */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="خط العرض (Latitude)">
              <input
                type="number"
                step="any"
                className="v-input text-sm font-mono"
                value={formData.latitude}
                onChange={(e) => onFieldChange('latitude', e.target.value)}
              />
            </Field>

            <Field label="خط الطول (Longitude)">
              <input
                type="number"
                step="any"
                className="v-input text-sm font-mono"
                value={formData.longitude}
                onChange={(e) => onFieldChange('longitude', e.target.value)}
              />
            </Field>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_featured"
              className="w-4 h-4 v-check"
              checked={formData.is_featured}
              onChange={(e) => onFieldChange('is_featured', e.target.checked)}
            />

            <label htmlFor="is_featured" className="text-sm font-medium v-ink-2 select-none">
              تمييز الوجهة وعرضها كاقتراح مفضل في الصفحة الرئيسية
            </label>
          </div>

          {/* الأزرار */}
          <div className="pt-4 v-divider-top flex justify-end gap-2">
            <button type="button" onClick={onClose} className="v-btn v-btn-ghost text-sm">
              إلغاء
            </button>

            <button type="submit" className="v-btn v-btn-primary text-sm">
              حفظ وتخزين
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
