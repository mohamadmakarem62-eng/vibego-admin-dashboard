import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Outlet,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/login';
import UsersList from './pages/UsersList';
import Destinations from './pages/destinations';
import Landing from './pages/Landing';
import './admin.css';

// 1. مكون حماية المسارات (يمنع الدخول بدون توكن)
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// 2. حماية عكسية: تمنع المستخدم المُسجّل من دخول صفحة الـ Login مجدداً وتوجيهه للداشبورد مباشرة
function GuestRoute({ children }) {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />; // التوجيه الافتراضي المباشر بعد اللوجن
  }
  return children;
}

// مكون الإطار الموحد (Layout) للوحة التحكم
function AdminLayout() {
  const navigate = useNavigate();

  // دالة تسجيل الخروج ومسح التوكن
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token'); // حذف التوكن من المتصفح
      navigate('/login'); // التوجيه الفوري لصفحة اللوجن
    }
  };

  // تنسيق الروابط: الرابط النشط بلون السيان (الستايل بملف admin.css)
  const navClass = ({ isActive }) => `v-navlink ${isActive ? 'is-active' : ''}`;

  return (
    <div className="admin-shell">
      <div className="admin-bg" aria-hidden="true" />

      {/* شريط التنقل العلوي للأدمين */}
      <nav className="v-nav">
        {/* اليسار: الشعار وروابط التنقل */}
        <div className="flex items-center gap-8">
          <h1 className="v-brand">
            VIBEGO<span className="v-brand-tag">Admin</span>
          </h1>
          <div className="flex gap-6 items-center">
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/destinations" className={navClass}>
              Destinations
            </NavLink>
            <NavLink to="/users" className={navClass}>
              Users
            </NavLink>
          </div>
        </div>

        {/* اليمين: زر Logout */}
        <button onClick={handleLogout} className="v-logout">
          <span>Logout</span>
          <span aria-hidden="true">➔</span>
        </button>
      </nav>

      {/* محتوى الصفحات المتغير (كل صفحة بتضبط مسافاتها بنفسها عبر v-page) */}
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* أولاً: صفحة الهبوط تفتح تلقائياً عند الدخول للموقع بدون نيفبار لوحة التحكم */}
        <Route path="/" element={<Landing />} />

        {/* ثانياً: صفحة الـ Login منفصلة تماماً ومحمية */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* ثالثاً: مسارات لوحة التحكم المحمية داخل الـ AdminLayout */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/users" element={<UsersList />} />
        </Route>

        {/* إعادة توجيه أي مسار خاطئ أو غير موجود تلقائياً إلى صفحة الهبوط */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
