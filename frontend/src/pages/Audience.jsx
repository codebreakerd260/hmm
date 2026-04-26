import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const Audience = () => {
  const [audience, setAudience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudience = async () => {
      try {
        const res = await analyticsAPI.getTopAudience();
        setAudience(res.data);
      } catch (err) {
        console.error("Error fetching audience:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudience();
  }, []);

  if (loading) {
    return <div className="animate-pulse text-blue-500 font-semibold p-8">Loading Audience Data...</div>;
  }

  // Transform data for PieChart
  const pieData = audience.map(item => ({
    name: `${item.age_group} (${item.gender})`,
    value: Number(item.audience_size)
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Users size={32} className="text-blue-500" />
        <h1 className="text-3xl font-bold">Audience Demographics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Audience Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demographic Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {audience.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 border border-border rounded-lg bg-background">
                  <div>
                    <p className="font-semibold text-lg">{item.age_group}</p>
                    <p className="text-sm text-muted-foreground">{item.gender}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-blue-400">{Number(item.audience_size).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Audience;
