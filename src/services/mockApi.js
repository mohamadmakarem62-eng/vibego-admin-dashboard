import { AxiosError } from 'axios';

/**
 * باك إند وهمي يشتغل جوا المتصفح (وضع Demo).
 * بيتحمّل فقط لما يكون الوضع demo، وبيرد على نفس الـ endpoints اللي بيستخدمها المشروع
 * بنفس شكل الاستجابة تبع Laravel، فما بنحتاج نغيّر أي صفحة.
 * البيانات بالذاكرة فقط: أي تعديل بيضل لحد ما تعمل Refresh، وبعدها بترجع لحالتها الأولى.
 */

const PAGE_SIZE = 5;
const DEMO_TOKEN = 'demo-token';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------- البيانات الأولية ----------

const seedUsers = () => [
  {
    id: 1,
    full_name: 'مدير النظام',
    email: 'admin@vibego.demo',
    role: 'admin',
    status: 'approved',
  },
  {
    id: 2,
    full_name: 'سارة الخطيب',
    email: 'sara.khatib@example.com',
    role: 'traveler',
    status: 'pending',
  },
  {
    id: 3,
    full_name: 'محمد العلي',
    email: 'mohammad.ali@example.com',
    role: 'organizer',
    status: 'pending',
  },
  {
    id: 4,
    full_name: 'ليلى حداد',
    email: 'layla.haddad@example.com',
    role: 'traveler',
    status: 'approved',
  },
  {
    id: 5,
    full_name: 'أحمد درويش',
    email: 'ahmad.darwish@example.com',
    role: 'organizer',
    status: 'approved',
  },
  {
    id: 6,
    full_name: 'رنا منصور',
    email: 'rana.mansour@example.com',
    role: 'traveler',
    status: 'pending',
  },
  {
    id: 7,
    full_name: 'يزن القاسم',
    email: 'yazan.qassem@example.com',
    role: 'traveler',
    status: 'rejected',
  },
  {
    id: 8,
    full_name: 'هالة صبّاغ',
    email: 'hala.sabbagh@example.com',
    role: 'organizer',
    status: 'pending',
  },
  {
    id: 9,
    full_name: 'عمر النجار',
    email: 'omar.najjar@example.com',
    role: 'traveler',
    status: 'approved',
  },
  {
    id: 10,
    full_name: 'جود الأحمد',
    email: 'joud.ahmad@example.com',
    role: 'traveler',
    status: 'approved',
  },
  {
    id: 11,
    full_name: 'كنان سلوم',
    email: 'kinan.salloum@example.com',
    role: 'organizer',
    status: 'rejected',
  },
  {
    id: 12,
    full_name: 'ديما شحادة',
    email: 'dima.shehadeh@example.com',
    role: 'traveler',
    status: 'approved',
  },
];

