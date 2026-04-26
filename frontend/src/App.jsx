import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Content from './pages/Content';
import Audience from './pages/Audience';
import Insights from './pages/Insights';
import Login from './pages/Login';
import { LayoutDashboard, Video, Users, Zap, LogOut } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const DashboardLayout = ({ children }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 flex flex-col gap-6 justify-between">
        <div>
          <div className="mb-8">
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
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors font-medium w-full"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<PrivateRoute><DashboardLayout><Dashboard /></DashboardLayout></PrivateRoute>} />
        <Route path="/content" element={<PrivateRoute><DashboardLayout><Content /></DashboardLayout></PrivateRoute>} />
        <Route path="/audience" element={<PrivateRoute><DashboardLayout><Audience /></DashboardLayout></PrivateRoute>} />
        <Route path="/insights" element={<PrivateRoute><DashboardLayout><Insights /></DashboardLayout></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
