import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

export function useGroups() {
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadGroups = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/api/groups', {
                params: { pageSize: 100 },
            });
            const list = res.data?.items ?? res.data ?? [];
            setGroups(list);
            return list;
        } catch (err) {
            console.error('Ошибка загрузки групп:', err);
            setError(err.userMessage ?? 'Не удалось загрузить список групп.');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        (async () => {
            const list = await loadGroups();
            if (list.length > 0) {
                setSelectedGroupId((prev) => prev || String(list[0].id));
            }
        })();
    }, [loadGroups]);

    const createGroup = useCallback(
        async ({ name }) => {
            const res = await apiClient.post('/api/groups', { name });
            const list = await loadGroups();
            const created = res.data?.id
                ? String(res.data.id)
                : list.find((g) => g.name === name)?.id;
            if (created) setSelectedGroupId(String(created));
            return res.data;
        },
        [loadGroups]
    );

    const deleteGroup = useCallback(
        async (id) => {
            if (!id) throw new Error('Не указан Id группы.');
            await apiClient.delete(`/api/groups/${id}`);
            const list = await loadGroups();
            setSelectedGroupId((prev) => {
                if (String(prev) !== String(id)) return prev;
                return list.length > 0 ? String(list[0].id) : '';
            });
        },
        [loadGroups]
    );

    return {
        groups,
        selectedGroupId,
        setSelectedGroupId,
        loading,
        error,
        reload: loadGroups,
        createGroup,
        deleteGroup,
    };
}