const seedDestinations = () => [
  {
    id: 1,
    city_name: 'دبي',
    country: 'الإمارات العربية المتحدة',
    description: 'مدينة المستقبل: أبراج شاهقة وشواطئ ذهبية وتسوّق عالمي.',
    is_featured: 1,
    latitude: 25.2048,
    longitude: 55.2708,
    image: '/demo/dest-1.svg',
  },
  {
    id: 2,
    city_name: 'إسطنبول',
    country: 'تركيا',
    description: 'مدينة بين قارتين، تجمع عبق التاريخ العثماني وحيوية الحاضر.',
    is_featured: 1,
    latitude: 41.0082,
    longitude: 28.9784,
    image: '/demo/dest-2.svg',
  },
  {
    id: 3,
    city_name: 'باريس',
    country: 'فرنسا',
    description: 'عاصمة النور والفن والمطاعم الراقية على ضفاف نهر السين.',
    is_featured: 0,
    latitude: 48.8566,
    longitude: 2.3522,
    image: '/demo/dest-3.svg',
  },
  {
    id: 4,
    city_name: 'القاهرة',
    country: 'مصر',
    description: 'أم الدنيا، حيث الأهرامات والمتاحف وأسواق خان الخليلي.',
    is_featured: 0,
    latitude: 30.0444,
    longitude: 31.2357,
    image: '/demo/dest-4.svg',
  },
  {
    id: 5,
    city_name: 'روما',
    country: 'إيطاليا',
    description: 'المدينة الخالدة: الكولوسيوم والفاتيكان وأزقّة الحجر القديمة.',
    is_featured: 1,
    latitude: 41.9028,
    longitude: 12.4964,
    image: '/demo/dest-5.svg',
  },
  {
    id: 6,
    city_name: 'طوكيو',
    country: 'اليابان',
    description: 'مزيج مدهش من التقنية الحديثة والمعابد التقليدية.',
    is_featured: 0,
    latitude: 35.6762,
    longitude: 139.6503,
    image: '/demo/dest-6.svg',
  },
  {
    id: 7,
    city_name: 'برشلونة',
    country: 'إسبانيا',
    description: 'عمارة غاودي الساحرة وشواطئ المتوسط وحياة الليل.',
    is_featured: 0,
    latitude: 41.3874,
    longitude: 2.1686,
    image: '/demo/dest-7.svg',
  },
  {
    id: 8,
    city_name: 'عمّان',
    country: 'الأردن',
    description: 'عاصمة هادئة قرب البتراء ووادي رم والبحر الميت.',
    is_featured: 0,
    latitude: 31.9454,
    longitude: 35.9284,
    image: '/demo/dest-8.svg',
  },
  {
    id: 9,
    city_name: 'مراكش',
    country: 'المغرب',
    description: 'المدينة الحمراء بأسواقها وقصورها وساحة جامع الفنا.',
    is_featured: 1,
    latitude: 31.6295,
    longitude: -7.9811,
    image: '/demo/dest-9.svg',
  },
  {
    id: 10,
    city_name: 'بالي',
    country: 'إندونيسيا',
    description: 'جزيرة الآلهة: مدرّجات الأرز والمعابد والشواطئ الاستوائية.',
    is_featured: 0,
    latitude: -8.4095,
    longitude: 115.1889,
    image: '/demo/dest-10.svg',
  },
  {
    id: 11,
    city_name: 'أنطاليا',
    country: 'تركيا',
    description: 'ريفييرا تركيا: منتجعات ساحلية وبلدة قديمة على الجرف.',
    is_featured: 0,
    latitude: 36.8969,
    longitude: 30.7133,
    image: '/demo/dest-11.svg',
  },
];

const db = {
  users: seedUsers(),
  destinations: seedDestinations(),
  nextUserId: 100,
  nextDestinationId: 100,
};

// ---------- أدوات مساعدة ----------

function weatherFor(destination) {
  const lat = Math.abs(Number(destination.latitude) || 30);
  const descriptions = ['صافٍ', 'غائم جزئياً', 'مشمس', 'سماء مغيّمة', 'أمطار خفيفة'];
  const temperature = Math.round(34 - lat * 0.45 + (destination.id % 4));
  return {
    city: destination.city_name,
    temperature,
    feels_like: temperature + (destination.id % 2 === 0 ? 1 : -1),
    humidity: 38 + ((destination.id * 7) % 40),
    description: descriptions[destination.id % descriptions.length],
  };
}

function validateDestination(body) {
  const errors = {};
  if (!String(body.city_name || '').trim()) errors.city_name = ['حقل اسم المدينة مطلوب.'];
  if (!String(body.country || '').trim()) errors.country = ['حقل الدولة مطلوب.'];

  const lat = body.latitude === '' || body.latitude == null ? null : Number(body.latitude);
  const lng = body.longitude === '' || body.longitude == null ? null : Number(body.longitude);
  if (lat !== null && (Number.isNaN(lat) || lat < -90 || lat > 90)) {
    errors.latitude = ['خط العرض يجب أن يكون بين -90 و 90.'];
  }
  if (lng !== null && (Number.isNaN(lng) || lng < -180 || lng > 180)) {
    errors.longitude = ['خط الطول يجب أن يكون بين -180 و 180.'];
  }
  return Object.keys(errors).length ? errors : null;
}

