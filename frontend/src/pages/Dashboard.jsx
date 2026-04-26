import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { analyticsAPI, insightsAPI } from '../services/api';
import { TrendingUp, DollarSign, Activity, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

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
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse text-2xl text-blue-500 font-semibold">
          Nexus AI is analyzing your data...
        </div>
      </div>
    );
  }

  const totalRevenue = topPlatform.reduce((sum, item) => sum + Number(item.total_revenue), 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <h2 className="text-3xl font-bold my-2">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
              <p className="text-sm text-green-500">+12.5% from last month</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-500 opacity-20" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Top Platform</p>
              <h2 className="text-3xl font-bold my-2">{topPlatform[0]?.platform || 'N/A'}</h2>
              <p className="text-sm text-green-500">Highest ROI</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Best Performing Content</p>
              <h2 className="text-xl font-bold my-2 truncate w-48">{topContent[0]?.title || 'N/A'}</h2>
              <p className="text-sm text-blue-400">{topContent[0]?.views.toLocaleString()} views</p>
            </div>
            <Activity className="w-12 h-12 text-green-500 opacity-20" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Platform</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPlatform} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="platform" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Bar dataKey="total_revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Content Engagement</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={topContent} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="title" stroke="#94a3b8" tickFormatter={(val) => val.substring(0, 10) + '...'} />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                />
                <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <Zap className="text-purple-500" /> AI Strategic Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <Card key={index} className="border-l-4 border-l-purple-500 bg-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">{insight.title}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full">
                    {insight.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
