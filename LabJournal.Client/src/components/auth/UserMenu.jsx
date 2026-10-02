import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function UserMenu() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    if (!user) return null;

    const initial = (user.userName ?? '?').charAt(0).toUpperCase();

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-semibold text-white">
                    {initial}
                </span>
                <span className="hidden sm:inline">{user.userName}</span>
                <span className="hidden text-xs text-slate-400 sm:inline">
                    {user.role}
                </span>
            </button>

            {open && (
                <div className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    <div className="px-3 py-2 text-xs text-slate-500">
                        <div className="font-medium text-slate-700">{user.userName}</div>
                        <div>{user.role}</div>
                    </div>
                    <hr className="my-1 border-slate-100" />
                    <button
                        type="button"
                        onClick={async () => {
                            setOpen(false);
                            await logout();
                        }}
                        className="block w-full px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                    >
                        Выйти
                    </button>
                </div>
            )}
        </div>
    );
}