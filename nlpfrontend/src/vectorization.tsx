import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { previewVectorization } from './api/vectorizationApi';
import { previewFeatureExtraction } from './api/featureExtractionApi';
import type { VectorizationResponse, VectorizationType, NgramType } from './api/vectorizationApi';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

// ── Pipeline steps ────────────────────────────────────────────────────────────
const PIPELINE = [
    { label: 'Upload Dataset', icon: 'upload_file', done: true, active: false, path: '/upload' },
    { label: 'Preprocessing', icon: 'settings_suggest', done: true, active: false, path: '/preprocessing' },
    { label: 'Feature Extraction', icon: 'query_stats', done: true, active: false, path: '/feature-extraction' },
    { label: 'Vectorization', icon: 'view_in_ar', done: false, active: true, path: '/vectorization' },
    { label: 'Model Selection', icon: 'model_training', done: false, active: false, path: '/model-selection' },
];

// ── Strategy cards ────────────────────────────────────────────────────────────
const strategies: {
    id: VectorizationType;
    icon: string;
    title: string;
    desc: string;
    gradient: string;
    accentBorder: string;
}[] = [
        {
            id: 'TF_IDF',
            icon: 'analytics',
            title: 'TF-IDF',
            desc: 'Evaluates word importance relative to the corpus using term frequency and inverse document frequency.',
            gradient: 'from-blue-600/20 to-cyan-600/10',
            accentBorder: 'border-blue-500',
        },
        {
            id: 'BAG_OF_WORDS',
            icon: 'format_list_numbered',
            title: 'Bag of Words',
            desc: 'Counts word frequency without considering order — simplest text representation.',
            gradient: 'from-violet-600/20 to-purple-600/10',
            accentBorder: 'border-violet-500',
        },
        {
            id: 'ONE_HOT',
            icon: 'looks_one',
            title: 'One-Hot Encoding',
            desc: 'Binary vector where each position represents a unique word in the vocabulary.',
            gradient: 'from-emerald-600/20 to-teal-600/10',
            accentBorder: 'border-emerald-500',
        },
    ];

// ── Custom tooltip for Recharts ───────────────────────────────────────────────
const ChartTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
            <p className="text-xs text-slate-300 font-bold">{d.name}</p>
            <p className="text-sm text-blue-400 font-mono">{d.value.toFixed(4)}</p>
        </div>
    );
};

