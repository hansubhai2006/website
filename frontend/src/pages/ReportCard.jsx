import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Star, Target, TrendingUp, RefreshCw, Trophy, Flame, CheckCircle2, XCircle, User } from 'lucide-react';

export default function ReportCard() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReport = async (studentId = '') => {
    setLoading(true);
    const url = studentId ? `/progress/report?studentId=${studentId}` : '/progress/report';
    try {
      const res = await api.get(url);
      setReport(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    if (user?.role === 'teacher') {
      api.get('/progress/students').then(res => setStudents(res.data));
    }
  }, []);

  const stats = [
    { icon: Star,       value: report?.stats?.totalPoints  || 0,    label: 'Total Points',    color: 'var(--primary)', bg: 'rgba(124,58,237,0.12)' },
    { icon: Target,     value: report?.stats?.passedLevels || 0,    label: 'Levels Passed',   color: 'var(--success)', bg: 'rgba(16,185,129,0.12)' },
    { icon: TrendingUp, value: `${report?.stats?.avgScore  || 0}%`, label: 'Average Score',   color: 'var(--accent)',  bg: 'rgba(6,182,212,0.12)'  },
    { icon: RefreshCw,  value: report?.stats?.totalAttempts|| 0,    label: 'Total Attempts',  color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
    { icon: Trophy,     value: report?.badges?.length      || 0,    label: 'Badges Earned',   color: '#f472b6',        bg: 'rgba(244,114,182,0.12)' },
    { icon: Flame,      value: report?.stats?.loginStreak  || 0,    label: 'Day Streak',      color: '#fb923c',        bg: 'rgba(251,146,60,0.12)'  },
  ];

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 className="page-title">Report Card</h1>
            <p className="page-subtitle">Track learning progress and performance</p>
          </div>
          {user?.role === 'teacher' && students.length > 0 && (
            <select
              className="form-select" style={{ width: 220 }}
              value={selectedStudent}
              onChange={e => { setSelectedStudent(e.target.value); fetchReport(e.target.value); }}
            >
              <option value="">Select a student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.name} — Class {s.class}</option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-3)' }}>Loading report...</div>
        ) : (
          <>
            {/* Student info */}
            {report?.user && (
              <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <User size={20} color="var(--text-2)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem' }}>{report.user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: 2 }}>
                    Reg No: {report.user.regNo} &nbsp;·&nbsp;
                    {report.user.role === 'student' ? `Class ${report.user.class}` : 'Teacher'}
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: 24 }}>
              {stats.map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon-wrap" style={{ background: s.bg }}>
                    <s.icon size={18} color={s.color} />
                  </div>
                  <div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scores table */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 16, fontSize: '0.9rem' }}>Level Performance</div>
              {!report?.scores?.length ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)', fontSize: '0.875rem' }}>
                  No levels attempted yet.
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Level</th>
                        <th>Subject</th>
                        <th>Class</th>
                        <th>Score</th>
                        <th>Attempts</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.scores.map(s => (
                        <tr key={s._id}>
                          <td style={{ color: 'var(--text)', fontWeight: 600 }}>{s.level?.title || '—'}</td>
                          <td>{s.level?.subject}</td>
                          <td>Class {s.level?.class}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className="progress-wrap" style={{ width: 72 }}>
                                <div className={`progress-fill ${s.passed ? 'success' : 'danger'}`} style={{ width: `${s.percentage}%` }} />
                              </div>
                              <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.85rem' }}>{s.percentage}%</span>
                            </div>
                          </td>
                          <td>{s.attempts}</td>
                          <td>
                            <span className={`pass-chip ${s.passed ? 'pass' : 'fail'}`}>
                              {s.passed
                                ? <><CheckCircle2 size={11} /> Passed</>
                                : <><XCircle size={11} /> Failed</>
                              }
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>
                            {new Date(s.completedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Badges */}
            {report?.badges?.length > 0 && (
              <div className="card">
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 14, fontSize: '0.9rem' }}>Badges Earned</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {report.badges.map(b => (
                    <div key={b._id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      padding: '9px 14px', borderRadius: 10
                    }}>
                      <Trophy size={14} color="var(--warning)" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>{b.badgeName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: 1 }}>
                          {new Date(b.earnedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
