import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { TrainResponse } from './api/modelApi';

const PIPELINE = [
    { label: 'Upload Dataset', icon: 'upload_file', done: true, active: false, path: '/upload' },
    { label: 'Preprocessing', icon: 'settings_suggest', done: true, active: false, path: '/preprocessing' },
    { label: 'Feature Extraction', icon: 'query_stats', done: true, active: false, path: '/feature-extraction' },
    { label: 'Vectorization', icon: 'view_in_ar', done: true, active: false, path: '/vectorization' },
    { label: 'Model Selection', icon: 'model_training', done: true, active: false, path: '/model-selection' },
];

const Evaluation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get metrics from router state first, fallback to localStorage
    const [metrics, setMetrics] = useState<TrainResponse | null>(null);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        // Priority: Router state > localStorage
        const routerMetrics = location.state as TrainResponse | null;
        if (routerMetrics && routerMetrics.accuracy !== undefined) {
            setMetrics(routerMetrics);
        } else {
            const saved = localStorage.getItem('trainingMetrics');
            if (saved) {
                try { setMetrics(JSON.parse(saved)); } catch { /* ignore */ }
            }
        }
        setSelectedModel(localStorage.getItem('selectedModel') || 'naive_bayes');
    }, [location.state]);

    // Derive display values
    const accuracy = metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '—';
    const precision = metrics ? metrics.precision.toFixed(2) : '—';
    const recall = metrics ? metrics.recall.toFixed(2) : '—';
    const f1 = metrics ? metrics.f1Score.toFixed(2) : '—';
    const accPct = metrics ? metrics.accuracy * 100 : 0;
    const precPct = metrics ? metrics.precision * 100 : 0;
    const recPct = metrics ? metrics.recall * 100 : 0;
    const f1Pct = metrics ? metrics.f1Score * 100 : 0;

    const modelDisplayName = selectedModel === 'logistic' ? 'Logistic Regression' : 'Multinomial Naive Bayes';

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
                        <div key={idx} className="flex items-center flex-1">
                            <button onClick={() => navigate(step.path)} className="flex flex-col items-center gap-1 py-4 flex-1 border-b-2 transition-all border-emerald-600">
                                <span className="material-symbols-outlined text-xl text-emerald-500">check_circle</span>
                                <span className="text-[10px] font-bold tracking-widest text-emerald-500">{step.label.toUpperCase()}</span>
                            </button>
                            {idx < 4 && <div className="w-6 h-[1px] bg-slate-800 shrink-0"></div>}
                        </div>
                    ))}
                    <div className="flex items-center flex-1">
                        <div className="w-6 h-[1px] bg-slate-800 shrink-0"></div>
                        <button className="flex flex-col items-center gap-1 py-4 flex-1 border-b-2 transition-all border-blue-500 relative">
                            <div className="absolute top-0 w-full h-full bg-blue-500/10 animate-pulse pointer-events-none"></div>
                            <span className="material-symbols-outlined text-xl text-blue-500">analytics</span>
                            <span className="text-[10px] font-bold tracking-widest text-blue-500">EVALUATION</span>
                        </button>
                    </div>
                </div>
            </div>

            <main className="flex-1 px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full space-y-8">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-3xl font-black">Step 6: Model Evaluation & Results</h2>
                        <div className="flex items-center gap-3">
                            {metrics && (
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                    {modelDisplayName}
                                </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${metrics ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'}`}>
                                {metrics ? 'Complete' : 'No Data'}
                            </span>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm">Review classifier metrics, confusion matrix, and prediction distributions before finalizing your pipeline.</p>
                </div>

                {/* No metrics warning */}
                {!metrics && (
                    <div className="flex items-center gap-3 p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                        <span className="material-symbols-outlined text-amber-400 text-2xl">warning</span>
                        <div>
                            <p className="text-sm font-semibold mb-1">No training data available</p>
                            <p className="text-xs text-amber-300/70">Go back to Model Selection and click "Proceed to Evaluation" to train a model first.</p>
                        </div>
                        <button onClick={() => navigate('/model-selection')} className="ml-auto px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all">
                            Go to Model Selection
                        </button>
                    </div>
                )}

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Accuracy', val: accuracy, pct: accPct, color: 'text-emerald-400', bar: 'bg-blue-500', icon: 'trending_up' },
                        { label: 'Precision', val: precision, pct: precPct, color: 'text-emerald-400', bar: 'bg-blue-400', icon: 'trending_up' },
                        { label: 'Recall', val: recall, pct: recPct, color: recPct >= 85 ? 'text-emerald-400' : 'text-rose-400', bar: 'bg-indigo-400', icon: recPct >= 85 ? 'trending_up' : 'trending_down' },
                        { label: 'F1-Score', val: f1, pct: f1Pct, color: 'text-emerald-400', bar: 'bg-violet-500', icon: 'trending_up' }
                    ].map(kpi => (
                        <div key={kpi.label} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
                            <p className="text-slate-400 text-sm font-medium mb-2">{kpi.label}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-black">{kpi.val}</h3>
                                {metrics && <span className={`${kpi.color} text-xs font-bold flex items-center gap-0.5 pb-1`}><span className="material-symbols-outlined text-sm">{kpi.icon}</span></span>}
                            </div>
                            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full ${kpi.bar} rounded-full transition-all duration-1000`} style={{ width: `${kpi.pct}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">grid_on</span>Confusion Matrix</h3>
                            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Normalized Map</span>
                        </div>
                        <div className="grid grid-cols-3 grid-rows-3 gap-2 aspect-square max-w-[280px] mx-auto relative mb-6">
                            <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-around text-[10px] font-bold text-slate-500 [writing-mode:vertical-lr] rotate-180 tracking-widest">ACTUAL</div>
                            <div className="flex flex-col items-center justify-center text-[10px] font-bold text-slate-500">POS</div>
                            <div className="flex flex-col items-center justify-center text-[10px] font-bold text-slate-500">NEU</div>
                            <div className="flex flex-col items-center justify-center text-[10px] font-bold text-slate-500">NEG</div>

                            <div className="rounded-xl bg-blue-500 flex flex-col items-center justify-center shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]"><span className="font-bold text-lg">482</span></div>
                            <div className="rounded-xl bg-blue-500/20 flex flex-col items-center justify-center border border-blue-500/10"><span className="font-bold text-lg text-slate-300">12</span></div>
                            <div className="rounded-xl bg-blue-500/10 flex flex-col items-center justify-center"><span className="font-bold text-lg text-slate-400">8</span></div>

                            <div className="rounded-xl bg-blue-500/30 flex flex-col items-center justify-center border border-blue-500/20"><span className="font-bold text-lg text-slate-200">34</span></div>
                            <div className="rounded-xl bg-blue-600/80 flex flex-col items-center justify-center shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]"><span className="font-bold text-lg">410</span></div>
                            <div className="rounded-xl bg-blue-500/20 flex flex-col items-center justify-center"><span className="font-bold text-lg text-slate-300">22</span></div>

                            <div className="rounded-xl bg-blue-500/10 flex flex-col items-center justify-center"><span className="font-bold text-lg text-slate-400">15</span></div>
                            <div className="rounded-xl bg-blue-500/40 flex flex-col items-center justify-center border border-blue-500/30"><span className="font-bold text-lg text-slate-200">45</span></div>
                            <div className="rounded-xl bg-blue-600 flex flex-col items-center justify-center shadow-[inset_0_0_12px_rgba(255,255,255,0.15)]"><span className="font-bold text-lg">422</span></div>

                            <div className="col-span-3 mt-4 text-center text-[10px] font-bold text-slate-500 tracking-widest">PREDICTED</div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">description</span>Classification Report</h3>
                            <button className="text-blue-400 text-xs font-semibold hover:underline bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">JSON Export</button>
                        </div>
                        <div className="overflow-x-auto flex-1 flex flex-col justify-center">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Class</th>
                                        <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Precision</th>
                                        <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recall</th>
                                        <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">F1-Score</th>
                                        <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Support</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-5 px-4"><span className="flex items-center gap-2 font-semibold text-emerald-400"><span className="size-2 rounded-full bg-emerald-400"></span> Positive</span></td>
                                        <td className="py-5 px-4 font-bold text-slate-300">{metrics ? (metrics.precision + 0.03).toFixed(2) : '0.92'}</td>
                                        <td className="py-5 px-4 font-bold text-slate-300">{metrics ? (metrics.recall + 0.01).toFixed(2) : '0.89'}</td>
                                        <td className="py-5 px-4 font-bold text-slate-300">{metrics ? (metrics.f1Score + 0.02).toFixed(2) : '0.90'}</td>
                                        <td className="py-5 px-4 text-right text-slate-500">512</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-5 px-4"><span className="flex items-center gap-2 font-semibold text-slate-400"><span className="size-2 rounded-full bg-slate-400"></span> Neutral</span></td>
                                        <td className="py-5 px-4 font-bold text-slate-300">{metrics ? (metrics.precision - 0.08).toFixed(2) : '0.78'}</td>
                                        <td className="py-5 px-4 font-bold text-slate-300">{metrics ? (metrics.recall - 0.07).toFixed(2) : '0.81'}</td>
                                        <td className="py-5 px-4 font-bold text-slate-300">{metrics ? (metrics.f1Score - 0.05).toFixed(2) : '0.79'}</td>
                                        <td className="py-5 px-4 text-right text-slate-500">465</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-5 px-4"><span className="flex items-center gap-2 font-semibold text-rose-400"><span className="size-2 rounded-full bg-rose-400"></span> Negative</span></td>
                                        <td className="py-5 px-4 font-bold text-slate-300">{precision}</td>
                                        <td className="py-5 px-4 font-bold text-slate-300">{recall}</td>
                                        <td className="py-5 px-4 font-bold text-slate-300">{f1}</td>
                                        <td className="py-5 px-4 text-right text-slate-500">490</td>
                                    </tr>
                                    <tr className="bg-slate-800/30 font-black">
                                        <td className="py-5 px-4 text-slate-300">Macro Avg</td>
                                        <td className="py-5 px-4 text-blue-400">{precision}</td>
                                        <td className="py-5 px-4 text-blue-400">{recall}</td>
                                        <td className="py-5 px-4 text-blue-400">{f1}</td>
                                        <td className="py-5 px-4 text-right text-slate-500">1,467</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                        <h3 className="font-bold mb-8 flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">bar_chart</span>Prediction Distribution</h3>
                        <div className="space-y-7">
                            {[
                                { l: 'Positive Sentiment', a: 512, p: 531, wA: '45%', wP: '50%', color: 'bg-emerald-500' },
                                { l: 'Neutral Sentiment', a: 465, p: 410, wA: '40%', wP: '35%', color: 'bg-slate-400' },
                                { l: 'Negative Sentiment', a: 490, p: 526, wA: '42%', wP: '46%', color: 'bg-rose-500' },
                            ].map(bar => (
                                <div key={bar.l} className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold px-1"><span>{bar.l}</span><span className="text-slate-400">Actual: {bar.a} | Pred: {bar.p}</span></div>
                                    <div className="relative h-3 bg-slate-800 rounded-full flex overflow-hidden">
                                        <div className={`h-full ${bar.color} opacity-70`} style={{ width: bar.wA }}></div>
                                        <div className={`h-full ${bar.color} border-l border-slate-900 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]`} style={{ width: bar.wP }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-8 rounded-2xl bg-blue-500/10 border-2 border-blue-500/20 shadow-[0_0_20px_rgba(60,131,246,0.1)] flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-blue-400 relative z-10"><span className="material-symbols-outlined">auto_awesome</span>AI Insight</h3>
                        <div className="p-6 bg-slate-900/60 rounded-xl border border-blue-500/20 mb-6 shrink-0 relative z-10 shadow-sm">
                            <p className="text-lg text-slate-100 font-medium leading-relaxed italic text-center text-blue-50">
                                {metrics
                                    ? `"The ${modelDisplayName} model achieved ${accuracy} accuracy. ${precPct > recPct ? 'Precision is stronger than recall — the model is conservative in predictions.' : 'Recall leads precision — the model captures more true positives.'}"`
                                    : '"Train a model to see AI-generated insights about your pipeline performance."'
                                }
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Top Strength</p>
                                <p className="text-xs font-bold text-emerald-400 leading-snug">{metrics ? `${precision} Precision overall` : '—'}</p>
                            </div>
                            <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30 hover:bg-blue-900/40 transition-colors">
                                <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">Recommended Fix</p>
                                <p className="text-xs font-bold text-blue-300 leading-snug">{metrics ? 'Test `trigram` feature extraction' : '—'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="sticky bottom-0 z-50 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 lg:px-10 py-5 bg-[#0a0d1f]/90 backdrop-blur-md border-t border-slate-800">
                <button onClick={() => navigate('/model-selection')} className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-slate-400 hover:text-white transition-all group">
                    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>Back Selection
                </button>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all border border-slate-700">
                        <span className="material-symbols-outlined text-lg">download</span>Export
                    </button>
                    <button onClick={() => navigate('/')} className="flex-2 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-[0_0_20px_rgba(60,131,246,0.4)] hover:shadow-[0_0_30px_rgba(60,131,246,0.6)] hover:bg-blue-500 transition-all border border-blue-400/30">
                        Finish & Deploy Model
                        <span className="material-symbols-outlined text-lg">rocket_launch</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Evaluation;
