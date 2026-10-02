import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const inputCls =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200';

const ROLES = ['Teacher', 'Admin', 'User'];

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({ userName: '', password: '', role: 'Teacher' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!form.userName.trim() || !form.password) {
            setError('Заполните все поля.');
            return;
        }
        if (form.password.length < 6) {
            setError('Пароль должен быть не короче 6 символов.');
            return;
        }

        setSubmitting(true);
        try {
            await register({
                userName: form.userName.trim(),
                password: form.password,
                role: form.role,
            });
            navigate('/login', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="mb-1 text-xl font-bold text-slate-800">Регистрация</h1>
                <p className="mb-6 text-sm text-slate-500">Создайте новый аккаунт</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            name="userName"
                            value={form.userName}
                            onChange={handleChange}
                            className={inputCls}
                            autoFocus
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">
                            Пароль
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={inputCls}
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">
                            Роль
                        </label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className={inputCls}
                        >
                            {ROLES.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
                    >
                        {submitting ? 'Создание…' : 'Создать аккаунт'}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Уже есть аккаунт?{' '}
                    <a href="/login" className="font-medium text-sky-600 hover:underline">
                        Войти
                    </a>
                </p>
            </div>
        </div>
    );
}