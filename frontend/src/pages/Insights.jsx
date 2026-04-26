import { useState, useEffect } from 'react';
import { insightsAPI } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Zap, Sparkles } from 'lucide-react';

const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await insightsAPI.getInsights();
        setInsights(res.data.insights || []);
      } catch (err) {
        console.error("Error fetching insights:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Sparkles className="w-12 h-12 text-purple-500 animate-pulse" />
        <div className="text-2xl text-purple-400 font-semibold animate-pulse">Gemini AI is analyzing your performance...</div>
        <p className="text-muted-foreground">Crunching engagement, revenue, and audience data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Zap size={32} className="text-yellow-500" />
        <h1 className="text-3xl font-bold">AI Strategic Insights</h1>
      </div>
      
      <p className="text-muted-foreground max-w-2xl text-lg">
        These insights are generated dynamically in real-time by the Gemini AI based on your latest PostgreSQL database metrics.
      </p>

      <div className="grid grid-cols-1 gap-6 mt-8">
        {insights.map((insight, index) => (
          <Card key={index} className="border-l-[6px] border-l-purple-500 bg-card hover:bg-muted/50 transition-colors">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-2xl text-foreground">{insight.title}</h3>
                <span className="text-sm font-semibold px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                  {insight.category}
                </span>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Insights;
