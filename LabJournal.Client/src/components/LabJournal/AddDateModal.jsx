import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { getTodayISO } from '../../utils/date';

const inputCls =
    'w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200';

export default function AddDateModal({ open, onClose, onAdd, existingDates = [] }) {
    const [date, setDate] = useState('');
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        if (open) {
            setDate(getTodayISO());
            setLocalError(null);
        }
    }, [open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!date) {
            setLocalError('Выберите дату.');
            return;
        }
        if (existingDates.includes(date)) {
            setLocalError('Столбец с такой датой уже существует.');
            return;
        }
        onAdd(date);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
                Добавить дату занятия
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600">
                        Дата <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={inputCls}
                        autoFocus
                    />
                    <p className="mt-1 text-xs text-slate-400">
                        Появится новый столбец в матрице журнала.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <QuickDate label="Сегодня" onClick={() => setDate(getTodayISO())} />
                    <QuickDate label="Вчера" onClick={() => setDate(offsetDays(-1))} />
                    <QuickDate label="+1 нед." onClick={() => setDate(offsetDays(7))} />
                </div>

                {localError && (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                        {localError}
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button type="submit" variant="primary">
                        Добавить
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

function offsetDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

function QuickDate({ label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
        >
            {label}
        </button>
    );
}