function pickDestinationFields(body) {
  return {
    city_name: String(body.city_name).trim(),
    country: String(body.country).trim(),
    description: body.description || '',
    is_featured: body.is_featured ? 1 : 0,
    latitude: body.latitude === '' || body.latitude == null ? null : Number(body.latitude),
    longitude: body.longitude === '' || body.longitude == null ? null : Number(body.longitude),
  };
}

const ok = (data, status = 200) => [status, { success: true, ...data }];
const notFound = () => [404, { success: false, message: 'العنصر المطلوب غير موجود.' }];

// ---------- الـ Routes ----------
// كل handler بيرجّع [status, body]. و admin = true معناها لازم يكون في توكن.

const routes = [
  {
    method: 'post',
    pattern: /^\/v1\/login$/,
    handle: ({ body }) => {
      const email = String(body.email || '').trim();
      const password = String(body.password || '');

      // للتجربة: كلمة المرور "wrong" بتعطي خطأ تحقق
      if (!email || !password || password === 'wrong') {
        return [
          422,
          {
            success: false,
            message: 'بيانات الدخول غير صحيحة.',
            errors: { email: ['البريد الإلكتروني أو كلمة المرور غير صحيحة.'] },
          },
        ];
      }

      // للتجربة: أي بريد يبدأ بـ user بيدخل كحساب مسافر (غير أدمن)
      const role = email.toLowerCase().startsWith('user') ? 'traveler' : 'admin';
      return ok({
        data: {
          access_token: DEMO_TOKEN,
          user: { id: 1, full_name: 'مدير النظام', email, role },
        },
      });
    },
  },

  {
    method: 'get',
    pattern: /^\/v1\/admin\/users\/pending$/,
    admin: true,
    handle: () => ok({ data: db.users.filter((u) => u.status === 'pending') }),
  },

  {
    method: 'get',
    pattern: /^\/v1\/admin\/users\/all$/,
    admin: true,
    handle: () => ok({ data: db.users }),
  },

  {
    method: 'put',
    pattern: /^\/v1\/admin\/users\/(\d+)\/status$/,
    admin: true,
    handle: ({ match, body }) => {
      const user = db.users.find((u) => u.id === Number(match[1]));
      if (!user) return notFound();
      if (!['approved', 'rejected'].includes(body.status)) {
        return [
          422,
          {
            success: false,
            message: 'حالة غير صالحة.',
            errors: { status: ['الحالة المطلوبة غير صالحة.'] },
          },
        ];
      }
      user.status = body.status;
      return ok({ message: 'تم تحديث حالة المستخدم بنجاح', data: user });
    },
  },

  {
    method: 'get',
    pattern: /^\/v1\/destinations$/,
    handle: ({ query }) => {
      const sorted = [...db.destinations].sort((a, b) => b.id - a.id); // الأحدث أولاً
      const total = sorted.length;
      const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
      const page = Math.min(Math.max(1, Number(query.get('page')) || 1), lastPage);
      const start = (page - 1) * PAGE_SIZE;
      return ok({
        data: {
          data: sorted.slice(start, start + PAGE_SIZE),
          current_page: page,
          last_page: lastPage,
          per_page: PAGE_SIZE,
          total,
        },
      });
    },
  },

  {
    method: 'get',
    pattern: /^\/v1\/destinations\/(\d+)\/weather$/,
    handle: ({ match }) => {
      const destination = db.destinations.find((d) => d.id === Number(match[1]));
      if (!destination) return notFound();
      return [200, { success: true, weather: weatherFor(destination) }];
    },
  },

  {
    method: 'get',
    pattern: /^\/v1\/destinations\/(\d+)\/map$/,
    handle: ({ match }) => {
      const destination = db.destinations.find((d) => d.id === Number(match[1]));
      if (!destination) return notFound();
      const { latitude, longitude } = destination;
      if (latitude == null || longitude == null) {
        return [200, { success: true, latitude: null, longitude: null }];
      }
      return [
        200,
        {
          success: true,
          latitude,
          longitude,
          map_url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        },
      ];
    },
  },

  {
    method: 'get',
    pattern: /^\/v1\/admin\/destinations\/stats$/,
    admin: true,
    handle: () => {
      const count = db.destinations.length;
      return ok({
        data: {
          total_trips: count * 14,
          active_bookings: count * 5 + 3,
          total_revenue: count * 18750,
          destinations_coverage: count,
        },
      });
    },
  },

  {
    method: 'post',
    pattern: /^\/v1\/admin\/destinations$/,
    admin: true,
    handle: ({ body }) => {
      const errors = validateDestination(body);
      if (errors) return [422, { success: false, message: 'بيانات غير صالحة.', errors }];
      const destination = {
        id: db.nextDestinationId++,
        image: null,
        ...pickDestinationFields(body),
      };
      db.destinations.push(destination);
      return ok({ message: 'تمت إضافة الوجهة بنجاح', data: destination }, 201);
    },
  },

  {
    method: 'put',
    pattern: /^\/v1\/admin\/destinations\/(\d+)$/,
    admin: true,
    handle: ({ match, body }) => {
      const destination = db.destinations.find((d) => d.id === Number(match[1]));
      if (!destination) return notFound();
      const errors = validateDestination(body);
      if (errors) return [422, { success: false, message: 'بيانات غير صالحة.', errors }];
      Object.assign(destination, pickDestinationFields(body));
      return ok({ message: 'تم تحديث الوجهة بنجاح', data: destination });
    },
  },

  {
    method: 'delete',
    pattern: /^\/v1\/admin\/destinations\/(\d+)$/,
    admin: true,
    handle: ({ match }) => {
      const index = db.destinations.findIndex((d) => d.id === Number(match[1]));
      if (index === -1) return notFound();
      db.destinations.splice(index, 1);
      return ok({ message: 'تم حذف الوجهة بنجاح' });
    },
  },
];

