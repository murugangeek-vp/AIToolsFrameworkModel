import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex bg-[#0a0a0f] min-h-screen text-slate-250">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header Bar */}
        <TopBar />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
