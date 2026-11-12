import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. دالة جلب طلبات التسجيل المعلقة
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/v1/admin/users/pending');

      // حل المشكلة: الباك إند يرسل البيانات مغلّفة داخل الكي "data"
      if (response.data && response.data.success) {
        setRequests(response.data.data); // نمرر response.data.data وليس response.data فقط
      } else {
        setError('فشل في جلب البيانات بالشكل الصحيح من السيرفر');
      }
    } catch (err) {
      setError('حدث خطأ أثناء جلب طلبات التسجيل من السيرفر');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // 2. دالة الموافقة على طلب الحساب
  const handleApprove = async (userId) => {
    setError('');
    setSuccess('');
    try {
      const response = await API.put(`/v1/admin/users/${userId}/status`, { status: 'approved' });

      if (response.data && response.data.success) {
        setSuccess('تم قبول الحساب بنجاح!');
        // إخفاء الحساب من الجدول فوراً
        setRequests((prevRequests) => prevRequests.filter((user) => user.id !== userId));
      } else {
        setError(response.data.message || 'فشل في قبول الحساب');
      }
    } catch (err) {
      setError('فشل في قبول الحساب، يرجى المحاولة لاحقاً');
      console.error(err);
    }
  };

  // 3. دالة رفض طلب الحساب
  const handleReject = async (userId) => {
    setError('');
    setSuccess('');
    try {
      const response = await API.put(`/v1/admin/users/${userId}/status`, { status: 'rejected' });

      if (response.data && response.data.success) {
        setSuccess('تم رفض طلب التسجيل بنجاح.');
        // إخفاء الحساب من الجدول فوراً
        setRequests((prevRequests) => prevRequests.filter((user) => user.id !== userId));
      } else {
        setError(response.data.message || 'فشل في رفض الحساب');
      }
    } catch (err) {
      setError('فشل في رفض الحساب، يرجى المحاولة لاحقاً');
      console.error(err);
    }
  };

  return (
    <div className="v-page space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="v-glass p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="v-title">لوحة التحكم (Dashboard)</h1>
          <p className="v-sub mt-1">إدارة والموافقة على طلبات تسجيل الحسابات الجديدة</p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2">
          <div className="v-pill">الطلبات المعلقة: {requests.length}</div>
          <Link to="/users" className="v-btn v-btn-ghost v-btn--compact text-xs">
            عرض جميع المستخدمين
          </Link>
        </div>
      </div>

      {/* التنبيهات والرسائل */}
      {error && (
        <div role="alert" className="v-alert v-alert-error">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="v-alert v-alert-ok">
          {success}
        </div>
      )}

      {/* جدول عرض البيانات */}
      <div className="v-glass overflow-hidden">
        {loading ? (
          <div className="v-empty">جاري تحميل الطلبات...</div>
        ) : requests.length === 0 ? (
          <div className="v-empty">🎉 لا توجد طلبات تسجيل معلقة حالياً. كل شيء جاهز!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="v-table w-full text-right">
              <thead className="v-thead">
                <tr className="text-sm">
                  <th className="p-4 v-th">الاسم الكامل</th>
                  <th className="p-4 v-th">البريد الإلكتروني</th>
                  <th className="p-4 v-th">نوع الحساب</th>
                  <th className="p-4 v-th text-center">الإجراءات المتخذة</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {requests.map((user) => (
                  <tr key={user.id} className="v-row">
                    <td className="p-4 font-medium v-ink">{user.full_name}</td>
                    <td className="p-4 v-muted">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`v-badge ${
                          user.role === 'admin'
                            ? 'v-badge--admin'
                            : user.role === 'organizer'
                              ? 'v-badge--organizer'
                              : 'v-badge--ok'
                        }`}
                      >
                        {user.role === 'admin'
                          ? 'مدير'
                          : user.role === 'organizer'
                            ? 'منظم رحلات'
                            : 'مسافر'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleApprove(user.id)}
                          className="v-btn-sm v-btn-sm--ok"
                        >
                          قبول
                        </button>
                        <button
                          onClick={() => handleReject(user.id)}
                          className="v-btn-sm v-btn-sm--bad"
                        >
                          رفض
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
