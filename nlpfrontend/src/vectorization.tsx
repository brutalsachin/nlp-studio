import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { previewVectorization } from './api/vectorizationApi';
import type { VectorizationResponse, VectorizationType, NgramType } from './api/vectorizationApi';

const PIPELINE = [
    { label: 'Upload Dataset', icon: 'upload_file', done: true, active: false, path: '/upload' },
    { label: 'Preprocessing', icon: 'settings_suggest', done: true, active: false, path: '/preprocessing' },
    { label: 'Feature Extraction', icon: 'query_stats', done: true, active: false, path: '/feature-extraction' },
    { label: 'Vectorization', icon: 'view_in_ar', done: false, active: true, path: '/vectorization' },
    { label: 'Model Selection', icon: 'model_training', done: false, active: false, path: '/model-selection' },
];

const strategies: { id: VectorizationType; icon: string; title: string; desc: string }[] = [
    { id: 'TF_IDF', icon: 'analytics', title: 'TF-IDF', desc: 'Statistical measure evaluating word importance relative to the corpus.' },
    { id: 'BAG_OF_WORDS', icon: 'format_list_numbered', title: 'Bag of Words', desc: 'Simplest representation counting word frequencies without considering order.' },
    { id: 'ONE_HOT', icon: 'looks_one', title: 'One-Hot Encoding', desc: 'Binary vectors where each position represents a unique word in the vocabulary.' },
];

