import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Novax Admin Panel',
  description: 'Administrative Control Center for Novax Travel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-navy`}>
      {/* NOVAX_BRAND_HEADER */}
      <header style={{position:"sticky",top:0,zIndex:50,background:"#ffffff",borderBottom:"1px solid rgba(0,0,0,.08)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
          <a href="/" style={{display:"inline-flex",alignItems:"center",gap:10,textDecoration:"none"}}>
            <img src="/brand/svg/novax_logo_primary_dark.svg" alt="NOVAX" style={{height:28,width:"auto"}}
              onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src="/brand/svg/novax_logo_primary.svg";}} />
          </a>
        </div>
      </header>

        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-y-auto p-6 bg-background">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
