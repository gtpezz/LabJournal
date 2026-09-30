import React, { useMemo, useState, useEffect } from 'react';

import JournalToolbar from './JournalToolbar';
import JournalTable from './JournalTable';
import CellEditorModal from './CellEditorModal';
import AddComputerModal from './AddComputerModal';
import AddGroupModal from './AddGroupModal';
import AddDateModal from './AddDateModal';
import ManageComputersModal from './ManageComputersModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import LoadingIndicator from './LoadingIndicator';
import ErrorBanner from './ErrorBanner';

import { useComputers } from '../../hooks/useComputers';
import { useGroups } from '../../hooks/useGroups';
import { useTaskRecords } from '../../hooks/useTaskRecords';
import { useExportExcel } from '../../hooks/useExportExcel';
import { getTodayISO } from '../../utils/date';

export default function LabJournalMatrix() {
    const {
        computers,
        error: computersError,
        createComputer,
        deleteComputer,
    } = useComputers();

    const {
        groups,
        selectedGroupId,
        setSelectedGroupId,
        error: groupsError,
        createGroup,
        deleteGroup,
    } = useGroups();

    const {
        records,
        loading,
        error: recordsError,
        saveRecord,
        deleteRecord,
        deleteColumnRecords,
        deleteRowRecords,
        appendPlaceholderDate,
    } = useTaskRecords(selectedGroupId);

    const { exportExcel, exporting, error: exportError } = useExportExcel();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingCell, setEditingCell] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [computerModalOpen, setComputerModalOpen] = useState(false);
    const [computerSaving, setComputerSaving] = useState(false);

    const [groupModalOpen, setGroupModalOpen] = useState(false);
    const [groupSaving, setGroupSaving] = useState(false);

    const [dateModalOpen, setDateModalOpen] = useState(false);

    const [manageComputersOpen, setManageComputersOpen] = useState(false);

    const [confirmGroupOpen, setConfirmGroupOpen] = useState(false);
    const [groupDeleting, setGroupDeleting] = useState(false);
    const [groupDeleteError, setGroupDeleteError] = useState(null);

    const [confirmColumn, setConfirmColumn] = useState(null);
    const [columnDeleting, setColumnDeleting] = useState(false);
    const [columnError, setColumnError] = useState(null);

    const [confirmRow, setConfirmRow] = useState(null);
    const [rowDeleting, setRowDeleting] = useState(false);
    const [rowError, setRowError] = useState(null);

    const dates = useMemo(() => {
        const set = new Set(
            records
                .map((r) => String(r.date ?? '').slice(0, 10))
                .filter(Boolean)
        );
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

    const handleCreateGroup = async (payload) => {
        setGroupSaving(true);
        try {
            await createGroup(payload);
        } finally {
            setGroupSaving(false);
        }
    };

    const handleOpenDeleteGroup = () => {
        setGroupDeleteError(null);
        setConfirmGroupOpen(true);
    };

    const handleConfirmDeleteGroup = async () => {
        setGroupDeleting(true);
        setGroupDeleteError(null);
        try {
            await deleteGroup(selectedGroupId);
            setConfirmGroupOpen(false);
        } catch (err) {
            setGroupDeleteError(
                err.userMessage ??
                err.message ??
                'Не удалось удалить группу. Возможно, в ней есть записи.'
            );
        } finally {
            setGroupDeleting(false);
        }
    };

    const handleCreateComputer = async (payload) => {
        setComputerSaving(true);
        try {
            await createComputer(payload);
        } finally {
            setComputerSaving(false);
        }
    };

    const handleDeleteComputer = async (id) => {
        await deleteComputer(id);
    };

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
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCell = async (recordId) => {
        setDeleting(true);
        try {
            await deleteRecord(recordId);
            setModalOpen(false);
            setEditingCell(null);
        } finally {
            setDeleting(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingCell(null);
    };

    const handleOpenDeleteColumn = (date) => {
        const count = records.filter(
            (r) =>
                r.id != null &&
                String(r.date).slice(0, 10) === String(date).slice(0, 10)
        ).length;
        if (count === 0) return;
        setColumnError(null);
        setConfirmColumn({ date, count });
    };

    const handleConfirmDeleteColumn = async () => {
        if (!confirmColumn) return;
        setColumnDeleting(true);
        setColumnError(null);
        try {
            await deleteColumnRecords(confirmColumn.date, selectedGroupId);
            setConfirmColumn(null);
        } catch (err) {
            setColumnError(
                err.userMessage ?? err.message ?? 'Не удалось удалить записи столбца.'
            );
        } finally {
            setColumnDeleting(false);
        }
    };

    const handleOpenDeleteRow = (computer) => {
        const count = records.filter(
            (r) =>
                r.id != null &&
                String(r.computerName).trim() === String(computer.name).trim()
        ).length;
        if (count === 0) return;
        setRowError(null);
        setConfirmRow({ computer, count });
    };

    const handleConfirmDeleteRow = async () => {
        if (!confirmRow) return;
        setRowDeleting(true);
        setRowError(null);
        try {
            await deleteRowRecords(confirmRow.computer.name, selectedGroupId);
            setConfirmRow(null);
        } catch (err) {
            setRowError(
                err.userMessage ?? err.message ?? 'Не удалось удалить записи ПК.'
            );
        } finally {
            setRowDeleting(false);
        }
    };

    const handleExport = () => {
        if (!selectedGroupId) return;
        exportExcel(selectedGroupId);
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
                onExport={handleExport}
                exporting={exporting}
                onAddComputer={() => setComputerModalOpen(true)}
                onAddGroup={() => setGroupModalOpen(true)}
                onDeleteGroup={handleOpenDeleteGroup}
                onManageComputers={() => setManageComputersOpen(true)}
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
                onDeleteColumn={handleOpenDeleteColumn}
                onDeleteRow={handleOpenDeleteRow}
                groupName={selectedGroup?.name ?? selectedGroup?.title ?? ''}
            />

            <CellEditorModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCell}
                onDelete={handleDeleteCell}
                initialData={editingCell?.record ?? null}
                saving={saving}
                deleting={deleting}
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

            <ManageComputersModal
                open={manageComputersOpen}
                onClose={() => setManageComputersOpen(false)}
                computers={computers}
                onDelete={handleDeleteComputer}
            />

            <ConfirmDeleteModal
                open={confirmGroupOpen}
                onClose={() => setConfirmGroupOpen(false)}
                onConfirm={handleConfirmDeleteGroup}
                title="Удалить текущую группу?"
                description={`Группа «${selectedGroup?.name ?? selectedGroupId
                    }» будет удалена безвозвратно. Если в ней есть записи, удаление не пройдёт.`}
                confirmLabel="Удалить группу"
                busy={groupDeleting}
                error={groupDeleteError}
            />

            <ConfirmDeleteModal
                open={Boolean(confirmColumn)}
                onClose={() => setConfirmColumn(null)}
                onConfirm={handleConfirmDeleteColumn}
                title={`Удалить все записи за ${confirmColumn?.date}?`}
                description={`Будет удалено ${confirmColumn?.count} запис. Действие необратимо.`}
                confirmLabel="Удалить записи"
                busy={columnDeleting}
                error={columnError}
            />

            <ConfirmDeleteModal
                open={Boolean(confirmRow)}
                onClose={() => setConfirmRow(null)}
                onConfirm={handleConfirmDeleteRow}
                title={`Удалить все записи для «${confirmRow?.computer?.name}»?`}
                description={`Будет удалено ${confirmRow?.count} записей(-ись). Действие необратимо.`}
                confirmLabel="Удалить записи"
                busy={rowDeleting}
                error={rowError}
            />
        </div>
    );
}