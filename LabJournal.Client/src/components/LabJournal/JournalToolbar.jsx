import React from 'react';
import Select from '../ui/Select';
import Button from '../ui/Button';

export default function JournalToolbar({
    groups,
    selectedGroupId,
    onGroupChange,
    onAddToday,
    addTodayDisabled,
    onAddDate,
    onExport,
    exporting,
    onAddComputer,
    onAddGroup,
    onDeleteGroup,
    onManageComputers,
    hasGroup,
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    Журнал лабораторных работ
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Матрица «Компьютеры × Даты занятий»
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-600">Группа:</label>

                    <Select value={selectedGroupId} onChange={onGroupChange}>
                        {groups.length === 0 && <option value="">— нет групп —</option>}
                        {groups.map((g) => (
                            <option key={g.id} value={String(g.id)}>
                                {g.name ?? g.title ?? `Группа ${g.id}`}
                            </option>
                        ))}
                    </Select>

                    <Button
                        variant="outline"
                        onClick={onAddGroup}
                        title="Добавить группу"
                        className="!px-3"
                    >
                        +
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onDeleteGroup}
                        disabled={!hasGroup}
                        title="Удалить текущую группу"
                        className="!px-3 !text-rose-600 hover:!bg-rose-50"
                    >
                        🗑
                    </Button>
                </div>

                <Button
                    variant="outline"
                    onClick={onAddComputer}
                    title="Добавить компьютер"
                >
                    🖥 Добавить ПК
                </Button>

                <Button
                    variant="outline"
                    onClick={onManageComputers}
                    title="Управление компьютерами (удаление)"
                >
                    ⚙ ПК
                </Button>

                <Button
                    variant="outline"
                    onClick={onAddToday}
                    disabled={addTodayDisabled}
                    title="Добавить столбец на сегодняшнюю дату"
                >
                    📅 Сегодня
                </Button>

                <Button
                    variant="outline"
                    onClick={onAddDate}
                    disabled={!hasGroup}
                    title="Выбрать произвольную дату занятия"
                >
                    📅 Выбрать дату…
                </Button>

                <Button
                    variant="success"
                    onClick={onExport}
                    disabled={!hasGroup || exporting}
                    title="Выгрузить отчёт в Excel"
                >
                    {exporting ? 'Выгрузка…' : '📊 Выгрузить в Excel'}
                </Button>
            </div>
        </div>
    );
}