const Vectorization = () => {
    const navigate = useNavigate();

    // ── Pre-loaded global state ───────────────────────────────────────────────
    // Using memoized initializers to prevent reading from localStorage on every render
    const [inputText, setInputText] = useState<string>(() => localStorage.getItem('preprocessedText') ?? "");
    const selectedFeatures: string[] = JSON.parse(localStorage.getItem('selectedFeatures') || "[]");
    const selectedNgramType: NgramType = (localStorage.getItem('ngramType') as NgramType) || "UNIGRAM";

    // ── Local configuration state ─────────────────────────────────────────────
    const [vectorType, setVectorType] = useState<VectorizationType>('TF_IDF');

    // ── API state ─────────────────────────────────────────────────────────────
    const [vectorResult, setVectorResult] = useState<VectorizationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ── Debounced API call (300 ms) ───────────────────────────────────────────
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(async () => {
            if (!inputText.trim() || selectedFeatures.length === 0) return;
            setLoading(true);
            setError(null);

            try {
                const data = await previewVectorization({
                    text: inputText,
                    ngramType: selectedNgramType,
                    vectorizationType: vectorType,
                    selectedFeatures,
                });
                setVectorResult(data);

                // Persist choice for model selection phase
                localStorage.setItem('vectorizationType', data.vectorizationType);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Vectorization preview failed.');
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [inputText, vectorType, selectedNgramType, selectedFeatures]);

    const activeStrategy = strategies.find(s => s.id === vectorType)!;

    // Default metrics mapping prior to successful query 
    const fallbackMetrics = { density: 0, sparsity: 0, vocabSize: 0 };
    const currentDensity = vectorResult ? vectorResult.featureDensity : fallbackMetrics.density;
    const currentSparsity = vectorResult ? vectorResult.matrixSparsity : fallbackMetrics.sparsity;
    const currentVocabCoverage = vectorResult ? vectorResult.vocabCoverage : fallbackMetrics.vocabSize;

    return (
        <div className="bg-[#07091a] text-slate-100 min-h-screen font-sans flex flex-col">
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0a0d1f]/90 backdrop-blur-md px-6 lg:px-10 py-3.5">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(60,131,246,0.4)] transition-all">
                            <span className="material-symbols-outlined text-white text-xl">account_tree</span>
                        </div>
                        <span className="text-base font-bold tracking-tight group-hover:text-blue-400 transition-colors">Interactive NLP Experimentation Platform</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700">
                            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span></span>
                            <span className="text-xs font-bold text-blue-400">VECTORIZATION ACTIVE</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">SY</div>
                    </div>
                </div>
            </header>

            <div className="border-b border-slate-800/70 bg-[#0a0d1f] px-6 lg:px-10">
                <div className="max-w-[1400px] mx-auto flex">
                    {PIPELINE.map((step, idx) => (
                        <div key={step.label} className="flex items-center flex-1">
                            <button onClick={() => navigate(step.path)} className={`flex flex-col items-center gap-1 py-4 flex-1 border-b-2 transition-all ${step.active ? 'border-blue-500' : step.done ? 'border-emerald-600' : 'border-transparent hover:border-slate-700'}`}>
                                <span className={`material-symbols-outlined text-xl ${step.active ? 'text-blue-500' : step.done ? 'text-emerald-500' : 'text-slate-600'}`}>{step.done && !step.active ? 'check_circle' : step.icon}</span>
                                <span className={`text-[10px] font-bold tracking-widest ${step.active ? 'text-blue-500' : step.done ? 'text-emerald-500' : 'text-slate-600'}`}>{step.label.toUpperCase()}</span>
                            </button>
                            {idx < 4 && <div className="w-6 h-[1px] bg-slate-800 shrink-0"></div>}
                        </div>
                    ))}
                </div>
            </div>

            <main className="flex-1 px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full space-y-8">
                <div>
                    <h1 className="text-3xl font-black mb-2">Step 4: Vectorization</h1>
                    <p className="text-slate-400 text-sm">Convert processed text into numerical feature vectors for machine learning models.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                    <div className="space-y-6">

                        {/* ── Input Text Area ── */}
                        <section className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">text_fields</span>
                                <h3 className="text-lg font-semibold">Transform Text</h3>
                            </div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                rows={2}
                                className="w-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 resize-y focus:outline-none transition-colors placeholder:text-slate-600"
                                placeholder="Enter text to test vectorization..."
                            />
                        </section>

                        {/* ── Vectorization Strats ── */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {strategies.map(s => {
                                const active = vectorType === s.id;
                                return (
                                    <div key={s.id} onClick={() => setVectorType(s.id)} className={`p-6 rounded-xl cursor-pointer transition-all border relative overflow-hidden ${active ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(60,131,246,0.2)]' : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/60'}`}>
                                        {active && <div className="absolute top-3 right-3 text-blue-500"><span className="material-symbols-outlined">check_circle</span></div>}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${active ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-400'}`}>
                                            <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                                        </div>
                                        <h4 className="text-white font-bold text-lg mb-2">{s.title}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Dynamic Preview ── */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-500">data_array</span>
                                    Vector Preview — {activeStrategy.title}
                                </h3>
                                {loading ? (
                                    <svg className="animate-spin h-4 w-4 text-blue-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                ) : (
                                    <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold animate-pulse">Live</span>
                                )}
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                    <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">error</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="bg-[#020617] rounded-xl p-5 font-mono text-sm border border-slate-800">
                                <div className="flex flex-wrap gap-2 items-center text-blue-400">
                                    <span className="text-slate-500">[</span>
                                    {loading ? (
                                        <span className="text-slate-600">computing vector...</span>
                                    ) : vectorResult && vectorResult.vector.length > 0 ? (
                                        <>
                                            {vectorResult.vector.slice(0, 20).map((v, i) => {
                                                // Highlight non-zero values for visual indication
                                                const isNonZero = Number(v) > 0;
                                                return (
                                                    <span key={i} className={isNonZero ? 'text-white bg-blue-500/30 rounded px-1.5 py-0.5' : ''}>
                                                        {Number.isInteger(v) ? v : v.toFixed(3)},
                                                    </span>
                                                );
                                            })}
                                            {vectorResult.vector.length > 20 && <span className="text-slate-500 italic mt-1">... ({vectorResult.vector.length - 20} more)</span>}
                                        </>
                                    ) : (
                                        <span className="text-slate-600">No features configured. Go back to Step 3.</span>
                                    )}
                                    <span className="text-slate-500">]</span>
                                </div>
                                <div className="flex flex-col gap-1 mt-4">
                                    <p className="text-slate-500 text-[10px] uppercase tracking-tighter">
                                        Strategy: <span className="text-blue-400 font-bold">{activeStrategy.title}</span>
                                        &nbsp;|&nbsp; Features: <span className="text-emerald-400">{vectorResult?.featureCount || 0}</span> configured
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-4">
                        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 space-y-5 sticky top-24">
                            <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">monitoring</span>Metrics</h3>
                            {[
                                { label: 'Feature Density', val: `${currentDensity}%`, pct: currentDensity, color: 'bg-blue-500' },
                                { label: 'Matrix Sparsity', val: `${currentSparsity}%`, pct: currentSparsity, color: 'bg-emerald-500' },
                                { label: 'Vocab Coverage', val: `${currentVocabCoverage}%`, pct: currentVocabCoverage, color: 'bg-amber-500' },
                            ].map(m => (
                                <div key={m.label} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-slate-400 text-sm">{m.label}</span>
                                        <span className="text-slate-100 text-sm font-bold">{m.val} {loading && <span className="opacity-50">...</span>}</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className={`${m.color} h-full rounded-full transition-all duration-500 ${loading ? 'opacity-30' : ''}`} style={{ width: `${m.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            <div className="border-t border-slate-700 pt-4 flex gap-3">
                                <span className="material-symbols-outlined text-amber-400 shrink-0">lightbulb</span>
                                <p className="text-xs text-slate-400 leading-relaxed"><span className="text-amber-400 font-bold">Pro Tip:</span> Sparse data (like One-Hot/BoW) benefits from efficient representations.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="sticky bottom-0 z-50 px-6 lg:px-10 py-4 bg-[#0a0d1f]/90 backdrop-blur-md border-t border-slate-800">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/feature-extraction')} className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>Back
                    </button>
                    <button onClick={() => navigate('/model-selection')} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl text-sm font-semibold shadow-[0_0_18px_rgba(60,131,246,0.4)] flex items-center gap-2">
                        Proceed to Model Selection<span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Vectorization;