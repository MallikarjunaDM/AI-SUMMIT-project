
import React, { useState, useRef } from 'react';
import { Language, LanguageLabels, LanguageFlags, DetectionResult, Classification } from '../types';
import { detectVoice } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const VoiceDetector: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setCopied(false);
    }
  };

  const analyzeAudio = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await detectVoice(base64);
        setResult(res);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  const copyTranscript = () => {
    if (result?.transcription) {
      navigator.clipboard.writeText(result.transcription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const data = result ? [
    { name: 'Confidence', value: result.confidenceScore * 100 },
    { name: 'Uncertainty', value: Math.max(0, (1 - result.confidenceScore) * 100) }
  ] : [];

  const COLORS = result?.classification === Classification.AI_GENERATED ? ['#ef4444', '#1e293b'] : ['#22c55e', '#1e293b'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl h-full flex flex-col justify-center">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-white mb-2">Voice Analysis Hub</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Upload any audio recording. Our AI will automatically detect the language (English, Tamil, Hindi, Malayalam, or Telugu) and verify its authenticity.
            </p>
          </div>
          
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all group relative overflow-hidden"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="audio/mp3,audio/wav,audio/m4a" 
                className="hidden" 
              />
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-400 group-hover:text-blue-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-slate-200">
                {file ? file.name : "Choose audio file"}
              </p>
              <p className="text-sm text-slate-500 mt-2">Drop MP3, WAV, or M4A here</p>
              
              {file && (
                <div className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                  File Ready
                </div>
              )}
            </div>

            <button
              onClick={analyzeAudio}
              disabled={!file || isAnalyzing}
              className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                !file || isAnalyzing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] active:scale-[0.98]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Forensic Analysis...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Scan & Transcribe
                </>
              )}
            </button>
          </div>
          
          <div className="mt-8 flex justify-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase">
              <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
              Auto-Detection Active
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase">
              <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
              Linguistic Transcript Included
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className={`bg-slate-900/50 border p-6 rounded-2xl transition-all duration-500 h-full flex flex-col ${
          result ? (result.classification === Classification.AI_GENERATED ? 'border-red-900/30 bg-red-900/5' : 'border-green-900/30 bg-green-900/5') : 'border-slate-800'
        }`}>
          <h3 className="text-xl font-bold mb-4 text-white">Detection Report</h3>
          
          {!result && !isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              </div>
              <p className="text-slate-400">Analysis results and transcript will appear here after scanning.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-pulse">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-blue-400 font-mono text-[10px] font-bold uppercase tracking-widest">Processing</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm text-center">Identifying language and generating high-fidelity transcript...</p>
            </div>
          )}

          {result && (
            <div className="flex-1 space-y-6 animate-in zoom-in-95 duration-300 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Source Analysis</p>
                  <div className={`text-2xl font-black ${result.classification === Classification.AI_GENERATED ? 'text-red-500' : 'text-green-500'}`}>
                    {result.classification === Classification.AI_GENERATED ? 'Synthetic AI Voice' : 'Authentic Human Voice'}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Score</p>
                  <div className="text-2xl font-mono text-white">{(result.confidenceScore * 100).toFixed(1)}%</div>
                </div>
              </div>

              <div className="h-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      startAngle={90}
                      endAngle={450}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</span>
                   <span className="text-lg font-mono text-white">{(result.confidenceScore * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Transcription Section */}
              <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    Audio Transcript
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-md">
                      <span className="text-sm">{LanguageFlags[result.language]}</span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase">{result.language}</span>
                    </div>
                    <button 
                      onClick={copyTranscript}
                      className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-500 hover:text-white"
                      title="Copy Transcript"
                    >
                      {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50 min-h-[60px]">
                  <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {result.transcription}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800/50">
                   <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Technical Summary</p>
                   <p className="text-slate-400 text-[11px] leading-relaxed italic">
                    {result.explanation}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Phonetic Integrity</p>
                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-2">
                    <div 
                      className={`h-full transition-all duration-1000 ${result.classification === Classification.HUMAN ? 'bg-green-500' : 'bg-red-500'}`} 
                      style={{ width: `${result.confidenceScore * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 text-center flex flex-col justify-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Verification Status</p>
                  <p className="text-[10px] font-black text-white truncate flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    VOX-CERTIFIED
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default VoiceDetector;
