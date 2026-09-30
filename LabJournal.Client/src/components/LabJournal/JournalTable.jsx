import React from 'react';
import JournalTableHeader from './JournalTableHeader';
import JournalTableRow from './JournalTableRow';

export default function JournalTable({
    computers,
    dates,
    recordMap,
    lastStudentByComputer,
    onCellClick,
    groupName,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                    <JournalTableHeader dates={dates} groupName={groupName} />

                    <tbody>
                        {computers.map((computer, rowIdx) => (
                            <JournalTableRow
                                key={computer.id}
                                computer={computer}
                                dates={dates}
                                recordMap={recordMap}
                                lastStudent={lastStudentByComputer.get(String(computer.name).trim())}
                                rowIdx={rowIdx}
                                onCellClick={onCellClick}
                            />
                        ))}

                        {computers.length === 0 && (
                            <tr>
                                <td
                                    colSpan={dates.length + 1}
                                    className="px-4 py-8 text-center text-sm text-slate-400"
                                >
                                    Нет данных о компьютерах.{' '}
                                    <button
                                        type="button"
                                        onClick={() => onAddComputer?.()}
                                        className="font-medium text-sky-600 hover:underline"
                                    >
                                        Добавить первый ПК
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}