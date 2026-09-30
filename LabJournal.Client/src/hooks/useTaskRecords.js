import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../api/apiClient';

export function useTaskRecords(groupId) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const abortRef = useRef(null);

    const loadRecords = useCallback(async (id) => {
        if (!id) {
            setRecords([]);
            return;
        }

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const res = await apiClient.get('/api/task-records', {
                params: { groupId: id, pageSize: 1000 },
                signal: controller.signal,
            });

            const list = (res.data?.items ?? res.data ?? [])
                .filter((r) => r && r.id != null)
                .map((r) => ({
                    id: r.id,
                    date: String(r.date ?? '').slice(0, 10),
                    computerName: String(r.computerName ?? '').trim(),
                    groupName: String(r.groupName ?? '').trim(),
                    studentFullName: r.studentFullName ?? '',
                    taskDone: r.taskDone ?? '',
                    createdAt: r.createdAt ?? null,
                }));

            setRecords(list);
        } catch (err) {
            if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
            console.error('Ошибка загрузки записей:', err);
            setError(err.userMessage ?? 'Не удалось загрузить данные журнала.');
            setRecords([]);
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRecords(groupId);
        return () => abortRef.current?.abort();
    }, [groupId, loadRecords]);

    const saveRecord = useCallback(
        async ({ existingRecord, computer, group, date, studentFullName, taskDone }) => {
            if (!computer?.id) throw new Error('Не удалось определить компьютер.');
            if (!group?.id) throw new Error('Не выбрана группа.');
            if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date))
                throw new Error('Некорректная дата занятия.');
            if (!taskDone?.trim())
                throw new Error('Список выполненных заданий не может быть пустым.');
            if (!studentFullName?.trim())
                throw new Error('Укажите ФИО ученика.');

            if (existingRecord?.id) {
                await apiClient.put('/api/task-records', {
                    id: existingRecord.id,
                    taskDone: taskDone.trim(),
                    studentFullName: studentFullName.trim(),
                });
            } else {
                await apiClient.post('/api/task-records', {
                    computerId: Number(computer.id),
                    groupId: Number(group.id),
                    date,
                    taskDone: taskDone.trim(),
                    studentFullName: studentFullName.trim(),
                });
            }

            await loadRecords(groupId);
        },
        [groupId, loadRecords]
    );

    const deleteRecord = useCallback(
        async (recordId) => {
            if (!recordId) throw new Error('Не указан Id записи.');
            await apiClient.delete(`/api/task-records/${recordId}`);
            await loadRecords(groupId);
        },
        [groupId, loadRecords]
    );

    const deleteColumnRecords = useCallback(
        async (date, targetGroupId) => {
            if (!date || !targetGroupId) throw new Error('Нет даты или группы.');

            const ids = records
                .filter(
                    (r) =>
                        r.id != null &&
                        String(r.date).slice(0, 10) === String(date).slice(0, 10)
                )
                .map((r) => r.id);

            if (ids.length === 0) return 0;

            const results = await Promise.allSettled(
                ids.map((id) => apiClient.delete(`/api/task-records/${id}`))
            );

            const failed = results.filter((r) => r.status === 'rejected').length;

            await loadRecords(targetGroupId);

            if (failed > 0) {
                throw new Error(
                    `Не удалось удалить ${failed} из ${ids.length} записей.`
                );
            }
            return ids.length;
        },
        [records, loadRecords]
    );

    const deleteRowRecords = useCallback(
        async (computerName, targetGroupId) => {
            if (!computerName || !targetGroupId) throw new Error('Нет ПК или группы.');

            const ids = records
                .filter(
                    (r) =>
                        r.id != null &&
                        String(r.computerName).trim() === String(computerName).trim()
                )
                .map((r) => r.id);

            if (ids.length === 0) return 0;

            const results = await Promise.allSettled(
                ids.map((id) => apiClient.delete(`/api/task-records/${id}`))
            );

            const failed = results.filter((r) => r.status === 'rejected').length;

            await loadRecords(targetGroupId);

            if (failed > 0) {
                throw new Error(
                    `Не удалось удалить ${failed} из ${ids.length} записей.`
                );
            }
            return ids.length;
        },
        [records, loadRecords]
    );

    const appendPlaceholderDate = useCallback((date) => {
        setRecords((prev) => [
            ...prev,
            {
                id: null,
                computerName: '',
                groupName: '',
                date,
                taskDone: '',
                studentFullName: '',
                __placeholder: true,
            },
        ]);
    }, []);

    return {
        records,
        loading,
        error,
        reload: () => loadRecords(groupId),
        saveRecord,
        deleteRecord,
        deleteColumnRecords,
        deleteRowRecords,
        appendPlaceholderDate,
    };
}