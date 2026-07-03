import React from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import AIAssistantPanel from '@/components/AIAssistantPanel';
import Home from '@/pages/Home';
import Attacks from '@/pages/Attacks';
import AttackDetail from '@/pages/AttackDetail';
import Submit from '@/pages/Submit';
import About from '@/pages/About';

function App() {
  return (
    <div className="App grain min-h-screen bg-obsidian text-white">
      <AppProvider>
        <BrowserRouter>
          <Navbar />
          <AIAssistantPanel />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/attacks" element={<Attacks />} />
            <Route path="/attacks/:slug" element={<AttackDetail />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <footer className="border-t border-white/10 py-10 mt-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
              <div className="mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
                THREAT.CHRONICLES · An open archive of documented cyber incidents
              </div>
              <div className="mono text-[10px] tracking-[0.3em] text-white/30">© {new Date().getFullYear()}</div>
            </div>
          </footer>
        </BrowserRouter>
      </AppProvider>
    </div>
  );
}

export default App;
