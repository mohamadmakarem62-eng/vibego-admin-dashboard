import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { IS_DEMO } from '../services/api';
import FlightScene from '../components/FlightScene';
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  PlaneIcon,
  SpinnerIcon,
} from '../components/icons';
import './login.css';

// تحويل أخطاء السيرفر إلى رسالة واضحة للمستخدم
function getErrorMessage(err) {
  if (!err.response) {
    return 'تعذّر الاتصال بالسيرفر. تأكد من تشغيل الباك إند ثم حاول مجدداً.';
  }
  const validationErrors = err.response.data?.errors;
  if (validationErrors) {
    return Object.values(validationErrors)[0][0];
  }
  return err.response.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
}

export default function Login() {
  const navigate = useNavigate();
  const sceneRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  // idle: جاهز | loading: عم نتحقق من السيرفر | departing: الدخول نجح والطائرة عم تقلع
  const [status, setStatus] = useState('idle');

  const isBusy = status !== 'idle';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isBusy) return;

    setError('');
    setStatus('loading');

    let data;
    try {
      const response = await API.post('/v1/login', { email, password });
      data = response.data?.data;
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus('idle');
      return;
    }

    // التحقق أن الحساب أدمن (التحقق الحقيقي لازم يكون بالباك إند كمان)
    if (data?.user && data.user.role !== 'admin') {
      setError('عذراً، لوحة التحكم مخصصة للمشرفين فقط.');
      setStatus('idle');
      return;
    }

    if (data?.access_token) {
      localStorage.setItem('token', data.access_token);
    }

    // نجح الدخول: الطائرة تقلع، وبس تختفي بننقل المستخدم للداشبورد
    setStatus('departing');
    await sceneRef.current?.takeOff();
    navigate('/dashboard', { replace: true });
  };

  const buttonLabel =
    status === 'loading' ? 'جاري التحقق...' : status === 'departing' ? 'جاري الإقلاع...' : 'دخول';

  return (
    <div className="login-page flex items-center justify-center min-h-screen px-4 py-10" dir="rtl">
      <FlightScene ref={sceneRef} />

      <main
        className={`login-card w-full max-w-md px-7 py-9 sm:px-10 sm:py-11 ${status === 'departing' ? 'is-leaving' : ''}`}
      >
        <Link to="/" className="login-brand" aria-label="VIBEGO - العودة للصفحة الرئيسية">
          VIBEGO
        </Link>

        <h1 className="login-title">تسجيل الدخول</h1>
        <p className="login-sub">لوحة تحكم الإدارة</p>

        {IS_DEMO && (
          <p className="login-demo">وضع تجريبي: ادخل بأي بريد وكلمة مرور، والبيانات كلها وهمية.</p>
        )}

        <div aria-live="polite" className="mt-6 space-y-3 empty:mt-0">
          {error && (
            <div role="alert" className="login-alert login-alert--error">
              {error}
            </div>
          )}
          {status === 'departing' && (
            <div role="status" className="login-alert login-alert--ok">
              تم تسجيل الدخول بنجاح، جاري الانتقال للوحة التحكم...
            </div>
          )}
        </div>

        <form onSubmit={handleLogin} className="mt-7 space-y-5">
          {/* البريد الإلكتروني */}
          <div>
            <label htmlFor="email" className="login-label">
              البريد الإلكتروني
            </label>
            <div className="neon-field relative">
              <MailIcon className="field-icon right-4" />
              <input
                id="email"
                name="email"
                type="email"
                dir="ltr"
                autoComplete="email"
                className="neon-input"
                placeholder="admin@example.com"
                required
                disabled={isBusy}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* كلمة المرور */}
          <div>
            <label htmlFor="password" className="login-label">
              كلمة المرور
            </label>
            <div className="neon-field relative">
              <LockIcon className="field-icon right-4" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                autoComplete="current-password"
                className="neon-input"
                placeholder="••••••••"
                required
                disabled={isBusy}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className={`launch-btn ${status === 'departing' ? 'is-departing' : ''}`}
          >
            <span>{buttonLabel}</span>
            {status === 'loading' ? (
              <SpinnerIcon className="w-5 h-5" />
            ) : (
              <PlaneIcon className="btn-plane" />
            )}
          </button>
        </form>

        <p className="login-foot">
          <LockIcon className="w-3.5 h-3.5" />
          نظام إدارة منصة VIBEGO المحمي
        </p>
      </main>
    </div>
  );
}
