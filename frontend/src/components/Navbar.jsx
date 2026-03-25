import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, LayoutDashboard, Gamepad2, BookOpen,
  MessageSquare, Trophy, BarChart3, LogOut
} from 'lucide-react';

const navItems = [
  { path: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/levels',    icon: Gamepad2,        label: 'Levels' },
  { path: '/materials', icon: BookOpen,        label: 'Study Materials' },
  { path: '/chat',      icon: MessageSquare,   label: 'Ask a Doubt' },
  { path: '/badges',    icon: Trophy,          label: 'My Badges' },
  { path: '/report',    icon: BarChart3,       label: 'Report Card' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <GraduationCap size={18} />
        </div>
        <span className="sidebar-logo-text">EduQuest</span>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-name">{user?.name}</div>
        <div className="sidebar-user-sub">
          {user?.role === 'student' ? `Class ${user?.class} · ${user?.totalPoints || 0} pts` : 'Teacher'}
        </div>
      </div>

      {navItems.map(({ path, icon: Icon, label }) => (
        <button
          key={path}
          className={`nav-link ${location.pathname === path ? 'active' : ''}`}
          onClick={() => navigate(path)}
        >
          <Icon size={16} className="nav-icon" />
          {label}
        </button>
      ))}

      <div className="sidebar-bottom">
        <button className="nav-link" onClick={handleLogout}>
          <LogOut size={16} className="nav-icon" />
          Logout
        </button>
      </div>
    </aside>
  );
}
