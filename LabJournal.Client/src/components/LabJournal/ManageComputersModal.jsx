import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ManageComputersModal({
    open,
    onClose,
    computers,
    onDelete,
}) {
    const [deletingId, setDeletingId] = useState(null);
    const [confirmId, setConfirmId] = useState(null);
    const [localError, setLocalError] = useState(null);

    const handleDelete = async (id) => {
        setDeletingId(id);
        setLocalError(null);
        try {
            await onDelete(id);
            setConfirmId(null);
        } catch (err) {
            setLocalError(
                err.userMessage ??
                err.message ??
                'Не удалось удалить компьютер. Возможно, за ним закреплены записи.'
            );
        } finally {
            setDeletingId(null);
        }
    };

    const handleClose = () => {
        setConfirmId(null);
        setLocalError(null);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose} maxWidth="max-w-2xl">
            <h3 className="mb-1 text-lg font-semibold text-slate-800">
                Управление компьютерами
            </h3>
            <p className="mb-4 text-sm text-slate-500">
                Всего: {computers.length}. Удаление ПК с закреплёнными записями
                невозможно — сначала удалите записи в журнале.
            </p>

            {localError && (
                <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                    {localError}
                </div>
            )}

            <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-slate-200">
                {computers.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-slate-400">
                        Список пуст
                    </div>
                )}

                {computers.map((c, idx) => (
                    <div
                        key={c.id}
                        className={`flex items-center justify-between gap-3 px-4 py-2 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                            }`}
                    >
                        <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-slate-800">
                                {c.name ?? `ПК-${c.id}`}
                            </div>
                            <div className="truncate text-xs text-slate-400">id: {c.id}</div>
                        </div>

                        {confirmId === c.id ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-rose-700">Удалить?</span>
                                <Button
                                    variant="ghost"
                                    onClick={() => setConfirmId(null)}
                                    disabled={deletingId === c.id}
                                    className="!px-2 !py-1 !text-xs"
                                >
                                    Нет
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => handleDelete(c.id)}
                                    disabled={deletingId === c.id}
                                    className="!bg-rose-600 !px-2 !py-1 !text-xs hover:!bg-rose-700"
                                >
                                    {deletingId === c.id ? '…' : 'Да'}
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="ghost"
                                onClick={() => setConfirmId(c.id)}
                                className="!px-2 !py-1 !text-xs !text-rose-600 hover:!bg-rose-50"
                            >
                                🗑 Удалить
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-end">
                <Button variant="ghost" onClick={handleClose}>
                    Закрыть
                </Button>
            </div>
        </Modal>
    );
}