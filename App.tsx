import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useStopwatch } from './hooks/useStopwatch';
import Stopwatch from './components/Stopwatch';
import HistoryPanel from './components/HistoryPanel';
import type { TimeEntry } from './types';
import { formatTime, exportToCsv } from './utils/formatters';

// Adiciona a propriedade adsbygoogle ao objeto window para o TypeScript
declare global {
    interface Window {
        adsbygoogle?: { [key: string]: unknown }[];
    }
}

const AdSenseUnit: React.FC<{ className?: string, slot: string }> = ({ className = '', slot }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error: ", e);
    }
  }, []);

  return (
    <div className={`flex items-center justify-center text-slate-500 bg-slate-800 w-full min-h-[90px] rounded-lg overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '90px' }}
        data-ad-client="ca-pub-5144966648864454"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};


const SeoContent: React.FC = () => (
  <section className="w-full max-w-4xl mx-auto p-6 text-slate-400 space-y-6">
    <h2 className="text-3xl font-bold text-white">Tudo Sobre Cronômetros</h2>
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-slate-200">O que é um cronômetro?</h3>
      <p>Um cronômetro é um instrumento projetado para medir com precisão a quantidade de tempo que decorre entre o seu acionamento e a sua desativação. O Cronômetro Online 2.0 é uma versão digital moderna, que oferece precisão, simplicidade e funcionalidades extras como histórico e modo foco.</p>
      <h3 className="text-2xl font-semibold text-slate-200">Usos Comuns</h3>
      <p>Cronômetros são versáteis e usados em diversas áreas: atletas medem seus tempos de corrida, cozinheiros controlam o preparo de receitas, estudantes gerenciam seu tempo de estudo (técnica Pomodoro), e profissionais otimizam a produtividade em tarefas.</p>
      <h3 className="text-2xl font-semibold text-slate-200">Curiosidades</h3>
      <p>O primeiro cronômetro moderno foi inventado por Nicolas Mathieu Rieussec em 1821 para cronometrar corridas de cavalos. A palavra "cronômetro" vem do grego "khronos" (tempo) e "metron" (medida).</p>
    </div>
  </section>
);


const App: React.FC = () => {
  const { time, isRunning, start, pause, reset } = useStopwatch();
  const [description, setDescription] = useState<string>(() => localStorage.getItem('stopwatchDescription') || '');
  const [history, setHistory] = useState<TimeEntry[]>(() => {
      try {
        const savedHistory = localStorage.getItem('stopwatchHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
      } catch (error) {
        console.error("Failed to parse history from localStorage", error);
        return [];
      }
  });
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  const isPaused = !isRunning && time > 0;
  const showFocusMode = useMemo(() => isRunning || isFocusMode, [isRunning, isFocusMode]);

  useEffect(() => {
    localStorage.setItem('stopwatchDescription', description);
  }, [description]);

  useEffect(() => {
    localStorage.setItem('stopwatchHistory', JSON.stringify(history));
  }, [history]);

  const handleSaveTime = useCallback(() => {
    if (time === 0) return;
    const newEntry: TimeEntry = {
      id: Date.now(),
      description: description || 'Tempo salvo',
      time,
      date: new Date().toLocaleString('pt-BR'),
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 20));
  }, [time, description]);

  const handleClearHistory = useCallback(() => {
    if(window.confirm("Você tem certeza que deseja limpar todo o histórico?")) {
        setHistory([]);
    }
  }, []);
  
  const handleShare = useCallback(async () => {
    const shareText = `Eu cronometrei "${description || 'uma atividade'}" em ${formatTime(time)}! Confira o Cronômetro Online 2.0`;
    const shareData = {
        title: 'Resultado do Cronômetro',
        text: shareText,
        url: window.location.href
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareText);
            alert('Resultado copiado para a área de transferência!');
        }
    } catch (err) {
        console.error('Error sharing:', err);
        alert('Não foi possível compartilhar.');
    }
  }, [time, description]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).tagName === 'INPUT') return;
      
      if (event.code === 'Space') {
        event.preventDefault();
        isRunning ? pause() : start();
      } else if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        reset();
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        setIsFocusMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRunning, pause, start, reset]);

  return (
    <div className={`min-h-screen text-white flex flex-col items-center transition-all duration-300 p-4 ${showFocusMode ? 'bg-slate-900 justify-center' : 'bg-slate-900 justify-between'}`}>
      
      <header className={`w-full max-w-4xl mx-auto transition-all duration-300 ${showFocusMode ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold">Cronômetro Online <span className="text-cyan-400">2.0</span></h1>
          <button onClick={() => setIsFocusMode(prev => !prev)} className="bg-slate-700 hover:bg-slate-600 text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
            {isFocusMode ? 'Sair do' : 'Entrar no'} Modo Foco (F)
          </button>
        </div>
        <AdSenseUnit slot="5825935070" />
      </header>
      
      <main className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto flex-grow">
          <div className={`w-full transition-all duration-300 mb-4 ${showFocusMode ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
             <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva sua atividade aqui..."
              maxLength={100}
              className="w-full bg-slate-800 text-white placeholder-slate-400 text-center text-xl p-3 rounded-lg border-2 border-transparent focus:border-cyan-500 focus:outline-none transition-colors"
             />
          </div>
        
        <Stopwatch 
          time={time} 
          isRunning={isRunning} 
          onStart={start} 
          onPause={pause} 
          onReset={reset} 
          onSave={handleSaveTime} 
        />
        
        {isPaused && (
           <button onClick={handleShare} className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-5 rounded-full transition-colors">
            Compartilhar Resultado
          </button>
        )}
      </main>

      <footer className={`w-full transition-all duration-300 space-y-6 ${showFocusMode ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <HistoryPanel history={history} onClear={handleClearHistory} onExport={() => exportToCsv(history)} />
        <AdSenseUnit slot="5825935070" />
        <SeoContent />
        <div className="text-center text-slate-500 text-sm pb-4">
            Feito com ❤️ por um Engenheiro de Frontend.
        </div>
      </footer>
    </div>
  );
}

export default App;