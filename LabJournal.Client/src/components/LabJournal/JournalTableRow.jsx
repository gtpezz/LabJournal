import React from 'react';
import ComputerCell from './ComputerCell';
import TaskCell from './TaskCell';

export default function JournalTableRow({
    computer,
    dates,
    recordMap,
    lastStudent,
    rowIdx,
    onCellClick,
    onDeleteRow,
}) {
    return (
        <tr className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
            <ComputerCell
                computer={computer}
                lastStudent={lastStudent}
                onDeleteRow={onDeleteRow}
            />

            {dates.map((date) => {
                const key = `${String(computer.name).trim()}__${String(date).slice(0, 10)}`;
                const record = recordMap.get(key);
                return (
                    <TaskCell
                        key={key}
                        record={record}
                        onClick={() => onCellClick(computer, date, record ?? null)}
                    />
                );
            })}

            {dates.length === 0 && (
                <td className="border-b border-slate-300 px-4 py-3 text-center text-xs text-slate-300">
                    —
                </td>
            )}
        </tr>
    );
}