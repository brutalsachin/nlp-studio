import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDataset } from './api/nlpApi';
import type { DatasetUploadResponse } from './api/nlpApi';

const sampleDatasets = [
    {
        id: 'movie',
        icon: '🎬',
        name: 'Movie Reviews',
        desc: '50k rows, Binary sentiment (Pos/Neg)',
        textCol: 'review_text',
        labelCol: 'sentiment',
        rows: 50000,
        cols: 2,
        distribution: { pos: 51, neu: 0, neg: 49 },
        preview: [
            { text: '"The movie was absolutely fantastic, loved every minute."', label: 'Positive', type: 'pos' },
            { text: '"Waste of time, terrible plot and acting."', label: 'Negative', type: 'neg' },
            { text: '"It was okay, not great but not bad either."', label: 'Neutral', type: 'neu' },
            { text: '"Visuals were stunning, but the story was weak."', label: 'Neutral', type: 'neu' },
            { text: '"Highly recommend! Best film of the year."', label: 'Positive', type: 'pos' },
        ],
    },
    {
        id: 'twitter',
        icon: '🐦',
        name: 'Twitter Sentiment',
        desc: '1.6m rows, Multi-class labels',
        textCol: 'tweet_text',
        labelCol: 'sentiment_label',
        rows: 1600000,
        cols: 3,
        distribution: { pos: 40, neu: 30, neg: 30 },
        preview: [
            { text: '"Just had the best coffee of my life! ☕ #blessed"', label: 'Positive', type: 'pos' },
            { text: '"This traffic is absolutely unbearable, stuck for 2hrs"', label: 'Negative', type: 'neg' },
            { text: '"Heading to the office for another Monday meeting 😐"', label: 'Neutral', type: 'neu' },
            { text: '"New phone just arrived and it\'s amazing! #tech"', label: 'Positive', type: 'pos' },
            { text: '"The weather today is just grey and dull..."', label: 'Negative', type: 'neg' },
        ],
    },
    {
        id: 'product',
        icon: '🏷️',
        name: 'Product Reviews',
        desc: '30k rows, Star ratings (1–5)',
        textCol: 'review_body',
        labelCol: 'star_rating',
        rows: 30000,
        cols: 4,
        distribution: { pos: 55, neu: 25, neg: 20 },
        preview: [
            { text: '"Excellent quality! Exceeded my expectations completely."', label: 'Positive', type: 'pos' },
            { text: '"Broke after 2 weeks, very disappointed with quality."', label: 'Negative', type: 'neg' },
            { text: '"Average product, does what it says on the tin."', label: 'Neutral', type: 'neu' },
            { text: '"Fast delivery, product exactly as described. Happy!"', label: 'Positive', type: 'pos' },
            { text: '"Packaging damaged but the product itself is fine."', label: 'Neutral', type: 'neu' },
        ],
    },
];

const pipelineSteps = [
    { label: 'UPLOAD DATASET', icon: 'upload_file' },
    { label: 'PREPROCESSING', icon: 'settings_suggest' },
    { label: 'FEATURE EXTRACTION', icon: 'query_stats' },
    { label: 'VECTORIZATION', icon: 'view_in_ar' },
    { label: 'MODEL SELECTION', icon: 'model_training' },
];

