import React, { memo, useMemo } from 'react';

export type TableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  // Prefer accessor for type-safe reads; fall back to render if provided
  accessor?: (row: T) => React.ReactNode;
  render?: (row: T) => React.ReactNode;
};

export interface CommonTableProps<T> {
  columns: Array<TableColumn<T>>;
  data: T[];
  getRowKey: (row: T, index: number) => string;
  emptyMessage?: string;
  tableClassName?: string;
  isLoading?: boolean;
  // Pagination (controlled or uncontrolled)
  page?: number; // 1-based
  pageSize?: number;
  total?: number; // pass when doing server-side pagination
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

function CommonTableImpl<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'No data',
  tableClassName = '',
  isLoading = false,
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50]
}: CommonTableProps<T>) {
  const isServerPaginated = typeof onPageChange === 'function';
  const totalCount = typeof total === 'number' ? total : data.length;
  const currentPage = Math.max(1, page);
  const currentPageSize = Math.max(1, pageSize);
  const pageCount = Math.max(1, Math.ceil(totalCount / currentPageSize));

  const displayedData = useMemo(() => {
    if (isServerPaginated) return data;
    const start = (currentPage - 1) * currentPageSize;
    return data.slice(start, start + currentPageSize);
  }, [data, isServerPaginated, currentPage, currentPageSize]);

  const from = totalCount === 0 ? 0 : (currentPage - 1) * currentPageSize + 1;
  const to = Math.min(totalCount, currentPage * currentPageSize);

  if (isLoading) {
    // Skeleton loader
    return (
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm p-4 animate-pulse">
        <div className="flex gap-2 mb-4">
          {columns.map(col => (
            <div key={col.key} className="h-4 w-24 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-10 w-full bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-600 text-center">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
      <table className={`min-w-full text-left text-sm ${tableClassName}`}>
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            {columns.map(col => (
              <th key={col.key} className={`px-4 py-3 font-medium ${col.className || ''}`}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {displayedData.map((row, index) => (
            <tr key={getRowKey(row, index)} className="hover:bg-gray-50">
              {columns.map(col => (
                <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                  {col.render
                    ? col.render(row)
                    : col.accessor
                      ? col.accessor(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
        <div className="text-xs text-gray-600">{from}–{to} of {totalCount}</div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-600">Rows per page</label>
          <select
            className="rounded-md border border-gray-300 px-2 py-1 text-sm bg-white"
            value={currentPageSize}
            onChange={(e) => onPageSizeChange ? onPageSizeChange(Number(e.target.value)) : undefined}
            disabled={!onPageSizeChange}
          >
            {pageSizeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1 || !onPageChange}
            >
              Prev
            </button>
            <span className="text-xs text-gray-700 px-2">Page {currentPage} of {pageCount}</span>
            <button
              type="button"
              className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={() => onPageChange && onPageChange(Math.min(pageCount, currentPage + 1))}
              disabled={currentPage >= pageCount || !onPageChange}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CommonTable = memo(CommonTableImpl) as typeof CommonTableImpl;

export default CommonTable;


