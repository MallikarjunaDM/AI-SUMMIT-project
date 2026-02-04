
import React, { useState } from 'react';
import { Language } from '../types';

const ApiDocs: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const curlExample = `curl -X POST https://voxguard.ai/api/voice-detection \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: sk_live_vox_92837482" \\
  -d '{
    "language": "English", // Supported: English, Tamil, Hindi, Malayalam, Telugu
    "audioFormat": "mp3",
    "audioBase64": "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAA..."
  }'`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(curlExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">REST API Integration</h2>
        <p className="text-slate-400">Integrate VoxGuard's multi-lingual detection engine directly into your enterprise applications.</p>
      </header>

      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Post</span>
            <code className="text-sm text-slate-300 font-mono">/api/voice-detection</code>
          </div>
          <button 
            onClick={copyToClipboard}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <div className="p-0">
          <pre className="p-6 text-sm font-mono text-blue-300 bg-slate-950 overflow-x-auto">
            {curlExample}
          </pre>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4 text-white">Authentication</h3>
          <p className="text-sm text-slate-400 mb-4">Requests must include your secret API Key in the headers for authorization.</p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
            x-api-key: sk_live_vox_92837482
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4 text-white">Request Specification</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 uppercase tracking-wider text-left border-b border-slate-800">
                  <th className="pb-2 pr-4">Field</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Supported Values</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 font-mono text-blue-400">language</td>
                  <td className="py-3">String</td>
                  <td className="py-3">English, Tamil, Hindi, Malayalam, Telugu</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 font-mono text-blue-400">audioFormat</td>
                  <td className="py-3">String</td>
                  <td className="py-3">mp3, wav, m4a</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-blue-400">audioBase64</td>
                  <td className="py-3">Base64</td>
                  <td className="py-3">Binary data string</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-4 text-white">Example Output</h3>
        <p className="text-xs text-slate-500 mb-4">The API returns a verified language and classification with a detailed forensic explanation.</p>
        <pre className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs text-green-400 overflow-x-auto">
{`{
  "status": "success",
  "language": "Hindi", // Verified by AI model
  "classification": "AI_GENERATED",
  "confidenceScore": 0.982,
  "explanation": "Artificial prosody and lack of natural phonetic variance detected in Hindi aspirated stops."
}`}
        </pre>
      </section>
    </div>
  );
};

export default ApiDocs;
