import { useState, useEffect } from 'react';
import API from '../services/api';
import { getImageUrl, getLocalImagePath, saveLocalImagePath } from '../utils/destinationImages';
import DestinationsHeader from '../components/destinations/DestinationsHeader';
import StatsCards from '../components/destinations/StatsCards';
import DestinationsTable from '../components/destinations/DestinationsTable';
import DestinationFormModal from '../components/destinations/DestinationFormModal';
import DestinationDetailsModal from '../components/destinations/DestinationDetailsModal';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [stats, setStats] = useState({
    total_trips: 0,
    active_bookings: 0,
    total_revenue: 0,
    destinations_coverage: 0,
  });

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    city_name: '',
    country: '',
    description: '',
    is_featured: false,
    latitude: '',
    longitude: '',
  });

  const [imagePath, setImagePath] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const [selectedDestinationWeather, setSelectedDestinationWeather] = useState(null);
  const [selectedDestinationMap, setSelectedDestinationMap] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [message, setMessage] = useState({
    text: '',
    type: '',
  });

  useEffect(() => {
    fetchDestinations(currentPage);
    fetchStats();
  }, [currentPage]);

  // جلب الوجهات
  const fetchDestinations = async (page) => {
    setLoading(true);

    try {
      const response = await API.get(`/v1/destinations?page=${page}`);

      if (response.data && response.data.success) {
        setDestinations(response.data.data.data || []);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
        setStats((previousStats) => ({
          ...previousStats,
          destinations_coverage: response.data.data.total || 0,
        }));
      }
    } catch (err) {
      console.error(err);
      showAlert('حدث خطأ أثناء جلب الوجهات السياحية', 'error');
    } finally {
      setLoading(false);
    }
  };

  // جلب الإحصائيات
  const fetchStats = async () => {
    try {
      const response = await API.get('/v1/admin/destinations/stats');

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch {
      console.error('تعذر جلب الإحصائيات');
    }
  };

  // التنبيهات
  const showAlert = (text, type) => {
    setMessage({
      text,
      type,
    });

    setTimeout(() => {
      setMessage({
        text: '',
        type: '',
      });
    }, 4000);
  };

  // فتح نافذة الإضافة
  const openCreateModal = () => {
    setEditId(null);

    setFormData({
      city_name: '',
      country: '',
      description: '',
      is_featured: false,
      latitude: '',
      longitude: '',
    });

    setImagePath('');
    setImagePreview(null);

    setIsFormModalOpen(true);
  };

  // اختيار صورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImagePath(`/destinations/${file.name}`);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // فتح نافذة التعديل
  const openEditModal = (destination) => {
    setEditId(destination.id);

    setFormData({
      city_name: destination.city_name || destination.name || '',
      country: destination.country || '',
      description: destination.description || '',
      is_featured: destination.is_featured == 1 || destination.is_featured === true,
      latitude: destination.latitude || '',
      longitude: destination.longitude || '',
    });

    setImagePath(getLocalImagePath(destination.id) || '');

    setImagePreview(
      getImageUrl(
        getLocalImagePath(destination.id) || destination.image || destination.image_url,
      ) || null,
    );

    setIsFormModalOpen(true);
  };

  // حفظ الإضافة أو التعديل
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      let savedDestinationId = editId;
      const data = {
        ...formData,
        is_featured: formData.is_featured ? 1 : 0,
      };

      if (editId) {
        const response = await API.put(`/v1/admin/destinations/${editId}`, data, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.data.success) {
          savedDestinationId = response.data.data?.id || editId;
          showAlert('تم تحديث بيانات الوجهة السياحية بنجاح', 'success');
        }
      } else {
        const response = await API.post('/v1/admin/destinations', data, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.data.success) {
          savedDestinationId = response.data.data?.id;
          showAlert('تم إضافة الوجهة السياحية الجديدة للنظام', 'success');
        }
      }

      setIsFormModalOpen(false);
      if (savedDestinationId && imagePath) {
        saveLocalImagePath(savedDestinationId, imagePath);
      }
      setImagePath('');
      setImagePreview(null);

      fetchDestinations(currentPage);
      fetchStats();
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data.errors) {
        showAlert(Object.values(err.response.data.errors)[0][0], 'error');
      } else {
        showAlert(
          err.response?.data?.message || 'فشلت العملية، تحقق من الحقول والصلاحيات',
          'error',
        );
      }
    }
  };

  // حذف وجهة
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد تماماً من حذف هذه الوجهة السياحية؟')) {
      try {
        const response = await API.delete(`/v1/admin/destinations/${id}`);

        if (response.data.success) {
          showAlert('تم حذف الوجهة بنجاح من النظام', 'success');

          fetchDestinations(currentPage);
          fetchStats();
        }
      } catch (err) {
        showAlert(err.response?.data?.message || 'لا يمكن إتمام عملية الحذف لسبب تقني', 'error');
      }
    }
  };

  // تفاصيل الطقس والخريطة
  const handleViewDetails = async (id) => {
    setLoadingDetails(true);
    setSelectedDestinationWeather(null);
    setSelectedDestinationMap(null);
    setIsViewModalOpen(true);

    try {
      const weatherRes = await API.get(`/v1/destinations/${id}/weather`);

      setSelectedDestinationWeather(weatherRes.data?.weather);

      const mapRes = await API.get(`/v1/destinations/${id}/map`);

      setSelectedDestinationMap(mapRes.data);
    } catch {
      console.error('لم تكتمل بعض الخدمات الخارجية');
    } finally {
      setLoadingDetails(false);
    }
  };

  // تحديث حقل واحد من نموذج الإضافة/التعديل
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="v-page space-y-6 text-right" dir="rtl">
      <DestinationsHeader onCreate={openCreateModal} />

      {message.text && (
        <div
          className={`v-alert font-medium ${message.type === 'success' ? 'v-alert-ok' : 'v-alert-error'}`}
        >
          {message.text}
        </div>
      )}

      <StatsCards stats={stats} />

      <DestinationsTable
        destinations={destinations}
        loading={loading}
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {isFormModalOpen && (
        <DestinationFormModal
          isEditing={Boolean(editId)}
          formData={formData}
          imagePreview={imagePreview}
          onFieldChange={updateField}
          onImageChange={handleImageChange}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormModalOpen(false)}
        />
      )}

      {isViewModalOpen && (
        <DestinationDetailsModal
          loading={loadingDetails}
          weather={selectedDestinationWeather}
          map={selectedDestinationMap}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
}
