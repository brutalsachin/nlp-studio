import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { previewFeatureExtraction } from './api/featureExtractionApi';
import type { FeatureExtractionResponse } from './api/featureExtractionApi';

type NgramType = 'UNIGRAM' | 'BIGRAM' | 'TRIGRAM';

const DEFAULT_TEXT = 'just hate movie waste time totally go hate if but';

const PIPELINE = [
    { label: 'Upload Dataset', icon: 'upload_file', done: true, active: false, path: '/upload' },
    { label: 'Preprocessing', icon: 'settings_suggest', done: true, active: false, path: '/preprocessing' },
    { label: 'Feature Extraction', icon: 'query_stats', done: false, active: true, path: '/feature-extraction' },
    { label: 'Vectorization', icon: 'view_in_ar', done: false, active: false, path: '/vectorization' },
    { label: 'Model Selection', icon: 'model_training', done: false, active: false, path: '/model-selection' },
    { label: 'Evaluation', icon: 'analytics', done: false, active: false, path: '/evaluation' },
];

const NGRAM_LABELS: Record<NgramType, { title: string; range: string; desc: string }> = {
    UNIGRAM: { title: 'Unigram', range: 'N=1', desc: 'Single words — simplest and most common approach.' },
    BIGRAM: { title: 'Bigram', range: 'N=2', desc: 'Word pairs — captures short-range context.' },
    TRIGRAM: { title: 'Trigram', range: 'N=3', desc: 'Word triplets — captures longer context.' },
};

