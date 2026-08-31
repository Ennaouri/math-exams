'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  id: number;
  question_text: string;
  choices: string[];
  position: number;
}

interface Correction {
  question_id: number;
  correct_index: number;
  explanation: string;
  is_correct: boolean;
}

interface PreviousAttempt {
  score: number;
  total: number;
  completed: boolean;
  answers: { question_id: number; chosen_index: number }[];
  correct_answers?: { question_id: number; correct_index: number; explanation: string }[];
}

interface QuizBlockProps {
  postId: number;
  isLoggedIn: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBadge({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const color =
    pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
  const label =
    pct >= 80 ? '🏆 Excellent !' : pct >= 50 ? '👍 Passable' : '📚 À réviser';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-20 h-20 rounded-full ${color} text-white flex flex-col items-center justify-center shadow-lg`}>
        <span className="text-2xl font-black">{score}/{total}</span>
        <span className="text-xs font-bold">{pct}%</span>
      </div>
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </div>
  );
}

function Timer({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [left, setLeft] = useState(seconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => {
      setLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpire();
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [seconds, onExpire]);

  if (seconds <= 0) return null;
  const m = Math.floor(left / 60);
  const s = left % 60;
  const urgent = left <= 30;

  return (
    <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
      urgent ? 'bg-red-50 border-red-300 text-red-700 animate-pulse' : 'bg-slate-100 border-slate-200 text-slate-600'
    }`}>
      ⏱ {m}:{s.toString().padStart(2, '0')}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuizBlock({ postId, isLoggedIn }: QuizBlockProps) {
  const [quiz, setQuiz] = useState<{ id: number; title: string; description?: string; time_limit: number; questions: Question[] } | null>(null);
  const [previousAttempt, setPreviousAttempt] = useState<PreviousAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch quiz on mount
  useEffect(() => {
    fetch(`/api/quiz?postId=${postId}`)
      .then((r) => r.json())
      .then((data) => {
        setQuiz(data.quiz);
        if (data.attempt?.completed) {
          setPreviousAttempt(data.attempt);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleStart = () => {
    if (!quiz) return;
    setSelected(new Array(quiz.questions.length).fill(null));
    setCurrentIdx(0);
    setStarted(true);
    setSubmitted(false);
    setCorrections([]);
    setResult(null);
    setPreviousAttempt(null);
  };

  const handleSelect = (choiceIdx: number) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = [...prev];
      next[currentIdx] = choiceIdx;
      return next;
    });
  };

  const handleNext = () => {
    if (quiz && currentIdx < quiz.questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  const handleSubmit = useCallback(async () => {
    if (!quiz) return;
    setSubmitting(true);
    const answers = quiz.questions.map((q, i) => ({
      question_id: q.id,
      chosen_index: selected[i] ?? -1,
    }));

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: quiz.id, answers }),
      });
      const data = await res.json();
      setCorrections(data.corrections || []);
      setResult({ score: data.score, total: data.total });
      setSubmitted(true);
      setCurrentIdx(0);
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }, [quiz, selected]);

  // ── Render states ──────────────────────────────────────────────────────────

  if (loading) return null;
  if (!quiz || quiz.questions.length === 0) return null;

  const q = quiz.questions[currentIdx];
  const answered = selected.filter((s) => s !== null).length;
  const allAnswered = answered === quiz.questions.length;

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="mt-8 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center shadow-sm">
        <div className="text-3xl mb-2">🧠</div>
        <h3 className="text-base font-black text-slate-800 mb-1">{quiz.title}</h3>
        <p className="text-xs text-slate-500 mb-4">
          {quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''} · Testez vos connaissances
        </p>
        <a
          href="/api/auth/signin"
          className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
        >
          Se connecter pour accéder au QCM →
        </a>
      </div>
    );
  }

