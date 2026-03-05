import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDataset } from './api/nlpApi';
import type { DatasetUploadResponse } from './api/nlpApi';

type SampleId = 'movie' | 'twitter';

type SampleDataset = {
    id: SampleId;
    icon: string;
    name: string;
    desc: string;
};

const sampleDatasets: SampleDataset[] = [
    { id: 'movie', icon: 'movie', name: 'Movie Reviews', desc: 'Real IMDB sentiment CSV (online source)' },
    { id: 'twitter', icon: 'chat', name: 'SMS Sentiment', desc: 'Real 2-column text+label dataset (online source)' },
];

const SAMPLE_DATASET_URLS: Record<SampleId, { urls: string[]; filename: string }> = {
    movie: {
        urls: [
            'https://raw.githubusercontent.com/clairett/pytorch-sentiment-classification/master/data/SST2/train.tsv',
        ],
        filename: 'movie-sentiment.csv',
    },
    twitter: {
        urls: [
            'https://raw.githubusercontent.com/justmarkham/pycon-2016-tutorial/master/data/sms.tsv',
        ],
        filename: 'sms-sentiment.csv',
    },
};

const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;

const normalizeSampleToTwoColumnCsv = (sampleId: SampleId, raw: string): string => {
    const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
    const rows: string[] = ['sentence,label'];

    if (sampleId === 'movie') {
        for (const line of lines) {
            const tabIndex = line.lastIndexOf('\t');
            if (tabIndex <= 0) {
                continue;
            }
            const sentence = line.slice(0, tabIndex).trim();
            const label = line.slice(tabIndex + 1).trim();
            if (!sentence || !label) {
                continue;
            }
            rows.push(`${escapeCsv(sentence)},${escapeCsv(label)}`);
        }
        return rows.join('\n');
    }

    let startIndex = 0;
    const header = lines[0].toLowerCase();
    if (header.startsWith('id,label,tweet') || header.startsWith('label,sentence') || header.startsWith('sentence,label')) {
        startIndex = 1;
    }
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        const tabIndex = line.indexOf('\t');
        if (tabIndex > 0) {
            const left = line.slice(0, tabIndex).trim();
            const right = line.slice(tabIndex + 1).trim();
            if (!left || !right) {
                continue;
            }
            const knownLabel = /^(0|1|pos|neg|positive|negative|neutral|ham|spam)$/i.test(left);
            const label = knownLabel ? left : right;
            const sentence = knownLabel ? right : left;
            rows.push(`${escapeCsv(sentence)},${escapeCsv(label)}`);
            continue;
        }

        const firstComma = line.indexOf(',');
        if (firstComma < 0) {
            continue;
        }
        const secondComma = line.indexOf(',', firstComma + 1);
        if (secondComma < 0) { // two-column csv
            const left = line.slice(0, firstComma).trim();
            const right = line.slice(firstComma + 1).trim();
            if (!left || !right) {
                continue;
            }
            const knownLabel = /^(0|1|pos|neg|positive|negative|neutral|ham|spam)$/i.test(left);
            const label = knownLabel ? left : right;
            const sentence = knownLabel ? right : left;
            rows.push(`${escapeCsv(sentence.replace(/^"/, '').replace(/"$/, ''))},${escapeCsv(label.replace(/^"/, '').replace(/"$/, ''))}`);
            continue;
        }
        const label = line.slice(firstComma + 1, secondComma).trim();
        const sentence = line.slice(secondComma + 1).trim();
        if (!sentence || !label) {
            continue;
        }
        const cleanSentence = sentence.replace(/^"/, '').replace(/"$/, '');
        rows.push(`${escapeCsv(cleanSentence)},${escapeCsv(label)}`);
    }
    return rows.join('\n');
};

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

    const [dragOver, setDragOver] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [selectedDatasetId, setSelectedDatasetId] = useState<SampleId>('movie');
    const [isCustomUpload, setIsCustomUpload] = useState(false);
    const [datasetInfo, setDatasetInfo] = useState<DatasetUploadResponse | null>(null);
    const [sampleCache, setSampleCache] = useState<Record<SampleId, DatasetUploadResponse | null>>({
        movie: null,
        twitter: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [textCol, setTextCol] = useState('');
    const [labelCol, setLabelCol] = useState('');
    const [shuffle, setShuffle] = useState(true);
    const [trainSplit, setTrainSplit] = useState(70);

    const testSplit = 100 - trainSplit;

    const detectTextColumn = (columns: string[]) =>
        columns.find((col) => /text|review|content|body|tweet|sentence|comment/i.test(col)) ?? columns[0] ?? '';

    const detectLabelColumn = (columns: string[]) =>
        columns.find((col) => /^(label|sentiment|target|class|y)$/i.test(col.trim())) ?? columns[columns.length - 1] ?? '';

    const persistTrainingData = (info: DatasetUploadResponse, selectedTextCol: string, selectedLabelCol: string) => {
        const texts = info.preview
            .map((row) => String(row[selectedTextCol] ?? '').trim())
            .filter(Boolean);
        const labels = info.preview
            .map((row) => String(row[selectedLabelCol] ?? '').trim())
            .filter(Boolean);

        localStorage.setItem('trainingTexts', JSON.stringify(texts));
        localStorage.setItem('trainingLabels', JSON.stringify(labels));
        localStorage.setItem('uploadedDatasetAvailable', isCustomUpload ? 'true' : 'false');
    };

    const applyDatasetInfo = (info: DatasetUploadResponse) => {
        setDatasetInfo(info);
        const detectedText = detectTextColumn(info.columns);
        const detectedLabel = detectLabelColumn(info.columns);
        setTextCol(detectedText);
        setLabelCol(detectedLabel);
        persistTrainingData(info, detectedText, detectedLabel);
    };

    const loadSample = async (sampleId: SampleId) => {
        const cached = sampleCache[sampleId];
        if (cached) {
            setError(null);
            setIsCustomUpload(false);
            setUploadedFile(null);
            setSelectedDatasetId(sampleId);
            applyDatasetInfo(cached);
            return;
        }

        setLoading(true);
        setError(null);
        setIsCustomUpload(false);
        setUploadedFile(null);
        setSelectedDatasetId(sampleId);
        try {
            const source = SAMPLE_DATASET_URLS[sampleId];
            let csvContent = '';
            let lastStatus = 0;

            for (const url of source.urls) {
                const response = await fetch(url);
                lastStatus = response.status;
                if (!response.ok) {
                    continue;
                }
                csvContent = await response.text();
                if (csvContent && csvContent.trim().length > 0) {
                    break;
                }
            }

            if (!csvContent) {
                throw new Error(`Failed to download sample dataset (${lastStatus || 'network error'})`);
            }
            const normalizedCsv = normalizeSampleToTwoColumnCsv(sampleId, csvContent);
            const sampleFile = new File([normalizedCsv], source.filename, { type: 'text/csv' });
            const info = await uploadDataset(sampleFile);
            setSampleCache((prev) => ({ ...prev, [sampleId]: info }));
            applyDatasetInfo(info);
        } catch (err: unknown) {
            setDatasetInfo(null);
            setError(err instanceof Error ? err.message : 'Failed to load sample dataset.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadSample('movie');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (datasetInfo && textCol && labelCol) {
            persistTrainingData(datasetInfo, textCol, labelCol);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [textCol, labelCol]);

    const processFile = async (file: File) => {
        setUploadedFile(file.name);
        setIsCustomUpload(true);
        setError(null);
        setLoading(true);
        try {
            const info = await uploadDataset(file);
            applyDatasetInfo(info);
            localStorage.setItem('uploadedDatasetAvailable', 'true');
        } catch (err: unknown) {
            setDatasetInfo(null);
            localStorage.setItem('uploadedDatasetAvailable', 'false');
            setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            void processFile(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            void processFile(file);
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
                    {pipelineSteps.map((step, idx) => (
                        <div key={step.label} className="flex items-center flex-1">
                            <button className={`flex flex-col items-center gap-1 py-4 flex-1 border-b-2 transition-all ${idx === 0 ? 'border-blue-500' : 'border-transparent hover:border-slate-700'}`}>
                                <span className={`material-symbols-outlined text-xl transition-colors ${idx === 0 ? 'text-blue-500' : 'text-slate-600'}`}>{step.icon}</span>
                                <span className={`text-[10px] font-bold tracking-widest transition-colors ${idx === 0 ? 'text-blue-500' : 'text-slate-600'}`}>{step.label}</span>
                            </button>
                            {idx < 4 && <div className="w-6 h-[1px] bg-slate-800 shrink-0"></div>}
                        </div>
                    ))}
                </div>
            </div>

            <main className="flex-1 px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2 text-white">Step 1: Upload and Configure Dataset</h1>
                    <p className="text-slate-400 text-sm">Upload your CSV or choose a real online sample (Movie/Twitter).</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-8">
                    <div className="space-y-6">
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all duration-300 ${dragOver ? 'border-blue-400 bg-blue-500/10 scale-[1.01]' : uploadedFile ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-slate-700 bg-slate-900/30 hover:border-blue-500/50 hover:bg-blue-500/5'}`}
                        >
                            <input ref={fileInputRef} type="file" accept=".csv,.json" className="hidden" onChange={handleFileChange} />
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${uploadedFile ? 'bg-emerald-500/20' : 'bg-blue-500/10'}`}>
                                <span className={`material-symbols-outlined text-5xl transition-colors ${uploadedFile ? 'text-emerald-400' : 'text-blue-400'}`}>{uploadedFile ? 'check_circle' : 'cloud_upload'}</span>
                            </div>
                            {uploadedFile ? (
                                <div>
                                    <p className="text-emerald-400 font-bold text-lg">{uploadedFile}</p>
                                    <p className="text-slate-500 text-sm mt-1">Click to change file</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-white font-bold text-lg mb-2">Drag and drop your labeled CSV file here or click to browse</p>
                                    <p className="text-slate-500 text-sm">CSV format: text column + label column</p>
                                </div>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="mt-1 px-7 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all">Browse Files</button>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-400 mb-3">Or use online sample dataset</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {sampleDatasets.map((ds) => {
                                    const active = !isCustomUpload && selectedDatasetId === ds.id;
                                    return (
                                        <div key={ds.id} onClick={() => { if (loading || active) { return; } void loadSample(ds.id); }} className={`rounded-xl p-4 border cursor-pointer transition-all duration-200 ${active ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(60,131,246,0.2)]' : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'}`}>
                                            <span className="material-symbols-outlined text-2xl mb-2 block">{ds.icon}</span>
                                            <h4 className="font-bold text-sm text-slate-200 mb-1">{ds.name}</h4>
                                            <p className="text-xs text-slate-500 mb-3">{ds.desc}</p>
                                            <button
                                                disabled={loading || active}
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${active ? 'bg-blue-600 text-white' : 'border border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-400'} ${loading || active ? 'opacity-90 cursor-default' : ''}`}
                                            >
                                                {active ? 'Loaded' : 'Load Dataset'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-500 text-xl">table_view</span>
                                    <h3 className="font-bold text-slate-100">Dataset Preview</h3>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold">
                                    <span className="text-emerald-400">{datasetInfo ? datasetInfo.rowCount.toLocaleString() : '-'} ROWS</span>
                                    <span className="text-blue-400">{datasetInfo ? datasetInfo.columns.length : '-'} COLS</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-800/60 text-slate-500 text-xs uppercase tracking-wider">
                                            {datasetInfo ? datasetInfo.columns.map((col) => (
                                                <th key={col} className="px-5 py-3 text-left">{col}</th>
                                            )) : <th className="px-5 py-3 text-left">Load a dataset to preview</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && <tr><td colSpan={10} className="px-5 py-10 text-center text-slate-500">Loading dataset...</td></tr>}
                                        {!loading && error && <tr><td colSpan={10} className="px-5 py-8 text-center text-red-400">{error}</td></tr>}
                                        {!loading && !error && !datasetInfo && <tr><td colSpan={10} className="px-5 py-10 text-center text-slate-500">No dataset loaded.</td></tr>}
                                        {!loading && !error && datasetInfo && datasetInfo.preview.slice(0, 5).map((row, idx) => (
                                            <tr key={idx} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                                                {datasetInfo.columns.map((col) => (
                                                    <td key={`${idx}-${col}`} className="px-5 py-3.5 text-slate-300 text-sm">{row[col] ?? '-'}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-slate-900/60 border border-slate-700/80 rounded-2xl overflow-hidden sticky top-24 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                            <div className="px-6 py-5 border-b border-slate-700/80 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">tune</span>
                                <h3 className="font-bold text-slate-100">Dataset Configuration</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Text Column</label>
                                    <select value={textCol} onChange={(e) => setTextCol(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200" disabled={!datasetInfo}>
                                        {datasetInfo ? datasetInfo.columns.map((col) => <option key={col} value={col}>{col}</option>) : <option value="">No columns</option>}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Label Column</label>
                                    <select value={labelCol} onChange={(e) => setLabelCol(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200" disabled={!datasetInfo}>
                                        {datasetInfo ? datasetInfo.columns.map((col) => <option key={col} value={col}>{col}</option>) : <option value="">No columns</option>}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Label Distribution</label>
                                    {datasetInfo ? (
                                        (() => {
                                            const entries = Object.entries(datasetInfo.labelDistribution);
                                            const total = entries.reduce((s, [, c]) => s + c, 0);
                                            const colors = ['bg-emerald-500', 'bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-slate-500'];
                                            return (
                                                <>
                                                    <div className="h-4 rounded-full overflow-hidden flex bg-slate-800 gap-0.5">
                                                        {entries.map(([label, count], i) => (
                                                            <div key={label} className={`h-full ${colors[i % colors.length]}`} style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}></div>
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] mt-1.5">
                                                        {entries.map(([label, count]) => (
                                                            <span key={label} className="font-semibold text-slate-300">{label}: {count}</span>
                                                        ))}
                                                    </div>
                                                </>
                                            );
                                        })()
                                    ) : (
                                        <p className="text-[11px] text-slate-500">Load a dataset to see label distribution.</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between py-1">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-200">Shuffle Dataset</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Randomize row order before split</p>
                                    </div>
                                    <button onClick={() => setShuffle(!shuffle)} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${shuffle ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${shuffle ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-semibold text-slate-200">Train / Test Split</p>
                                        <div className="flex items-center gap-1 text-sm"><span className="font-bold text-blue-400">{trainSplit}</span><span className="text-slate-500">/</span><span className="font-bold text-slate-400">{testSplit}</span></div>
                                    </div>
                                    <input type="range" min={50} max={90} step={5} value={trainSplit} onChange={(e) => setTrainSplit(Number(e.target.value))} className="w-full h-2 accent-blue-500 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="sticky bottom-0 z-50 px-6 lg:px-10 py-4 bg-[#0a0d1f]/90 backdrop-blur-md border-t border-slate-800">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-lg">arrow_back</span>Back</button>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 hidden sm:block">Changes are saved automatically</span>
                        <button onClick={() => navigate('/preprocessing')} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_18px_rgba(60,131,246,0.4)] hover:shadow-[0_0_28px_rgba(60,131,246,0.6)] flex items-center gap-2" disabled={!datasetInfo}>Proceed to Preprocessing<span className="material-symbols-outlined text-lg">arrow_forward</span></button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UploadData;

