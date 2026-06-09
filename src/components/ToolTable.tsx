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

interface ToolTableProps {
  data: AITool[];
  onSelect: (tool: AITool) => void;
}

export const ToolTable: React.FC<ToolTableProps> = ({ data, onSelect }) => {
  const { addTool, removeTool, isSelected } = useComparisonStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<AITool>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <div
            className="font-bold text-white hover:text-indigo-400 cursor-pointer transition-colors"
            onClick={() => onSelect(info.row.original)}
          >
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('subcategory', {
        header: 'Subcategory',
        cell: (info) => <span className="text-slate-350">{info.getValue()}</span>,
      }),
      columnHelper.accessor('vendor', {
        header: 'Vendor',
        cell: (info) => <span className="text-slate-400">{info.getValue()}</span>,
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
          const selected = isSelected(tool.id);
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (selected) {
                  removeTool(tool.id);
                } else {
                  addTool(tool);
                }
              }}
              className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-400 border border-slate-700/60'
              }`}
            >
              {selected ? 'Added' : 'Compare'}
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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="glass rounded-xl overflow-hidden w-full border border-slate-800/80">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-slate-900/60 border-b border-slate-800">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="p-4 text-xs font-bold uppercase tracking-wider text-indigo-300 cursor-pointer hover:bg-slate-800/40 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-indigo-950/10 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 text-sm align-middle text-slate-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center p-4 bg-slate-900/40 border-t border-slate-800">
        <div className="text-xs text-slate-450">
          Showing Page <span className="font-semibold text-white">{table.getState().pagination.pageIndex + 1}</span> of{' '}
          <span className="font-semibold text-white">{table.getPageCount()}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs text-white rounded transition-opacity disabled:cursor-not-allowed cursor-pointer font-medium"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs text-white rounded transition-opacity disabled:cursor-not-allowed cursor-pointer font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
