import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PIPELINE = [
    { label: 'Upload Dataset', icon: 'upload_file', done: true, active: false, path: '/upload' },
    { label: 'Preprocessing', icon: 'settings_suggest', done: true, active: false, path: '/preprocessing' },
    { label: 'Feature Extraction', icon: 'query_stats', done: true, active: false, path: '/feature-extraction' },
    { label: 'Vectorization', icon: 'view_in_ar', done: true, active: false, path: '/vectorization' },
    { label: 'Model Selection', icon: 'model_training', done: false, active: true, path: '/model-selection' },
];

type ModelType = 'naive_bayes' | 'logistic';

const ModelSelection = () => {
    const navigate = useNavigate();
    const [model, setModel] = useState<ModelType>('naive_bayes');
    const [alpha, setAlpha] = useState(1.0);
    const [fitPrior, setFitPrior] = useState(true);

    const metrics = model === 'naive_bayes'
        ? { accuracy: '87%', f1: '0.86', precision: '0.89', recall: '0.84', precPct: 89, recPct: 84, f1Pct: 86 }
        : { accuracy: '91%', f1: '0.90', precision: '0.92', recall: '0.88', precPct: 92, recPct: 88, f1Pct: 90 };

    return (
        <div className="bg-[#07091a] text-slate-100 min-h-screen font-sans flex flex-col">
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0a0d1f]/90 backdrop-blur-md px-6 lg:px-10 py-3.5">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(60,131,246,0.4)] transition-all">
                            <span className="material-symbols-outlined text-white text-xl">account_tree</span>
                        </div>
                        <span className="text-base font-bold tracking-tight group-hover:text-blue-400 transition-colors">NLP Pipeline Builder</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 rounded-full border border-slate-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-medium text-slate-400">Kernel: Python 3.10 Active</span>
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
                    <h1 className="text-3xl font-black mb-2">Step 5: Model Selection</h1>
                    <p className="text-slate-400 text-sm">Choose a classification algorithm and configure its hyperparameters for the text dataset.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { id: 'naive_bayes' as ModelType, icon: 'function', title: 'Naive Bayes', desc: 'Probabilistic classifier based on Bayes\' Theorem. Fast and efficient for text with high-dimensional data.' },
                                { id: 'logistic' as ModelType, icon: 'show_chart', title: 'Logistic Regression', desc: 'Predicts probabilities for binary or multi-class classification with strong linear relationships.' },
                            ].map(m => {
                                const active = model === m.id;
                                return (
                                    <div key={m.id} onClick={() => setModel(m.id)} className={`p-6 rounded-2xl cursor-pointer transition-all border relative overflow-hidden ${active ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(60,131,246,0.2)]' : 'border-slate-700 bg-slate-800/20 hover:bg-slate-800/50 opacity-80 hover:opacity-100'}`}>
                                        {active && <div className="absolute top-4 right-4 text-blue-500"><span className="material-symbols-outlined">check_circle</span></div>}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${active ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-700/50 text-slate-400'}`}>
                                            <span className="material-symbols-outlined text-3xl">{m.icon}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{m.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{m.desc}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Hyperparameters */}
                        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-8 space-y-8">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">tune</span>
                                <h3 className="text-lg font-bold">Hyperparameters: {model === 'naive_bayes' ? 'MultinomialNB' : 'LogisticRegression'}</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-medium text-slate-300">{model === 'naive_bayes' ? 'Alpha (Smoothing)' : 'C (Regularization strength)'}</label>
                                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-xs font-bold">{alpha.toFixed(1)}</span>
                                    </div>
                                    <input className="w-full accent-blue-500 cursor-pointer" max={2} min={0} step={0.1} type="range" value={alpha} onChange={e => setAlpha(Number(e.target.value))} />
                                    <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                                        <span>0.0 (No Smoothing)</span><span>1.0 (Laplace)</span><span>2.0</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 block mb-3">Fit Prior</label>
                                        <div className="flex gap-2">
                                            {['True', 'False'].map(v => (
                                                <button key={v} onClick={() => setFitPrior(v === 'True')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${(v === 'True') === fitPrior ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(60,131,246,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{v}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl flex gap-3">
                                        <span className="material-symbols-outlined text-blue-400 shrink-0 text-lg">tips_and_updates</span>
                                        <p className="text-xs text-blue-300/80 leading-relaxed"><span className="text-blue-300 font-bold">Pro Tip:</span> Alpha ≈ 1.0 is safer for sparse text vectors to avoid zero-probability issues.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right – Projected Metrics */}
                    <aside>
                        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 sticky top-24 space-y-6">
                            <h3 className="font-bold">Projected Performance</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Accuracy', val: metrics.accuracy, color: 'text-blue-400' },
                                    { label: 'F1-Score', val: metrics.f1, color: 'text-purple-400' },
                                    { label: 'Precision', val: metrics.precision, color: 'text-slate-200' },
                                    { label: 'Recall', val: metrics.recall, color: 'text-slate-200' },
                                ].map(m => (
                                    <div key={m.label} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{m.label}</p>
                                        <p className={`text-2xl font-black ${m.color}`}>{m.val}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Precision', pct: metrics.precPct, color: 'bg-blue-500' },
                                    { label: 'Recall', pct: metrics.recPct, color: 'bg-blue-400 opacity-70' },
                                    { label: 'F1-Score', pct: metrics.f1Pct, color: 'bg-purple-500' },
                                ].map(m => (
                                    <div key={m.label}>
                                        <div className="flex justify-between text-xs mb-1"><span>{m.label}</span><span className="text-slate-400">{(m.pct / 100).toFixed(2)}</span></div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${m.color} rounded-full transition-all duration-500`} style={{ width: `${m.pct}%` }}></div></div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-slate-500 italic leading-relaxed border-t border-slate-700 pt-3">Metrics are estimated based on selected vectorization and N-gram configurations. Actual values may vary during cross-validation.</p>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="sticky bottom-0 z-50 px-6 lg:px-10 py-4 bg-[#0a0d1f]/90 backdrop-blur-md border-t border-slate-800">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/vectorization')} className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>Back
                    </button>
                    <div className="flex items-center gap-3">
                        <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-slate-700 hover:bg-slate-800 transition-colors">Save Draft</button>
                        <button onClick={() => navigate('/evaluation')} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl text-sm font-semibold shadow-[0_0_18px_rgba(60,131,246,0.4)] flex items-center gap-2">
                            Proceed to Evaluation<span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ModelSelection;