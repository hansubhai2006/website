import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import {
  Star, Target, TrendingUp, Flame, Medal,
  Gamepad2, BookOpen, MessageSquare, Trophy, BarChart3, ArrowRight
} from 'lucide-react';

function StatCard({ icon: Icon, value, label, color, bg }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrap" style={{ background: bg }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

const quickLinks = [
  { path: '/levels',    icon: Gamepad2,      label: 'Play Levels',      desc: 'Continue learning',    color: 'var(--primary)',  bg: 'rgba(124,58,237,0.1)' },
  { path: '/materials', icon: BookOpen,      label: 'Study Materials',  desc: 'Videos & notes',       color: 'var(--accent)',   bg: 'rgba(6,182,212,0.1)' },
  { path: '/chat',      icon: MessageSquare, label: 'Ask a Doubt',      desc: 'Talk to your teacher', color: 'var(--success)',  bg: 'rgba(16,185,129,0.1)' },
  { path: '/badges',    icon: Trophy,        label: 'My Badges',        desc: 'See achievements',     color: 'var(--warning)',  bg: 'rgba(245,158,11,0.1)' },
  { path: '/report',    icon: BarChart3,     label: 'Report Card',      desc: 'Track your progress',  color: '#f472b6',         bg: 'rgba(244,114,182,0.1)' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [recentBadges, setRecentBadges] = useState([]);

  useEffect(() => {
    api.get('/progress/report').then(res => setReport(res.data)).catch(() => {});
    if (user?.role === 'student') {
      api.get('/badges').then(res => setRecentBadges(res.data.slice(0, 4))).catch(() => {});
    }
  }, []);

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">

        {/* Welcome */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 6 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p style={{ color: 'var(--text-2)', marginTop: 4, fontSize: '0.875rem' }}>
            {user?.role === 'student'
              ? `Class ${user?.class} · Keep earning points and completing levels`
              : 'Teacher dashboard · Monitor your students'}
          </p>
        </div>

        {/* Stats */}
        {user?.role === 'student' && (
          <div className="stats-grid">
            <StatCard icon={Star}      value={user?.totalPoints || 0}           label="Total Points"   color="var(--primary)" bg="rgba(124,58,237,0.12)" />
            <StatCard icon={Target}    value={report?.stats?.passedLevels || 0} label="Levels Passed"  color="var(--success)" bg="rgba(16,185,129,0.12)" />
            <StatCard icon={TrendingUp} value={`${report?.stats?.avgScore || 0}%`} label="Avg Score"   color="var(--accent)"  bg="rgba(6,182,212,0.12)" />
            <StatCard icon={Flame}     value={user?.loginStreak || 0}           label="Day Streak"     color="var(--warning)" bg="rgba(245,158,11,0.12)" />
            <StatCard icon={Medal}     value={recentBadges.length}              label="Badges Earned"  color="#f472b6"        bg="rgba(244,114,182,0.12)" />
          </div>
        )}

        {/* Recent Badges */}
        {recentBadges.length > 0 && (
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>Recent Badges</div>
              <button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => navigate('/badges')}>
                View all <ArrowRight size={13} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {recentBadges.map(b => (
                <div key={b._id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  padding: '8px 14px', borderRadius: 10
                }}>
                  <Trophy size={14} color="var(--warning)" />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>{b.badgeName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: 14 }}>
          {user?.role === 'teacher' ? 'Teacher Tools' : 'Quick Actions'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
          {quickLinks.map(link => {
            const Icon = link.icon;
            return (
              <div
                key={link.path}
                className="card"
                onClick={() => navigate(link.path)}
                style={{ cursor: 'pointer', padding: '18px 20px', transition: 'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 9, background: link.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Icon size={18} color={link.color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: 2 }}>{link.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>{link.desc}</div>
              </div>
            );
          })}
        </div>

        {/* About banner */}
        <div style={{
          marginTop: 24, padding: '20px 24px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', borderLeft: '3px solid var(--primary)'
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: 6 }}>About EduQuest</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.65 }}>
            EduQuest brings gamified learning to rural school students. Earn points, unlock levels, collect badges, and track your progress — all while having fun learning.
          </p>
        </div>

      </main>
    </div>
  );
}
