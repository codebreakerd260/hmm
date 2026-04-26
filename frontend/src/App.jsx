import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Content from './pages/Content';
import Audience from './pages/Audience';
import Insights from './pages/Insights';
import { LayoutDashboard, Video, Users, Zap } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Nexus AI</h2>
            <p className="text-sm text-muted-foreground">Creator Analytics</p>
          </div>
          
          <nav className="flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground font-medium">
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link to="/content" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground font-medium">
              <Video size={20} />
              Content
            </Link>
            <Link to="/audience" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground font-medium">
              <Users size={20} />
              Audience
            </Link>
            <Link to="/insights" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground font-medium">
              <Zap size={20} />
              Insights
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/content" element={<Content />} />
            <Route path="/audience" element={<Audience />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
