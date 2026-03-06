import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { previewPreprocessing } from './api/preprocessingApi';
import type { PreprocessingResponse } from './api/preprocessingApi';

type NormMethod = 'STEMMING' | 'LEMMATIZATION' | 'NONE';

const DEFAULT_TEXT = 'I absolutely loved the running scenes in the movie!';

const PIPELINE = [
    { label: 'Upload Dataset', icon: 'upload_file', done: true, active: false, path: '/upload' },
    { label: 'Preprocessing', icon: 'settings_suggest', done: false, active: true, path: '/preprocessing' },
    { label: 'Feature Extraction', icon: 'query_stats', done: false, active: false, path: '/feature-extraction' },
    { label: 'Vectorization', icon: 'view_in_ar', done: false, active: false, path: '/vectorization' },
    { label: 'Model Selection', icon: 'model_training', done: false, active: false, path: '/model-selection' },
];

const Preprocessing = () => {
    const navigate = useNavigate();

    const [inputText, setInputText] = useState<string>(DEFAULT_TEXT);
    const [norm, setNorm] = useState<NormMethod>('STEMMING');
    const [stopwords, setStopwords] = useState(true);
    const [lowercase, setLowercase] = useState(true);
    const [punct, setPunct] = useState(true);
    const [numbers, setNumbers] = useState(false);

    const [previewResult, setPreviewResult] = useState<PreprocessingResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(async () => {
            if (!inputText.trim()) return;
            setLoading(true);
            setError(null);
            try {
                const result = await previewPreprocessing({
                    text: inputText,
                    normalization: norm,
                    removeStopwords: stopwords,
                    lowercase,
                    removePunctuation: punct,
                    removeNumbers: numbers,
                });
                setPreviewResult(result);

                localStorage.setItem('preprocessedText', result.processedText);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Preview failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [inputText, norm, stopwords, lowercase, punct, numbers]);

    const originalTokenCount = previewResult
        ? previewResult.originalText.split(/\s+/).filter(Boolean).length
        : inputText.split(/\s+/).filter(Boolean).length;

    const processedTokenCount = previewResult?.tokens.length ?? 0;

    const reductionPct = originalTokenCount > 0
        ? Math.round((1 - processedTokenCount / originalTokenCount) * 100)
        : 0;

    const normCards = [
        { id: 'STEMMING' as NormMethod, icon: 'content_cut', title: 'Stemming', desc: 'Reduces words to their root by chopping off endings.', example: 'running → run' },
        { id: 'LEMMATIZATION' as NormMethod, icon: 'psychology', title: 'Lemmatization', desc: 'Uses vocabulary analysis to return the base form.', example: 'better → good' },
        { id: 'NONE' as NormMethod, icon: 'block', title: 'No Normalization', desc: 'Keep original word tokens without modification.', example: 'running → running' },
    ];

    const toggles = [
        { label: 'Remove Stopwords', info: "Filters out common words like 'the', 'a', 'is'", value: stopwords, set: setStopwords },
        { label: 'Convert to Lowercase', info: 'Transforms all text to lowercase', value: lowercase, set: setLowercase },
        { label: 'Remove Punctuation', info: 'Removes symbols and punctuation marks', value: punct, set: setPunct },
        { label: 'Remove Numbers', info: 'Deletes numeric digits from text', value: numbers, set: setNumbers },
    ];

    return (
        <div className="bg-[#07091a] text-slate-100 min-h-screen font-sans flex flex-col">
            
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0a0d1f]/90 backdrop-blur-md px-6 lg:px-10 py-3.5">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                        <span className="text-base font-bold tracking-tight group-hover:text-blue-400 transition-colors">NLP Lab</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-10">
                        {[{ label: 'Home', path: '/' }, { label: 'Pipeline', path: '/pipeline-visual' }].map((item) => (
                            <a key={item.label} className="text-slate-400 hover:text-blue-500 text-sm font-medium transition-colors cursor-pointer" onClick={() => navigate(item.path)}>{item.label}</a>
                        ))}
                        <a className="text-slate-400 hover:text-blue-500 text-sm font-medium transition-colors cursor-pointer" onClick={() => navigate('/about')}>About</a>
                    </nav>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold cursor-pointer hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all" onClick={() => navigate('/about')}>SY</div>
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

            
            <main className="flex-1 px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">Step 2: Configure Text Preprocessing</h1>
                    <p className="text-slate-400 text-sm">Apply transformations to clean and standardize your textual data before model training.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    
                    <div className="space-y-8">

                        
                        <section className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">text_fields</span>
                                <h3 className="text-lg font-semibold">Sample Input Text</h3>
                            </div>
                            <textarea
                                id="preprocessing-input"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-900/60 border border-white/10 hover:border-white/20 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 resize-y focus:outline-none transition-colors placeholder:text-slate-600"
                                placeholder="Enter text to preview preprocessing…"
                            />
                        </section>

                        
                        <section className="space-y-5">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">width_normal</span>
                                <h3 className="text-lg font-semibold">Normalization Method</h3>
                                <span className="material-symbols-outlined text-slate-500 text-lg cursor-help ml-auto" title="Standardize word variations">help</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {normCards.map(card => {
                                    const active = norm === card.id;
                                    return (
                                        <div key={card.id} onClick={() => setNorm(card.id)} className={`p-5 rounded-xl cursor-pointer transition-all border ${active ? 'border-blue-500/60 bg-blue-500/10 ring-2 ring-blue-500/40 shadow-[0_0_20px_rgba(60,131,246,0.2)]' : 'border-white/10 bg-white/3 hover:border-blue-500/30 hover:bg-white/5'}`} style={{ background: active ? undefined : 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)' }}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-2 rounded-lg ${active ? 'bg-blue-500/20' : 'bg-slate-800'}`}>
                                                    <span className={`material-symbols-outlined ${active ? 'text-blue-500' : 'text-slate-400'}`}>{card.icon}</span>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full border-2 ${active ? 'border-blue-500 bg-blue-500' : 'border-slate-600'}`}></div>
                                            </div>
                                            <h4 className="font-bold mb-1">{card.title}</h4>
                                            <p className="text-xs text-slate-400 leading-relaxed mb-3">{card.desc}</p>
                                            <div className={`p-2 rounded text-[10px] font-mono italic ${active ? 'bg-blue-500/10 text-blue-400' : 'bg-black/20 text-slate-400'}`}>{card.example}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {toggles.map(t => (
                                <div key={t.label} className="flex items-center justify-between p-4 rounded-xl border border-white/10 transition-all hover:border-white/20" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)' }}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{t.label}</span>
                                        <span className="material-symbols-outlined text-xs text-slate-500 cursor-help" title={t.info}>info</span>
                                    </div>
                                    <button onClick={() => t.set(!t.value)} className={`w-11 h-6 rounded-full relative transition-all duration-300 ${t.value ? 'bg-blue-600 shadow-[0_0_10px_rgba(60,131,246,0.4)]' : 'bg-slate-700'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${t.value ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            ))}
                        </section>
                    </div>

                    
                    <div className="rounded-xl border border-white/10 overflow-hidden flex flex-col sticky top-24" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)' }}>
                        <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500 text-xl">auto_awesome</span>
                                Live Transformation Preview
                            </h3>
                            {loading ? (
                                <svg className="animate-spin h-4 w-4 text-blue-400 shrink-0" xmlns="http:
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            ) : (
                                <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold animate-pulse">Real-time</span>
                            )}
                        </div>

                        <div className="p-6 space-y-5 flex-1">
                            
                            {error && (
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                    <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">error</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Original Text</label>
                                <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 text-sm italic leading-relaxed text-slate-400">
                                    "{previewResult ? previewResult.originalText : inputText}"
                                </div>
                            </div>

                            
                            <div className="flex justify-center">
                                <div className="bg-blue-500/20 p-2 rounded-full border border-blue-500/30">
                                    <span className="material-symbols-outlined text-blue-500">expand_more</span>
                                </div>
                            </div>

                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-blue-500 uppercase tracking-wider">After Preprocessing</label>
                                <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20 text-sm font-mono leading-relaxed text-slate-100 min-h-[80px] transition-all">
                                    {loading ? (
                                        <span className="text-slate-500 italic">Processing…</span>
                                    ) : previewResult ? (
                                        previewResult.processedText || <span className="text-slate-500 italic">All tokens filtered out</span>
                                    ) : (
                                        <span className="text-slate-500 italic">Adjust settings to see preview</span>
                                    )}
                                </div>
                            </div>

                            
                            {previewResult && previewResult.tokens.length > 0 && !loading && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tokens</label>
                                    <div className="flex flex-wrap gap-2">
                                        {previewResult.tokens.map((token, i) => (
                                            <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-blue-300">
                                                {token}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            
                            {previewResult && previewResult.appliedSteps.length > 0 && !loading && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applied Steps</label>
                                    <div className="flex flex-wrap gap-2">
                                        {previewResult.appliedSteps.map((step) => (
                                            <span key={step} className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                                                {step}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Original Tokens</p>
                                    <p className="text-xl font-bold text-slate-200">{originalTokenCount}</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">After Processing</p>
                                    <p className="text-xl font-bold text-blue-400">
                                        {loading ? '…' : processedTokenCount}
                                    </p>
                                </div>
                            </div>

                            
                            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                                <span className="material-symbols-outlined text-blue-400 shrink-0 text-lg">tips_and_updates</span>
                                <div>
                                    <h5 className="text-sm font-bold text-blue-200 mb-1">Preprocessing Impact</h5>
                                    <p className="text-xs text-blue-300/80 leading-relaxed">
                                        Vocabulary reduced by{' '}
                                        <span className="font-bold text-blue-400">
                                            ~{loading ? '…' : `${reductionPct}%`}
                                        </span>
                                        , which accelerates model training and improves accuracy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            
            <footer className="sticky bottom-0 z-50 px-6 lg:px-10 py-4 bg-[#0a0d1f]/90 backdrop-blur-md border-t border-slate-800">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/upload')} className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>Back
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 hidden sm:block">Changes are saved automatically</span>
                        <button onClick={() => navigate('/feature-extraction')} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_18px_rgba(60,131,246,0.4)] flex items-center gap-2">
                            Proceed to Feature Extraction
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Preprocessing;