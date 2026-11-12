import DestinationRow from './DestinationRow';
import Pagination from './Pagination';

const COLUMNS = [
  { label: 'الوجهة', align: 'text-right' },
  { label: 'الدولة', align: 'text-right' },
  { label: 'المميزات', align: 'text-right' },
  { label: 'الإحداثيات', align: 'text-right' },
  { label: 'الخيارات', align: 'text-center' },
];

function MessageRow({ children }) {
  return (
    <tr>
      <td colSpan="5" className="text-center py-8 v-muted text-sm">
        {children}
      </td>
    </tr>
  );
}

export default function DestinationsTable({
  destinations,
  loading,
  currentPage,
  lastPage,
  onPageChange,
  onViewDetails,
  onEdit,
  onDelete,
}) {
  return (
    <div className="v-glass overflow-hidden">
      <div className="overflow-x-auto">
        <table className="v-table min-w-full">
          <thead className="v-thead">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column.label}
                  className={`px-4 py-3 ${column.align} text-xs font-semibold v-th`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <MessageRow>جاري تحديث خلاصة الموارد الجغرافية...</MessageRow>
            ) : destinations.length === 0 ? (
              <MessageRow>لا يوجد أي وجهات مسجلة حالياً بالنظام</MessageRow>
            ) : (
              destinations.map((destination) => (
                <DestinationRow
                  key={destination.id}
                  destination={destination}
                  onViewDetails={onViewDetails}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={onPageChange} />
    </div>
  );
}
