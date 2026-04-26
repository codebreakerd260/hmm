import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { analyticsAPI, insightsAPI } from '../services/api';
import { TrendingUp, Users, DollarSign, Activity, Zap } from 'lucide-react';

const Dashboard = () => {
  const [topContent, setTopContent] = useState([]);
  const [topPlatform, setTopPlatform] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [contentRes, platformRes, insightsRes] = await Promise.all([
          analyticsAPI.getTopContent(),
          analyticsAPI.getTopPlatform(),
          insightsAPI.getInsights()
        ]);
        
        setTopContent(contentRes.data);
        setTopPlatform(platformRes.data);
        setInsights(insightsRes.data.insights || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-pulse" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
          Nexus AI is analyzing your data...
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalRevenue = topPlatform.reduce((sum, item) => sum + Number(item.total_revenue), 0);

  return (
    <div>
      <div className="flex-between">
        <h1>Dashboard Overview</h1>
        <button style={{ 
          background: 'var(--primary)', 
          color: 'white', 
          border: 'none', 
          padding: '0.75rem 1.5rem', 
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginTop: '2rem' }}>
        <div className="card glass flex-between">
          <div>
            <p>Total Revenue</p>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
            <p style={{ color: 'var(--accent)', fontSize: '0.875rem' }}>+12.5% from last month</p>
          </div>
          <DollarSign size={48} color="var(--primary)" opacity={0.2} />
        </div>
        
        <div className="card glass flex-between">
          <div>
            <p>Top Platform</p>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{topPlatform[0]?.platform || 'N/A'}</h2>
            <p style={{ color: 'var(--accent)', fontSize: '0.875rem' }}>Highest ROI</p>
          </div>
          <TrendingUp size={48} color="var(--secondary)" opacity={0.2} />
        </div>

        <div className="card glass flex-between">
          <div>
            <p>Best Performing Content</p>
            <h2 style={{ fontSize: '1.25rem', margin: '0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
              {topContent[0]?.title || 'N/A'}
            </h2>
            <p style={{ color: 'var(--accent)', fontSize: '0.875rem' }}>{topContent[0]?.views.toLocaleString()} views</p>
          </div>
          <Activity size={48} color="var(--accent)" opacity={0.2} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid-2">
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Revenue by Platform</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPlatform} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="platform" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Bar dataKey="total_revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Top Content Engagement</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={topContent} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="title" stroke="var(--text-muted)" tickFormatter={(val) => val.substring(0, 10) + '...'} />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: 'var(--radius-md)' }}
                />
                <Line type="monotone" dataKey="views" stroke="var(--secondary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--secondary)' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights Engine Section */}
      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Zap color="var(--secondary)" /> AI Strategic Insights
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {insights.map((insight, index) => (
          <div key={index} className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', color: 'var(--text-main)' }}>{insight.title}</h3>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--secondary)', borderRadius: '1rem', fontWeight: '500' }}>
                {insight.category}
              </span>
            </div>
            <p>{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
