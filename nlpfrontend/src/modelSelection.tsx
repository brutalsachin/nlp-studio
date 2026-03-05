import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trainModel, type ModelType, type TrainResponse } from './api/modelApi';
import { previewVectorization, type NgramType, type VectorizationType } from './api/vectorizationApi';

const PIPELINE = [
    { label: 'Upload Dataset', icon: 'upload_file', done: true, active: false, path: '/upload' },
    { label: 'Preprocessing', icon: 'settings_suggest', done: true, active: false, path: '/preprocessing' },
    { label: 'Feature Extraction', icon: 'query_stats', done: true, active: false, path: '/feature-extraction' },
    { label: 'Vectorization', icon: 'view_in_ar', done: true, active: false, path: '/vectorization' },
    { label: 'Model Selection', icon: 'model_training', done: false, active: true, path: '/model-selection' },
];

const ModelSelection = () => {
    const navigate = useNavigate();
    const [model, setModel] = useState<ModelType>('NAIVE_BAYES');
    const [isTraining, setIsTraining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trainedMetrics, setTrainedMetrics] = useState<TrainResponse | null>(null);

    // Derive display metrics — show real data if trained, otherwise show placeholder estimates
    const metrics = trainedMetrics
        ? {
            accuracy: `${(trainedMetrics.accuracy * 100).toFixed(1)}%`,
            f1: trainedMetrics.f1Score.toFixed(2),
            precision: trainedMetrics.precision.toFixed(2),
            recall: trainedMetrics.recall.toFixed(2),
            precPct: Math.round(trainedMetrics.precision * 100),
            recPct: Math.round(trainedMetrics.recall * 100),
            f1Pct: Math.round(trainedMetrics.f1Score * 100),
        }
        : model === 'NAIVE_BAYES'
            ? { accuracy: '~87%', f1: '~0.86', precision: '~0.89', recall: '~0.84', precPct: 89, recPct: 84, f1Pct: 86 }
            : { accuracy: '~91%', f1: '~0.90', precision: '~0.92', recall: '~0.88', precPct: 92, recPct: 88, f1Pct: 90 };

    const handleModelChange = (newModel: ModelType) => {
        setModel(newModel);
        setTrainedMetrics(null); // Reset trained metrics when switching models
        setError(null);
    };

    const handleTrain = async () => {
        setIsTraining(true);
        setError(null);

        try {
            // 1. Gather pipeline state from localStorage
            const selectedFeatures: string[] = JSON.parse(localStorage.getItem('selectedFeatures') || '[]');
            const ngramType = (localStorage.getItem('ngramType') as NgramType) || 'UNIGRAM';
            const vectorizationType = (localStorage.getItem('vectorizationType') as VectorizationType) || 'TF_IDF';
            const uploadedDatasetAvailable = localStorage.getItem('uploadedDatasetAvailable') === 'true';
            let texts: string[] = JSON.parse(localStorage.getItem('trainingTexts') || '[]');
            let labels: string[] = JSON.parse(localStorage.getItem('trainingLabels') || '[]');

            // 2. Validation and Alignment
            if (selectedFeatures.length === 0) {
                throw new Error('Missing selected features. Please complete Feature Extraction and Vectorization first.');
            }
            if (!uploadedDatasetAvailable) {
                if (texts.length === 0 || labels.length === 0) {
                    throw new Error('Missing training data. Please upload/select dataset again.');
                }
                if (texts.length !== labels.length) {
                    const minLen = Math.min(texts.length, labels.length);
                    console.warn(`Data length mismatch: texts(${texts.length}) vs labels(${labels.length}). Aligning to ${minLen}.`);
                    texts = texts.slice(0, minLen);
                    labels = labels.slice(0, minLen);
                }
                if (new Set(labels).size < 2) {
                    throw new Error('Training requires at least 2 distinct labels. Please upload/select a balanced dataset.');
                }
            }

            // 3. Build feature matrix on frontend for sample datasets.
            // For uploaded CSVs, backend trains directly from the uploaded dataset.
            let features: number[][] = [];
            if (!uploadedDatasetAvailable) {
                features = await Promise.all(
                    texts.map(async (text) => {
                        const vectorized = await previewVectorization({
                            text,
                            ngramType,
                            vectorizationType,
                            selectedFeatures,
                        });
                        return vectorized.vector.map((value) => Number(value) || 0);
                    })
                );
                localStorage.setItem('trainingFeatures', JSON.stringify(features));
            }

            // 4. Debug Logging
            console.log("🚀 Training Payload Shape:", {
                modelType: model,
                rowCount: uploadedDatasetAvailable ? 'backend-uploaded-dataset' : features.length,
                featureVectorSize: features[0]?.length || 0,
                labelCount: uploadedDatasetAvailable ? 'backend-uploaded-dataset' : labels.length,
                useUploadedDataset: uploadedDatasetAvailable,
                ngramType,
                vectorizationType
            });

            // 5. API Call
            const payloadLabels = uploadedDatasetAvailable ? [] : labels;
            const result = await trainModel({
                modelType: model,
                features,
                labels: payloadLabels,
                selectedFeatures,
                ngramType,
                vectorizationType,
                // Additional settings if available
                lowercase: true,
                removeStopwords: true,
                removePunctuation: true
            });

            setTrainedMetrics(result);

            // Store training results for the evaluation page
            localStorage.setItem('trainingMetrics', JSON.stringify(result));
            localStorage.setItem('selectedModel', model);

            // Navigate to evaluation with the metrics
            navigate('/evaluation', { state: result });
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Model training failed. Please try again.';
            setError(msg);
        } finally {
            setIsTraining(false);
        }
    };

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

            <main className="flex-1 px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full space-y-8">
                <div>
                    <h1 className="text-3xl font-black mb-2">Step 5: Model Selection</h1>
                    <p className="text-slate-400 text-sm">Choose a classification algorithm for the text dataset.</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 animate-in">
                        <span className="material-symbols-outlined text-rose-400">error</span>
                        <p className="text-sm flex-1">{error}</p>
                        <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-300 transition-colors">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { id: 'NAIVE_BAYES' as ModelType, icon: 'function', title: 'Naive Bayes', desc: 'Probabilistic classifier based on Bayes\' Theorem. Fast and efficient for text with high-dimensional data.' },
                                { id: 'LOGISTIC_REGRESSION' as ModelType, icon: 'show_chart', title: 'Logistic Regression', desc: 'Predicts probabilities for binary or multi-class classification with strong linear relationships.' },
                            ].map(m => {
                                const active = model === m.id;
                                return (
                                    <div key={m.id} onClick={() => handleModelChange(m.id)} className={`p-6 rounded-2xl cursor-pointer transition-all border relative overflow-hidden ${active ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(60,131,246,0.2)]' : 'border-slate-700 bg-slate-800/20 hover:bg-slate-800/50 opacity-80 hover:opacity-100'} ${isTraining ? 'pointer-events-none opacity-60' : ''}`}>
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

                    </div>

                    {/* Right – Projected Metrics */}
                    <aside>
                        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 sticky top-24 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold">{trainedMetrics ? 'Training Results' : 'Projected Performance'}</h3>
                                {trainedMetrics && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Live</span>
                                )}
                            </div>
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
                            <p className="text-[10px] text-slate-500 italic leading-relaxed border-t border-slate-700 pt-3">
                                {trainedMetrics
                                    ? 'These are real metrics from the trained model. Click "Proceed to Evaluation" to see the detailed report.'
                                    : 'Metrics are estimated. Click "Proceed to Evaluation" to train the model and get actual results.'
                                }
                            </p>
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
                        <button
                            onClick={handleTrain}
                            disabled={isTraining}
                            className={`px-8 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${isTraining
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_18px_rgba(60,131,246,0.4)]'
                                }`}
                        >
                            {isTraining ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Training Model...
                                </>
                            ) : (
                                <>
                                    Proceed to Evaluation
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ModelSelection;
