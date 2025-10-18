import React from 'react';
import { formatTime } from '../utils/formatters';

const PlayIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const PauseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const ResetIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14" /></svg>);
const SaveIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>);

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
    <div className="flex flex-col items-center justify-center gap-8 py-10">
      <div 
        className="text-center w-full" 
        aria-live="polite" 
        aria-atomic="true"
        role="timer"
      >
        <p className="font-mono text-7xl sm:text-8xl md:text-9xl tracking-tighter text-white">
          {formatTime(time)}
        </p>
      </div>
      <div className="flex items-center justify-center gap-4">
        {isRunning ? (
          <button onClick={onPause} className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-transform transform hover:scale-105" aria-label="Pausar cronômetro">
            <PauseIcon />
            Pausar
          </button>
        ) : (
          <button onClick={onStart} className="bg-green-500 hover:bg-green-600 text-slate-900 font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-transform transform hover:scale-105" aria-label={isPaused ? "Retomar cronômetro" : "Iniciar cronômetro"}>
            <PlayIcon />
            {isPaused ? 'Retomar' : 'Iniciar'}
          </button>
        )}
        {time > 0 && (
          <button onClick={onReset} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-transform transform hover:scale-105" aria-label="Reiniciar cronômetro">
            <ResetIcon />
            Reiniciar
          </button>
        )}
        {isPaused && (
           <button onClick={onSave} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-transform transform hover:scale-105" aria-label="Salvar tempo">
            <SaveIcon />
            Salvar
          </button>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;