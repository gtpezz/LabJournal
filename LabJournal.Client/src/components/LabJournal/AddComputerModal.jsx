import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const inputCls =
    'w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200';

export default function AddComputerModal({ open, onClose, onCreate, saving }) {
    const [name, setName] = useState('');
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        if (open) {
            setName('');
            setLocalError(null);
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setLocalError('Укажите название компьютера (например, ПК-12).');
            return;
        }
        try {
            await onCreate({ name: name.trim() });
            onClose();
        } catch (err) {
            setLocalError(err.userMessage ?? 'Не удалось создать компьютер.');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
                Новый компьютер
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600">
                        Название ПК <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ПК-12"
                        className={inputCls}
                        autoFocus
                    />
                </div>

                {localError && (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                        {localError}
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
                        Отмена
                    </Button>
                    <Button type="submit" variant="primary" disabled={saving}>
                        {saving ? 'Создание…' : 'Создать'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}