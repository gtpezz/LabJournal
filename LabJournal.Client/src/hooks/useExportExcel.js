import { useState, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { getTodayISO } from '../utils/date';

export function useExportExcel() {
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState(null);

    const exportExcel = useCallback(async (groupId) => {
        if (!groupId) return;
        setExporting(true);
        setError(null);
        try {
            const res = await apiClient.get('/api/task-records/export', {
                params: { groupId },
                responseType: 'blob',
            });

            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `journal_group_${groupId}_${getTodayISO()}.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Ошибка экспорта:', err);
            setError('Не удалось выгрузить отчёт.');
        } finally {
            setExporting(false);
        }
    }, []);

    return { exportExcel, exporting, error };
}