// ── Component ─────────────────────────────────────────────────────────────────
const Vectorization = () => {
    const navigate = useNavigate();

    // ── State ─────────────────────────────────────────────────────────────────
    const [inputText, setInputText] = useState<string>(
        () => localStorage.getItem('preprocessedText') ?? ''
    );
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(() =>
        JSON.parse(localStorage.getItem('selectedFeatures') || '[]')
    );
    const [selectedNgramType] = useState<NgramType>(
        () => (localStorage.getItem('ngramType') as NgramType) || 'UNIGRAM'
    );
    const [vectorType, setVectorType] = useState<VectorizationType>('TF_IDF');

    // ── API state ─────────────────────────────────────────────────────────────
    const [vectorResult, setVectorResult] = useState<VectorizationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ── Debounced two-step API call ───────────────────────────────────────────
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            if (!inputText.trim()) return;
            setLoading(true);
            setError(null);
            try {
                // 1. Re-extract features from the current text
                const fe = await previewFeatureExtraction({
                    text: inputText,
                    ngramType: selectedNgramType,
                    maxFeatures: 5000,
                    minDocumentFrequency: 1,
                });
                const fresh = fe.selectedFeatures;
                setSelectedFeatures(fresh);
                localStorage.setItem('selectedFeatures', JSON.stringify(fresh));
                localStorage.setItem('ngramType', fe.ngramType);

                if (fresh.length === 0) {
                    setVectorResult(null);
                    return;
                }

                // 2. Vectorize with fresh features
                const data = await previewVectorization({
                    text: inputText,
                    ngramType: selectedNgramType,
                    vectorizationType: vectorType,
                    selectedFeatures: fresh,
                });
                setVectorResult(data);
                localStorage.setItem('vectorizationType', data.vectorizationType);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Vectorization preview failed.');
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [inputText, vectorType, selectedNgramType]);

    // ── Derived data ──────────────────────────────────────────────────────────
    const activeStrategy = strategies.find((s) => s.id === vectorType)!;

    const featureValuePairs = vectorResult
        ? vectorResult.vector.map((v, i) => ({
            name: selectedFeatures[i] ?? `feat_${i}`,
            value: Number(v),
        }))
        : [];

    // top features sorted descending (meaningful for TF-IDF)
    const topFeatures = [...featureValuePairs]
        .filter((f) => f.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    const density = vectorResult?.featureDensity ?? 0;
    const sparsity = vectorResult?.matrixSparsity ?? 0;
    const vocabCoverage = vectorResult?.vocabCoverage ?? 0;
    const vectorSize = vectorResult?.vector.length ?? 0;
    const vocabSize = selectedFeatures.length;

    // Gradient bar colours for chart
    const BAR_COLORS = [
        '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc',
        '#818cf8', '#60a5fa', '#38bdf8', '#22d3ee', '#2dd4bf',
    ];

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#07091a] text-slate-100 min-h-screen font-sans flex flex-col">
            {/* ────────── Header ────────── */}
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0a0d1f]/90 backdrop-blur-md px-6 lg:px-10 py-3.5">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_18px_rgba(59,130,246,.45)] group-hover:shadow-[0_0_28px_rgba(59,130,246,.65)] transition-all">
                            <span className="material-symbols-outlined text-white text-xl">
                                account_tree
                            </span>
                        </div>
                        <span className="text-base font-bold tracking-tight group-hover:text-blue-400 transition-colors">
                            Interactive NLP Experimentation Platform
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                            </span>
                            <span className="text-[10px] font-bold text-blue-400 tracking-wider">
                                VECTORIZATION ACTIVE
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                            SY
                        </div>
                    </div>
                </div>
            </header>

            {/* ────────── Pipeline breadcrumbs ────────── */}
            <div className="border-b border-slate-800/70 bg-[#0a0d1f] px-6 lg:px-10">
                <div className="max-w-[1440px] mx-auto flex">
                    {PIPELINE.map((step, idx) => (
                        <div key={step.label} className="flex items-center flex-1">
                            <button
                                onClick={() => navigate(step.path)}
                                className={`flex flex-col items-center gap-1 py-4 flex-1 border-b-2 transition-all ${step.active
                                    ? 'border-blue-500'
                                    : step.done
                                        ? 'border-emerald-600'
                                        : 'border-transparent hover:border-slate-700'
                                    }`}
                            >
                                <span
                                    className={`material-symbols-outlined text-xl ${step.active
                                        ? 'text-blue-500'
                                        : step.done
                                            ? 'text-emerald-500'
                                            : 'text-slate-600'
                                        }`}
                                >
                                    {step.done && !step.active ? 'check_circle' : step.icon}
                                </span>
                                <span
                                    className={`text-[10px] font-bold tracking-widest ${step.active
                                        ? 'text-blue-500'
                                        : step.done
                                            ? 'text-emerald-500'
                                            : 'text-slate-600'
                                        }`}
                                >
                                    {step.label.toUpperCase()}
                                </span>
                            </button>
                            {idx < PIPELINE.length - 1 && (
                                <div className="w-6 h-[1px] bg-slate-800 shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ────────── Main Content ────────── */}
            <main className="flex-1 px-6 lg:px-10 py-8 max-w-[1440px] mx-auto w-full">
                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">
                        Vectorization{' '}
                        <span className="text-slate-500 font-medium text-lg">
                            — Transform Text into Feature Vectors
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                        Convert your preprocessed text into numerical vector representations
                        that machine learning models can understand. Choose a strategy, tune
                        parameters, and inspect the generated feature vectors in real time.
                    </p>
                </div>

                {/* ────── 3-column grid ────── */}
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
                    {/* ──── LEFT: Controls + Previews ──── */}
                    <div className="space-y-8">
                        {/* ── Text Input ── */}
                        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">
                                    edit_note
                                </span>
                                <h3 className="text-lg font-semibold">Input Sentences</h3>
                                <span className="ml-auto text-[10px] uppercase tracking-widest text-blue-400 font-bold animate-pulse">
                                    Real-time
                                </span>
                            </div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                rows={4}
                                className="w-full bg-[#020617] border border-slate-800 hover:border-slate-700 focus:border-blue-500/60 rounded-xl px-5 py-4 text-sm text-slate-200 resize-y focus:outline-none transition-colors placeholder:text-slate-600 font-mono leading-relaxed"
                                placeholder={`love this scene too much\nI dont want love again`}
                            />
                        </section>

                        {/* ── Vectorization Method Cards ── */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-blue-500">
                                    view_in_ar
                                </span>
                                <h3 className="text-lg font-semibold">
                                    Vectorization Method
                                </h3>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                {strategies.map((s) => {
                                    const active = vectorType === s.id;
                                    return (
                                        <div
                                            key={s.id}
                                            onClick={() => setVectorType(s.id)}
                                            className={`
                                                group relative p-6 rounded-2xl cursor-pointer
                                                transition-all duration-300 border overflow-hidden
                                                ${active
                                                    ? `${s.accentBorder} bg-gradient-to-br ${s.gradient} ring-1 ring-white/10 shadow-[0_0_30px_rgba(59,130,246,.15)]`
                                                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/70 hover:shadow-lg hover:-translate-y-0.5'
                                                }
                                            `}
                                        >
                                            {/* Glow on active */}
                                            {active && (
                                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                                            )}

                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${active
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined text-2xl">
                                                        {s.icon}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${active
                                                        ? 'border-blue-500 bg-blue-500 scale-110'
                                                        : 'border-slate-600 group-hover:border-slate-500'
                                                        }`}
                                                >
                                                    {active && (
                                                        <span className="material-symbols-outlined text-white text-sm">
                                                            check
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <h4 className="text-white font-bold text-lg mb-1.5 relative z-10">
                                                {s.title}
                                            </h4>
                                            <p className="text-slate-400 text-xs leading-relaxed relative z-10">
                                                {s.desc}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* ── Vector Preview ── */}
                        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="bg-white/[.03] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                                <h3 className="font-bold flex items-center gap-2 text-sm">
                                    <span className="material-symbols-outlined text-blue-500 text-lg">
                                        data_array
                                    </span>
                                    Vector Preview — {activeStrategy.title}
                                </h3>
                                {loading ? (
                                    <svg
                                        className="animate-spin h-4 w-4 text-blue-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        />
                                    </svg>
                                ) : (
                                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                                        ● Live
                                    </span>
                                )}
                            </div>

                            <div className="p-6 space-y-5">
                                {error && (
                                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                        <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">
                                            error
                                        </span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Raw vector */}
                                <div className="bg-[#020617] rounded-xl p-5 font-mono text-sm border border-slate-800 max-h-40 overflow-y-auto">
                                    <div className="flex flex-wrap gap-1.5 items-center text-blue-400">
                                        <span className="text-slate-500 text-lg">[</span>
                                        {loading ? (
                                            <span className="text-slate-600 italic">
                                                computing vector…
                                            </span>
                                        ) : vectorResult &&
                                            vectorResult.vector.length > 0 ? (
                                            vectorResult.vector.map((v, i) => {
                                                const nz = Number(v) > 0;
                                                return (
                                                    <span
                                                        key={i}
                                                        className={
                                                            nz
                                                                ? 'text-white bg-blue-500/25 rounded px-1.5 py-0.5 text-xs'
                                                                : 'text-slate-500 text-xs'
                                                        }
                                                    >
                                                        {Number.isInteger(v)
                                                            ? v
                                                            : v.toFixed(3)}
                                                        {i < vectorResult.vector.length - 1
                                                            ? ','
                                                            : ''}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span className="text-slate-600 italic">
                                                Enter text above to generate vectors
                                            </span>
                                        )}
                                        <span className="text-slate-500 text-lg">]</span>
                                    </div>
                                </div>

                                {/* Feature → Value mapping table */}
                                {!loading &&
                                    featureValuePairs.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                                Feature → Value Mapping
                                            </p>
                                            <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-800 divide-y divide-slate-800/60">
                                                {featureValuePairs.map((f, i) => (
                                                    <div
                                                        key={`${f.name}-${i}`}
                                                        className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[.02] transition-colors"
                                                    >
                                                        <span className="text-sm font-mono text-slate-300">
                                                            {f.name}
                                                        </span>
                                                        <div className="flex items-center gap-3">
                                                            {/* Tiny inline bar */}
                                                            <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                                                                <div
                                                                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                                                    style={{
                                                                        width: `${Math.min(
                                                                            f.value *
                                                                            (vectorType === 'TF_IDF'
                                                                                ? 300
                                                                                : 100),
                                                                            100
                                                                        )}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <span
                                                                className={`text-sm font-mono font-bold tabular-nums ${f.value > 0
                                                                    ? 'text-blue-400'
                                                                    : 'text-slate-600'
                                                                    }`}
                                                            >
                                                                {Number.isInteger(f.value)
                                                                    ? f.value
                                                                    : f.value.toFixed(3)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </section>

                        {/* ── Top TF-IDF Features Chart ── */}
                        {!loading && topFeatures.length > 0 && (
                            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                                <div className="bg-white/[.03] px-6 py-4 border-b border-slate-800">
                                    <h3 className="font-bold flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-blue-500 text-lg">
                                            bar_chart
                                        </span>
                                        Top {activeStrategy.title} Features
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <ResponsiveContainer width="100%" height={topFeatures.length * 38 + 20}>
                                        <BarChart
                                            layout="vertical"
                                            data={topFeatures}
                                            margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
                                        >
                                            <XAxis
                                                type="number"
                                                tick={{ fill: '#475569', fontSize: 10 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                                                axisLine={false}
                                                tickLine={false}
                                                width={90}
                                            />
                                            <Tooltip content={<ChartTooltip />} cursor={false} />
                                            <Bar
                                                dataKey="value"
                                                radius={[0, 6, 6, 0]}
                                                barSize={22}
                                            >
                                                {topFeatures.map((_, idx) => (
                                                    <Cell
                                                        key={idx}
                                                        fill={BAR_COLORS[idx % BAR_COLORS.length]}
                                                        fillOpacity={0.85}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* ──── RIGHT: Metrics + Vocabulary ──── */}
                    <aside className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-6 scrollbar-thin">
                        {/* ── Metrics Panel ── */}
                        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 space-y-5">
                            <h3 className="font-bold flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-blue-500">
                                    monitoring
                                </span>
                                Metrics
                            </h3>

                            {(
                                [
                                    {
                                        label: 'Feature Density',
                                        value: `${density}%`,
                                        pct: density,
                                        color: 'bg-blue-500',
                                        glow: 'shadow-blue-500/30',
                                    },
                                    {
                                        label: 'Matrix Sparsity',
                                        value: `${sparsity}%`,
                                        pct: sparsity,
                                        color: 'bg-emerald-500',
                                        glow: 'shadow-emerald-500/30',
                                    },
                                    {
                                        label: 'Vocab Coverage',
                                        value: `${vocabCoverage}%`,
                                        pct: vocabCoverage,
                                        color: 'bg-amber-500',
                                        glow: 'shadow-amber-500/30',
                                    },
                                ] as const
                            ).map((m) => (
                                <div
                                    key={m.label}
                                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60"
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="text-slate-400 text-xs font-medium">
                                            {m.label}
                                        </span>
                                        <span className="text-slate-100 text-sm font-bold tabular-nums">
                                            {loading ? '…' : m.value}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`${m.color} h-full rounded-full transition-all duration-700 ${loading ? 'opacity-30' : ''
                                                }`}
                                            style={{ width: `${m.pct}%` }}
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Numeric stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-800/50 rounded-xl p-3.5 text-center border border-slate-700/50">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                                        Vector Size
                                    </p>
                                    <p className="text-xl font-bold text-blue-400 tabular-nums">
                                        {loading ? '…' : vectorSize}
                                    </p>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-3.5 text-center border border-slate-700/50">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                                        Vocab Size
                                    </p>
                                    <p className="text-xl font-bold text-emerald-400 tabular-nums">
                                        {loading ? '…' : vocabSize}
                                    </p>
                                </div>
                            </div>

                            {/* Pro Tip */}
                            <div className="border-t border-slate-700 pt-4 flex gap-3">
                                <span className="material-symbols-outlined text-amber-400 shrink-0">
                                    lightbulb
                                </span>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    <span className="text-amber-400 font-bold">Pro Tip:</span>{' '}
                                    {vectorType === 'TF_IDF'
                                        ? 'TF-IDF naturally down-weights common words, making it ideal for text classification tasks.'
                                        : vectorType === 'BAG_OF_WORDS'
                                            ? 'BoW preserves word frequency — repeated words will show counts > 1 in the vector.'
                                            : 'One-Hot produces sparse binary vectors — efficient for small vocabularies.'}
                                </p>
                            </div>
                        </div>

                        {/* ── Vocabulary Panel ── */}
                        {!loading && selectedFeatures.length > 0 && (
                            <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 space-y-4">
                                <h3 className="font-bold flex items-center gap-2 text-sm">
                                    <span className="material-symbols-outlined text-violet-400">
                                        dictionary
                                    </span>
                                    Vocabulary
                                    <span className="ml-auto text-xs text-slate-500 font-mono">
                                        {selectedFeatures.length} words
                                    </span>
                                </h3>
                                <div className="max-h-48 overflow-y-auto">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedFeatures.map((word, i) => {
                                            const val = vectorResult?.vector[i] ?? 0;
                                            const isActive = Number(val) > 0;
                                            return (
                                                <span
                                                    key={`${word}-${i}`}
                                                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${isActive
                                                        ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300'
                                                        : 'bg-slate-800 border border-slate-700 text-slate-500'
                                                        }`}
                                                >
                                                    {word}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </main>

            {/* ────────── Footer Nav ────────── */}
            <footer className="sticky bottom-0 z-50 px-6 lg:px-10 py-4 bg-[#0a0d1f]/90 backdrop-blur-md border-t border-slate-800">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate('/feature-extraction')}
                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 hidden sm:block">
                            Changes are saved automatically
                        </span>
                        <button
                            onClick={() => navigate('/model-selection')}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,.4)] hover:shadow-[0_0_30px_rgba(59,130,246,.55)] flex items-center gap-2"
                        >
                            Proceed to Model Selection
                            <span className="material-symbols-outlined text-lg">
                                arrow_forward
                            </span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Vectorization;
