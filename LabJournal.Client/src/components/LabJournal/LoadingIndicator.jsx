import React from 'react';

export default function LoadingIndicator({ label = 'Загрузка данных…' }) {
    return (
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
            {label}
        </div>
    );
}