import axios from 'axios';

// وضع التجربة (Demo): بيشتغل المشروع كامل بدون باك إند، ببيانات وهمية.
// بيتفعّل بالأمر: npm run dev:demo  أو  بتعيين VITE_DEMO=true
export const IS_DEMO = import.meta.env.MODE === 'demo' || import.meta.env.VITE_DEMO === 'true';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // الباك إند الوهمي بيتحمّل عند الحاجة فقط، فما بيدخل بحجم النسخة العادية
  ...(IS_DEMO && {
    adapter: (config) => import('./mockApi').then((mock) => mock.default(config)),
  }),
});

// إضافة التوكن تلقائياً قبل إرسال أي طلب
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// التعامل مع الأخطاء وتوجيه المستخدم إذا انتهت الصلاحية
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default API;
