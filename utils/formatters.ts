
import type { TimeEntry } from '../types';

export const formatTime = (timeInMs: number): string => {
  const centiseconds = Math.floor((timeInMs % 1000) / 10);
  const totalSeconds = Math.floor(timeInMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(centiseconds)}`;
};

export const exportToCsv = (history: TimeEntry[]): void => {
  if (history.length === 0) return;

  const headers = ['Data', 'Descrição', 'Tempo (Formatado)', 'Tempo (ms)'];
  const rows = history.map(entry => [
    entry.date,
    `"${entry.description.replace(/"/g, '""')}"`,
    formatTime(entry.time),
    entry.time.toString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'historico_cronometro.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