const FeatureExtraction = () => {
    const navigate = useNavigate();

    const [text, setText] = useState<string>(

        localStorage.getItem('preprocessedText') ?? DEFAULT_TEXT
    );
    const [ngram, setNgram] = useState<NgramType>('UNIGRAM');
    const [maxFeatures, setMaxFeatures] = useState(5000);
    const [minDf, setMinDf] = useState(1);

    const [result, setResult] = useState<FeatureExtractionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(async () => {
            if (!text.trim()) return;
            setLoading(true);
            setError(null);
            try {
                const data = await previewFeatureExtraction({
                    text,
                    ngramType: ngram,
                    maxFeatures,
                    minDocumentFrequency: minDf,
                });
                setResult(data);

                localStorage.setItem('selectedFeatures', JSON.stringify(data.selectedFeatures));
                localStorage.setItem('ngramType', data.ngramType);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Feature extraction preview failed.');
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [text, ngram, maxFeatures, minDf]);

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
                                <span className={`material-symbols-outlined text-xl ${step.active ? 'text-blue-500' : step.done ? 'text-emerald-500' : 'text-slate-600'}`}>
                                    {step.done && !step.active ? 'check_circle' : step.icon}
                                </span>
                                <span className={`text-[10px] font-bold tracking-widest ${step.active ? 'text-blue-500' : step.done ? 'text-emerald-500' : 'text-slate-600'}`}>
                                    {step.label.toUpperCase()}
                                </span>
                            </button>
                            {idx < 5 && <div className="w-6 h-[1px] bg-slate-800 shrink-0"></div>}
                        </div>
                    ))}
                </div>
            </div>

            
            <main className="flex-1 px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">Step 3: Feature Extraction</h1>
                    <p className="text-slate-400 text-sm">Configure N-gram generation and feature selection parameters to extract meaningful patterns from text.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

                    
                    <div className="space-y-8">

                        
                        <section className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">text_fields</span>
                                <h3 className="text-lg font-semibold">Input Text</h3>
                            </div>
                            <textarea
                                id="feature-extraction-input"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 resize-y focus:outline-none transition-colors placeholder:text-slate-600"
                                placeholder="Enter preprocessed text to extract features from…"
                            />
                        </section>

                        
                        <section className="space-y-5">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">filter_list</span>
                                <h3 className="text-lg font-semibold">N-gram Configuration</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {(['UNIGRAM', 'BIGRAM', 'TRIGRAM'] as NgramType[]).map(n => {
                                    const active = ngram === n;
                                    const meta = NGRAM_LABELS[n];
                                    return (
                                        <div
                                            key={n}
                                            onClick={() => setNgram(n)}
                                            className={`p-5 rounded-xl cursor-pointer transition-all border ${active ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/40 shadow-[0_0_20px_rgba(60,131,246,0.2)]' : 'border-slate-700 bg-slate-800/30 hover:border-blue-500/30'}`}
                                        >
                                            <div className="flex justify-between mb-3">
                                                <span className={`text-xs font-black tracking-widest px-2 py-0.5 rounded-full ${active ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>{meta.range}</span>
                                                <div className={`w-4 h-4 rounded-full border-2 ${active ? 'border-blue-500 bg-blue-500' : 'border-slate-600'}`}></div>
                                            </div>
                                            <h4 className="font-bold mb-1">{meta.title}</h4>
                                            <p className="text-xs text-slate-400 leading-relaxed">{meta.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        
                        <section className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">tune</span>Feature Parameters
                            </h3>
                            <div className="space-y-6">
                                
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-slate-300">Max Features</label>
                                        <span className="text-blue-400 font-bold text-sm">{maxFeatures.toLocaleString()}</span>
                                    </div>
                                    <input
                                        type="range" min={500} max={20000} step={500}
                                        value={maxFeatures}
                                        onChange={e => setMaxFeatures(Number(e.target.value))}
                                        className="w-full accent-blue-500 cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>500</span><span>10,000</span><span>20,000</span></div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-slate-300">Min Document Frequency</label>
                                        <span className="text-blue-400 font-bold text-sm">{minDf}</span>
                                    </div>
                                    <input
                                        type="range" min={1} max={20} step={1}
                                        value={minDf}
                                        onChange={e => setMinDf(Number(e.target.value))}
                                        className="w-full accent-blue-500 cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>1 (all)</span><span>10</span><span>20 (rare)</span></div>
                                </div>
                            </div>
                        </section>
                    </div>

                    
                    <div className="rounded-2xl border border-slate-800 overflow-hidden flex flex-col sticky top-24 bg-slate-900/30">
                        
                        <div className="bg-slate-800/40 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500 text-xl">token</span>
                                Extracted Tokens
                            </h3>
                            {loading ? (
                                <svg className="animate-spin h-4 w-4 text-blue-400 shrink-0" xmlns="http:
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            ) : (
                                <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold animate-pulse">Live</span>
                            )}
                        </div>

                        <div className="p-6 space-y-5 flex-1">

                            
                            {error && (
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                    <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">error</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">N-gram Type</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-xs font-black border border-blue-500/25">
                                    {result ? result.ngramType : ngram}
                                </span>
                            </div>

                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Selected Features</label>
                                {loading ? (
                                    <div className="flex flex-wrap gap-2">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="h-7 rounded-lg bg-slate-800 animate-pulse" style={{ width: `${60 + (i % 3) * 20}px` }} />
                                        ))}
                                    </div>
                                ) : result && result.selectedFeatures.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {result.selectedFeatures.map((feature, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-400 text-xs font-mono font-bold border border-blue-500/20">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                ) : !error ? (
                                    <p className="text-slate-600 text-xs italic">Adjust settings to see extracted features</p>
                                ) : null}
                            </div>

                            
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Vocabulary Size</p>
                                    <p className="text-xl font-bold text-blue-400">
                                        {loading ? '…' : result ? result.vocabularySize.toLocaleString() : '—'}
                                    </p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Filtered Out</p>
                                    <p className="text-xl font-bold text-slate-200">
                                        {loading ? '…' : result ? result.filteredOutCount.toLocaleString() : '—'}
                                    </p>
                                </div>
                            </div>

                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Max Features</p>
                                    <p className="text-xl font-bold text-blue-400">{maxFeatures.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Min Doc Freq</p>
                                    <p className="text-xl font-bold text-slate-200">{minDf}</p>
                                </div>
                            </div>

                            
                            {result && !loading && (
                                <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                                    <span className="material-symbols-outlined text-blue-400 shrink-0 text-lg">tips_and_updates</span>
                                    <div>
                                        <h5 className="text-sm font-bold text-blue-200 mb-1">Feature Coverage</h5>
                                        <p className="text-xs text-blue-300/80 leading-relaxed">
                                            <span className="font-bold text-blue-400">{result.selectedFeatures.length}</span> features selected out of a vocabulary of{' '}
                                            <span className="font-bold text-blue-400">{result.vocabularySize.toLocaleString()}</span>.{' '}
                                            <span className="font-bold text-blue-400">{result.filteredOutCount}</span> terms filtered by min-df.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            
            <footer className="sticky bottom-0 z-50 px-6 lg:px-10 py-4 bg-[#0a0d1f]/90 backdrop-blur-md border-t border-slate-800">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/preprocessing')} className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>Back
                    </button>
                    <button onClick={() => navigate('/vectorization')} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_18px_rgba(60,131,246,0.4)] flex items-center gap-2">
                        Proceed to Vectorization
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default FeatureExtraction;
