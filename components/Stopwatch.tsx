import React from 'react';
import { formatTime } from '../utils/formatters';

const PlayIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const PauseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const ResetIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14" /></svg>);
const SaveIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>);

interface StopwatchProps {
  time: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSave: () => void;
}

const Stopwatch: React.FC<StopwatchProps> = ({ time, isRunning, onStart, onPause, onReset, onSave }) => {
  const isPaused = !isRunning && time > 0;

  return (
    <div className="is-flex is-flex-direction-column is-align-items-center is-justify-content-center py-6" style={{gap: '2rem'}}>
      <div 
        className="has-text-centered w-full" 
        aria-live="polite" 
        aria-atomic="true"
        role="timer"
      >
        <p className="is-family-monospace is-size-1-desktop is-size-2-tablet is-size-3 has-text-white" style={{letterSpacing: '-0.05em'}}>
          {formatTime(time)}
        </p>
      </div>
      <div className="buttons are-large is-centered">
        {isRunning ? (
          <button onClick={onPause} className="button is-yellow is-rounded has-text-weight-bold" aria-label="Pausar cronômetro">
            <span className="icon"><PauseIcon /></span>
            <span>Pausar</span>
          </button>
        ) : (
          <button onClick={onStart} className="button is-green is-rounded has-text-weight-bold" aria-label={isPaused ? "Retomar cronômetro" : "Iniciar cronômetro"}>
             <span className="icon"><PlayIcon /></span>
            <span>{isPaused ? 'Retomar' : 'Iniciar'}</span>
          </button>
        )}
        {time > 0 && (
          <button onClick={onReset} className="button is-red is-rounded has-text-weight-bold" aria-label="Reiniciar cronômetro">
            <span className="icon"><ResetIcon /></span>
            <span>Reiniciar</span>
          </button>
        )}
        {isPaused && (
           <button onClick={onSave} className="button is-info is-rounded has-text-weight-bold" aria-label="Salvar tempo">
            <span className="icon"><SaveIcon /></span>
            <span>Salvar</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;