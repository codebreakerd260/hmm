"use client";
import { useState, useEffect } from 'react';
import { analyticsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

export default function Content() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await analyticsAPI.getEngagementRate();
        setContent(res.data);
      } catch (err) {
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return <div className="animate-pulse text-blue-500 font-semibold p-8">Loading Content Data...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Video size={32} className="text-purple-500" />
        <h1 className="text-3xl font-bold">Content Performance</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Engagement Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-4 font-medium text-muted-foreground">Title</th>
                  <th className="py-4 px-4 font-medium text-muted-foreground text-right">Views</th>
                  <th className="py-4 px-4 font-medium text-muted-foreground text-right">Likes</th>
                  <th className="py-4 px-4 font-medium text-muted-foreground text-right">Comments</th>
                  <th className="py-4 px-4 font-medium text-muted-foreground text-right">Engagement Rate</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium truncate max-w-xs">{item.title}</td>
                    <td className="py-4 px-4 text-right">{item.views.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">{item.likes.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">{item.comments.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-md text-sm font-semibold">
                        {item.engagement_rate_pct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
