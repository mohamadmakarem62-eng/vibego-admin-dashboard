const LOCAL_IMAGE_PATHS_KEY = 'destination-image-paths';

// المسار الأساسي للموقع: "/" محلياً، و "/اسم-الريبو/" على GitHub Pages
const withBase = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/')) return withBase(imageUrl);
  return withBase(`destinations/${imageUrl}`);
};

export const getLocalImagePath = (id) => {
  const paths = JSON.parse(localStorage.getItem(LOCAL_IMAGE_PATHS_KEY) || '{}');
  return paths[id] || null;
};

export const saveLocalImagePath = (id, path) => {
  const paths = JSON.parse(localStorage.getItem(LOCAL_IMAGE_PATHS_KEY) || '{}');
  if (path) paths[id] = path;
  else delete paths[id];
  localStorage.setItem(LOCAL_IMAGE_PATHS_KEY, JSON.stringify(paths));
};

// مصدر الصورة المعروضة للوجهة: المسار المحلي المحفوظ أولاً، ثم صورة الباك إند
export const getDestinationImageSrc = (destination) =>
  getImageUrl(getLocalImagePath(destination.id) || destination.image || destination.image_url);
