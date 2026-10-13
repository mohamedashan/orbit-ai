import { useEffect, useMemo, useState } from 'react';
import { ArrowUp, BrainCircuit, Check, ChevronDown, Clock3, Copy, FileText, Hash, Lightbulb, LoaderCircle, Menu, MoreHorizontal, Plus, Search, Sparkles, WandSparkles, X, Zap } from 'lucide-react';

const starters = [
  { icon: FileText, title: 'Tighten my writing', prompt: 'Rewrite this to be clearer, more concise, and confident:', tag: 'Writing' },
  { icon: Lightbulb, title: 'Shape an idea', prompt: 'Help me turn this rough idea into a practical plan with milestones:', tag: 'Strategy' },
  { icon: BrainCircuit, title: 'Think it through', prompt: 'Challenge my assumptions and surface the tradeoffs in this decision:', tag: 'Thinking' },
  { icon: WandSparkles, title: 'Make a first draft', prompt: 'Create a thoughtful first draft for this, with a warm and direct tone:', tag: 'Drafting' },
];

const initialActivity = [
  { title: 'Q3 product narrative', detail: 'Drafted 14 minutes ago', kind: 'draft' },
  { title: 'Launch risks & mitigations', detail: 'Brainstormed yesterday', kind: 'brainstorm' },
  { title: 'Team offsite notes', detail: 'Summarized 2 days ago', kind: 'summarize' },
];

