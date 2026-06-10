import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import type { AITool } from '@types-app/AITool';
import { ScoreBadge } from './ScoreBadge';
import { useComparisonStore } from '@store/useComparisonStore';
import { useUIStore } from '@store/useUIStore';

interface ToolTableProps {
  data: AITool[];
  onSelect: (tool: AITool) => void;
}

export const ToolTable: React.FC<ToolTableProps> = ({ data, onSelect }) => {
  const { addTool, removeTool, isSelected } = useComparisonStore();
  const { pinnedToolId } = useUIStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<AITool>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <div
            className="font-bold cursor-pointer transition-colors t-text"
            style={{ color: 'var(--text-color)' }}
            onClick={() => onSelect(info.row.original)}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-indigo)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-color)')}
          >
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('subcategory', {
        header: 'Subcategory',
        cell: (info) => <span className="t-text-secondary">{info.getValue()}</span>,
      }),
      columnHelper.accessor('vendor', {
        header: 'Vendor',
        cell: (info) => <span className="t-text-muted">{info.getValue()}</span>,
      }),
      columnHelper.accessor('overall_rating', {
        header: 'Overall Rating',
        cell: (info) => <ScoreBadge score={info.getValue()} size="sm" />,
      }),
      columnHelper.accessor('enterprise_readiness_score', {
        header: 'Enterprise Readiness',
        cell: (info) => <ScoreBadge score={info.getValue()} size="sm" />,
      }),
      columnHelper.accessor('latency_score', {
        header: 'Latency',
        cell: (info) => <ScoreBadge score={info.getValue()} size="sm" />,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Compare',
        cell: (info) => {
          const tool = info.row.original;
          const sel = isSelected(tool.id);
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (sel) removeTool(tool.id);
                else addTool(tool);
              }}
              className={`text-xs font-semibold px-2.5 py-1 rounded transition-all cursor-pointer ${
                sel ? '' : 't-unselected'
              }`}
              style={
                sel
                  ? { background: 'var(--accent-indigo)', color: '#fff', border: '1px solid var(--accent-indigo)' }
                  : {}
              }
            >
              {sel ? 'Added' : 'Compare'}
            </button>
          );
        },
      }),
    ],
    [isSelected, addTool, removeTool, onSelect]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="glass rounded-xl overflow-hidden w-full" style={{ border: '1px solid var(--border-color)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="t-table-header">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="p-4 text-xs font-bold uppercase tracking-wider cursor-pointer select-none transition-colors"
                    style={{ color: 'var(--accent-indigo)' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const isPinned = pinnedToolId === row.original.id;
              return (
                <tr
                  key={row.id}
                  className={`t-table-row transition-colors ${
                    isPinned ? 'score-bg-excellent' : ''
                  }`}
                  style={{
                    borderLeft: isPinned ? '3px solid var(--accent-indigo)' : 'none',
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 text-sm align-middle t-text-secondary">
                      {cell.column.id === 'name' && isPinned ? (
                        <span className="flex items-center gap-1.5 font-bold">
                          <span>📌</span>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="flex justify-between items-center p-4"
        style={{ background: 'var(--surface-bg)', borderTop: '1px solid var(--border-color)' }}
      >
        <div className="text-xs t-text-muted">
          Showing Page{' '}
          <span className="font-semibold t-text">{table.getState().pagination.pageIndex + 1}</span> of{' '}
          <span className="font-semibold t-text">{table.getPageCount()}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="t-btn-secondary px-3 py-1.5 text-xs rounded font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="t-btn-secondary px-3 py-1.5 text-xs rounded font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
