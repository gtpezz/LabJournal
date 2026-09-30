import React, { useMemo, useState, useEffect } from 'react';
import JournalToolbar from './JournalToolbar';
import JournalTable from './JournalTable';
import CellEditorModal from './CellEditorModal';
import AddComputerModal from './AddComputerModal';
import AddGroupModal from './AddGroupModal';
import AddDateModal from './AddDateModal';   // ← новое
import LoadingIndicator from './LoadingIndicator';
import ErrorBanner from './ErrorBanner';

import { useComputers } from '../../hooks/useComputers';
import { useGroups } from '../../hooks/useGroups';
import { useTaskRecords } from '../../hooks/useTaskRecords';
import { useExportExcel } from '../../hooks/useExportExcel';
import { getTodayISO } from '../../utils/date';

export default function LabJournalMatrix() {
    const { computers, error: computersError, createComputer } = useComputers();
    const {
        groups,
        selectedGroupId,
        setSelectedGroupId,
        error: groupsError,
        createGroup,
    } = useGroups();

    const {
        records,
        loading,
        error: recordsError,
        saveRecord,
        appendPlaceholderDate,
    } = useTaskRecords(selectedGroupId);

    const { exportExcel, exporting, error: exportError } = useExportExcel();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingCell, setEditingCell] = useState(null);
    const [saving, setSaving] = useState(false);

    const [computerModalOpen, setComputerModalOpen] = useState(false);
    const [computerSaving, setComputerSaving] = useState(false);

    const [groupModalOpen, setGroupModalOpen] = useState(false);
    const [groupSaving, setGroupSaving] = useState(false);

    const [dateModalOpen, setDateModalOpen] = useState(false); // ← новое

    const dates = useMemo(() => {
        const set = new Set(records.map((r) => String(r.date).slice(0, 10)).filter(Boolean));
        return Array.from(set).sort();
    }, [records]);

    const recordMap = useMemo(() => {
        const map = new Map();
        records.forEach((r) => {
            if (!r.computerName || !r.date) return;
            const key = `${String(r.computerName).trim()}__${String(r.date).slice(0, 10)}`;
            map.set(key, r);
        });
        return map;
    }, [records]);

    const lastStudentByComputer = useMemo(() => {
        const map = new Map();
        records.forEach((r) => {
            if (!r.studentFullName || !r.computerName) return;
            const key = String(r.computerName).trim();
            const prev = map.get(key);
            if (!prev || prev.date < r.date) map.set(key, r);
        });
        return map;
    }, [records]);

    const selectedGroup = useMemo(
        () => groups.find((g) => String(g.id) === String(selectedGroupId)),
        [groups, selectedGroupId]
    );

    const handleGroupChange = (e) => setSelectedGroupId(e.target.value);

    const handleAddToday = () => {
        const today = getTodayISO();
        if (dates.includes(today)) return;
        appendPlaceholderDate(today);
    };

    const handleAddDate = (date) => {
        if (!date) return;
        if (dates.includes(date)) return;
        appendPlaceholderDate(date);
    };

    const handleCellClick = (computer, date, record) => {
        setEditingCell({ computer, date, record });
        setModalOpen(true);
    };

    const handleSaveCell = async ({ studentFullName, taskDone }) => {
        if (!editingCell) return;
        setSaving(true);
        try {
            await saveRecord({
                existingRecord: editingCell.record,
                computer: editingCell.computer,
                group: selectedGroup,
                date: editingCell.date,
                studentFullName,
                taskDone,
            });
            setModalOpen(false);
            setEditingCell(null);
        } catch (err) {
            console.error('Ошибка сохранения:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingCell(null);
    };

    const handleCreateComputer = async (payload) => {
        setComputerSaving(true);
        try {
            await createComputer(payload);
        } finally {
            setComputerSaving(false);
        }
    };

    const handleCreateGroup = async (payload) => {
        setGroupSaving(true);
        try {
            await createGroup(payload);
        } finally {
            setGroupSaving(false);
        }
    };

    const errorMessage =
        computersError || groupsError || recordsError || exportError;

    return (
        <div className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-6">
            <JournalToolbar
                groups={groups}
                selectedGroupId={selectedGroupId}
                onGroupChange={handleGroupChange}
                onAddToday={handleAddToday}
                addTodayDisabled={!selectedGroupId || dates.includes(getTodayISO())}
                onAddDate={() => setDateModalOpen(true)}
                onExport={() => exportExcel(selectedGroupId)}
                exporting={exporting}
                onAddComputer={() => setComputerModalOpen(true)}
                onAddGroup={() => setGroupModalOpen(true)}
                hasGroup={Boolean(selectedGroupId)}
            />

            <ErrorBanner message={errorMessage} />
            {loading && <LoadingIndicator />}

            <JournalTable
                computers={computers}
                dates={dates}
                recordMap={recordMap}
                lastStudentByComputer={lastStudentByComputer}
                onCellClick={handleCellClick}
                groupName={selectedGroup?.name ?? selectedGroup?.title ?? ''}
            />

            <CellEditorModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCell}
                initialData={editingCell?.record ?? null}
                saving={saving}
                meta={editingCell}
            />

            <AddComputerModal
                open={computerModalOpen}
                onClose={() => setComputerModalOpen(false)}
                onCreate={handleCreateComputer}
                saving={computerSaving}
            />

            <AddGroupModal
                open={groupModalOpen}
                onClose={() => setGroupModalOpen(false)}
                onCreate={handleCreateGroup}
                saving={groupSaving}
            />

            <AddDateModal
                open={dateModalOpen}
                onClose={() => setDateModalOpen(false)}
                onAdd={handleAddDate}
                existingDates={dates}
            />
        </div>
    );
}