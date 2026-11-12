export default function Pagination({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null;

  return (
    <div className="v-pagebar px-6 py-4 flex items-center justify-between">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
        className="v-btn v-btn-ghost v-btn--compact text-sm disabled:opacity-50"
      >
        السابق
      </button>

      <span className="text-sm v-muted font-medium">
        الصفحة {currentPage} من {lastPage}
      </span>

      <button
        disabled={currentPage === lastPage}
        onClick={() => onPageChange((prev) => Math.min(prev + 1, lastPage))}
        className="v-btn v-btn-ghost v-btn--compact text-sm disabled:opacity-50"
      >
        التالي
      </button>
    </div>
  );
}
