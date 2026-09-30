import React from 'react';
import { formatDateLabel } from '../../utils/date';

export default function JournalTableHeader({ dates, groupName }) {
    return (
        <thead>
            <tr>
                <th
                    className="sticky left-0 z-10 border-b border-r border-slate-300 bg-slate-100 px-4 py-2 text-center text-sm font-bold text-slate-700 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]"
                    colSpan={1}
                >
                    Группа — {groupName ?? '—'}
                </th>
                <th
                    className="border-b border-slate-300 bg-slate-100 px-4 py-2 text-center text-sm font-bold text-slate-700"
                    colSpan={Math.max(dates.length, 1)}
                >
                    Дата
                </th>
            </tr>

            <tr>
                <th className="sticky left-0 z-10 min-w-[220px] border-b border-r border-slate-300 bg-slate-50 px-4 py-2 text-left text-sm font-semibold text-slate-700 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">
                    Номер компьютера / ФИО
                </th>

                {dates.length === 0 && (
                    <th className="min-w-[160px] border-b border-slate-300 bg-slate-50 px-4 py-2 text-center text-xs font-normal text-slate-400">
                        Нет дат — добавьте столбец
                    </th>
                )}

                {dates.map((d) => (
                    <th
                        key={d}
                        className="min-w-[160px] border-b border-r border-slate-300 bg-slate-50 px-4 py-2 text-center text-sm font-semibold text-slate-700"
                        title={d}
                    >
                        {d}
                    </th>
                ))}
            </tr>
        </thead>
    );
}