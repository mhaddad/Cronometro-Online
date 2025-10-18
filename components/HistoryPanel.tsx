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
    <div className="box has-background-slate-800-semi p-4 md:p-6">
      <div className="level mb-4">
        <div className="level-left">
          <h2 className="title is-4 has-text-white">Histórico</h2>
        </div>
        <div className="level-right">
          <div className="buttons are-small">
             <button onClick={onExport} className="button is-info has-text-weight-semibold">
              Exportar (.csv)
            </button>
            <button onClick={onClear} className="button is-red-clear has-text-weight-semibold">
              Limpar Histórico
            </button>
          </div>
        </div>
      </div>
      <div className="table-container is-dark-theme" style={{maxHeight: '20rem', overflowY: 'auto'}}>
        <table className="table is-fullwidth is-dark-theme">
          <thead>
            <tr>
              <th className="p-3">Descrição</th>
              <th className="p-3 has-text-right">Tempo</th>
              <th className="p-3 has-text-right is-hidden-mobile">Data</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={entry.id} className={index % 2 === 0 ? 'is-striped' : ''}>
                <td className="p-3 has-text-white" style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{entry.description || '-'}</td>
                <td className="p-3 is-family-monospace has-text-right is-size-6 has-text-white">{formatTime(entry.time)}</td>
                <td className="p-3 has-text-right is-hidden-mobile">{entry.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPanel;