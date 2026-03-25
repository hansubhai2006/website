import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { CheckCircle2, Lock, Play, RotateCcw, Clock, Zap, Trophy } from 'lucide-react';

function LevelCard({ level, onClick }) {
  const passed = level.userScore?.passed;
  const attempted = !!level.userScore;

  return (
    <div
      className={`level-card ${passed ? 'passed' : ''}`}
      onClick={() => onClick(level._id)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div className={`level-num-badge ${passed ? 'passed' : ''}`}>
          {passed
            ? <CheckCircle2 size={16} />
            : <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{level.levelNumber}</span>
          }
        </div>
        {level.badge && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Trophy size={13} color="var(--warning)" />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 600 }}>Badge</span>
          </div>
        )}
      </div>

      <span className="subject-tag">{level.subject}</span>

      <h3 style={{ fontWeight: 700, margin: '10px 0 4px', fontSize: '1rem', color: 'var(--text)' }}>{level.title}</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 14, lineHeight: 1.5 }}>{level.description}</p>

      {attempted ? (
        <>
          <div className="progress-wrap" style={{ marginBottom: 8 }}>
            <div className={`progress-fill ${passed ? 'success' : 'danger'}`} style={{ width: `${level.userScore.percentage}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600, marginBottom: 14 }}>
            <span>Best score: {level.userScore.percentage}%</span>
            <span>{level.userScore.attempts} attempt{level.userScore.attempts > 1 ? 's' : ''}</span>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 14 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Zap size={12} /> {level.questions?.length || '?'} questions
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} /> {level.timeLimit}s
          </span>
        </div>
      )}

      <button
        className={`btn ${passed ? 'btn-ghost' : 'btn-primary'}`}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {passed
          ? <><RotateCcw size={14} /> Retry</>
          : attempted
            ? <><Play size={14} /> Continue</>
            : <><Play size={14} /> Start Level</>
        }
      </button>
    </div>
  );
}

export default function Levels() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState(user?.class || 1);

  useEffect(() => {
    setLoading(true);
    api.get(`/levels/class/${classFilter}`)
      .then(res => setLevels(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [classFilter]);

  const passed = levels.filter(l => l.userScore?.passed).length;

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Levels</h1>
          <p className="page-subtitle">Complete levels to earn points and badges</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div className="filter-tabs">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600, alignSelf: 'center', marginRight: 4 }}>Class</span>
            {[1,2,3,4].map(c => (
              <button key={c} className={`filter-tab ${classFilter == c ? 'active' : ''}`} onClick={() => setClassFilter(c)}>
                {c}
              </button>
            ))}
          </div>
          {levels.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--surface)', border: '1px solid var(--border)',
              padding: '6px 14px', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)'
            }}>
              <CheckCircle2 size={13} color="var(--success)" />
              {passed} / {levels.length} passed
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-3)' }}>Loading levels...</div>
        ) : levels.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 60 }}>
            <Lock size={32} color="var(--text-3)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-2)', fontWeight: 500 }}>No levels available for Class {classFilter} yet.</p>
          </div>
        ) : (
          <div className="levels-grid">
            {levels.map(level => (
              <LevelCard key={level._id} level={level} onClick={(id) => navigate(`/levels/${id}`)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
