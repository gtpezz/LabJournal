import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

export function useComputers(groupId) {
    const [computers, setComputers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadComputers = useCallback(async (id) => {
        if (!id) {
            setComputers([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await apiClient.get('/api/computers', {
                params: { pageSize: 100, groupId: id },
            });

            const list = (res.data?.items ?? res.data ?? [])
                .filter((c) => c && c.id != null)
                .map((c) => ({
                    id: c.id,
                    name: String(c.name ?? '').trim(),
                    groupId: c.groupId ?? null,
                }));

            setComputers(list);
        } catch (err) {
            console.error('Ошибка загрузки ПК:', err);
            setError(err.userMessage ?? 'Не удалось загрузить список ПК.');
            setComputers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadComputers(groupId);
    }, [groupId, loadComputers]);

    const createComputer = useCallback(
        async ({ name }) => {
            if (!groupId) throw new Error('Сначала выберите группу.');
            if (!name?.trim()) throw new Error('Укажите название ПК.');

            await apiClient.post('/api/computers', {
                name: name.trim(),
                groupId: Number(groupId),
            });

            await loadComputers(groupId);
        },
        [groupId, loadComputers]
    );

    const deleteComputer = useCallback(
        async (id) => {
            if (!id) throw new Error('Не указан Id компьютера.');
            await apiClient.delete(`/api/computers/${id}`);
            await loadComputers(groupId);
        },
        [groupId, loadComputers]
    );

    return {
        computers,
        loading,
        error,
        reload: () => loadComputers(groupId),
        createComputer,
        deleteComputer,
    };
}