import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ConfirmDeleteModal({
    open,
    onClose,
    onConfirm,
    title = 'Удалить?',
    description,
    confirmLabel = 'Удалить',
    busy = false,
    error = null,
}) {
    return (
        <Modal open={open} onClose={onClose}>
            <h3 className="mb-2 text-lg font-semibold text-slate-800">{title}</h3>
            {description && (
                <p className="mb-4 text-sm text-slate-600">{description}</p>
            )}

            {error && (
                <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={onClose} disabled={busy}>
                    Отмена
                </Button>
                <Button
                    variant="primary"
                    onClick={onConfirm}
                    disabled={busy}
                    className="!bg-rose-600 hover:!bg-rose-700"
                >
                    {busy ? 'Удаление…' : confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}