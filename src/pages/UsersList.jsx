import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api'; 

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' لعرض الكل، أو 'pending' للعلقين

  // 1. دالة جلب المستخدمين بناءً على الفلتر المختار
  const fetchUsers = async (type = 'all') => {
    try {
      setLoading(true);
      setError('');

      const endpoint = type === 'pending' ? '/v1/admin/users/pending' : '/v1/admin/users/all';
      const response = await API.get(endpoint);

       

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
        console.error('شكل البيانات غير مدعوم');
      }
    } catch (err) {
      setError('حدث خطأ أثناء جلب قائمة المستخدمين من السيرفر');
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. دالة تحديث حالة الحساب (قبول / رفض) المتوافقة مع الـ PUT Route بالباك إند
  const handleUpdateStatus = async (id, newStatus) => {
    if (window.confirm(`هل أنت متأكد من تغيير حالة هذا الحساب؟`)) {
      try {
        const response = await API.put(`/v1/admin/users/${id}/status`, { status: newStatus });
        if (response.status === 200 || response.data.success) {
          setSuccessMessage('تم تحديث حالة المستخدم بنجاح');
          fetchUsers(filter); // إعادة تحديث الجدول فوراً بنفس الفلترة الحالية
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'فشلت عملية تحديث حالة المستخدم');
        console.error(err);
      }
    }
  };

  // 💡 [الحل الجوهري]: استدعاء الدالة عند تحميل المكون وتغيير الفلتر
  useEffect(() => {
    fetchUsers(filter);
  }, [filter]);

  return (
    <div className="v-page space-y-6" dir="rtl">
      {/* الهيدر وأزرار الفلترة والعودة */}
      <div className="v-glass p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="v-title">قائمة جميع المستخدمين</h1>
          <p className="v-sub mt-1">عرض ومتابعة كافة الحسابات والتحكم بالطلبات المعلقة</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`v-btn v-btn-ghost v-btn--compact text-sm ${filter === 'all' ? 'is-on' : ''}`}
          >
            كل الحسابات
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`v-btn v-btn-ghost v-btn--compact text-sm ${filter === 'pending' ? 'is-on--warn' : ''}`}
          >
            قيد الانتظار ⏳
          </button>
          <Link to="/dashboard" className="v-btn v-btn-primary v-btn--compact text-sm">
            العودة للوحة التحكم ←
          </Link>
        </div>
      </div>

      {error && (
        <div role="alert" className="v-alert v-alert-error">
          {error}
        </div>
      )}
      {successMessage && (
        <div role="status" className="v-alert v-alert-ok">
          {successMessage}
        </div>
      )}

      {/* جدول عرض المستخدمين */}
      <div className="v-glass overflow-hidden">
        {loading ? (
          <div className="v-empty">جاري تحميل المستخدمين من السيرفر...</div>
        ) : users.length === 0 ? (
          <div className="v-empty">لا يوجد مستخدمون مسجلون حالياً ضمن هذا الخيار.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="v-table w-full text-right">
              <thead className="v-thead">
                <tr className="text-sm">
                  <th className="p-4 v-th">الرقم الشخصي (ID)</th>
                  <th className="p-4 v-th">الاسم الكامل</th>
                  <th className="p-4 v-th">البريد الإلكتروني</th>
                  <th className="p-4 v-th">نوع الحساب</th>
                  <th className="p-4 v-th">حالة الحساب</th>
                  <th className="p-4 v-th text-center">إجراءات الإدارة</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((user) => (
                  <tr key={user.id} className="v-row">
                    <td className="p-4 font-mono v-faint">#{user.id}</td>
                    <td className="p-4 font-medium v-ink">{user.name || user.full_name}</td>
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
                      <span
                        className={`v-badge ${
                          user.status === 'approved' || user.status === 'active'
                            ? 'v-badge--ok'
                            : user.status === 'pending'
                              ? 'v-badge--warn'
                              : 'v-badge--bad'
                        }`}
                      >
                        {user.status === 'approved' || user.status === 'active'
                          ? 'نشط'
                          : user.status === 'pending'
                            ? 'قيد الانتظار'
                            : 'مرفوض'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {user.status === 'pending' ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(user.id, 'approved')}
                            className="v-btn-sm v-btn-sm--ok"
                          >
                            قبول
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(user.id, 'rejected')}
                            className="v-btn-sm v-btn-sm--bad"
                          >
                            رفض
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs v-faint">لا توجد إجراءات معلقة</span>
                      )}
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