// ---------- الـ Adapter ----------

function buildResponse(config, status, data) {
  return { data, status, statusText: String(status), headers: {}, config, request: {} };
}

export default async function mockAdapter(config) {
  await sleep(350 + Math.random() * 250); // تأخير بسيط حتى تظهر حالات التحميل

  const url = new URL(config.url, 'http://demo.local');
  const method = (config.method || 'get').toLowerCase();

  const route = routes.find((r) => r.method === method && r.pattern.test(url.pathname));
  const auth = config.headers?.get
    ? config.headers.get('Authorization')
    : config.headers?.Authorization;

  let status;
  let data;

  if (!route) {
    [status, data] = notFound();
  } else if (route.admin && auth !== `Bearer ${DEMO_TOKEN}`) {
    [status, data] = [401, { success: false, message: 'غير مصرّح، سجّل الدخول أولاً.' }];
  } else {
    let body = {};
    if (typeof config.data === 'string' && config.data) {
      try {
        body = JSON.parse(config.data);
      } catch {
        body = {};
      }
    } else if (config.data && typeof config.data === 'object') {
      body = config.data;
    }
    [status, data] = route.handle({
      match: url.pathname.match(route.pattern),
      query: url.searchParams,
      body,
    });
  }

  const response = buildResponse(config, status, data);
  if (status >= 200 && status < 300) return response;

  throw new AxiosError(
    `Request failed with status code ${status}`,
    status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
    config,
    {},
    response,
  );
}