const UploadData = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Existing UI state ──────────────────────────────────────────────────
    const [dragOver, setDragOver] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [isCustomUpload, setIsCustomUpload] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState(sampleDatasets[0]);
    const [shuffle, setShuffle] = useState(true);
    const [trainSplit, setTrainSplit] = useState(70);
    const [textCol, setTextCol] = useState(sampleDatasets[0].textCol);
    const [labelCol, setLabelCol] = useState(sampleDatasets[0].labelCol);

    // ── API state ──────────────────────────────────────────────────────────
    const [datasetInfo, setDatasetInfo] = useState<DatasetUploadResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testSplit = 100 - trainSplit;

    useEffect(() => {
        if (isCustomUpload) {
            return;
        }
        const texts = selectedDataset.preview.map((row) => row.text);
        const labels = selectedDataset.preview.map((row) => row.label);
        localStorage.setItem('trainingTexts', JSON.stringify(texts));
        localStorage.setItem('trainingLabels', JSON.stringify(labels));
    }, [isCustomUpload, selectedDataset]);

    const handleSelectDataset = (ds: typeof sampleDatasets[0]) => {
        setSelectedDataset(ds);
        setIsCustomUpload(false);
        setUploadedFile(null);
        setDatasetInfo(null);
        setError(null);
        setTextCol(ds.textCol);
        setLabelCol(ds.labelCol);
        // Persist sample rows for training later
        const texts = ds.preview.map(row => row.text);
        const labels = ds.preview.map(row => row.label);
        localStorage.setItem('trainingTexts', JSON.stringify(texts));
        localStorage.setItem('trainingLabels', JSON.stringify(labels));
        localStorage.setItem('uploadedDatasetAvailable', 'false');
    };

    const processFile = async (file: File) => {
        setUploadedFile(file.name);
        setIsCustomUpload(true);
        setDatasetInfo(null);
        setError(null);
        setLoading(true);
        try {
            const result = await uploadDataset(file);
            setDatasetInfo(result);
            if (result.columns.length > 0) {
                const detectedTextColumn = result.columns.find((col) =>
                    /text|review|content|body|tweet|sentence|comment/i.test(col)
                ) ?? result.columns[0];
                const detectedLabelColumn = result.columns.find((col) =>
                    /^(label|sentiment|target|class|y)$/i.test(col.trim())
                ) ?? result.columns[result.columns.length - 1];

                setTextCol(detectedTextColumn);
                setLabelCol(detectedLabelColumn);

                const texts = result.preview
                    .map((row) => String(row[detectedTextColumn] ?? '').trim())
                    .filter(Boolean);
                const labels = result.preview
                    .map((row) => String(row[detectedLabelColumn] ?? '').trim())
                    .filter(Boolean);

                localStorage.setItem('trainingTexts', JSON.stringify(texts));
                localStorage.setItem('trainingLabels', JSON.stringify(labels));
                localStorage.setItem('uploadedDatasetAvailable', 'true');
            }
        } catch (err: unknown) {
            localStorage.setItem('uploadedDatasetAvailable', 'false');
            setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const labelColors: Record<string, string> = {
        pos: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
        neg: 'bg-red-500/15 text-red-400 border border-red-500/20',
        neu: 'bg-slate-500/20 text-slate-400 border border-slate-500/20',
    };

    return (
        <div className="bg-[#07091a] text-slate-100 min-h-screen font-sans flex flex-col">

            {/* ── Header ── */}
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

            {/* ── Pipeline Progress ── */}
            <div className="border-b border-slate-800/70 bg-[#0a0d1f] px-6 lg:px-10">
                <div className="max-w-[1400px] mx-auto flex">
                    {pipelineSteps.map((step, idx) => (
                        <div key={step.label} className="flex items-center flex-1">
                            <button
                                className={`flex flex-col items-center gap-1 py-4 flex-1 border-b-2 transition-all ${idx === 0 ? 'border-blue-500' : 'border-transparent hover:border-slate-700'}`}
                            >
                                <span className={`material-symbols-outlined text-xl transition-colors ${idx === 0 ? 'text-blue-500' : 'text-slate-600'}`}>{step.icon}</span>
                                <span className={`text-[10px] font-bold tracking-widest transition-colors ${idx === 0 ? 'text-blue-500' : 'text-slate-600'}`}>{step.label}</span>
                            </button>
                            {idx < 4 && <div className="w-6 h-[1px] bg-slate-800 shrink-0"></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Main ── */}
            <main className="flex-1 px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2 text-white">Step 1: Upload and Configure Dataset</h1>
                    <p className="text-slate-400 text-sm">Initialize your NLP pipeline by providing a labeled CSV dataset or choosing a curated sample.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-8">

                    {/* ── Left Column ── */}
                    <div className="space-y-6">

                        {/* Drag & Drop */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all duration-300 ${dragOver ? 'border-blue-400 bg-blue-500/10 scale-[1.01]' : uploadedFile && isCustomUpload ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-slate-700 bg-slate-900/30 hover:border-blue-500/50 hover:bg-blue-500/5'}`}
                        >
                            <input ref={fileInputRef} type="file" accept=".csv,.json" className="hidden" onChange={handleFileChange} />

                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${uploadedFile && isCustomUpload ? 'bg-emerald-500/20' : 'bg-blue-500/10'}`}>
                                <span className={`material-symbols-outlined text-5xl transition-colors ${uploadedFile && isCustomUpload ? 'text-emerald-400' : 'text-blue-400'}`}>
                                    {uploadedFile && isCustomUpload ? 'check_circle' : 'cloud_upload'}
                                </span>
                            </div>

                            {uploadedFile && isCustomUpload ? (
                                <div>
                                    <p className="text-emerald-400 font-bold text-lg">{uploadedFile}</p>
                                    <p className="text-slate-500 text-sm mt-1">Click to change file</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-white font-bold text-lg mb-2">Drag and drop your labeled CSV file here or click to browse</p>
                                    <p className="text-slate-500 text-sm">
                                        CSV format required:&nbsp;
                                        <code className="text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded text-xs">text_column</code>
                                        &nbsp;+&nbsp;
                                        <code className="text-violet-400 bg-violet-400/10 px-1.5 py-0.5 rounded text-xs">label_column</code>
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                className="mt-1 px-7 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_18px_rgba(60,131,246,0.35)] hover:shadow-[0_0_28px_rgba(60,131,246,0.55)]"
                            >
                                Browse Files
                            </button>
                        </div>

                        {/* Sample Datasets */}
                        <div>
                            <p className="text-sm font-semibold text-slate-400 mb-3">Or use sample dataset</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {sampleDatasets.map((ds) => {
                                    const active = !isCustomUpload && selectedDataset.id === ds.id;
                                    return (
                                        <div
                                            key={ds.id}
                                            onClick={() => handleSelectDataset(ds)}
                                            className={`rounded-xl p-4 border cursor-pointer transition-all duration-200 ${active ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(60,131,246,0.2)]' : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'}`}
                                        >
                                            <div className="text-2xl mb-2">{ds.icon}</div>
                                            <h4 className="font-bold text-sm text-slate-200 mb-1">{ds.name}</h4>
                                            <p className="text-xs text-slate-500 mb-3">{ds.desc}</p>
                                            <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${active ? 'bg-blue-600 text-white' : 'border border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-400'}`}>
                                                {active ? '✓ Using Dataset' : 'Use Dataset'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Dataset Preview */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-500 text-xl">table_view</span>
                                    <h3 className="font-bold text-slate-100">Dataset Preview</h3>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold">
                                    <span className="text-emerald-400">
                                        {isCustomUpload && datasetInfo
                                            ? datasetInfo.rowCount.toLocaleString()
                                            : isCustomUpload ? '—'
                                                : selectedDataset.rows.toLocaleString()} ROWS
                                    </span>
                                    <span className="text-blue-400">
                                        {isCustomUpload && datasetInfo
                                            ? datasetInfo.columns.length
                                            : isCustomUpload ? '—'
                                                : selectedDataset.cols} COLS
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-800/60 text-slate-500 text-xs uppercase tracking-wider">
                                            {/* Dynamic column headers when we have API data, otherwise hardcoded */}
                                            {isCustomUpload && datasetInfo ? (
                                                datasetInfo.columns.map((col) => (
                                                    <th key={col} className="px-5 py-3 text-left">{col}</th>
                                                ))
                                            ) : (
                                                <>
                                                    <th className="px-5 py-3 text-left w-10">#</th>
                                                    <th className="px-5 py-3 text-left">Text Content</th>
                                                    <th className="px-5 py-3 text-left w-28">Label</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Loading state */}
                                        {loading && (
                                            <tr>
                                                <td colSpan={10} className="px-5 py-10 text-center text-slate-500">
                                                    <svg className="animate-spin h-7 w-7 text-blue-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                    </svg>
                                                    Uploading and parsing dataset…
                                                </td>
                                            </tr>
                                        )}
                                        {/* Error state */}
                                        {!loading && error && (
                                            <tr>
                                                <td colSpan={10} className="px-5 py-8 text-center">
                                                    <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                                        <span className="material-symbols-outlined text-base">error</span>
                                                        {error}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {/* Custom upload idle (no result yet) */}
                                        {!loading && !error && isCustomUpload && !datasetInfo && (
                                            <tr>
                                                <td colSpan={3} className="px-5 py-10 text-center text-slate-500">
                                                    <span className="material-symbols-outlined block text-4xl mb-2 mx-auto">upload_file</span>
                                                    Upload a CSV file to preview data
                                                </td>
                                            </tr>
                                        )}
                                        {/* API result rows */}
                                        {!loading && !error && isCustomUpload && datasetInfo && (
                                            datasetInfo.preview.slice(0, 5).map((row, idx) => (
                                                <tr key={idx} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                                                    {datasetInfo.columns.map((col) => (
                                                        <td key={col} className="px-5 py-3.5 text-slate-300 text-sm">{row[col] ?? '—'}</td>
                                                    ))}
                                                </tr>
                                            ))
                                        )}
                                        {/* Sample dataset hardcoded rows */}
                                        {!loading && !isCustomUpload && (
                                            selectedDataset.preview.map((row, idx) => (
                                                <tr key={idx} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-5 py-3.5 text-slate-600 font-mono text-xs">{idx + 1}</td>
                                                    <td className="px-5 py-3.5 text-slate-300 italic">{row.text}</td>
                                                    <td className="px-5 py-3.5">
                                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${labelColors[row.type]}`}>{row.label}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column: Configuration ── */}
                    <div>
                        <div className="bg-slate-900/60 border border-slate-700/80 rounded-2xl overflow-hidden sticky top-24 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                            <div className="px-6 py-5 border-b border-slate-700/80 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">tune</span>
                                <h3 className="font-bold text-slate-100">Dataset Configuration</h3>
                            </div>
                            <div className="p-6 space-y-6">

                                {/* Text Column */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Text Column</label>
                                    <div className="relative">
                                        <select
                                            value={textCol}
                                            onChange={(e) => setTextCol(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-200 appearance-none cursor-pointer focus:outline-none focus:border-blue-500 transition-colors"
                                        >
                                            {isCustomUpload && datasetInfo ? (
                                                datasetInfo.columns.map((col) => (
                                                    <option key={col} value={col}>{col}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value={selectedDataset.textCol}>{selectedDataset.textCol}</option>
                                                    <option value="text">text</option>
                                                    <option value="content">content</option>
                                                    <option value="body">body</option>
                                                </>
                                            )}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                                    </div>
                                </div>

                                {/* Label Column */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Label Column</label>
                                    <div className="relative">
                                        <select
                                            value={labelCol}
                                            onChange={(e) => setLabelCol(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-200 appearance-none cursor-pointer focus:outline-none focus:border-blue-500 transition-colors"
                                        >
                                            {isCustomUpload && datasetInfo ? (
                                                datasetInfo.columns.map((col) => (
                                                    <option key={col} value={col}>{col}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value={selectedDataset.labelCol}>{selectedDataset.labelCol}</option>
                                                    <option value="label">label</option>
                                                    <option value="category">category</option>
                                                    <option value="class">class</option>
                                                </>
                                            )}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                                    </div>
                                </div>

                                {/* Label Distribution */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Label Distribution</label>
                                    {isCustomUpload && datasetInfo ? (
                                        (() => {
                                            const dist = datasetInfo.labelDistribution;
                                            const total = Object.values(dist).reduce((a, b) => a + b, 0);
                                            const barColors = [
                                                'bg-emerald-500', 'bg-red-500', 'bg-blue-500',
                                                'bg-yellow-500', 'bg-purple-500', 'bg-slate-500',
                                            ];
                                            const entries = Object.entries(dist);
                                            return (
                                                <>
                                                    <div className="h-4 rounded-full overflow-hidden flex bg-slate-800 gap-0.5">
                                                        {entries.map(([label, count], i) => (
                                                            <div
                                                                key={label}
                                                                className={`h-full transition-all duration-500 ${barColors[i % barColors.length]} ${i === 0 ? 'rounded-l-full' : ''} ${i === entries.length - 1 ? 'rounded-r-full' : ''}`}
                                                                style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] mt-1.5">
                                                        {entries.map(([label, count], i) => (
                                                            <span key={label} className={`font-semibold ${['text-emerald-400', 'text-red-400', 'text-blue-400', 'text-yellow-400', 'text-purple-400', 'text-slate-400'][i % 6]}`}>
                                                                {label.toUpperCase()}: {total > 0 ? Math.round((count / total) * 100) : 0}% ({count})
                                                            </span>
                                                        ))}
                                                    </div>
                                                </>
                                            );
                                        })()
                                    ) : (
                                        <>
                                            <div className="h-4 rounded-full overflow-hidden flex bg-slate-800 gap-0.5">
                                                <div className="h-full bg-emerald-500 transition-all duration-500 rounded-l-full" style={{ width: `${selectedDataset.distribution.pos}%` }}></div>
                                                {selectedDataset.distribution.neu > 0 && (
                                                    <div className="h-full bg-slate-500 transition-all duration-500" style={{ width: `${selectedDataset.distribution.neu}%` }}></div>
                                                )}
                                                <div className="h-full bg-red-500 transition-all duration-500 rounded-r-full" style={{ width: `${selectedDataset.distribution.neg}%` }}></div>
                                            </div>
                                            <div className="flex justify-between text-[11px] mt-1.5">
                                                <span className="text-emerald-400 font-semibold">POS: {selectedDataset.distribution.pos}%</span>
                                                {selectedDataset.distribution.neu > 0 && <span className="text-slate-400">NEU: {selectedDataset.distribution.neu}%</span>}
                                                <span className="text-red-400 font-semibold">NEG: {selectedDataset.distribution.neg}%</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Shuffle Toggle */}
                                <div className="flex items-center justify-between py-1">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-200">Shuffle Dataset</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Randomize row order before split</p>
                                    </div>
                                    <button
                                        onClick={() => setShuffle(!shuffle)}
                                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${shuffle ? 'bg-blue-600 shadow-[0_0_12px_rgba(60,131,246,0.5)]' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${shuffle ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                {/* Train / Test Split */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-semibold text-slate-200">Train / Test Split</p>
                                        <div className="flex items-center gap-1 text-sm">
                                            <span className="font-bold text-blue-400">{trainSplit}</span>
                                            <span className="text-slate-500">/</span>
                                            <span className="font-bold text-slate-400">{testSplit}</span>
                                        </div>
                                    </div>

                                    {/* Slider */}
                                    <input
                                        type="range"
                                        min={50} max={90} step={5}
                                        value={trainSplit}
                                        onChange={(e) => setTrainSplit(Number(e.target.value))}
                                        className="w-full h-2 accent-blue-500 cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                                        <span>50/50</span><span>70/30</span><span>90/10</span>
                                    </div>

                                    {/* Visual split bar */}
                                    <div className="flex h-2.5 rounded-full overflow-hidden mt-3 bg-slate-800">
                                        <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-l-full transition-all duration-300" style={{ width: `${trainSplit}%` }}></div>
                                        <div className="h-full bg-slate-600 rounded-r-full transition-all duration-300" style={{ width: `${testSplit}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold mt-1">
                                        <span className="text-blue-400">TRAIN {trainSplit}%</span>
                                        <span className="text-slate-500">TEST {testSplit}%</span>
                                    </div>
                                </div>

                                {/* Pro Tip */}
                                <div className="bg-blue-950/40 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                                    <span className="material-symbols-outlined text-blue-400 shrink-0 text-lg mt-0.5">tips_and_updates</span>
                                    <p className="text-[11px] text-blue-300/80 leading-relaxed">
                                        <span className="font-bold text-blue-300">Pro Tip:</span> Ensuring a balanced label distribution helps prevent model bias towards majority classes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Footer Nav ── */}
            <footer className="sticky bottom-0 z-50 px-6 lg:px-10 py-4 bg-[#0a0d1f]/90 backdrop-blur-md border-t border-slate-800">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 hidden sm:block">Changes are saved automatically</span>
                        <button onClick={() => navigate('/preprocessing')} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_18px_rgba(60,131,246,0.4)] hover:shadow-[0_0_28px_rgba(60,131,246,0.6)] flex items-center gap-2">
                            Proceed to Preprocessing
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UploadData;
