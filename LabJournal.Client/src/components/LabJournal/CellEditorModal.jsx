import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const inputCls =
    'w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200';

export default function CellEditorModal({
    open,
    onClose,
    onSave,
    initialData,
    saving,
    meta, // { computer, date }
}) {
    const [studentFullName, setStudentFullName] = useState('');
    const [taskDone, setTaskDone] = useState('');

    useEffect(() => {
        if (open) {
            setStudentFullName(initialData?.studentFullName ?? '');
            setTaskDone(initialData?.taskDone ?? '');
        }
    }, [open, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            studentFullName: studentFullName.trim(),
            taskDone: taskDone.trim(),
        });
    };

    const computerLabel = meta?.computer?.name ?? '—';
    const dateLabel = meta?.date ?? '—';

    return (
        <Modal open={open} onClose={onClose}>
            <h3 className="mb-1 text-lg font-semibold text-slate-800">
                {initialData?.id ? 'Редактирование записи' : 'Новая запись'}
            </h3>

            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                    🖥 {computerLabel}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                    📅 {dateLabel}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600">
                        ФИО Ученика / Рабочая пара
                    </label>
                    <input
                        type="text"
                        value={studentFullName}
                        onChange={(e) => setStudentFullName(e.target.value)}
                        placeholder="Иванов Иван Иванович"
                        className={inputCls}
                        autoFocus
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600">
                        Выполненные задания
                    </label>
                    <textarea
                        value={taskDone}
                        onChange={(e) => setTaskDone(e.target.value)}
                        rows={3}
                        placeholder="Лабораторная №3, вариант 2"
                        className={`${inputCls} resize-none`}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
                        Отмена
                    </Button>
                    <Button type="submit" variant="primary" disabled={saving}>
                        {saving ? 'Сохранение…' : 'Сохранить'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}