import React from 'react';

export default function ComputerCell({ computer, lastStudent, onDeleteRow }) {
    return (
        <td className="group sticky left-0 z-10 border-b border-r border-slate-200 bg-white px-4 py-3 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <div className="truncate font-medium text-slate-800">
                        {computer.name ?? `ПК-${computer.id}`}
                    </div>
                    {lastStudent?.studentFullName && (
                        <div
                            className="mt-0.5 truncate text-xs text-slate-400"
                            title={lastStudent.studentFullName}
                        >
                            {lastStudent.studentFullName}
                        </div>
                    )}
                </div>

                {onDeleteRow && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRow(computer);
                        }}
                        title={`Удалить все записи для ${computer.name}`}
                        aria-label={`Удалить все записи для ${computer.name}`}
                        className="
              flex h-6 w-6 shrink-0 items-center justify-center rounded-full
              text-sm text-rose-600 transition hover:bg-rose-100
              md:hidden md:group-hover:flex
            "
                    >
                        🗑
                    </button>
                )}
            </div>
        </td>
    );
}