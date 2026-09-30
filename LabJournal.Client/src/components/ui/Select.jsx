import React from 'react';

export default function Select({ className = '', children, ...rest }) {
    return (
        <select
            className={`rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 ${className}`}
            {...rest}
        >
            {children}
        </select>
    );
}