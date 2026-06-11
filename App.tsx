import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  Play, 
  Globe, 
  Users, 
  User, 
  Sparkles, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  ArrowRight,
  BookOpen,
  Compass,
  Plane,
  Heart,
  Volume2
} from 'lucide-react';
import { dialogues, duelQuestions } from './data';
import { DialogueData, DialogueLine, QuizQuestion, ScoreRecord } from './types';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'gor' | 'gayane' | 'duel' | 'records'>('gor');

  // Interactive Gap Filling States
  // key of map: "dialogueId_lineId_blankIndex" -> value: "user text"
  const [filledWords, setFilledWords] = useState<Record<string, string>>({});
  const [selectedBlank, setSelectedBlank] = useState<{ lineId: string; blankIndex: number } | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({}); // dialogueId -> hasBeenChecked
  const [showCelebration, setShowCelebration] = useState<string | null>(null); // dialogueId of completed dialogue

  // Armenian translation toggle per line
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({});

  // Duel State
  const [duelMode, setDuelMode] = useState<'selection' | 'playing' | 'ended'>('selection');
  const [gameType, setGameType] = useState<'duel' | 'gor_solo' | 'gayane_solo'>('duel');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameQuestions, setGameQuestions] = useState<QuizQuestion[]>([]);
  const [scores, setScores] = useState({ gor: 0, gayane: 0 });
  const [soloScore, setSoloScore] = useState(0);
  const [quizTurn, setQuizTurn] = useState<'gor' | 'gayane'>('gor');
  const [timer, setTimer] = useState(20);
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [answerStatus, setAnswerStatus] = useState<'unanswered' | 'correct' | 'incorrect'>('unanswered');
  const [selectedAnswersLog, setSelectedAnswersLog] = useState<{ question: string; selected: string; correct: string; isCorrect: boolean }[]>([]);
  const [chosenAnswer, setChosenAnswer] = useState<string | null>(null);

  // Leaderboard statistics state
  const [leaderboard, setLeaderboard] = useState<ScoreRecord[]>([]);

  // Sound simulations (Visual effects & haptic feel)
  const [confetti, setConfetti] = useState<{ x: number; y: number; color: string }[]>([]);

  // Pronunciation feedback simulations
  const [playingAudioLine, setPlayingAudioLine] = useState<string | null>(null);

  // Hydrate local records
  useEffect(() => {
    const saved = localStorage.getItem('spanish_study_records_v1');
    if (saved) {
      try {
        setLeaderboard(JSON.parse(saved));
      } catch (e) {
        console.error("Error reading leaderboard", e);
      }
    }
  }, []);

  // Timer run loop for interactive speed translation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (duelMode === 'playing' && answerStatus === 'unanswered') {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // Time out!
            handleQuizAnswer('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [duelMode, currentQuestionIndex, answerStatus]);

  // Spark confetti generation
  const triggerConfetti = () => {
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#ec4899', '#8b5cf6'];
    const array = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setConfetti(array);
    setTimeout(() => setConfetti([]), 3500);
  };

  // Dialogue selection according to active target
  const currentDialogue = dialogues.find(d => {
    if (activeTab === 'gor') return d.id === 'gor_weekend';
    if (activeTab === 'gayane') return d.id === 'gayane_airport';
    return false;
  });

  // Calculate gaps for dialogue checking
  const getGapsInLine = (line: DialogueLine) => {
    const parts = line.textTemplate.split('__________');
    return parts.length - 1;
  };

  // Speak pronunciation simulation using standard Web Speech API
  const handleSpeakText = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85; // Slightly slower for clear learning
      utterance.onstart = () => setPlayingAudioLine(text);
      utterance.onend = () => setPlayingAudioLine(null);
      utterance.onerror = () => setPlayingAudioLine(null);
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback visual simulation
      setPlayingAudioLine(text);
      setTimeout(() => setPlayingAudioLine(null), 1500);
    }
  };

  // Flow A: click word block, then click any gap to insert
  const handleWordSelect = (word: string) => {
    if (selectedBlank) {
      // Directly place into selected blank
      const key = `${activeTab}_${selectedBlank.lineId}_${selectedBlank.blankIndex}`;
      setFilledWords({ ...filledWords, [key]: word });
      setSelectedBlank(null);
      setSelectedWord(null);
    } else {
      setSelectedWord(word === selectedWord ? null : word);
    }
  };

  // Flow B: click empty gap, then click any word to insert or highlight gap
  const handleBlankClick = (lineId: string, blankIndex: number) => {
    const key = `${activeTab}_${lineId}_${blankIndex}`;
    
    if (selectedWord) {
      // Place the already selected word there
      setFilledWords({ ...filledWords, [key]: selectedWord });
      setSelectedWord(null);
      setSelectedBlank(null);
    } else {
      // If same is already selected, unselect
      if (selectedBlank?.lineId === lineId && selectedBlank?.blankIndex === blankIndex) {
        setSelectedBlank(null);
      } else {
        setSelectedBlank({ lineId, blankIndex });
      }
    }
  };

  // Clear single blank item
  const clearBlank = (lineId: string, blankIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = `${activeTab}_${lineId}_${blankIndex}`;
    const updated = { ...filledWords };
    delete updated[key];
    setFilledWords(updated);
    if (selectedBlank?.lineId === lineId && selectedBlank?.blankIndex === blankIndex) {
      setSelectedBlank(null);
    }
  };

  // Verify dialogue answers
  const handleCheckDialogue = (dialogue: DialogueData) => {
    let allCorrect = true;
    let missingAtLeastOne = false;

    dialogue.lines.forEach(line => {
      line.missingWords.forEach((word, index) => {
        const key = `${activeTab}_${line.id}_${index}`;
        const userProvided = filledWords[key];
        if (!userProvided) {
          missingAtLeastOne = true;
          allCorrect = false;
        } else if (userProvided.trim().toLowerCase() !== word.trim().toLowerCase()) {
          allCorrect = false;
        }
      });
    });

    setCheckedAnswers({ ...checkedAnswers, [dialogue.id]: true });

    if (allCorrect) {
      triggerConfetti();
      setShowCelebration(dialogue.id);
    }
  };

  // Reset dialogue
  const handleResetDialogue = (dialogueId: string) => {
    const updatedAnswers = { ...filledWords };
    const prefix = activeTab + '_';
    Object.keys(updatedAnswers).forEach(key => {
      if (key.startsWith(prefix)) {
        delete updatedAnswers[key];
      }
    });
    setFilledWords(updatedAnswers);
    setCheckedAnswers({ ...checkedAnswers, [dialogueId]: false });
    setShowCelebration(null);
    setSelectedBlank(null);
    setSelectedWord(null);
  };

  // Setup Quiz Competition Game
  const startQuiz = (mode: 'duel' | 'gor_solo' | 'gayane_solo') => {
    setGameType(mode);
    setDuelMode('playing');
    setCurrentQuestionIndex(0);
    setScores({ gor: 0, gayane: 0 });
    setSoloScore(0);
    setQuizTurn('gor');
    setAnswerStatus('unanswered');
    setChosenAnswer(null);
    setSelectedAnswersLog([]);
    setTimer(20);

    // Shuffle a pool of 10 random questions out of 27 seed phrases
    const shuffled = [...duelQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    setGameQuestions(shuffled);
  };

  // Submit Answer to Duel
  const handleQuizAnswer = (selected: string) => {
    if (answerStatus !== 'unanswered') return;

    setChosenAnswer(selected);
    const question = gameQuestions[currentQuestionIndex];
    const isCorrect = selected === question.correctSpanish;
    
    // Calculate speed bonus score (100 base + 40 per remaining seconds)
    const pointsEarned = isCorrect ? Math.max(100, 100 + timer * 45) : 0;

    if (isCorrect) {
      // Simple play simulation sound visually
      triggerConfetti();
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }

    // Append history
    setSelectedAnswersLog((prev) => [
      ...prev,
      {
        question: question.armenianText,
        selected: selected || 'Ժամանակը սպառվեց',
        correct: question.correctSpanish,
        isCorrect
      }
    ]);

    // Apply scores
    if (gameType === 'duel') {
      if (quizTurn === 'gor') {
        setScores(prev => ({ ...prev, gor: prev.gor + pointsEarned }));
      } else {
        setScores(prev => ({ ...prev, gayane: prev.gayane + pointsEarned }));
      }
    } else {
      // Solo Mode
      setSoloScore((prev) => prev + pointsEarned);
    }
  };

  // Next Question or End Duel Game
  const handleNextQuiz = () => {
    const isLast = currentQuestionIndex === gameQuestions.length - 1;
    if (isLast) {
      // Game Over, log scoreboard records
      const newLogs: ScoreRecord[] = [];
      const currentDateString = new Date().toLocaleString('hy-AM', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });

      if (gameType === 'duel') {
        const gorRecord: ScoreRecord = {
          player: 'Գոռ',
          score: scores.gor,
          total: scores.gor + scores.gayane === 0 ? 0 : 100, // percentage helper
          date: currentDateString
        };
        const gayaneRecord: ScoreRecord = {
          player: 'Գայանե',
          score: scores.gayane,
          total: scores.gor + scores.gayane === 0 ? 0 : 100,
          date: currentDateString
        };
        newLogs.push(gorRecord, gayaneRecord);
      } else if (gameType === 'gor_solo') {
        newLogs.push({
          player: 'Գոռ',
          score: soloScore,
          total: 10,
          date: currentDateString
        });
      } else {
        newLogs.push({
          player: 'Գայանե',
          score: soloScore,
          total: 10,
          date: currentDateString
        });
      }

      const updatedLeaderboard = [...newLogs, ...leaderboard].slice(0, 20); // Keep top 20 battles
      setLeaderboard(updatedLeaderboard);
      localStorage.setItem('spanish_study_records_v1', JSON.stringify(updatedLeaderboard));

      setDuelMode('ended');
      triggerConfetti();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswerStatus('unanswered');
      setChosenAnswer(null);
      setTimer(20);
      
      // Toggles turns in duel mode
      if (gameType === 'duel') {
        setQuizTurn(prev => (prev === 'gor' ? 'gayane' : 'gor'));
      }
    }
  };

  // Clear Leaderboard storage
  const handleClearRecords = () => {
    localStorage.removeItem('spanish_study_records_v1');
    setLeaderboard([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-200">
      
      {/* Decorative top strip banner - Armenian & Spanish Theme */}
      <div className="h-2 bg-gradient-to-r from-red-600 via-blue-600 to-orange-500 flex justify-between absolute top-0 left-0 right-0 z-50">
        <div className="h-full w-1/2 bg-gradient-to-r from-yellow-500 to-red-600"></div>
      </div>

      {/* Confetti Visual effect */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {confetti.map((c, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 6 + 'px',
              height: Math.random() * 8 + 6 + 'px',
              backgroundColor: c.color,
              left: c.x + '%',
              top: c.y + '%',
              opacity: 0.85,
              transform: `translateY(${Math.sin(i) * 20}px)`,
              transition: 'all 3s cubic-bezier(0.1, 0.8, 0.3, 1)'
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-16">
        
        {/* Modern Bento-style Navigation Header */}
        <header className="mb-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              Լ
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 flex items-center gap-1 leading-none">
                LinguoQuest <span className="text-indigo-500 font-semibold text-xs bg-indigo-50 px-1.5 py-0.5 rounded-md">v1.1</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Իսպաներենի Ուսումնական հարթակ / Smart Learning App</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-center">
            <button
              onClick={() => setActiveTab('gor')}
              className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all border-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'gor'
                  ? 'bg-blue-100 text-blue-700 border-blue-500 font-extrabold shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-transparent hover:border-slate-350'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${activeTab === 'gor' ? 'bg-blue-500 animate-pulse' : 'bg-slate-450'}`}></span>
              Գոռ (Gor)
            </button>
            <button
              onClick={() => setActiveTab('gayane')}
              className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all border-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'gayane'
                  ? 'bg-rose-100 text-rose-700 border-rose-500 font-extrabold shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-transparent hover:border-slate-350'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${activeTab === 'gayane' ? 'bg-rose-500 animate-pulse' : 'bg-slate-450'}`}></span>
              Գայանե (Gayane)
            </button>
            
            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

            <button
              onClick={() => {
                setActiveTab('duel');
              }}
              className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all border-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'duel'
                  ? 'bg-orange-500 text-white border-orange-600 font-extrabold shadow-sm'
                  : 'bg-orange-50 text-orange-700 border-transparent hover:bg-orange-100 hover:border-orange-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Մրցույթ (Battle)
            </button>

            <button
              onClick={() => setActiveTab('records')}
              className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all border-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'records'
                  ? 'bg-slate-800 text-white border-slate-900 font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-transparent hover:border-slate-350'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              Ռեկորդներ
            </button>
          </div>
        </header>

        {/* Dynamic Screen Render */}
        <main className="relative">
          {(activeTab === 'gor' || activeTab === 'gayane') && currentDialogue && (
            <div className="grid grid-cols-12 gap-5 items-start">
              
              {/* Box 1: Task Header Banner */}
              <div className="col-span-12 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className={`absolute top-0 bottom-0 left-0 w-2 ${activeTab === 'gor' ? 'bg-blue-500' : 'bg-rose-500'}`}></div>
                <div className="pl-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                    activeTab === 'gor' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {currentDialogue.ownerName}ի առաջադրանքը / Task
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    {currentDialogue.titleArm}
                  </h2>
                  <p className="text-xs text-indigo-500 font-semibold tracking-wider uppercase mt-1 font-mono">
                    {currentDialogue.title}
                  </p>
                </div>
                
                <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl text-amber-850 text-xs font-medium max-w-[320px]">
                  💡 <span className="font-bold">Կանոններ՝</span> Տեղադրիր բաց թողած բառերը, իսկ նախադասության վրա սեղմելիս ներքևում անմիջապես կբացվի դրա հայերեն թարգմանությունը։
                </div>
              </div>

              {/* Box 2: Word Bank Area */}
              <section className="col-span-12 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Բառերի ցանկ / Word Bank</h3>
                  <span className="text-xs text-indigo-500 font-medium italic">Ընտրեք ճիշտ բառը</span>
                </div>
                
                <div className="flex gap-2flex-wrap flex-wrap gap-2.5">
                  {currentDialogue.targetWords.map((word, idx) => {
                    let usedCount = 0;
                    Object.keys(filledWords).forEach(key => {
                      if (key.startsWith(`${activeTab}_`) && filledWords[key] === word) {
                        usedCount++;
                      }
                    });

                    const isFullyUsed = (word !== 'comprarán' && word !== 'volaremos') && usedCount > 0;
                    const isSelected = selectedWord === word;

                    return (
                      <button
                        key={`${word}_${idx}`}
                        disabled={isFullyUsed}
                        onClick={() => handleWordSelect(word)}
                        className={`py-2 px-4 rounded-xl font-mono text-sm font-bold transition-all duration-200 cursor-pointer ${
                          isFullyUsed 
                            ? 'bg-slate-100 text-slate-300 border border-slate-200 line-through cursor-not-allowed'
                            : isSelected
                              ? 'bg-amber-500 text-white border-2 border-amber-600 scale-102 shadow-md shadow-amber-200'
                              : activeTab === 'gor'
                                ? 'bg-blue-50 text-blue-800 border border-blue-100 hover:bg-blue-600 hover:text-white hover:scale-[1.02]'
                                : 'bg-rose-50 text-rose-800 border border-rose-100 hover:bg-rose-600 hover:text-white hover:scale-[1.02]'
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>

                {selectedWord && (
                  <div className="flex justify-start mt-3">
                    <button 
                      onClick={() => setSelectedWord(null)}
                      className="text-xs text-slate-450 hover:text-slate-700 underline transition cursor-pointer"
                    >
                      Չեղարկել ընտրությունը
                    </button>
                  </div>
                )}
              </section>

              {/* Box 3: Main Dialogue Chat Window (Spans 9 columns on lg, 12 on mobile) */}
              <section className="col-span-12 lg:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col overflow-hidden">
                <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
                  <span className={`px-3 py-1 text-white rounded text-xs font-bold ${
                    activeTab === 'gor' ? 'bg-blue-600' : 'bg-rose-600'
                  }`}>
                    Դիալոգ 1
                  </span>
                  <h2 className="text-lg font-bold text-slate-800">Planes para el fin de semana</h2>
                </div>
                
                <div className="space-y-4">
                  {currentDialogue.lines.map((line, lineIndex) => {
                    const isTranslationVisible = showTranslation[line.id] || false;
                    const isCarlos = line.speaker === 'Carlos';
                    const speakerColorClass = isCarlos
                      ? 'bg-indigo-50 border-indigo-100 text-indigo-700 text-xs font-bold'
                      : 'bg-emerald-50 border-emerald-100 text-emerald-700 text-xs font-bold';
                    
                    const renderInteractiveText = () => {
                      const parts = line.textTemplate.split('__________');
                      if (parts.length === 1) {
                        return <span className="font-semibold text-slate-700 text-[17px]">{line.textTemplate}</span>;
                      }

                      return (
                        <span className="font-semibold text-slate-700 text-[17px] leading-relaxed flex flex-wrap items-center">
                          {parts.map((partText, partIdx) => {
                            const gapIdx = partIdx;
                            const gapKey = `${activeTab}_${line.id}_${gapIdx}`;
                            const userVal = filledWords[gapKey];
                            const isActiveGap = selectedBlank?.lineId === line.id && selectedBlank?.blankIndex === gapIdx;

                            let checkBorderClass = 'border-slate-200 focus:border-amber-400';
                            let checkTextClass = 'text-slate-700 bg-slate-50';
                            let showIcon : React.ReactNode = null;

                            if (checkedAnswers[currentDialogue.id]) {
                              const actualCorrect = line.missingWords[gapIdx];
                              const isCorrect = userVal?.trim().toLowerCase() === actualCorrect?.trim().toLowerCase();
                              checkBorderClass = isCorrect ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-rose-400 bg-rose-50 shadow-sm';
                              checkTextClass = isCorrect ? 'text-emerald-700 font-extrabold' : 'text-rose-700 line-through font-extrabold';
                              showIcon = isCorrect ? <Check className="w-3.5 h-3.5 text-emerald-600 inline" /> : <X className="w-3.5 h-3.5 text-rose-600 inline" />;
                            } else if (isActiveGap) {
                              checkBorderClass = activeTab === 'gor' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-rose-500 ring-4 ring-rose-50';
                              checkTextClass = 'bg-amber-50 font-bold';
                            }

                            return (
                              <React.Fragment key={partIdx}>
                                <span>{partText}</span>
                                {gapIdx < parts.length - 1 && (
                                  <span className="inline-flex items-center mx-1.5 relative my-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleBlankClick(line.id, gapIdx);
                                      }}
                                      className={`px-3 py-1.5 min-w-[110px] h-9 rounded-xl border-2 text-center text-sm font-semibold transition-all flex items-center justify-center gap-1 shadow-sm ${checkBorderClass} ${checkTextClass} cursor-pointer`}
                                    >
                                      {userVal ? (
                                        <>
                                          <span>{userVal}</span>
                                          {showIcon}
                                        </>
                                      ) : (
                                        <span className="text-slate-400 tracking-widest italic font-light">
                                          {isActiveGap ? 'ընտրիր...' : '...'}
                                        </span>
                                      )}
                                    </button>

                                    {userVal && !checkedAnswers[currentDialogue.id] && (
                                      <button
                                        onClick={(e) => clearBlank(line.id, gapIdx, e)}
                                        className="absolute -top-1.5 -right-1.5 bg-slate-200 text-slate-600 rounded-full w-4 h-4 flex items-center justify-center hover:bg-rose-200 hover:text-red-800 transition cursor-pointer text-[10px] font-bold"
                                        title="Մաքրել"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </span>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </span>
                      );
                    };

                    return (
                      <div 
                        key={line.id}
                        onClick={() => setShowTranslation(prev => ({ ...prev, [line.id]: !isTranslationVisible }))}
                        className={`p-3 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-colors cursor-pointer flex flex-col ${
                          isTranslationVisible ? 'bg-slate-50 border-slate-100' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <strong className={isCarlos ? 'text-indigo-600' : 'text-emerald-600'}>{line.speaker}:</strong>
                          
                          <button
                            onClick={(e) => handleSpeakText(line.fullText, e)}
                            className={`p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-150 transition cursor-pointer flex items-center gap-1 ${
                              playingAudioLine === line.fullText ? 'text-amber-500 animate-pulse bg-amber-50' : ''
                            }`}
                            title="Լսել արտասանությունը"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="pl-1">
                          {renderInteractiveText()}
                        </div>

                        {isTranslationVisible && (
                          <div className="mt-2 text-sm text-slate-400 italic font-serif pl-1">
                            {line.translationArm}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Box 4: Sidebar Stats Card (Spans 3 columns on lg, 12 on mobile) */}
              <section className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Առաջադիմություն (Stats)</h3>
                  
                  {(() => {
                    const calcScore = (tab: 'gor' | 'gayane') => {
                      const diag = dialogues.find(d => d.id === (tab === 'gor' ? 'gor_weekend' : 'gayane_airport'));
                      if (!diag) return { scored: 0, total: 0 };
                      let scored = 0;
                      let total = 0;
                      diag.lines.forEach(line => {
                        line.missingWords.forEach((word, idx) => {
                          total++;
                          const key = `${tab}_${line.id}_${idx}`;
                          const userVal = filledWords[key];
                          if (userVal && userVal.trim().toLowerCase() === word.trim().toLowerCase()) {
                            scored++;
                          }
                        });
                      });
                      return { scored, total };
                    };

                    const gorScore = calcScore('gor');
                    const gayaneScore = calcScore('gayane');

                    return (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-600">Գոռ (Gor)</span>
                            <span className="text-blue-600 font-bold">{gorScore.scored}/{gorScore.total}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(gorScore.scored / (gorScore.total || 1)) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-600">Գայանե (Gayane)</span>
                            <span className="text-pink-600 font-bold">{gayaneScore.scored}/{gayaneScore.total}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-pink-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(gayaneScore.scored / (gayaneScore.total || 1)) * 105 / 1.05}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <p className="text-xs font-bold text-orange-850 uppercase">Մրցույթի ռեժիմ</p>
                    <p className="text-sm text-orange-700 mt-1 italic font-medium">«Ով ավելի շատ ճիշտ թարգմանություն կանի»</p>
                    <button 
                      onClick={() => {
                        setActiveTab('duel');
                        startQuiz('duel');
                      }}
                      className="mt-3 w-full bg-white border border-orange-250 py-2 rounded-lg text-orange-600 text-xs font-bold shadow-sm hover:bg-orange-50 transition-colors"
                    >
                      Սկսել Մրցույթը
                    </button>
                  </div>
                </div>
              </section>

              {/* Box 5: Bottom Navigation / Action Bar */}
              <section className="col-span-12 bg-indigo-900 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between text-white gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-800 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-indigo-300 font-bold block uppercase leading-none mb-1">Ներկայիս կարգավիճակը</span>
                    <p className="text-sm">Սեղմեք նախադասության վրա՝ թարգմանությունը տեսնելու համար:</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => handleResetDialogue(currentDialogue.id)}
                    className="flex-1 sm:flex-initial px-6 py-2 bg-indigo-800 text-slate-100 font-bold rounded-xl shadow hover:bg-indigo-750 transition-colors border border-indigo-700 text-sm cursor-pointer"
                  >
                    Մաքրել (Reset)
                  </button>
                  <button 
                    onClick={() => handleCheckDialogue(currentDialogue)}
                    className="flex-1 sm:flex-initial px-6 py-2 bg-white text-indigo-900 font-bold rounded-xl shadow-md hover:bg-indigo-50 transition-colors text-sm cursor-pointer"
                  >
                    Ստուգել (Check)
                  </button>
                </div>
              </section>

              {/* Modal Success celebration box */}
              {showCelebration === currentDialogue.id && (
                <div className="col-span-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 text-white text-center shadow-lg transform scale-100 transition-transform relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-10">
                    <Trophy className="w-48 h-48" />
                  </div>
                  <span className="text-4xl text-center block">🏆🌟✨</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold mt-4 mb-2">Շնորհավորո՛ւմ ենք, {currentDialogue.ownerName}։</h3>
                  <p className="text-green-50 text-base max-w-xl mx-auto font-medium">
                    Դու հիանալի կերպով և առանց որևէ սխալի լրացրեցիր ողջ դիալոգը։ Կատարյա՛լ իսպաներեն։
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={() => handleResetDialogue(currentDialogue.id)}
                      className="py-2.5 px-6 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-bold transition cursor-pointer border border-white/20"
                    >
                      Կրկնել դիալոգը
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('duel');
                        startQuiz('duel');
                      }}
                      className="py-2.5 px-8 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-sm font-extrabold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Մարտահրավեր նետել (Դուել Խաղ)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* DUEL COMPETITION TAB (GOR VS GAYANE IN SPANISH BATTLE) */}
          {activeTab === 'duel' && (
            <div className="space-y-8">
              
              {/* STAGE 1: SELECTION MENU */}
              {duelMode === 'selection' && (
                <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100 text-center space-y-8">
                  <div className="max-w-xl mx-auto space-y-4">
                    <div className="mx-auto w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-500 animate-bounce">
                      <Trophy className="w-10 h-10" />
                    </div>
                    
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                      Իսպաներենի Մրցութային «Դուել» Խաղ
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
                      Ո՞վ է տիրապետում լավագույն թարգմանությանը։ Ստուգեք Ձեր գիտելիքները Գոռի և Գայանեի միջև կատաղի, բայց ընկերական մրցակցությունում:
                    </p>
                  </div>

                  {/* Mode select cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    
                    {/* Head-to-head Duel CARD */}
                    <div className="bg-gradient-to-tr from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col justify-between text-left relative group">
                      <div className="absolute top-3 right-3 bg-amber-500 text-white font-xs font-bold px-2 py-0.5 rounded-full text-[10px]">
                        Հանրաճանաչ
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-amber-100 rounded-xl w-fit text-amber-700">
                          <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Գոռ VS Գայանե (Դուել)</h3>
                        <p className="text-xs text-slate-500">
                          Հերթով պատասխանեք 10 հարցերի: Յուրաքանչյուրը ստանում է 5 հարց: Արագ պատասխանները ստանում են առավելագույն բոնուսային միավորներ։
                        </p>
                      </div>
                      <button
                        onClick={() => startQuiz('duel')}
                        className="mt-6 w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl text-xs font-extrabold tracking-wider transition uppercase flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-amber-200"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-900" />
                        Սկսել Դուելը
                      </button>
                    </div>

                    {/* Gor practice CARD */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col justify-between text-left">
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-xl w-fit text-blue-700">
                          <User className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Գոռի Մարզում (Solo)</h3>
                        <p className="text-xs text-slate-500">
                          Մարզվիր ինքնուրույն: Անցիր 10 պատահական հարցեր հայերենից իսպաներեն թարգմանությամբ և գրանցիր բարձր ռեկորդներ:
                        </p>
                      </div>
                      <button
                        onClick={() => startQuiz('gor_solo')}
                        className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold tracking-wider transition uppercase flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                      >
                        Մարզվել (Գոռ)
                      </button>
                    </div>

                    {/* Gayane practice CARD */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col justify-between text-left">
                      <div className="space-y-3">
                        <div className="p-3 bg-rose-50 rounded-xl w-fit text-rose-700">
                          <User className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Գայանեի Մարզում (Solo)</h3>
                        <p className="text-xs text-slate-500">
                          Մարզվիր ինքնուրույն: Անցիր 10 պատահական հարցեր հայերենից իսպաներեն թարգմանությամբ և գրանցիր բարձր ռեկորդներ:
                        </p>
                      </div>
                      <button
                        onClick={() => startQuiz('gayane_solo')}
                        className="mt-6 w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold tracking-wider transition uppercase flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                      >
                        Մարզվել (Գայանե)
                      </button>
                    </div>

                  </div>

                  {/* General scoring tutorial information */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl max-w-lg mx-auto flex items-center gap-3.5 text-left text-xs text-slate-500">
                    <span className="text-base">📢</span>
                    <span>
                      <strong className="text-slate-700">Բոնուս միավորներ:</strong> Մրցակցությունը գնահատում է թե՛ ճշտությունը, թե՛ արագությունը: Պատասխանիր ավելի արագ՝ առավելագույն միավոր ստանալու համար:
                    </span>
                  </div>

                </div>
              )}

              {/* STAGE 2: ACTIVE PLAYING GAMEBOARD */}
              {duelMode === 'playing' && gameQuestions[currentQuestionIndex] && (
                <div className="space-y-6">
                  
                  {/* Duel Top bar Status updates */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-slate-100 text-xs font-bold rounded-lg text-slate-600">
                        ՀԱՐՑ {currentQuestionIndex + 1} / 10
                      </span>
                      
                      {/* Active Player Tag indicator */}
                      {gameType === 'duel' ? (
                        <div className={`px-4 py-1.5 rounded-xl font-bold flex items-center gap-2 text-sm ${
                          quizTurn === 'gor' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse' 
                            : 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                        }`}>
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                          <span>Հերթը` {quizTurn === 'gor' ? 'Գոռի' : 'Գայանեի'} սահմանն է</span>
                        </div>
                      ) : (
                        <div className="px-4 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold text-sm">
                          👤 Անհատական Մարզում: {gameType === 'gor_solo' ? 'Գոռ' : 'Գայանե'}
                        </div>
                      )}
                    </div>

                    {/* Real-time score indicator */}
                    <div className="flex gap-4">
                      {gameType === 'duel' ? (
                        <>
                          <div className="text-center group">
                            <span className="text-[10px] text-slate-400 font-bold block">ԳՈՌԻ ՄԻԱՎՈՐԸ</span>
                            <span className="text-lg font-extrabold text-blue-600">{scores.gor}</span>
                          </div>
                          <div className="border-r border-slate-200 my-1"></div>
                          <div className="text-center">
                            <span className="text-[10px] text-slate-400 font-bold block">ԳԱՅԱՆԵԻ ՄԻԱՎՈՐԸ</span>
                            <span className="text-lg font-extrabold text-rose-600">{scores.gayane}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center bg-amber-50/50 px-3 py-1 rounded-xl">
                          <span className="text-[10px] text-amber-600 font-bold block">ԸՆԹԱՑԻԿ ՄԻԱՎՈՐԸ</span>
                          <span className="text-xl font-extrabold text-amber-600 flex items-center justify-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            {soloScore}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Question Panel card */}
                  <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 space-y-6 relative overflow-hidden">
                    
                    {/* Time progress ticking strip */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          timer > 10 ? 'bg-emerald-500' : timer > 5 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(timer / 20) * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Թարգմանիր իսպաներեն
                      </span>
                      <span className={`text-sm font-mono font-extrabold px-3 py-1 rounded-lg ${
                        timer > 5 ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-700 animate-bounce'
                      }`}>
                        ⏲️ {timer} վրկ
                      </span>
                    </div>

                    {/* Armenian visual sentence prompt */}
                    <div className="p-6 md:p-8 bg-slate-50/80 rounded-2xl border border-slate-100 text-center space-y-2">
                      <p className="text-slate-400 text-xs font-bold">ՀԱՅԵՐԵՆ ՊՐՈՄՊՏ</p>
                      <h4 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed font-serif">
                        « {gameQuestions[currentQuestionIndex].armenianText} »
                      </h4>
                    </div>

                    {/* Options Grid Layout mapping */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gameQuestions[currentQuestionIndex].options.map((opt, oIdx) => {
                        const isCorrectAnswer = opt === gameQuestions[currentQuestionIndex].correctSpanish;
                        const isChosenAnswer = chosenAnswer === opt;
                        
                        let optBtnStyle = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';
                        let badgeIcon = <span className="w-5 h-5 rounded-full border border-slate-300 block"></span>;

                        if (answerStatus !== 'unanswered') {
                          if (isCorrectAnswer) {
                            optBtnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 scale-[1.01] ring-2 ring-emerald-200';
                            badgeIcon = <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">✓</div>;
                          } else if (isChosenAnswer) {
                            optBtnStyle = 'border-rose-400 bg-rose-50 text-rose-800 line-through';
                            badgeIcon = <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">✕</div>;
                          } else {
                            optBtnStyle = 'opacity-50 border-slate-200 bg-white text-slate-400 cursor-not-allowed';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={answerStatus !== 'unanswered'}
                            onClick={() => handleQuizAnswer(opt)}
                            className={`p-4 md:p-5 rounded-2xl border-2 text-left text-sm md:text-base font-semibold transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${optBtnStyle}`}
                          >
                            <span>{opt}</span>
                            <span>{badgeIcon}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Match Action next controls */}
                    {answerStatus !== 'unanswered' && (
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={handleNextQuiz}
                          className="py-3 px-8 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 group transition cursor-pointer shadow-md shadow-amber-200"
                        >
                          <span>{currentQuestionIndex === 9 ? 'Ավարտել Խաղը 🏁' : 'Հաջորդ հարցը'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                        </button>
                      </div>
                    )}

                  </div>

                </div>
              )}

              {/* STAGE 3: RESULT GAMEBOARD & PODIUM WINNER */}
              {duelMode === 'ended' && (
                <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100 text-center space-y-8">
                  
                  <div className="max-w-md mx-auto space-y-3">
                    <span className="text-5xl">👑🔥🏆</span>
                    <h2 className="text-3xl font-bold text-slate-800 mt-4">Մրցույթի Ավարտ։</h2>
                    <p className="text-slate-500 text-sm">
                      Բոլոր 10 հարցերի պատասխանները տրված են։ Տեսնենք հաղթողին և արդյունքները.
                    </p>
                  </div>

                  {/* DUEL VS WINNER SHOWCASE */}
                  {gameType === 'duel' ? (
                    <div className="max-w-2xl mx-auto space-y-8">
                      {/* Interactive Podium visualization */}
                      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                        
                        {/* Gor column */}
                        <div className="space-y-2 flex flex-col justify-end items-center">
                          {scores.gor >= scores.gayane && scores.gor > 0 && <span className="text-3xl animate-bounce">👑</span>}
                          <div className="w-16 h-16 bg-blue-100 text-blue-600 text-2xl font-black rounded-3xl flex items-center justify-center shadow-sm">
                            Գոռ
                          </div>
                          <span className="text-lg font-black text-blue-600 mt-2">{scores.gor}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Միավոր</span>
                        </div>

                        {/* Gayane column */}
                        <div className="space-y-2 flex flex-col justify-end items-center">
                          {scores.gayane >= scores.gor && scores.gayane > 0 && <span className="text-3xl animate-bounce">👑</span>}
                          <div className="w-16 h-16 bg-rose-100 text-rose-600 text-2xl font-black rounded-3xl flex items-center justify-center shadow-sm">
                            Գայանե
                          </div>
                          <span className="text-lg font-black text-rose-600 mt-2">{scores.gayane}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Միավոր</span>
                        </div>

                      </div>

                      {/* Display custom Armenian champion banners */}
                      <div className="p-6 rounded-2xl border-2">
                        {scores.gor > scores.gayane ? (
                          <div className="text-blue-800 bg-blue-50 border-blue-200 p-2 rounded-xl">
                            <h3 className="text-xl font-bold">🥇 Հաղթող ճանաչվեց ԳՈՌԸ։</h3>
                            <p className="text-xs text-blue-600 mt-1">Հիանալի մարտավարություն և կայծակնային արագություն։ Գերազանց է։</p>
                          </div>
                        ) : scores.gayane > scores.gor ? (
                          <div className="text-rose-800 bg-rose-50 border-rose-200 p-2 rounded-xl">
                            <h3 className="text-xl font-bold">🥇 Հաղթող ճանաչվեց ԳԱՅԱՆԵՆ։</h3>
                            <p className="text-xs text-rose-600 mt-1">Ոլորտի բացարձակ թագուհին: Իսպաներենի անգնահատելի գիտակ։</p>
                          </div>
                        ) : (
                          <div className="text-amber-800 bg-amber-50 border-amber-200 p-2 rounded-xl">
                            <h3 className="text-xl font-bold">🤝 Ոչ-ոքի՛: Հիանալի բարեկամական հաշիվ:</h3>
                            <p className="text-xs text-amber-600 mt-1">Երկուսդ էլ ցուցադրեցիք հավասար և փայլուն արդյունքներ։</p>
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    /* SOLO SCORE SHOWCASE */
                    <div className="max-w-md mx-auto p-8 rounded-3xl bg-amber-50 border border-amber-100 space-y-4">
                      <div className="p-4 bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-sm">
                        <Flame className="w-10 h-10 text-orange-500" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-bold block">ԿՈՒՏԱԿՎԱԾ ՄԻԱՎՈՐԸ</span>
                        <span className="text-4xl font-extrabold text-slate-800">{soloScore}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {gameType === 'gor_solo' ? 'Գոռ' : 'Գայանե'}, հիանալի մարզվում էր։ Դուք բարելավում եք Ձեր իսպաներենի իմացությունը:
                      </p>
                    </div>
                  )}

                  {/* Question answers review logs detailer */}
                  <div className="mt-8 border-t border-slate-100 pt-8 text-left max-w-2xl mx-auto space-y-3">
                    <h4 className="text-sm font-extrabold text-slate-700 flex items-center gap-1.5 mb-3">
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      Պատասխանների վերլուծություն
                    </h4>
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {selectedAnswersLog.map((log, lIdx) => (
                        <div 
                          key={lIdx} 
                          className={`p-3.5 rounded-xl border flex justify-between gap-4 text-xs ${
                            log.isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'
                          }`}
                        >
                          <div className="space-y-1">
                            <p className="font-bold text-slate-800">🇦🇲 {log.question}</p>
                            <p className="font-mono text-slate-600">🇪🇸 {log.correct}</p>
                            {!log.isCorrect && (
                              <p className="text-rose-600 font-medium">Նշեցիք` {log.selected}</p>
                            )}
                          </div>
                          <span className={`font-bold shrink-0 ${log.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {log.isCorrect ? '✓ Ճիշտ էր' : '✕ Սխալ էր'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions buttons footer */}
                  <div className="flex flex-wrap gap-4 justify-center pt-4">
                    <button
                      onClick={() => setDuelMode('selection')}
                      className="py-3 px-8 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition cursor-pointer flex items-center gap-2 border border-slate-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Ընտրել այլ խաղ</span>
                    </button>

                    <button
                      onClick={() => startQuiz(gameType)}
                      className="py-3 px-8 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl font-extrabold transition shadow-md shadow-amber-200 cursor-pointer"
                    >
                      Խաղալ նորից 🔄
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* RECORDS LEADERBOARD TAB */}
          {activeTab === 'records' && (
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 flex-col sm:flex-row gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Պատմություն և Բարձրագույն Ռեկորդներ
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">
                    Գոռի և Գայանեի կողմից իրականացված վերջին խաղերի միավորները և կատարողականը:
                  </p>
                </div>

                {leaderboard.length > 0 && (
                  <button
                    onClick={handleClearRecords}
                    className="py-1.5 px-4 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold cursor-pointer border border-rose-200 transition"
                  >
                    🗑️ Ջնջել ողջ պատմությունը
                  </button>
                )}
              </div>

              {leaderboard.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="text-5xl animate-bounce">📁⏳</div>
                  <h3 className="text-lg font-bold text-slate-700">Դեռևս ոչ մի գրանցված խաղ չկա։</h3>
                  <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
                    Սլացեք դեպի <span className="font-semibold text-amber-500">Դուել Խաղ</span> բաժինը և անցեք Ձեր առաջին թեստը՝ այստեղ միավորներ գրանցելու համար։
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('duel');
                      setDuelMode('selection');
                    }}
                    className="mt-4 inline-flex items-center justify-center py-2.5 px-6 bg-amber-500 text-slate-900 font-extrabold rounded-xl text-xs transition cursor-pointer"
                  >
                    Անցնել խաղին
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Score breakdown metrics cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Gor accumulated records summary card */}
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-blue-500 font-extrabold uppercase tracking-wide">ԳՈՌԻ ԼԱՎԱԳՈՒՅՆԸ</span>
                        <div className="text-base text-blue-700 font-black">
                          {Math.max(...leaderboard.filter(r => r.player === 'Գոռ').map(r => r.score), 0)} միավոր
                        </div>
                      </div>
                      <span className="text-3xl">👤</span>
                    </div>

                    {/* Gayane accumulated records summary card */}
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-rose-500 font-extrabold uppercase tracking-wide">ԳԱՅԱՆԵԻ ԼԱՎԱԳՈՒՅՆԸ</span>
                        <div className="text-base text-rose-700 font-black">
                          {Math.max(...leaderboard.filter(r => r.player === 'Գայանե').map(r => r.score), 0)} միավոր
                        </div>
                      </div>
                      <span className="text-3xl">🌸</span>
                    </div>

                  </div>

                  {/* Main records mapping table */}
                  <div className="border border-slate-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-extrabold border-b border-slate-100">
                        <tr>
                          <th className="py-3.5 px-4">Մասնակից</th>
                          <th className="py-3.5 px-4 text-center">Միավորներ</th>
                          <th className="py-3.5 px-4 text-right">Օր / Ժամ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {leaderboard.map((record, index) => {
                          const isGor = record.player === 'Գոռ';
                          
                          return (
                            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isGor ? 'bg-blue-500' : 'bg-rose-500'}`}></span>
                                <span className={isGor ? 'text-blue-700' : 'text-rose-700'}>
                                  {record.player}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                                {record.score}
                              </td>
                              <td className="py-3.5 px-4 text-right text-xs text-slate-400">
                                {record.date}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>
          )}

        </main>

        {/* Humid/Warm learning footer */}
        <footer className="mt-16 text-center text-xs text-slate-400 space-y-2">
          <p>© 2026 Իսպաներենի Ուսումնական: Բոլոր իրավունքները պաշտպանված են</p>
          <p className="flex justify-center items-center gap-1.5">
            <span>Կատարված է 🇩🇪🇪🇸 և 🇦🇲 սիրով` Գոռի ու Գայանեի համար:</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </footer>

      </div>

    </div>
  );
}
