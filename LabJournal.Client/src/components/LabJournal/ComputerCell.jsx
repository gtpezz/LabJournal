import React from 'react';

export default function ComputerCell({ computer, lastStudent }) {
    return (
        <td className="sticky left-0 z-10 border-b border-r border-slate-200 bg-white px-4 py-3 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">
            <div className="font-medium text-slate-800">
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
        </td>
    );
}