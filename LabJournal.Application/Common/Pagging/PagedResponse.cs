namespace LabJournal.Application.Common.Pagging;

public class PagedResponse<T>(List<T> items, int count, int pageNumber, int pageSize)
{
    public List<T> Items { get; set; } = items;
    public int PageSize { get; set; } = pageSize;
    public int PageNumber { get; set; } = pageNumber;
    public int TotalCount { get; set; } = count;
    public int TotalPages { get; set; } = (int)Math.Ceiling(count / (double)pageSize);

    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;
}
