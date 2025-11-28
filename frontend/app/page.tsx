"use client";
import React, { useState } from 'react';
import { Send, Zap, Box, MessageSquare, Loader2, Terminal, Image as ImageIcon, Key } from 'lucide-react';

/* ============================================================
   BACKEND CONFIG (IMPORTANT FOR VERCEL DEPLOYMENT)
   ============================================================ */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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
        <div className="text-sm text-slate-500 font-medium">
          Backend: {BACKEND_URL}
        </div>
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
                  <p>Client waits for full JSON (<code>{"{ response: '...' }"}</code>).</p>
                </>
              )}

              {activeLevel === 2 && (
                <>
                  <p><strong>Mechanism:</strong> Server-Sent Events (SSE).</p>
                  <p>Backend streams tokens ➜ Frontend decodes chunks in real-time.</p>
                </>
              )}

              {activeLevel === 3 && (
                <>
                  <p><strong>Mechanism:</strong> Function Calling & UI State Updates.</p>
                  <p>AI returns structured JSON to control UI components.</p>
                </>
              )}

              {activeLevel === 4 && (
                <>
                  <p><strong>Mechanism:</strong> BYOK Multimodal (User supplies Gemini key).</p>
                  <p>Key used for one request only. No storage.</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Demo Section */}
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

/* ============================================================
   LEVEL 1 — BASIC COMPLETION
   ============================================================ */

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
      const res = await fetch(`${BACKEND_URL}/api/level1/basic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch {
      setResponse("Error connecting to backend.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h3 className="text-2xl font-bold">Standard Request</h3>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input 
          className="flex-1 border px-4 py-3 rounded-lg"
          placeholder="E.g. Explain Quantum Physics"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button disabled={loading} className="btn-primary">
          Send <Send size={18} />
        </button>
      </form>

      <div className="output-box">
        {loading ? "Loading..." : response}
      </div>
    </div>
  );
}

/* ============================================================
   LEVEL 2 — STREAMING SSE
   ============================================================ */

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
      const response = await fetch(`${BACKEND_URL}/api/level2/stream`, {
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
          if (line.startsWith("data: ")) {
            const content = line.replace("data: ", "");
            if (content !== "[DONE]") {
              setStreamedText(prev => prev + content);
            }
          }
        });
      }

    } catch (err) {
      console.error(err);
    }

    setStreaming(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h3 className="text-2xl font-bold">Streaming</h3>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input 
          className="flex-1 border px-4 py-3 rounded-lg"
          placeholder="Write a poem about coding"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button disabled={streaming} className="btn-primary">
          Stream <Zap size={18}/>
        </button>
      </form>

      <div className="output-box whitespace-pre-wrap">
        {streamedText || "Stream output will appear here..."}
      </div>
    </div>
  );
}

/* ============================================================
   LEVEL 3 — GENERATIVE UI (AI Controls Dashboard)
   ============================================================ */

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
      const res = await fetch(`${BACKEND_URL}/api/level3/ui`, {
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
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h3 className="text-2xl font-bold">Generative UI</h3>

      <div className="flex gap-2">
        <input 
          className="flex-1 border px-4 py-3 rounded-lg"
          placeholder="Change to dark mode..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="btn-primary" onClick={handleCommand}>
          Execute
        </button>
      </div>

      <div className={`rounded-2xl p-8 border-2 transition-all ${themeStyles[dashboardState.theme]}`}>
        <div className="text-4xl font-black">{dashboardState.theme.toUpperCase()} MODE</div>
        <div className="text-lg opacity-80 mt-2">
          Status: {dashboardState.status_message}
        </div>
        {loading && <Loader2 className="animate-spin mt-4"/>}
      </div>
    </div>
  );
}

/* ============================================================
   LEVEL 4 — GEMINI IMAGE GEN
   ============================================================ */

function Level4ImageGen() {
  const [apiKey, setApiKey] = useState('');
  const [input, setInput] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey) {
      setError("Please enter your Gemini API key.");
      return;
    }

    if (!input) return;

    setLoading(true);
    setError('');
    setImageSrc(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/level4/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          user_api_key: apiKey 
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Image failed");

      if (data.status === "success") {
        setImageSrc(`data:image/jpeg;base64,${data.image_base64}`);
      } else {
        setError("No image returned.");
      }

    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h3 className="text-2xl font-bold">Gemini Image Generation</h3>

      {/* API Key */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3">
        <Key className="text-amber-600" size={20} />
        <input 
          type="password"
          className="flex-1 bg-transparent border-none"
          placeholder="Paste your Gemini API key"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
        />
      </div>

      {/* Prompt */}
      <form onSubmit={handleGenerate} className="flex gap-3">
        <input 
          className="flex-1 border px-4 py-3 rounded-lg"
          placeholder="A futuristic banana city"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button disabled={loading} className="btn-primary">
          Generate <ImageIcon size={18} />
        </button>
      </form>

      {/* Error */}
      {error && <div className="error-box">{error}</div>}

      {/* Output */}
      <div className="bg-slate-50 border p-6 rounded-xl min-h-[350px] flex items-center justify-center">
        {loading ? (
          <div className="text-slate-400">
            <Loader2 className="animate-spin mx-auto"/>
            Generating image…
          </div>
        ) : imageSrc ? (
          <img src={imageSrc} className="rounded-lg shadow-md max-h-[400px]"/>
        ) : (
          <div className="text-slate-400 text-center">
            <ImageIcon size={40} className="mx-auto opacity-40"/>
            Image will appear here
          </div>
        )}
      </div>
    </div>
  );
}

