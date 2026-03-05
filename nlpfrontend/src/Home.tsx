import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeText } from './api/nlpApi';
import type { AnalyzeResponse } from './api/nlpApi';

const Home = () => {
    const navigate = useNavigate();

    // ── Try It Now state ──────────────────────────────────────────────────
    const [inputText, setInputText] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handlePredict = async () => {
        if (!inputText.trim()) return;
        setLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const result = await analyzeText({ text: inputText });
            setAnalysisResult(result);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const predictionBadgeStyle = (prediction: AnalyzeResponse['prediction']) => {
        switch (prediction) {
            case 'Positive': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Negative': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'Mixed': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };
    // ─────────────────────────────────────────────────────────────────────

    return (
        <div className="bg-[#0F172A] font-sans text-slate-100 selection:bg-blue-500/30 min-h-screen flex flex-col overflow-x-hidden">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/10 bg-[#0F172A]/80 backdrop-blur-md px-6 md:px-20 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 text-blue-500 cursor-pointer group" onClick={() => navigate('/')}>
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                        <h2 className="text-slate-100 text-xl font-bold tracking-tight ml-2 font-display group-hover:text-blue-400 transition-colors">NLP Lab</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-10">
                        {[{ label: 'Home', path: '/' }, { label: 'Pipeline', path: '/pipeline-visual' }].map((item) => (
                            <a key={item.label} className="text-slate-400 hover:text-blue-500 text-sm font-medium transition-colors cursor-pointer" onClick={() => navigate(item.path)}>{item.label}</a>
                        ))}
                        <a className="text-slate-400 hover:text-blue-500 text-sm font-medium transition-colors cursor-pointer" onClick={() => navigate('/about')}>About</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/upload')} className="flex items-center justify-center rounded-lg h-10 px-6 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-600/90 transition-all">
                            Launch Experiment
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold cursor-pointer hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all" onClick={() => navigate('/about')}>SY</div>

                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative px-6 md:px-20 py-16 md:py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col gap-8 text-left">
                        <div className="space-y-4">
                            <h1 className="text-slate-100 text-5xl md:text-6xl font-black leading-tight tracking-tight font-display">
                                Build and Experiment with <br />
                                <span className="text-blue-500">NLP Pipelines</span> Visually
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-xl">
                                A configurable NLP laboratory where users can select preprocessing techniques, N-gram models, vectorization methods, and machine learning algorithms to observe real-time performance changes.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => navigate('/upload')} className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-blue-600 text-white text-base font-bold shadow-[0_0_20px_rgba(60,131,246,0.4)] hover:shadow-[0_0_30px_rgba(60,131,246,0.6)] transition-all">
                                Start Experiment
                            </button>
                            <button onClick={() => navigate('/pipeline-visual')} className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 border-2 border-slate-700 bg-transparent text-slate-100 text-base font-bold hover:bg-slate-800 transition-all">
                                Explore Demo
                            </button>
                            <button onClick={() => navigate('/upload')} className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 border-2 border-indigo-500/50 bg-indigo-500/10 text-indigo-300 text-base font-bold hover:bg-indigo-500/20 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                                <span className="material-symbols-outlined mr-2">upload_file</span>
                                Upload Dataset
                            </button>
                        </div>
                    </div>

                    {/* Animated Pipeline Flow */}
                    <div className="relative p-8 bg-slate-800/40 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {[
                                    { icon: 'description', label: 'Raw Text' },
                                    { icon: 'cleaning_services', label: 'Preprocessing' },
                                    { icon: 'grid_view', label: 'N-grams' },
                                    { icon: 'data_object', label: 'TF-IDF' },
                                    { icon: 'psychology', label: 'Model' }
                                ].map((step, idx) => (
                                    <React.Fragment key={idx}>
                                        <div className="flex flex-col items-center gap-2 min-w-[80px]">
                                            <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-blue-500 border border-blue-500/30 cursor-pointer hover:scale-110 active:scale-95 transition-all hover:shadow-[0_0_20px_rgba(60,131,246,0.6)] hover:border-blue-500">
                                                <span className="material-symbols-outlined">{step.icon}</span>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{step.label}</span>
                                        </div>
                                        {idx < 4 && <span className="material-symbols-outlined text-blue-500 animate-pulse">trending_flat</span>}
                                    </React.Fragment>
                                ))}
                                <span className="material-symbols-outlined text-blue-500 animate-pulse">trending_flat</span>
                                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                                    <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center text-white cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(168,85,247,0.6)] border border-purple-400">
                                        <span className="material-symbols-outlined">bar_chart</span>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Metrics</span>
                                </div>
                            </div>

                            {/* Decorative Content */}
                            <div className="h-32 w-full bg-[#020617]/50 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden p-6">
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="h-2 w-3/4 bg-blue-500/20 rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-blue-500"></div>
                                    </div>
                                    <div className="h-2 w-1/2 bg-slate-700 rounded-full"></div>
                                    <div className="h-2 w-5/6 bg-slate-700 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Glows */}
                <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
            </section>

            {/* ── Interactive 3D Pipeline Workflow Section ── */}
            <PipelineWorkflow navigate={navigate} />

            {/* Key Features Section */}
            <section className="px-6 md:px-20 py-32">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20">
                        <h2 className="text-slate-100 text-4xl md:text-5xl font-black mb-4 font-display">Key Features</h2>
                        <p className="text-slate-400 text-lg">Advanced tools for high-end, futuristic AI experimentation.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: 'dynamic_feed', title: 'Configurable NLP Pipeline', desc: 'Visual drag-and-drop builder for designing complex NLP experiments with ease.' },
                            { icon: 'speed', title: 'Real-Time Metrics', desc: 'Instant feedback on model performance, accuracy, recall, and F1 scores during training.' },
                            { icon: 'visibility', title: 'Explainable AI', desc: 'Understand why models make specific decisions with highlighted feature importance maps.' },
                            { icon: 'settings_suggest', title: 'Modular Architecture', desc: 'Built on Spring Boot for robust, scalable backend operations and fast processing.' }
                        ].map((feature, idx) => (
                            <div key={idx} className="group relative p-10 rounded-2xl bg-slate-800/50 border border-slate-700 shadow-xl overflow-hidden hover:bg-slate-800/80 transition-all">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="material-symbols-outlined text-blue-500 text-4xl mb-6">{feature.icon}</span>
                                <h3 className="text-slate-100 text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Try It Now Section */}
            <section className="px-6 md:px-20 py-32 bg-slate-900/40">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-slate-100 text-4xl font-bold mb-4 font-display">Try It Now</h2>
                        <p className="text-slate-400 text-lg">See the pipeline in action with real-time analysis</p>
                    </div>
                    <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2">

                            {/* ── LEFT: Input ── */}
                            <div className="p-10 border-b md:border-b-0 md:border-r border-slate-700 flex flex-col gap-6">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 font-display">
                                    Input Text
                                </label>
                                <textarea
                                    id="try-it-now-input"
                                    className="w-full p-6 bg-[#020617] rounded-xl border border-slate-700 text-base font-medium text-slate-300 min-h-[160px] resize-y focus:outline-none focus:border-blue-500/60 transition-colors placeholder:text-slate-600"
                                    placeholder="Type or paste your text here… e.g. I absolutely love this product!"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                                <button
                                    id="try-it-now-predict-btn"
                                    onClick={handlePredict}
                                    disabled={loading || !inputText.trim()}
                                    className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Analyzing…
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-base">bolt</span>
                                            Predict
                                        </>
                                    )}
                                </button>
                                {error && (
                                    <div className="flex items-start gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>

                            {/* ── RIGHT: Output ── */}
                            <div className="p-10 bg-slate-800/50 space-y-8">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 font-display">
                                    Output Analysis
                                </label>

                                {!analysisResult && !loading && !error && (
                                    <div className="flex flex-col items-center justify-center gap-3 min-h-[200px] text-slate-600">
                                        <span className="material-symbols-outlined text-5xl">manage_search</span>
                                        <p className="text-sm">Results will appear here after prediction</p>
                                    </div>
                                )}

                                {loading && (
                                    <div className="flex flex-col items-center justify-center gap-3 min-h-[200px] text-slate-500">
                                        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        <p className="text-sm">Running NLP pipeline…</p>
                                    </div>
                                )}

                                {analysisResult && (
                                    <div className="space-y-6">
                                        {/* Prediction + Confidence */}
                                        <div>
                                            <div className="flex items-center justify-between py-2 border-b border-white/5">
                                                <span className="text-slate-400 text-sm">Prediction</span>
                                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${predictionBadgeStyle(analysisResult.prediction)}`}>
                                                    {analysisResult.prediction}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 mt-2">
                                                <span className="text-slate-400 text-sm">Confidence</span>
                                                <span className="text-slate-100 font-mono text-xl">
                                                    {analysisResult.confidence.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Key Drivers */}
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mb-3 block font-display">Key Drivers</label>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.keyDrivers.map((kw) => (
                                                    <span key={kw} className="px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pipeline Details */}
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mb-3 block font-display">Pipeline Details</label>
                                            <div className="rounded-xl bg-[#020617] border border-slate-700 p-5 space-y-3 text-xs font-mono">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-slate-600 min-w-[72px]">Tokens</span>
                                                    <span className="text-blue-400 break-all">[{analysisResult.pipeline.tokens.join(', ')}]</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="text-slate-600 min-w-[72px]">N-grams</span>
                                                    <span className="text-indigo-400 break-all">[{analysisResult.pipeline.ngrams.join(', ')}]</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-slate-600 min-w-[72px]">VectorSize</span>
                                                    <span className="text-emerald-400">{analysisResult.pipeline.vectorSize}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-slate-600 min-w-[72px]">Model</span>
                                                    <span className="text-purple-400">{analysisResult.pipeline.modelUsed}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative px-6 md:px-20 py-40 overflow-hidden text-center">
                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-slate-100 text-5xl md:text-6xl font-black mb-8 font-display leading-tight">Ready to Build Your First <br /> NLP Pipeline?</h2>
                    <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">Join hundreds of data scientists experimenting with state-of-the-art NLP techniques.</p>
                    <button onClick={() => navigate('/upload')} className="px-14 py-5 bg-blue-600 text-white rounded-2xl text-xl font-bold shadow-[0_0_40px_rgba(60,131,246,0.5)] hover:shadow-[0_0_60px_rgba(60,131,246,0.7)] transition-all transform hover:-translate-y-1">
                        Launch Experiment
                    </button>
                </div>
                <div className="absolute inset-0 -z-10 opacity-30">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-3xl"></div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 md:px-20 py-16 border-t border-slate-800 bg-[#020617] text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3 text-slate-100">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold text-lg tracking-tight">NLP Lab</span>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-8 text-sm font-medium">
                        <a className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/about-nlp')}>About NLP Lab</a>
                        {/* GitHub */}
                        <a href="https://github.com/brutalsachin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="GitHub">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                        </a>
                        {/* LinkedIn */}
                        <a href="https://www.linkedin.com/in/sachin-yadav-007814270/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="LinkedIn">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                        </a>
                    </div>
                    <p className="text-slate-600 text-sm">© 2026 NLP Lab ~ Sachin Yadav.</p>
                </div>
            </footer>
        </div>
    );
};


export default Home;

/* ════════════════════════════════════════════════
   Interactive 3D Glass Pipeline Workflow Component
   ════════════════════════════════════════════════ */
const pipelineSteps = [
    { icon: 'upload_file', title: 'Upload Dataset', desc: 'Import raw CSV or JSON text data', color: '#3c83f6' },
    { icon: 'cleaning_services', title: 'Choose Preprocessing', desc: 'Apply lemmatization & tokenization', color: '#818cf8' },
    { icon: 'filter_list', title: 'Select N-grams', desc: 'Configure Uni, Bi, or Tri-grams', color: '#a78bfa' },
    { icon: 'functions', title: 'Vectorization', desc: 'Convert text into TF-IDF vectors', color: '#38bdf8' },
    { icon: 'memory', title: 'Train Model', desc: 'Select from leading ML algorithms', color: '#34d399' },
    { icon: 'insights', title: 'Evaluate', desc: 'Review accuracy and F1 scores', color: '#f472b6' },
];

function PipelineWorkflow({ navigate }: { navigate: (path: string) => void }) {
    const [active, setActive] = useState(0);
    const [tilt, setTilt] = useState<{ x: number; y: number } | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);

    // Auto-advance active step
    React.useEffect(() => {
        const t = setInterval(() => setActive(p => (p + 1) % pipelineSteps.length), 2000);
        return () => clearInterval(t);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        const y = -((e.clientX - rect.left) / rect.width - 0.5) * 20;
        setTilt({ x, y });
        setHovered(idx);
    };

    const handleMouseLeave = () => {
        setTilt(null);
        setHovered(null);
    };

    return (
        <section className="px-6 md:px-20 py-24 bg-slate-900/30 overflow-hidden">
            {/* Inline keyframes for the glow pulse */}
            <style>{`
                @keyframes glow-pulse {
                    0%, 100% { box-shadow: 0 0 20px 2px var(--glow); }
                    50%       { box-shadow: 0 0 40px 8px var(--glow); }
                }
                .card-3d { transform-style: preserve-3d; transition: transform 0.15s ease, box-shadow 0.3s ease; }
                .arrow-anim { animation: arrow-flow 1.4s ease-in-out infinite; }
                @keyframes arrow-flow {
                    0%, 100% { opacity: 0.3; transform: translateX(0); }
                    50%       { opacity: 1;   transform: translateX(4px); }
                }
            `}</style>

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-slate-100 text-3xl font-bold font-display mb-3">The Pipeline Workflow</h2>
                    <p className="text-slate-500 text-sm">Click any step to begin — hover for the 3D effect</p>
                </div>

                {/* Cards row */}
                <div className="flex flex-wrap lg:flex-nowrap justify-center items-center gap-3" style={{ perspective: '1200px' }}>
                    {pipelineSteps.map((step, idx) => {
                        const isActive = active === idx;
                        const isHov = hovered === idx;
                        const tiltStyle = isHov && tilt
                            ? { transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(20px) scale(1.04)` }
                            : isActive
                                ? { transform: 'translateZ(12px) scale(1.02)' }
                                : { transform: 'translateZ(0px)' };

                        return (
                            <React.Fragment key={idx}>
                                <div
                                    className="card-3d flex-1 min-w-[150px] max-w-[200px] cursor-pointer"
                                    style={{ '--glow': step.color + '66' } as React.CSSProperties}
                                    onMouseMove={(e) => handleMouseMove(e, idx)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() => { setActive(idx); if (idx === 0) navigate('/upload'); }}
                                >
                                    <div
                                        className="card-3d rounded-2xl p-6 flex flex-col items-center text-center border transition-all duration-300"
                                        style={{
                                            background: isActive || isHov
                                                ? `linear-gradient(135deg, ${step.color}18 0%, rgba(15,23,42,0.9) 100%)`
                                                : 'rgba(255,255,255,0.03)',
                                            borderColor: isActive || isHov ? step.color + '80' : 'rgba(255,255,255,0.07)',
                                            backdropFilter: 'blur(12px)',
                                            boxShadow: isActive
                                                ? `0 0 30px 4px ${step.color}40, inset 0 1px 0 rgba(255,255,255,0.1)`
                                                : isHov
                                                    ? `0 20px 40px rgba(0,0,0,0.4), 0 0 20px 2px ${step.color}33, inset 0 1px 0 rgba(255,255,255,0.1)`
                                                    : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                                            ...tiltStyle,
                                        }}
                                    >
                                        {/* Step number */}
                                        <div
                                            className="text-[10px] font-black tracking-widest mb-3 px-2 py-0.5 rounded-full"
                                            style={{ color: step.color, background: step.color + '22', border: `1px solid ${step.color}44` }}
                                        >
                                            STEP {idx + 1}
                                        </div>

                                        {/* Icon */}
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all"
                                            style={{
                                                background: isActive || isHov ? step.color + '25' : 'rgba(255,255,255,0.05)',
                                                boxShadow: isActive || isHov ? `0 0 18px ${step.color}50` : 'none',
                                            }}
                                        >
                                            <span className="material-symbols-outlined text-2xl" style={{ color: step.color }}>{step.icon}</span>
                                        </div>

                                        <h4 className="text-slate-100 font-bold text-sm mb-2 leading-tight">{step.title}</h4>
                                        <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>

                                        {/* Active indicator dot */}
                                        {isActive && (
                                            <div className="mt-4 w-2 h-2 rounded-full" style={{ background: step.color, boxShadow: `0 0 8px ${step.color}` }}></div>
                                        )}
                                    </div>
                                </div>

                                {/* Animated arrow connector */}
                                {idx < pipelineSteps.length - 1 && (
                                    <div className="hidden lg:flex items-center shrink-0">
                                        <div className="arrow-anim" style={{ animationDelay: `${idx * 0.2}s` }}>
                                            <span className="material-symbols-outlined text-xl" style={{ color: pipelineSteps[idx].color + 'aa' }}>chevron_right</span>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Active step info bar */}
                <div
                    className="mt-12 mx-auto max-w-lg rounded-2xl p-5 text-center border transition-all duration-500"
                    style={{
                        background: `linear-gradient(135deg, ${pipelineSteps[active].color}15, rgba(15,23,42,0.8))`,
                        borderColor: pipelineSteps[active].color + '50',
                        boxShadow: `0 0 30px ${pipelineSteps[active].color}25`,
                    }}
                >
                    <span className="material-symbols-outlined text-3xl" style={{ color: pipelineSteps[active].color }}>{pipelineSteps[active].icon}</span>
                    <p className="text-slate-100 font-bold mt-2">{pipelineSteps[active].title}</p>
                    <p className="text-slate-400 text-sm mt-1">{pipelineSteps[active].desc}</p>
                </div>
            </div>
        </section>
    );
}
