"use client";
import React, { useState } from 'react';
import { Send, Zap, Box, MessageSquare, Loader2, Terminal, Image as ImageIcon, Key } from 'lucide-react';

/**
 * AI Integration Course Demo
 * Updated to include Level 4: Gemini Image Generation
 */

export default function AIDemoPage() {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3 | 4>(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg font-bold text-sm">AI</div>
          <h1 className="font-bold text-xl tracking-tight">Integration</h1>
        </div>
        <div className="text-sm text-slate-500 font-medium">Next.js + FastAPI + OpenAI&Gemini</div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-6">
          <nav className="space-y-2">
            <NavButton 
              level={1} current={activeLevel} set={setActiveLevel} 
              icon={<MessageSquare size={18}/>} title="Level 1: Basic" desc="Standard Request/Response"
            />
            <NavButton 
              level={2} current={activeLevel} set={setActiveLevel} 
              icon={<Zap size={18}/>} title="Level 2: Streaming" desc="Real-time Tokens"
            />
            <NavButton 
              level={3} current={activeLevel} set={setActiveLevel} 
              icon={<Box size={18}/>} title="Level 3: Gen UI" desc="AI Controlled Interface"
            />
            <NavButton 
              level={4} current={activeLevel} set={setActiveLevel} 
              icon={<ImageIcon size={18}/>} title="Level 4: Image Gen" desc="Gemini Text-to-Image"
            />
          </nav>

          {/* Educational Context */}
          <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 text-sm shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2 font-bold text-indigo-900 mb-3 border-b border-indigo-200 pb-2">
              <Terminal size={16} />
              <span>Technical Concept</span>
            </div>
            
            <div className="text-indigo-800 leading-relaxed space-y-3">
              {activeLevel === 1 && (
                <>
                  <p><strong>Mechanism:</strong> Standard HTTP Blocking Request.</p>
                  <p>Client waits for the complete JSON response <code>{`{ "response": "..." }`}</code>. High latency, simple implementation.</p>
                </>
              )}

              {activeLevel === 2 && (
                <>
                  <p><strong>Mechanism:</strong> Server-Sent Events (SSE).</p>
                  <p>Backend uses Python <code>yield</code> to push data chunks. Frontend uses <code>TextDecoder</code> to read the stream. Low latency feel.</p>
                </>
              )}

              {activeLevel === 3 && (
                <>
                  <p><strong>Mechanism:</strong> Function Calling (Tools).</p>
                  <p>The AI returns structured JSON arguments instead of text, allowing it to control the <code>State</code> of the application directly.</p>
                </>
              )}

              {activeLevel === 4 && (
                <>
                  <p><strong>Mechanism:</strong> BYOK (Bring Your Own Key) & Multimodal API.</p>
                  <p>
                    <strong>Flow:</strong> Frontend sends Prompt + User's API Key <span className="text-indigo-400">→</span> Backend configures <code>genai</code> dynamically <span className="text-indigo-400">→</span> Generates Image <span className="text-indigo-400">→</span> Returns Base64 string.
                  </p>
                  <p className="text-xs bg-white/50 p-2 rounded text-indigo-600">
                    <em>Note:</em> We do not store the API Key on the server. It is used for a single request scope.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Demo Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-700">Live Preview</h2>
            </div>
            
            <div className="flex-1 p-8">
              {activeLevel === 1 && <Level1Basic />}
              {activeLevel === 2 && <Level2Stream />}
              {activeLevel === 3 && <Level3GenUI />}
              {activeLevel === 4 && <Level4ImageGen />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub Components ---

function NavButton({ level, current, set, icon, title, desc }: any) {
  const isActive = current === level;
  return (
    <button
      onClick={() => set(level)}
      className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
        isActive 
          ? 'bg-white border-indigo-600 shadow-md ring-1 ring-indigo-600' 
          : 'bg-transparent border-transparent hover:bg-slate-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
          {icon}
        </div>
        <div>
          <div className={`font-bold ${isActive ? 'text-indigo-900' : 'text-slate-600'}`}>{title}</div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">{desc}</div>
        </div>
      </div>
    </button>
  );
}

// --- LEVEL 1: Basic ---
function Level1Basic() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://localhost:8000/api/level1/basic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setResponse("Error connecting to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-slate-800">Standard Request</h3>
        <p className="text-slate-500">Ask a question and wait for the complete answer.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input 
          className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          placeholder="E.g. Explain Quantum Physics"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button 
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          Send <Send size={18} />
        </button>
      </form>

      <div className="bg-slate-50 rounded-xl p-6 min-h-[200px] border border-slate-200">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
            <Loader2 className="animate-spin" />
            <span>Waiting for full response...</span>
          </div>
        ) : response ? (
          <p className="text-slate-700 leading-relaxed animate-in fade-in duration-500">{response}</p>
        ) : (
          <p className="text-slate-400 italic text-center mt-12">AI response will appear here.</p>
        )}
      </div>
    </div>
  );
}

// --- LEVEL 2: Streaming ---
function Level2Stream() {
  const [input, setInput] = useState('');
  const [streamedText, setStreamedText] = useState('');
  const [streaming, setStreaming] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    setStreaming(true);
    setStreamedText('');

    try {
      const response = await fetch('http://localhost:8000/api/level2/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            const content = line.replace('data: ', '');
            const cleanContent = content.replace(/\\n/g, '\n'); 
            if (cleanContent !== '[DONE]') {
              setStreamedText(prev => prev + cleanContent);
            }
          }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-slate-800">Streaming Response</h3>
        <p className="text-slate-500">See the answer type out in real-time.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input 
          className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          placeholder="E.g. Write a poem about coding"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button 
          disabled={streaming}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          Stream <Zap size={18} />
        </button>
      </form>

      <div className="bg-slate-50 rounded-xl p-6 min-h-[200px] border border-slate-200 relative">
        {streamedText ? (
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {streamedText}
            {streaming && <span className="inline-block w-2 h-5 bg-indigo-500 ml-1 animate-pulse align-middle"/>}
          </p>
        ) : (
          <p className="text-slate-400 italic text-center mt-12">Response streams here...</p>
        )}
      </div>
    </div>
  );
}

// --- LEVEL 3: Generative UI ---
function Level3GenUI() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboardState, setDashboardState] = useState({
    theme: 'light',
    status_message: 'System Normal'
  });

  const themeStyles: any = {
    light: 'bg-white border-slate-200',
    dark: 'bg-slate-900 border-slate-700 text-white',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    red: 'bg-red-50 border-red-200 text-red-900'
  };

  const handleCommand = async () => {
    if (!input) return;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/level3/ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      if (data.type === 'ui_update') {
        setDashboardState(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-slate-800">Generative UI</h3>
        <p className="text-slate-500">Tell the AI to change the interface.</p>
      </div>

      {/* Controls - Above the Output */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input 
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="E.g. Turn it to dark mode or Set status to 'Critical Error'"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCommand()}
          />
          <button 
            onClick={handleCommand}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            Execute
          </button>
        </div>
        <div className="flex gap-2 justify-center text-xs text-slate-500">
          <span>Try:</span>
          <button onClick={() => setInput("Change to Dark Mode with status 'Night Watch'")} className="underline hover:text-indigo-600">Dark Mode</button>
          <button onClick={() => setInput("Make it Red and warn about overheating")} className="underline hover:text-indigo-600">Red Alert</button>
        </div>
      </div>

      {/* The AI Controlled Card - Below the Input */}
      <div className={`rounded-2xl p-8 shadow-lg transition-all duration-500 border-2 flex flex-col items-center justify-center min-h-[240px] gap-4 ${themeStyles[dashboardState.theme] || themeStyles.light}`}>
        <div className="text-4xl font-black tracking-tighter">
          {dashboardState.theme.toUpperCase()} MODE
        </div>
        <div className="text-lg font-medium opacity-80">
          Status: {dashboardState.status_message}
        </div>
        {loading && <Loader2 className="animate-spin opacity-50" />}
      </div>
    </div>
  );
}

// --- LEVEL 4: Gemini Image Gen ---
function Level4ImageGen() {
  const [apiKey, setApiKey] = useState('');
  const [input, setInput] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    if (!apiKey) {
      setError("Please enter your Gemini API Key first.");
      return;
    }
    
    setLoading(true);
    setImageSrc(null);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/level4/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          user_api_key: apiKey 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Image generation failed");
      }

      if (data.status === 'success' && data.image_base64) {
        setImageSrc(`data:image/jpeg;base64,${data.image_base64}`);
      } else {
        setError("API returned success but no image data found.");
      }
      
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-slate-800">Gemini 2.5 Flash Image (Nano Banana)</h3>
        <p className="text-slate-500">Provide your key and generate images instantly.</p>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        {/* API Key Input */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3">
          <Key className="text-amber-600" size={20} />
          <input 
            type="password"
            className="flex-1 bg-transparent border-none focus:outline-none text-amber-900 placeholder-amber-400"
            placeholder="Paste your Gemini API Key here (starts with AIza...)"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
          />
        </div>

        {/* Prompt Input */}
        <form onSubmit={handleGenerate} className="flex gap-3">
          <input 
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="E.g. A futuristic banana city in neon lights"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            Generate <ImageIcon size={18} />
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {/* Output Area - Below Input */}
      <div className="bg-slate-50 rounded-xl p-6 min-h-[350px] border border-slate-200 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="animate-spin w-8 h-8" />
            <span>Generating image... (this takes ~5s)</span>
          </div>
        ) : imageSrc ? (
          <img 
            src={imageSrc} 
            alt="Generated from Gemini" 
            className="rounded-lg shadow-md max-h-[400px] w-full object-contain animate-in zoom-in duration-500" 
          />
        ) : (
          <div className="text-center text-slate-400">
            <ImageIcon className="mx-auto mb-2 opacity-50" size={48} />
            <p>Image will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}