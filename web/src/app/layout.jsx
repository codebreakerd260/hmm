"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Video, Users, Zap, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else if (pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    router.push('/login');
  };

  // Avoid hydration mismatch
  if (!mounted) return <html lang="en"><body></body></html>;

  if (pathname === '/login' || !isAuthenticated) {
    return (
      <html lang="en">
        <body className={`${inter.className} antialiased bg-background text-foreground min-h-screen`}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-background text-foreground min-h-screen flex`}>
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card p-6 flex flex-col gap-6 justify-between shrink-0 h-screen sticky top-0">
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Nexus AI</h2>
              <p className="text-sm text-muted-foreground">Creator Analytics</p>
            </div>
            
            <nav className="flex flex-col gap-2">
              <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${pathname === '/' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
              <Link href="/content" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${pathname === '/content' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                <Video size={20} />
                Content
              </Link>
              <Link href="/audience" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${pathname === '/audience' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                <Users size={20} />
                Audience
              </Link>
              <Link href="/insights" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${pathname === '/insights' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
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
      </body>
    </html>
  );
}
