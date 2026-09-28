using LabJournal.Application.Common.Interfaces;
using LabJournal.Application.Features.TaskRecord.Query.ExportTaskRecords;
using MediatR;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;

namespace LabJournal.Application.Features.TaskRecords.Queries.ExportTaskRecords;

public class ExportTaskRecordsToExcelQueryHandler(IApplicationDbContext context)
    : IRequestHandler<ExportTaskRecordsToExcelQuery, byte[]>
{
    public async Task<byte[]> Handle(ExportTaskRecordsToExcelQuery request, CancellationToken cancellationToken)
    {
        var query = context.TaskRecords
            .Include(tr => tr.Computer)
            .Include(tr => tr.Group)
            .AsNoTracking();

        if (request.DateFrom.HasValue)
            query = query.Where(tr => tr.Date >= request.DateFrom.Value);

        if (request.DateTo.HasValue)
            query = query.Where(tr => tr.Date <= request.DateTo.Value);

        if (request.GroupId.HasValue)
            query = query.Where(tr => tr.GroupId == request.GroupId.Value);

        var records = await query
            .OrderBy(tr => tr.Date)
            .ThenBy(tr => tr.Computer.Name)
            .ToListAsync(cancellationToken);

        using var package = new ExcelPackage();
        var worksheet = package.Workbook.Worksheets.Add("Журнал занятий");

        worksheet.Cells["A1"].Value = "Дата";
        worksheet.Cells["B1"].Value = "Группа";
        worksheet.Cells["C1"].Value = "ФИО Ученика(ов)";
        worksheet.Cells["D1"].Value = "Номер компьютера";
        worksheet.Cells["E1"].Value = "Выполненные задания";

        using (var headerRange = worksheet.Cells["A1:E1"])
        {
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
            headerRange.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(230, 230, 230)); // Светло-серый оттенок
            headerRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            headerRange.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
        }

        worksheet.Row(1).Height = 25;

        int row = 2;
        foreach (var record in records)
        {
            worksheet.Cells[row, 1].Value = record.Date.ToString("dd.MM.yyyy");
            worksheet.Cells[row, 2].Value = record.Group.Name;
            worksheet.Cells[row, 3].Value = record.StudentFullName;
            worksheet.Cells[row, 4].Value = record.Computer.Name;
            worksheet.Cells[row, 5].Value = record.TaskDone;

            worksheet.Cells[row, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            worksheet.Cells[row, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

            worksheet.Cells[row, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            worksheet.Cells[row, 2].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            worksheet.Cells[row, 3].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            worksheet.Cells[row, 4].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            worksheet.Cells[row, 5].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

            worksheet.Row(row).Height = 20;
            row++;
        }

        if (records.Count > 0 || row > 2)
        {
            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
        }

        int totalRows = row - 1;
        if (totalRows >= 1)
        {
            var dataRange = worksheet.Cells[1, 1, totalRows, 5];
            dataRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;

            var gridColor = Color.FromArgb(180, 180, 180);
            dataRange.Style.Border.Top.Color.SetColor(gridColor);
            dataRange.Style.Border.Bottom.Color.SetColor(gridColor);
            dataRange.Style.Border.Left.Color.SetColor(gridColor);
            dataRange.Style.Border.Right.Color.SetColor(gridColor);
        }

        return await package.GetAsByteArrayAsync(cancellationToken);
    }
}
