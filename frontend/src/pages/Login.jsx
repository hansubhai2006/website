import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import api from '../utils/api';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', regNo: '', password: '', role: 'student', class: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login'
        ? { regNo: form.regNo, password: form.password }
        : { name: form.name, regNo: form.regNo, password: form.password, role: form.role, class: Number(form.class) };
      const res = await api.post(endpoint, payload);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Brand header above card */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, background: 'var(--primary)', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', boxShadow: '0 0 32px rgba(124,58,237,0.4)'
          }}>
            <GraduationCap size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.4px' }}>EduQuest</h1>
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginTop: 4 }}>Gamified Learning for Rural Schools</p>
        </div>

        <div className="login-card">
          <div className="tabs">
            <button className={`tab-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
            <button className={`tab-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Register</button>
          </div>

          {error && (
            <div className="error-msg">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">FULL NAME</label>
                  <input className="form-input" name="name" placeholder="Enter your full name" value={form.name} onChange={update} required />
                </div>
                <div className="form-group">
                  <label className="form-label">ROLE</label>
                  <select className="form-select" name="role" value={form.role} onChange={update}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
                {form.role === 'student' && (
                  <div className="form-group">
                    <label className="form-label">CLASS</label>
                    <select className="form-select" name="class" value={form.class} onChange={update}>
                      {[1,2,3,4].map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>
                )}
              </>
            )}
            <div className="form-group">
              <label className="form-label">REGISTRATION NUMBER</label>
              <input className="form-input" name="regNo" placeholder="e.g. 12210001" value={form.regNo} onChange={update} required />
            </div>
            <div className="form-group" style={{ marginBottom: 22 }}>
              <label className="form-label">PASSWORD</label>
              <input className="form-input" type="password" name="password" placeholder="Enter password" value={form.password} onChange={update} required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {mode === 'login'
                ? <><LogIn size={16} /> {loading ? 'Signing in...' : 'Sign In'}</>
                : <><UserPlus size={16} /> {loading ? 'Creating account...' : 'Create Account'}</>
              }
            </button>
          </form>

          <div style={{
            marginTop: 20, padding: '12px 14px',
            background: 'var(--surface-2)', borderRadius: 10,
            border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-2)'
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-3)', marginBottom: 6, fontSize: '0.7rem', letterSpacing: '0.4px' }}>DEMO CREDENTIALS</div>
            <div>Student: <code style={{ color: 'var(--primary)', background: 'var(--surface-3)', padding: '1px 6px', borderRadius: 4 }}>12210001</code> / <code style={{ color: 'var(--primary)', background: 'var(--surface-3)', padding: '1px 6px', borderRadius: 4 }}>student123</code></div>
            <div style={{ marginTop: 4 }}>Teacher: <code style={{ color: 'var(--accent)', background: 'var(--surface-3)', padding: '1px 6px', borderRadius: 4 }}>TCH001</code> / <code style={{ color: 'var(--accent)', background: 'var(--surface-3)', padding: '1px 6px', borderRadius: 4 }}>teacher123</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
