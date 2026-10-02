import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient, { setUnauthorizedHandler } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------- Bootstrap: кто мы? ---------- */
  const fetchMe = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/auth/me');
      const data = res.data;

      if (!data || (!data.userName && !data.username && !data.login && !data.name)) {
        setUser(null);
        return;
      }

      setUser({
        userName: data.userName ?? data.username ?? data.login ?? data.name ?? '',
        role: data.role ?? data.userRole ?? 'User',
        id: data.id ?? data.userId ?? null,
      });
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error('Ошибка проверки сессии:', err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  /* ---------- Реакция на 401 от apiClient ---------- */
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  /* ---------- Login ---------- */
  const login = useCallback(
    async ({ login, password }) => {
      setError(null);
      try {
        await apiClient.post('/api/auth/login', { login, password });
        await fetchMe();
      } catch (err) {
        const msg = err.userMessage ?? 'Не удалось войти.';
        setError(msg);
        throw new Error(msg);
      }
    },
    [fetchMe]
  );

  /* ---------- Register ---------- */
  const register = useCallback(async ({ userName, password, role }) => {
    setError(null);
    try {
      await apiClient.post('/api/auth/register', { userName, password, role });
    } catch (err) {
      const msg = err.userMessage ?? 'Не удалось зарегистрироваться.';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  /* ---------- Logout ---------- */
  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      console.warn('Logout на сервере не удался:', err);
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refresh: fetchMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}