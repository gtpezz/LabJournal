import React from 'react';

const VARIANT_CLASSES = {
    primary: 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
    outline:
        'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm',
    ghost: 'text-slate-600 hover:bg-slate-100',
};

export default function Button({
    variant = 'primary',
    className = '',
    disabled,
    children,
    ...rest
}) {
    const base =
        'rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50';
    const variantCls = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary;

    return (
        <button
            className={`${base} ${variantCls} ${className}`}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
}