import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Play, FileText, StickyNote, X, Plus, Video, Inbox } from 'lucide-react';

function VideoModal({ material, onClose }) {
  if (!material) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontWeight: 700, color: 'var(--text)' }}>{material.title}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: 2 }}>{material.subject} · Class {material.class}</p>
          </div>
          <button className="btn btn-ghost" style={{ padding: '7px 10px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        {material.type === 'video' ? (
          <iframe src={material.link} title={material.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowFullScreen />
        ) : (
          <div style={{ padding: 40, textAlign: 'center', background: 'var(--surface-2)', borderRadius: 12 }}>
            <FileText size={40} color="var(--text-3)" style={{ margin: '0 auto 14px' }} />
            <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{material.title}</p>
            <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginBottom: 20 }}>{material.description}</p>
            <a href={material.link} target="_blank" rel="noreferrer" className="btn btn-primary">Open Document</a>
          </div>
        )}
      </div>
    </div>
  );
}

const typeIcon = { video: Video, pdf: FileText, notes: StickyNote };
const typeLabel = { video: 'VIDEO', pdf: 'PDF', notes: 'NOTES' };

export default function Materials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [classFilter, setClassFilter] = useState(user?.class || 1);
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', type: 'video', link: '', description: '' });

  const load = (cls) => {
    setLoading(true);
    api.get(`/materials/class/${cls}`).then(res => setMaterials(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(classFilter); }, [classFilter]);

  const filtered = typeFilter === 'all' ? materials : materials.filter(m => m.type === typeFilter);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post('/materials', { ...form, class: Number(classFilter) });
    setShowAdd(false);
    setForm({ title: '', subject: '', type: 'video', link: '', description: '' });
    load(classFilter);
  };

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 className="page-title">Study Materials</h1>
            <p className="page-subtitle">Videos, notes and learning resources</p>
          </div>
          {user?.role === 'teacher' && (
            <button className="btn btn-primary" onClick={() => setShowAdd(s => !s)}>
              <Plus size={15} /> Add Material
            </button>
          )}
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 16, fontSize: '0.9rem' }}>Add New Material</div>
            <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">TITLE</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">SUBJECT</label>
                <input className="form-input" value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">TYPE</label>
                <select className="form-select" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                  <option value="notes">Notes</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">LINK / URL</label>
                <input className="form-input" value={form.link} onChange={e => setForm(f => ({...f, link: e.target.value}))} required />
              </div>
              <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
                <label className="form-label">DESCRIPTION</label>
                <input className="form-input" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
              </div>
              <button type="submit" className="btn btn-primary"><Plus size={14} /> Save</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}><X size={14} /> Cancel</button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600 }}>CLASS</span>
            <div className="filter-tabs">
              {[1,2,3,4].map(c => (
                <button key={c} className={`filter-tab ${classFilter==c?'active':''}`} onClick={() => setClassFilter(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600 }}>TYPE</span>
            <div className="filter-tabs">
              {['all','video','pdf','notes'].map(t => (
                <button key={t} className={`filter-tab ${typeFilter===t?'active':''}`} onClick={() => setTypeFilter(t)} style={{ textTransform: 'capitalize' }}>
                  {t === 'all' ? 'All' : t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-3)' }}>Loading materials...</div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 60 }}>
            <Inbox size={32} color="var(--text-3)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-2)', fontWeight: 500 }}>No materials found.</p>
          </div>
        ) : (
          <div className="materials-grid">
            {filtered.map(m => {
              const TypeIcon = typeIcon[m.type] || FileText;
              return (
                <div key={m._id} className="material-card" onClick={() => setSelected(m)}>
                  <div className="material-thumb">
                    <TypeIcon size={36} className="material-thumb-icon" />
                    {m.type === 'video' && (
                      <div className="material-play-btn">
                        <div className="play-circle">
                          <Play size={20} style={{ marginLeft: 2 }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="material-body">
                    <span className={`type-chip type-${m.type}`}>
                      <TypeIcon size={11} /> {typeLabel[m.type]}
                    </span>
                    <h4 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4, fontSize: '0.9rem' }}>{m.title}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: 6 }}>{m.subject} · Class {m.class}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{m.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <VideoModal material={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
