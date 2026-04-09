import React, { useState } from 'react';
import { Page } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DetectionWorkspace from './components/DetectionWorkspace';
import Settings from './components/Settings';
import KnowledgeBase from './components/KnowledgeBase';
import GameWorkspace from './components/GameWorkspace';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);

  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD: return <Dashboard onStart={() => setCurrentPage(Page.DETECTION)} />;
      case Page.DETECTION: return <DetectionWorkspace />;
      case Page.GAME: return <GameWorkspace />;
      case Page.SETTINGS: return <Settings />;
      case Page.KNOWLEDGE: return <KnowledgeBase />;
      default: return <Dashboard onStart={() => setCurrentPage(Page.DETECTION)} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950">
      <Sidebar activePage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 relative overflow-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e293b_0%,transparent_50%)] opacity-30 pointer-events-none"></div>
        <div className="p-8 relative z-10 max-w-7xl mx-auto h-full flex flex-col">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;