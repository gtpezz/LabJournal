import React from 'react';

export default function Modal({ open, onClose, children, maxWidth = 'max-w-md' }) {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`w-full ${maxWidth} rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}