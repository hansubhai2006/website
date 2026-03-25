import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Trophy, Lock, Star, Zap, Leaf, Plus, BookOpen } from 'lucide-react';

const ALL_BADGES = [
  { name: '⭐ Number Star',     desc: 'Complete Level 1 — Numbers',     icon: Star,    color: 'var(--warning)',  bg: 'rgba(245,158,11,0.12)'  },
  { name: '📚 Letter Hero',     desc: 'Complete Level 2 — Alphabets',   icon: BookOpen,color: 'var(--success)',  bg: 'rgba(16,185,129,0.12)'  },
  { name: '🌿 Nature Champion', desc: 'Complete Level 3 — Science',      icon: Leaf,    color: 'var(--accent)',   bg: 'rgba(6,182,212,0.12)'   },
  { name: '➕ Addition Master', desc: 'Complete Level 4 — Addition',     icon: Plus,    color: 'var(--primary)',  bg: 'rgba(124,58,237,0.12)'  },
  { name: '🔤 Word Wizard',     desc: 'Complete Level 5 — Vocabulary',   icon: Zap,     color: '#f472b6',         bg: 'rgba(244,114,182,0.12)' },
];

export default function Badges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/badges').then(res => setBadges(res.data)).finally(() => setLoading(false));
  }, []);

  const earnedNames = badges.map(b => b.badgeName);
  const earnedCount = badges.length;
  const total = ALL_BADGES.length;
  const pct = Math.round((earnedCount / total) * 100);

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">My Badges</h1>
          <p className="page-subtitle">Collect badges by completing levels</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-3)' }}>Loading badges...</div>
        ) : (
          <>
            {/* Summary card */}
            <div className="card" style={{ marginBottom: 24, padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(245,158,11,0.1)', border: '2px solid rgba(245,158,11,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Trophy size={28} color="var(--warning)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)', letterSpacing: '-0.3px' }}>
                    {earnedCount} <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>/ {total} badges earned</span>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div className="progress-wrap">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--warning), #fbbf24)' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 6 }}>{pct}% complete</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Earned badges */}
            {badges.length > 0 && (
              <>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-3)', letterSpacing: '0.5px', marginBottom: 12 }}>EARNED</div>
                <div className="badges-grid" style={{ marginBottom: 28 }}>
                  {badges.map(b => {
                    const def = ALL_BADGES.find(x => x.name === b.badgeName);
                    const Icon = def?.icon || Trophy;
                    return (
                      <div key={b._id} className="badge-card earned">
                        <div className="badge-icon-wrap" style={{ background: def?.bg || 'rgba(245,158,11,0.12)' }}>
                          <Icon size={24} color={def?.color || 'var(--warning)'} />
                        </div>
                        <div className="badge-name">{b.badgeName}</div>
                        <div className="badge-desc">{b.description}</div>
                        <div className="badge-date">{new Date(b.earnedAt).toLocaleDateString()}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* All badges */}
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-3)', letterSpacing: '0.5px', marginBottom: 12 }}>ALL BADGES</div>
            <div className="badges-grid">
              {ALL_BADGES.map(b => {
                const earned = earnedNames.includes(b.name);
                const Icon = b.icon;
                return (
                  <div key={b.name} className={`badge-card ${earned ? 'earned' : 'locked'}`}>
                    <div className="badge-icon-wrap" style={{ background: earned ? b.bg : 'var(--surface-2)' }}>
                      {earned
                        ? <Icon size={24} color={b.color} />
                        : <Lock size={20} color="var(--text-3)" />
                      }
                    </div>
                    <div className="badge-name" style={{ color: earned ? 'var(--text)' : 'var(--text-3)' }}>{b.name}</div>
                    <div className="badge-desc">{b.desc}</div>
                    {earned && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8, fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>
                        <Trophy size={11} /> Earned
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
