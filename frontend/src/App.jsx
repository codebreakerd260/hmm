import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <div style={{ padding: '1rem 0' }}>
            <h2>Nexus AI</h2>
            <p style={{ fontSize: '0.875rem' }}>Creator Analytics</p>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--primary)', color: 'white', fontWeight: '500' }}>Dashboard</div>
            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--text-muted)' }}>Content</div>
            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--text-muted)' }}>Audience</div>
            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--text-muted)' }}>Insights</div>
          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
