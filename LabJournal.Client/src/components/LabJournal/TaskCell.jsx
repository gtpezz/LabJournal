import React from 'react';

export default function TaskCell({ record, onClick }) {
    const student = record?.studentFullName ?? record?.studentName ?? '';
    const tasks = record?.taskDone ?? '';
    const hasStudent = Boolean(student);
    const hasTasks = Boolean(tasks);
    const isEmpty = !hasStudent && !hasTasks;

    return (
        <td
            onClick={onClick}
            className="group min-w-[160px] cursor-pointer border-b border-r border-slate-300 px-3 py-2 align-top transition hover:bg-sky-50"
        >
            {isEmpty ? (
                <span className="text-xs text-slate-300 opacity-0 transition group-hover:opacity-100">
                    + добавить
                </span>
            ) : (
                <div className="space-y-0.5">
                    {hasStudent && (
                        <div
                            className="truncate text-xs font-medium text-slate-700"
                            title={student}
                        >
                            {student}
                        </div>
                    )}
                    {hasTasks && (
                        <div
                            className="truncate text-xs text-slate-500"
                            title={tasks}
                        >
                            {tasks}
                        </div>
                    )}
                </div>
            )}
        </td>
    );
}