  // ── Previous attempt (not yet restarted) ──────────────────────────────────
  if (previousAttempt && !started && !submitted) {
    const pct = previousAttempt.total > 0
      ? Math.round((previousAttempt.score / previousAttempt.total) * 100)
      : 0;
    return (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            🧠 <span>{quiz.title}</span>
          </h3>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            pct >= 80 ? 'bg-emerald-100 text-emerald-700' :
            pct >= 50 ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            Dernier score : {previousAttempt.score}/{previousAttempt.total} ({pct}%)
          </span>
        </div>

        {/* Correction summary */}
        <div className="space-y-3 mb-5">
          {quiz.questions.map((question, i) => {
            const userAns = previousAttempt.answers?.find((a) => a.question_id === question.id);
            const corrAns = previousAttempt.correct_answers?.find((a) => a.question_id === question.id);
            const isCorrect = userAns?.chosen_index === corrAns?.correct_index;
            return (
              <div key={question.id} className={`p-3 rounded-xl border text-xs ${
                isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
              }`}>
                <p className="font-semibold text-slate-800 mb-1">
                  {isCorrect ? '✅' : '❌'} {question.question_text}
                </p>
                {!isCorrect && corrAns && (
                  <p className="text-slate-600">
                    Bonne réponse : <strong>{question.choices[corrAns.correct_index]}</strong>
                    {corrAns.explanation && <span className="block text-slate-500 italic mt-0.5">{corrAns.explanation}</span>}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors"
        >
          🔄 Recommencer le QCM
        </button>
      </div>
    );
  }

  // ── Intro screen ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <div className="text-4xl mb-3">🧠</div>
          <h3 className="text-lg font-black text-slate-800 mb-2">{quiz.title}</h3>
          {quiz.description && (
            <p className="text-sm text-slate-500 mb-3 max-w-md mx-auto">{quiz.description}</p>
          )}
          <div className="flex justify-center gap-4 text-xs text-slate-500 mb-6">
            <span>📝 {quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}</span>
            {quiz.time_limit > 0 && <span>⏱ {Math.floor(quiz.time_limit / 60)} min</span>}
            <span>✅ Score instantané</span>
          </div>
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl transition-colors shadow-md shadow-blue-600/20"
          >
            Démarrer le QCM →
          </button>
        </div>
      </div>
    );
  }

  // ── Results screen ─────────────────────────────────────────────────────────
  if (submitted && result) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-black text-slate-800 mb-5 text-center">Résultats du QCM</h3>

        <div className="flex justify-center mb-6">
          <ScoreBadge score={result.score} total={result.total} />
        </div>

        <div className="space-y-4 mb-6">
          {quiz.questions.map((question) => {
            const corr = corrections.find((c) => c.question_id === question.id);
            const userIdx = selected[quiz.questions.indexOf(question)];
            return (
              <div
                key={question.id}
                className={`p-4 rounded-xl border text-sm ${
                  corr?.is_correct
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <p className="font-bold text-slate-800 mb-2">
                  {corr?.is_correct ? '✅' : '❌'} {question.question_text}
                </p>
                <div className="space-y-1">
                  {question.choices.map((choice, ci) => {
                    const isUser = ci === userIdx;
                    const isCorrect = ci === corr?.correct_index;
                    return (
                      <div
                        key={ci}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                          isCorrect
                            ? 'bg-emerald-200 text-emerald-900 font-bold'
                            : isUser && !isCorrect
                            ? 'bg-red-200 text-red-800 line-through'
                            : 'bg-white/60 text-slate-600'
                        }`}
                      >
                        {isCorrect ? '✓ ' : isUser ? '✗ ' : '  '}{choice}
                      </div>
                    );
                  })}
                </div>
                {corr?.explanation && (
                  <p className="mt-2 text-xs text-slate-500 italic bg-white/70 rounded-lg px-3 py-2">
                    💡 {corr.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-colors"
        >
          🔄 Recommencer
        </button>
      </div>
    );
  }

  // ── Active quiz (question-by-question) ─────────────────────────────────────
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <span className="text-sm font-black text-slate-700">
          🧠 Question {currentIdx + 1} / {quiz.questions.length}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{answered}/{quiz.questions.length} répondues</span>
          {quiz.time_limit > 0 && (
            <Timer seconds={quiz.time_limit} onExpire={handleSubmit} />
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="p-5">
        <p className="text-base font-bold text-slate-800 mb-5 leading-relaxed">
          {q.question_text}
        </p>

        <div className="space-y-2.5">
          {q.choices.map((choice, ci) => {
            const isSelected = selected[currentIdx] === ci;
            return (
              <button
                key={ci}
                onClick={() => handleSelect(ci)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 text-slate-700'
                }`}
              >
                <span className={`inline-flex w-6 h-6 rounded-full mr-3 text-xs font-black items-center justify-center shrink-0 ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + ci)}
                </span>
                {choice}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-5 pb-5 flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          ← Précédent
        </button>

        <div className="flex gap-1.5">
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentIdx
                  ? 'bg-blue-600 scale-125'
                  : selected[i] !== null
                  ? 'bg-blue-300'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {currentIdx < quiz.questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all"
          >
            Suivant →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-5 py-2 text-white text-xs font-black rounded-xl uppercase tracking-wider transition-all ${
              allAnswered
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
                : 'bg-amber-500 hover:bg-amber-600'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Envoi…
              </span>
            ) : allAnswered ? '✅ Valider le QCM' : '⚠️ Soumettre quand même'}
          </button>
        )}
      </div>
    </div>
  );
}
