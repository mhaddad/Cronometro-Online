import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useStopwatch } from './hooks/useStopwatch';
import Stopwatch from './components/Stopwatch';
import HistoryPanel from './components/HistoryPanel';
import type { TimeEntry } from './types';
import { formatTime, exportToCsv } from './utils/formatters';

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
    <div className={`is-flex is-align-items-center is-justify-content-center has-text-slate-500 has-background-slate-800 w-full is-rounded ${className}`} style={{minHeight: '90px'}}>
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
  <section className="content p-6 has-text-slate-400">
    <h2 className="title is-3 has-text-white">Tudo Sobre Cronômetros</h2>
    <h3 className="title is-4 has-text-slate-200">O que é um cronômetro?</h3>
    <p>Um cronômetro é um instrumento projetado para medir com precisão a quantidade de tempo que decorre entre o seu acionamento e a sua desativação. O Cronômetro Online 2.0 é uma versão digital moderna, que oferece precisão, simplicidade e funcionalidades extras como histórico e modo foco.</p>
    <h3 className="title is-4 has-text-slate-200">Usos Comuns</h3>
    <p>Cronômetros são versáteis e usados em diversas áreas: atletas medem seus tempos de corrida, cozinheiros controlam o preparo de receitas, estudantes gerenciam seu tempo de estudo (técnica Pomodoro), e profissionais otimizam a produtividade em tarefas.</p>
    <h3 className="title is-4 has-text-slate-200">Curiosidades</h3>
    <p>O primeiro cronômetro moderno foi inventado por Nicolas Mathieu Rieussec em 1821 para cronometrar corridas de cavalos. A palavra "cronômetro" vem do grego "khronos" (tempo) e "metron" (medida).</p>
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

  const mainContainerClasses = `section is-flex is-flex-direction-column has-text-white p-4`;

  return (
    <div className={`${mainContainerClasses} ${showFocusMode ? 'is-justify-content-center' : 'is-justify-content-space-between'}`} style={{minHeight: '100vh'}}>
      
      <header className={`container ${showFocusMode ? 'is-hidden' : ''}`}>
        <div className="level is-mobile mb-4">
          <div className="level-left">
             <h1 className="title is-3 has-text-white">Cronômetro Online <span className="has-text-cyan-400">2.0</span></h1>
          </div>
          <div className="level-right">
             <button onClick={() => setIsFocusMode(prev => !prev)} className="button is-slate is-small has-text-weight-semibold">
              {isFocusMode ? 'Sair do' : 'Entrar no'} Modo Foco (F)
            </button>
          </div>
        </div>
        <AdSenseUnit slot="5825935070" />
      </header>
      
      <main className="container is-flex is-flex-direction-column is-align-items-center is-justify-content-center is-flex-grow-1">
          <div className={`w-full mb-4 ${showFocusMode ? 'is-hidden' : ''}`}>
             <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva sua atividade aqui..."
              maxLength={100}
              className="input is-dark-theme has-text-centered is-size-5 p-3"
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
           <button onClick={handleShare} className="button is-indigo is-rounded is-medium mt-4 has-text-weight-bold">
            Compartilhar Resultado
          </button>
        )}
      </main>

      <footer className={`container ${showFocusMode ? 'is-hidden' : ''}`} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
        <HistoryPanel history={history} onClear={handleClearHistory} onExport={() => exportToCsv(history)} />
        <AdSenseUnit slot="5825935070" />
        <SeoContent />
        <div className="has-text-centered has-text-slate-500 is-size-7 pb-4">
            Feito com ❤️ por um Engenheiro de Frontend.
        </div>
      </footer>
    </div>
  );
}

export default App;