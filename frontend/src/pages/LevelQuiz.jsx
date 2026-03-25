import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Timer, ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';

function TimerBadge({ seconds, total }) {
  const pct = (seconds / total) * 100;
  const cls = seconds < 30 ? 'danger' : seconds < 60 ? 'warn' : '';
  return (
    <div className={`timer-badge ${cls}`}>
      <Timer size={14} />
      {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
    </div>
  );
}

export default function LevelQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [level, setLevel] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime] = useState(Date.now());
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    api.get(`/levels/${id}`).then(res => {
      setLevel(res.data);
      setTimeLeft(res.data.timeLimit);
    }).catch(() => navigate('/levels'));
  }, [id]);

  useEffect(() => {
    if (!level || result) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [level, result]);

  const handleSelect = (idx) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    setTimeout(() => {
      const newAnswers = [...answers, idx];
      setAnswers(newAnswers);
      setSelected(null);
      setShowAnswer(false);
      if (current + 1 < level.questions.length) {
        setCurrent(c => c + 1);
      } else {
        handleSubmit(false, newAnswers);
      }
    }, 900);
  };

  const handleSubmit = async (timeout = false, finalAnswers = null) => {
    clearInterval(timerRef.current);
    const ans = finalAnswers || answers;
    const padded = [...ans];
    while (padded.length < level.questions.length) padded.push(-1);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    setSubmitting(true);
    try {
      const res = await api.post(`/levels/${id}/submit`, { answers: padded, timeSpent });
      setResult({ ...res.data, timeout });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!level) return <div className="loading"><Timer size={16} /> Loading level...</div>;

  /* ── Result screen ── */
  if (result) {
    return (
      <div className="layout">
        <Navbar />
        <main className="main-content">
          <div className="quiz-container">
            <div className="card" style={{ padding: '40px 36px' }}>
              {/* Score ring */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%', margin: '0 auto 16px',
                  background: result.passed ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
                  border: `3px solid ${result.passed ? 'var(--success)' : 'var(--danger)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: result.passed ? 'var(--success)' : 'var(--danger)' }}>
                    {result.percentage}%
                  </span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
                  {result.passed ? 'Level Passed!' : result.timeout ? "Time's Up!" : 'Not Passed'}
                </h2>
                <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>
                  {result.earned} / {result.maxScore} points · Pass mark: {result.passingScore}%
                </p>
              </div>

              {/* Points banner */}
              {result.passed && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 12, padding: '14px 18px', marginBottom: 24
                }}>
                  <Trophy size={20} color="var(--success)" />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.9rem' }}>+{result.earned} Points Earned</div>
                    {level.badge && <div style={{ fontSize: '0.78rem', color: 'var(--text-2)', marginTop: 2 }}>Badge unlocked: {level.badge}</div>}
                  </div>
                </div>
              )}

              {/* Answer review */}
              <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '16px 18px', marginBottom: 24 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.4px', marginBottom: 12 }}>ANSWER REVIEW</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {level.questions.map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      {result.results[i]?.correct
                        ? <CheckCircle2 size={16} color="var(--success)" style={{ marginTop: 2, flexShrink: 0 }} />
                        : <XCircle size={16} color="var(--danger)" style={{ marginTop: 2, flexShrink: 0 }} />
                      }
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 500 }}>{q.question}</div>
                        {!result.results[i]?.correct && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--success)', marginTop: 3 }}>
                            Correct: {q.options[q.correct]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate('/levels')}>
                  <ArrowLeft size={15} /> Back to Levels
                </button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => window.location.reload()}>
                  <RotateCcw size={15} /> Try Again
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ── Quiz screen ── */
  const q = level.questions[current];
  const progress = (current / level.questions.length) * 100;

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div className="quiz-container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button className="btn btn-ghost" style={{ padding: '7px 14px' }} onClick={() => navigate('/levels')}>
              <ArrowLeft size={15} /> Exit
            </button>
            <TimerBadge seconds={timeLeft} total={level.timeLimit} />
          </div>

          {/* Progress */}
          <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>{level.title}</span>
                <span className="subject-tag" style={{ marginLeft: 10 }}>{level.subject}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>
                {current + 1} / {level.questions.length}
              </span>
            </div>
            <div className="progress-wrap">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Question */}
          <div className="card" style={{ padding: '28px 28px 24px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.5px', marginBottom: 12 }}>
              QUESTION {current + 1}
            </div>
            <p className="question-text">{q.question}</p>

            {q.options.map((opt, idx) => {
              let cls = 'option-btn';
              if (showAnswer) {
                if (idx === q.correct) cls += ' correct';
                else if (idx === selected) cls += ' wrong';
              } else if (idx === selected) cls += ' selected';

              return (
                <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={showAnswer || submitting}>
                  <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {submitting && (
            <div style={{ textAlign: 'center', marginTop: 16, color: 'var(--text-3)', fontSize: '0.875rem' }}>
              Submitting results...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
