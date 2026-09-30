import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

export function useComputers() {
    const [computers, setComputers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadComputers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/api/computers', {
                params: { pageSize: 100 },
            });
            setComputers(res.data?.items ?? res.data ?? []);
        } catch (err) {
            console.error('Ошибка загрузки ПК:', err);
            setError(err.userMessage ?? 'Не удалось загрузить список ПК.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadComputers();
    }, [loadComputers]);

    const createComputer = useCallback(
        async ({ name }) => {
            await apiClient.post('/api/computers', { name });
            await loadComputers();
        },
        [loadComputers]
    );

    const deleteComputer = useCallback(
        async (id) => {
            if (!id) throw new Error('Не указан Id компьютера.');
            await apiClient.delete(`/api/computers/${id}`);
            await loadComputers();
        },
        [loadComputers]
    );

    return {
        computers,
        loading,
        error,
        reload: loadComputers,
        createComputer,
        deleteComputer,
    };
}