function App() {
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('answer');
  const [activeTab, setActiveTab] = useState('workspace');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activity, setActivity] = useState(initialActivity);
  const [menuOpen, setMenuOpen] = useState(false);

  const modeLabel = useMemo(() => ({ answer: 'Answer', draft: 'Draft', brainstorm: 'Brainstorm', summarize: 'Summarize' }[mode]), [mode]);

  useEffect(() => { const saved = localStorage.getItem('orbit-activity'); if (saved) setActivity(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem('orbit-activity', JSON.stringify(activity)); }, [activity]);

  const submit = async (event) => {
    event?.preventDefault();
    if (!message.trim() || loading) return;
    setLoading(true); setResult(null);
    try {
      const response = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, mode }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');
      setResult(data);
      setActivity(current => [{ title: message.trim().slice(0, 34) + (message.trim().length > 34 ? '…' : ''), detail: `${modeLabel}d just now`, kind: mode }, ...current].slice(0, 5));
    } catch (error) { setResult({ error: error.message }); }
    finally { setLoading(false); }
  };

  const copyResult = async () => { if (!result?.answer) return; await navigator.clipboard?.writeText(result.answer); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  const useStarter = (starter) => { setMessage(starter.prompt + ' '); setActiveTab('workspace'); document.querySelector('.composer textarea')?.focus(); };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><OrbitMark /></div><span>orbit</span><span className="brand-dot">.</span><span className="brand-ai">ai</span></div>
      <button className="new-button" onClick={() => { setMessage(''); setResult(null); }}><Plus size={17} /> New thought <span className="shortcut">⌘ K</span></button>
      <nav className="nav-list">
        <button className={activeTab === 'workspace' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('workspace')}><Sparkles size={17} /> Workspace</button>
        <button className={activeTab === 'prompts' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('prompts')}><Hash size={17} /> Prompt library <span className="nav-count">12</span></button>
        <button className={activeTab === 'history' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('history')}><Clock3 size={17} /> Activity</button>
      </nav>
      <div className="sidebar-rule" />
      <div className="sidebar-label">Recent thoughts</div>
      <div className="recent-list">{activity.slice(0, 3).map((item, index) => <button className="recent-item" key={`${item.title}-${index}`} onClick={() => { setMessage(item.title); setActiveTab('workspace'); }}><span className={`recent-icon ${item.kind}`}><FileText size={14} /></span><span><b>{item.title}</b><small>{item.detail}</small></span></button>)}</div>
      <div className="sidebar-bottom"><div className="usage-card"><div className="usage-top"><span>Monthly usage</span><span>68%</span></div><div className="usage-bar"><i /></div><small>3,204 of 4,700 credits</small></div><div className="profile"><div className="avatar">MA</div><div><b>Mohamed Ashan</b><small>Personal workspace</small></div><MoreHorizontal size={18} className="muted" /></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="mobile-menu"><Menu size={20} /></button><div className="crumb"><span>Workspace</span><span className="slash">/</span><b>{activeTab === 'workspace' ? 'New thought' : activeTab[0].toUpperCase() + activeTab.slice(1)}</b></div><div className="top-actions"><button className="icon-button"><Search size={18} /></button><button className="icon-button"><span className="help-dot">?</span></button><button className="avatar small">MA</button></div></header>
      {activeTab === 'workspace' ? <section className="workspace-view"><div className="hero"><div className="eyebrow"><span className="eyebrow-line" /> GOOD MORNING, MOHAMED</div><h1>What are you <em>thinking</em><br />about today?</h1><p>Bring the rough idea. Leave with something sharper.</p></div>
        <div className="composer-wrap"><form className="composer" onSubmit={submit}><textarea value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); submit(e); } }} placeholder="Start with a thought, a question, or a messy first draft..." rows="4" /><div className="composer-footer"><div className="composer-tools"><button type="button" className="tool-button" onClick={() => setMenuOpen(!menuOpen)}><Zap size={15} /> {modeLabel} <ChevronDown size={14} /></button>{menuOpen && <div className="mode-menu">{Object.entries({ answer: 'Answer', draft: 'Draft', brainstorm: 'Brainstorm', summarize: 'Summarize' }).map(([key, label]) => <button type="button" key={key} onClick={() => { setMode(key); setMenuOpen(false); }}>{label}{mode === key && <Check size={14} />}</button>)}</div>}<button type="button" className="tool-button muted-tool"><PaperclipIcon /> Attach</button></div><div className="composer-submit"><span className="hint">{message.length > 0 ? `${message.length} characters` : '⌘ ↵ to run'}</span><button className="send-button" aria-label="Send" disabled={!message.trim() || loading}>{loading ? <LoaderCircle size={17} className="spin" /> : <ArrowUp size={18} />}</button></div></div></form>{result && <div className={`result-card ${result.error ? 'error' : ''}`} role="status" aria-live="polite"><div className="result-header"><div><span className="result-kicker">ORBIT RESPONSE</span>{result.demo && <span className="demo-pill">Demo mode</span>}</div><button onClick={copyResult} className="copy-button">{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy'}</button></div><div className="result-body">{result.error ? result.error : result.answer}</div></div>}</div>
        <div className="section-heading"><div><span className="eyebrow-line" /> STARTING POINTS</div><button onClick={() => setActiveTab('prompts')} className="text-button">View all <ArrowUp size={14} className="arrow-rotate" /></button></div><div className="starter-grid">{starters.map(starter => <button className="starter-card" key={starter.title} onClick={() => useStarter(starter)}><div className="starter-icon"><starter.icon size={18} /></div><div className="starter-copy"><b>{starter.title}</b><span>{starter.tag}</span></div><ArrowUp size={16} className="starter-arrow" /></button>)}</div>
        <div className="insight-strip"><div className="insight-icon"><Sparkles size={17} /></div><div><b>A little momentum goes a long way.</b><span>Your most productive sessions start with an imperfect first thought.</span></div><button onClick={() => useStarter(starters[1])}>Try it <ArrowUp size={14} className="arrow-rotate" /></button></div>
      </section> : <section className="secondary-view"><div className="secondary-head"><div className="eyebrow"><span className="eyebrow-line" /> YOUR {activeTab.toUpperCase()}</div><h1>{activeTab === 'prompts' ? 'Prompt library' : 'Your activity'}</h1><p>{activeTab === 'prompts' ? 'Reliable starting points for the work that matters.' : 'A quiet trail of everything you have been shaping.'}</p></div>{activeTab === 'prompts' ? <div className="library-grid">{[...starters, ...starters].map((starter, i) => <button className="library-card" key={i} onClick={() => useStarter(starter)}><div className="starter-icon"><starter.icon size={18} /></div><b>{starter.title}</b><p>{starter.prompt}</p><span>{starter.tag} <ArrowUp size={13} className="arrow-rotate" /></span></button>)}</div> : <div className="activity-list">{activity.map((item, i) => <div className="activity-row" key={i}><span className={`recent-icon ${item.kind}`}><FileText size={15} /></span><div><b>{item.title}</b><small>{item.detail}</small></div><button onClick={() => { setMessage(item.title); setActiveTab('workspace'); }}>Open <ArrowUp size={14} className="arrow-rotate" /></button></div>)}</div>}</section>}
    </main>
  </div>;
}

function OrbitMark() { return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="2.4" /><ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(-30 16 16)" /><circle cx="25" cy="8" r="2.4" fill="currentColor" /></svg>; }
function PaperclipIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m20.5 11.5-8.8 8.8a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" /></svg>; }

export default App;
