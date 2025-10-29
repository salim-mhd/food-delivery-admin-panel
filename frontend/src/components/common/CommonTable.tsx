import React, { memo } from 'react';

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
}

function CommonTableImpl<T>({ columns, data, getRowKey, emptyMessage = 'No data', tableClassName = '' }: CommonTableProps<T>) {
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
          {data.map((row, index) => (
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
    </div>
  );
}

const CommonTable = memo(CommonTableImpl) as typeof CommonTableImpl;

export default CommonTable;


