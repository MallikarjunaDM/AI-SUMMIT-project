
import React, { useState } from 'react';
import Layout from './components/Layout';
import VoiceDetector from './components/VoiceDetector';
import ApiDocs from './components/ApiDocs';
import VoiceTools from './components/VoiceTools';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('detector');

  const renderContent = () => {
    switch (activeTab) {
      case 'detector':
        return <VoiceDetector />;
      case 'api':
        return <ApiDocs />;
      case 'tools':
        return <VoiceTools />;
      case 'chat':
        return <ChatBot />;
      default:
        return <VoiceDetector />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-white mb-2">
          Voice Authenticity <span className="text-blue-500">Analytics</span>
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Multi-lingual neural analysis engine designed to distinguish between high-fidelity AI voice synthesis and human speech across five major regional languages.
        </p>
      </div>
      
      {renderContent()}

      <footer className="pt-12 pb-8 border-t border-slate-900 text-center">
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Languages</span>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-slate-900 rounded text-[10px] text-slate-400 border border-slate-800">Tamil</span>
              <span className="px-2 py-1 bg-slate-900 rounded text-[10px] text-slate-400 border border-slate-800">Hindi</span>
              <span className="px-2 py-1 bg-slate-900 rounded text-[10px] text-slate-400 border border-slate-800">English</span>
              <span className="px-2 py-1 bg-slate-900 rounded text-[10px] text-slate-400 border border-slate-800">Malayalam</span>
              <span className="px-2 py-1 bg-slate-900 rounded text-[10px] text-slate-400 border border-slate-800">Telugu</span>
            </div>
          </div>
        </div>
        <p className="text-slate-600 text-xs font-mono">
          VOXGUARD v1.0.4 &copy; {new Date().getFullYear()} Security Hackathon Edition
        </p>
      </footer>
    </Layout>
  );
};

export default App;
