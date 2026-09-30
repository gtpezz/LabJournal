export const getTodayISO = () => new Date().toISOString().slice(0, 10);

export const formatDateLabel = (isoDate) => {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};