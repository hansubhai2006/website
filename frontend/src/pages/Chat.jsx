import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Send, MessageSquare } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  const fetchMessages = () => {
    api.get('/chat').then(res => setMessages(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await api.post('/chat', { content: text.trim() });
      setText('');
      fetchMessages();
    } finally {
      setSending(false);
    }
  };

  const isMe = (msg) => msg.senderName === user?.name;

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 40px)', padding: '24px 36px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 className="page-title">Ask a Doubt</h1>
          <p className="page-subtitle">Class {user?.class} chat · Messages refresh automatically</p>
        </div>

        <div className="card chat-wrap" style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
          {/* Messages */}
          <div className="messages-list">
            {loading ? (
              <div style={{ margin: 'auto', color: 'var(--text-3)', fontSize: '0.875rem' }}>Loading messages...</div>
            ) : messages.length === 0 ? (
              <div style={{ margin: 'auto', textAlign: 'center' }}>
                <MessageSquare size={32} color="var(--text-3)" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-2)', fontWeight: 500, fontSize: '0.875rem' }}>No messages yet</p>
                <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginTop: 4 }}>Ask your first doubt!</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg._id} className={`msg-row ${isMe(msg) ? 'mine' : 'theirs'}`}>
                  {!isMe(msg) && (
                    <div className="msg-sender">
                      {msg.isFromStudent ? '🎒' : '👩‍🏫'} {msg.senderName}
                    </div>
                  )}
                  <div className={`message-bubble ${isMe(msg) ? 'mine' : 'theirs'}`}>
                    {msg.content}
                  </div>
                  <div className="msg-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form className="chat-input-row" onSubmit={send}>
            <input
              className="chat-input"
              placeholder="Type your question or message..."
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={sending}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!text.trim() || sending}
              style={{ padding: '10px 18px', flexShrink: 0 }}
            >
              <Send size={15} />
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
