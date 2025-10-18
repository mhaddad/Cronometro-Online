
import React from 'react';
import type { TimeEntry } from '../types';
import { formatTime } from '../utils/formatters';

interface HistoryPanelProps {
  history: TimeEntry[];
  onClear: () => void;
  onExport: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClear, onExport }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-slate-800/50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Histórico</h2>
        <div className="flex gap-2">
           <button onClick={onExport} className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Exportar (.csv)
          </button>
          <button onClick={onClear} className="text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Limpar Histórico
          </button>
        </div>
      </div>
      <div className="overflow-x-auto max-h-80">
        <table className="w-full text-left text-slate-300">
          <thead className="sticky top-0 bg-slate-800">
            <tr>
              <th className="p-3">Descrição</th>
              <th className="p-3 text-right">Tempo</th>
              <th className="p-3 text-right hidden md:table-cell">Data</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={entry.id} className={`${index % 2 === 0 ? 'bg-slate-700/50' : 'bg-slate-700/20'} border-b border-slate-700`}>
                <td className="p-3 font-medium text-white truncate max-w-xs">{entry.description || '-'}</td>
                <td className="p-3 font-mono text-right text-lg text-white">{formatTime(entry.time)}</td>
                <td className="p-3 text-right hidden md:table-cell">{entry.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPanel;
