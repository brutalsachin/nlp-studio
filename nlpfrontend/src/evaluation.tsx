import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { TrainResponse } from './api/modelApi';

const PIPELINE = [
    { label: 'Upload Dataset', icon: 'upload_file', path: '/upload' },
    { label: 'Preprocessing', icon: 'settings_suggest', path: '/preprocessing' },
    { label: 'Feature Extraction', icon: 'query_stats', path: '/feature-extraction' },
    { label: 'Vectorization', icon: 'view_in_ar', path: '/vectorization' },
    { label: 'Model Selection', icon: 'model_training', path: '/model-selection' },
];

type ClassMetric = {
    className: string;
    precision: number;
    recall: number;
    f1Score: number;
    support: number;
};

const Evaluation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [metrics, setMetrics] = useState<TrainResponse | null>(null);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        const routerMetrics = location.state as TrainResponse | null;
        if (routerMetrics && routerMetrics.accuracy !== undefined) {
            setMetrics(routerMetrics);
        } else {
            const saved = localStorage.getItem('trainingMetrics');
            if (saved) {
                try {
                    setMetrics(JSON.parse(saved));
                } catch {
                    setMetrics(null);
                }
            }
        }
        setSelectedModel(localStorage.getItem('selectedModel') || 'NAIVE_BAYES');
    }, [location.state]);

    const accuracy = metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '-';
    const precision = metrics ? metrics.precision.toFixed(2) : '-';
    const recall = metrics ? metrics.recall.toFixed(2) : '-';
    const f1 = metrics ? metrics.f1Score.toFixed(2) : '-';

    const backendReport: ClassMetric[] = metrics?.classificationReport ?? [];
    const backendMatrix: number[][] = metrics?.confusionMatrix ?? [];
    const backendLabels: string[] = metrics?.labels ?? backendReport.map((row) => row.className);

    const trainingLabels: string[] = (() => {
        try {
            return JSON.parse(localStorage.getItem('trainingLabels') || '[]');
        } catch {
            return [];
        }
    })();

    const supportMap = new Map<string, number>();
    for (const label of trainingLabels) {
        if (!label) {
            continue;
        }
        supportMap.set(label, (supportMap.get(label) ?? 0) + 1);
    }
    const fallbackReport: ClassMetric[] = Array.from(supportMap.entries()).map(([className, support]) => ({
        className,
        precision: metrics?.precision ?? 0,
        recall: metrics?.recall ?? 0,
        f1Score: metrics?.f1Score ?? 0,
        support,
    }));

    const report: ClassMetric[] = backendReport.length > 0 ? backendReport : fallbackReport;
    const labels: string[] = backendLabels.length > 0 ? backendLabels : report.map((row) => row.className);
    const matrix: number[][] = backendMatrix.length > 0
        ? backendMatrix
        : labels.map((label) =>
            labels.map((inner) => {
                if (label !== inner) {
                    return 0;
                }
                return report.find((row) => row.className === label)?.support ?? 0;
            })
        );

    const totalSamples = metrics?.totalSamples ?? report.reduce((sum, row) => sum + (row.support || 0), 0);

    const predictedByLabel = labels.map((_, colIdx) =>
        matrix.reduce((sum, row) => sum + (row[colIdx] ?? 0), 0)
    );

    const modelDisplayName = selectedModel === 'LOGISTIC_REGRESSION' ? 'Logistic Regression' : 'Naive Bayes';

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
                            <button onClick={() => navigate(step.path)} className="flex flex-col items-center gap-1 py-4 flex-1 border-b-2 border-emerald-600">
                                <span className="material-symbols-outlined text-xl text-emerald-500">check_circle</span>
                                <span className="text-[10px] font-bold tracking-widest text-emerald-500">{step.label.toUpperCase()}</span>
                            </button>
                            {idx < 4 && <div className="w-6 h-[1px] bg-slate-800 shrink-0"></div>}
                        </div>
                    ))}
                    <div className="flex items-center flex-1">
                        <div className="w-6 h-[1px] bg-slate-800 shrink-0"></div>
                        <button className="flex flex-col items-center gap-1 py-4 flex-1 border-b-2 border-blue-500">
                            <span className="material-symbols-outlined text-xl text-blue-500">analytics</span>
                            <span className="text-[10px] font-bold tracking-widest text-blue-500">EVALUATION</span>
                        </button>
                    </div>
                </div>
            </div>

            <main className="flex-1 px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black">Step 6: Model Evaluation & Results</h2>
                    {metrics && <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">{modelDisplayName}</span>}
                </div>

                {!metrics && (
                    <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
                        No training metrics found. Train a model first.
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Accuracy', value: accuracy },
                        { label: 'Precision', value: precision },
                        { label: 'Recall', value: recall },
                        { label: 'F1-Score', value: f1 },
                    ].map((item) => (
                        <div key={item.label} className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                            <p className="text-slate-400 text-xs uppercase tracking-widest">{item.label}</p>
                            <p className="text-3xl font-black mt-2">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                        <h3 className="font-bold mb-4">Confusion Matrix</h3>
                        {matrix.length > 0 && labels.length > 0 ? (
                            <div className="overflow-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="p-2 text-left text-slate-500">Actual \ Pred</th>
                                            {labels.map((label) => (
                                                <th key={label} className="p-2 text-left text-slate-400">{label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {labels.map((rowLabel, rowIdx) => (
                                            <tr key={rowLabel} className="border-b border-slate-800/60">
                                                <td className="p-2 font-semibold text-slate-300">{rowLabel}</td>
                                                {labels.map((_, colIdx) => (
                                                    <td key={`${rowLabel}-${colIdx}`} className="p-2 text-slate-200">{matrix[rowIdx]?.[colIdx] ?? 0}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">Confusion matrix not available.</p>
                        )}
                    </div>

                    <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                        <h3 className="font-bold mb-4">Classification Report</h3>
                        {report.length > 0 ? (
                            <div className="overflow-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="p-2 text-left text-slate-500">Class</th>
                                            <th className="p-2 text-left text-slate-500">Precision</th>
                                            <th className="p-2 text-left text-slate-500">Recall</th>
                                            <th className="p-2 text-left text-slate-500">F1</th>
                                            <th className="p-2 text-right text-slate-500">Support</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.map((row) => (
                                            <tr key={row.className} className="border-b border-slate-800/60">
                                                <td className="p-2 text-slate-200">{row.className}</td>
                                                <td className="p-2 text-slate-200">{row.precision.toFixed(2)}</td>
                                                <td className="p-2 text-slate-200">{row.recall.toFixed(2)}</td>
                                                <td className="p-2 text-slate-200">{row.f1Score.toFixed(2)}</td>
                                                <td className="p-2 text-right text-slate-400">{row.support}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-slate-800/40 font-semibold">
                                            <td className="p-2">Macro Avg</td>
                                            <td className="p-2">{precision}</td>
                                            <td className="p-2">{recall}</td>
                                            <td className="p-2">{f1}</td>
                                            <td className="p-2 text-right">{totalSamples}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">Classification report not available.</p>
                        )}
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                    <h3 className="font-bold mb-4">Prediction Distribution</h3>
                    {labels.length > 0 && totalSamples > 0 ? (
                        <div className="space-y-4">
                            {labels.map((label, idx) => {
                                const actual = report.find((r) => r.className === label)?.support ?? 0;
                                const predicted = predictedByLabel[idx] ?? 0;
                                const actualPct = (actual / totalSamples) * 100;
                                const predictedPct = (predicted / totalSamples) * 100;
                                return (
                                    <div key={label}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>{label}</span>
                                            <span className="text-slate-400">Actual: {actual} | Pred: {predicted}</span>
                                        </div>
                                        <div className="h-3 rounded-full bg-slate-800 overflow-hidden flex">
                                            <div className="bg-emerald-500/70" style={{ width: `${actualPct}%` }}></div>
                                            <div className="bg-blue-500" style={{ width: `${predictedPct}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">Distribution data not available.</p>
                    )}
                </div>
            </main>

            <footer className="sticky bottom-0 z-50 flex items-center justify-between px-6 lg:px-10 py-5 bg-[#0a0d1f]/90 backdrop-blur-md border-t border-slate-800">
                <button onClick={() => navigate('/model-selection')} className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-slate-400 hover:text-white transition-all">
                    <span className="material-symbols-outlined">arrow_back</span>Back Selection
                </button>
            </footer>
        </div>
    );
};

export default Evaluation;
