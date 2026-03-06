import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeText, type AnalyzeResponse } from './api/nlpApi';

const NlpPipelineVisual = () => {
    const navigate = useNavigate();
    const [showTryIt, setShowTryIt] = useState(false);
    const [customText, setCustomText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalyzeResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePredict = async () => {
        if (!customText.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await analyzeText({ text: customText.trim() });
            setResult(res);
        } catch (e: any) {
            setError(e.message || 'Prediction failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#020617] text-slate-100 min-h-screen selection:bg-indigo-500/30" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            <header className="fixed top-0 left-0 w-full h-20 z-50 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50">
                <div className="flex items-center gap-2 text-indigo-500 cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                    <h1 className="text-xl font-extrabold tracking-tighter uppercase italic">NLP Journey</h1>
                </div>
                <nav className="hidden md:flex gap-8 items-center">
                    <a className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors" href="#intro">Intro</a>
                    <a className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors" href="#step1">1. Raw</a>
                    <a className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors" href="#step2">2. Clean</a>
                    <a className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors" href="#step3">3. Pattern</a>
                    <a className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors" href="#step4">4. Math</a>
                    <a className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors" href="#step5">5. Brain</a>
                    <a className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 text-rose-500 transition-colors" href="#step6">Finish</a>
                </nav>
                <button
                    onClick={() => navigate('/upload')}
                    className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-tighter transition-all"
                >
                    Start Lab
                </button>
            </header>

            
            <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
                {['intro', 'step1', 'step2', 'step3', 'step4', 'step5', 'step6'].map((id) => (
                    <a key={id} href={`#${id}`} className="w-2 h-2 rounded-full bg-slate-700 hover:bg-indigo-500 transition-all duration-300" />
                ))}
            </div>

            
            <section id="intro" className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-24 relative overflow-hidden">
                <div className="max-w-4xl text-center space-y-8">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        A Cinematic Experience for Beginners
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
                        How Machines <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-rose-500">Understand Us.</span>
                    </h2>
                    <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Take a vertical dive through the NLP pipeline. Watch as raw human speech is broken, cleaned, and turned into digital intelligence.
                    </p>
                    <div className="pt-10 flex flex-col items-center gap-4">
                        <span className="material-symbols-outlined text-4xl animate-bounce text-slate-600">expand_more</span>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Scroll to Begin</p>
                    </div>
                </div>
            </section>

            
            <section
                id="step1"
                className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-24 relative overflow-hidden border-t border-slate-900"
                style={{ background: 'radial-gradient(circle at 20% 20%, #1e1b4b 0%, transparent 40%)' }}
            >
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-6">
                        <span className="text-indigo-500 font-black text-4xl italic opacity-20">01</span>
                        <h3 className="text-5xl font-black tracking-tight">The Raw Input</h3>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Everything starts with human messiness. Emails, tweets, or books. To us, it's emotion; to a machine, it's just a sequence of characters waiting for meaning.
                        </p>
                        <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl relative">
                            <span className="material-symbols-outlined absolute -top-4 -left-4 bg-indigo-500 text-white p-3 rounded-2xl">chat_bubble</span>
                            <p className="text-2xl font-medium italic text-slate-300">"I absolutely love this scene so much!"</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="bg-[#0f172a] p-10 rounded-[3rem] border border-slate-800/50 shadow-2xl animate-[float_6s_ease-in-out_infinite]">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                            </div>
                            <div className="space-y-3 font-mono text-sm text-slate-500">
                                <div className="flex gap-4"><span className="text-slate-700">01</span> <span>&lt;text&gt;</span></div>
                                <div className="flex gap-4"><span className="text-slate-700">02</span> <span className="text-white">"I absolutely love this scene so much!"</span></div>
                                <div className="flex gap-4"><span className="text-slate-700">03</span> <span>&lt;/text&gt;</span></div>
                            </div>
                        </div>
                        <div className="bg-slate-900/30 border-l-4 border-indigo-500 p-6 rounded-xl">
                            <p className="text-xs uppercase font-bold text-slate-500 mb-1">Takeaway</p>
                            <p className="text-sm text-slate-300">Machines don't see words yet. They see a string of <span className="text-indigo-400 font-bold">38 characters</span> including spaces.</p>
                        </div>
                    </div>
                </div>
            </section>

            
            <section id="step2" className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-24 relative overflow-hidden bg-[#0f172a]">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="lg:order-2 space-y-6">
                        <span className="text-indigo-500 font-black text-4xl italic opacity-20">02</span>
                        <h3 className="text-5xl font-black tracking-tight">Cleaning the Noise</h3>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Computers hate filler. We strip away "stopwords" like 'the', 'is', and 'at' to focus on the words that actually carry the weight of the message.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-5 py-2 bg-slate-800 rounded-full border border-slate-700 text-sm font-bold line-through opacity-40">absolutely</div>
                            <div className="px-5 py-2 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30 text-sm font-black">LOVE</div>
                            <div className="px-5 py-2 bg-slate-800 rounded-full border border-slate-700 text-sm font-bold line-through opacity-40">this</div>
                            <div className="px-5 py-2 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30 text-sm font-black">SCENE</div>
                        </div>
                    </div>
                    <div className="lg:order-1 flex flex-col gap-6">
                        <div className="relative p-10 bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="material-symbols-outlined text-8xl text-indigo-500 mb-6">cleaning_services</span>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[15%]" />
                                </div>
                                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">Stopwords Removed: 148</p>
                            </div>
                        </div>
                        <div className="bg-slate-900/30 border-l-4 border-indigo-500 p-6 rounded-xl">
                            <p className="text-xs uppercase font-bold text-slate-500 mb-1">Efficiency Gain</p>
                            <p className="text-sm text-slate-300">By removing common words, we reduce the data volume by nearly <span className="text-indigo-400 font-bold">40%</span> without losing meaning.</p>
                        </div>
                    </div>
                </div>
            </section>

            
            <section
                id="step3"
                className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-24 relative overflow-hidden"
                style={{ background: 'radial-gradient(circle at 80% 80%, #1e1b4b 0%, transparent 40%)' }}
            >
                <div className="max-w-6xl w-full space-y-16">
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                        <span className="text-indigo-500 font-black text-4xl italic opacity-20">03</span>
                        <h3 className="text-5xl font-black tracking-tight">Finding the Patterns</h3>
                        <p className="text-lg text-slate-400">
                            Context matters. We look at words in pairs (Bigrams) or triples (Trigrams) to capture relationships that single words miss.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-3xl text-center hover:border-indigo-500/50 transition-all">
                            <span className="text-xs font-black text-indigo-400 uppercase mb-4 block">Unigram</span>
                            <p className="text-2xl font-bold">"Love"</p>
                            <p className="text-sm text-slate-500 mt-4">Single word focus.</p>
                        </div>
                        <div className="p-8 bg-indigo-500/10 border-2 border-indigo-500 rounded-3xl text-center scale-105 shadow-xl shadow-indigo-500/10">
                            <span className="text-xs font-black text-white uppercase mb-4 block">Bigram</span>
                            <p className="text-2xl font-bold">"Love Scene"</p>
                            <p className="text-sm text-slate-400 mt-4">Captures the relationship.</p>
                        </div>
                        <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-3xl text-center hover:border-indigo-500/50 transition-all">
                            <span className="text-xs font-black text-indigo-400 uppercase mb-4 block">Trigram</span>
                            <p className="text-2xl font-bold">"Love Scene Much"</p>
                            <p className="text-sm text-slate-500 mt-4">Deep context captured.</p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-black text-indigo-400">12,402</p>
                                <p className="text-[10px] uppercase font-bold text-slate-500">Vocab Size</p>
                            </div>
                            <div className="w-px h-10 bg-slate-800" />
                            <div className="text-center">
                                <p className="text-2xl font-black text-indigo-400">5.2</p>
                                <p className="text-[10px] uppercase font-bold text-slate-500">Avg Length</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
            <section id="step4" className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-24 relative overflow-hidden bg-[#0f172a]">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-6">
                        <span className="text-indigo-500 font-black text-4xl italic opacity-20">04</span>
                        <h3 className="text-5xl font-black tracking-tight">Turning Text into Math</h3>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            This is the magic moment. We translate words into a coordinate system. Each word becomes a unique position in a massive digital universe.
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                            <div className="aspect-square bg-indigo-500/20 rounded border border-indigo-500/30 flex items-center justify-center text-[10px] font-mono">0.23</div>
                            <div className="aspect-square bg-indigo-500/10 rounded border border-indigo-500/20 flex items-center justify-center text-[10px] font-mono">0.08</div>
                            <div className="aspect-square bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-500">0.00</div>
                            <div className="aspect-square bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-500">0.00</div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-10 bg-indigo-500/20 blur-[100px] rounded-full group-hover:bg-indigo-500/30 transition-all" />
                        <div className="relative bg-slate-900/80 border border-slate-700 p-12 rounded-[4rem] flex flex-col items-center">
                            <span className="material-symbols-outlined text-[120px] text-indigo-500 animate-[float_6s_ease-in-out_infinite]">data_array</span>
                            <div className="mt-8 text-center">
                                <p className="text-3xl font-black">512</p>
                                <p className="text-xs uppercase tracking-[0.3em] font-bold text-slate-500">Vector Dimensions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
            <section
                id="step5"
                className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-24 relative overflow-hidden"
                style={{ background: 'radial-gradient(circle at 0% 100%, #312e81 0%, transparent 50%)' }}
            >
                <div className="max-w-5xl w-full space-y-12">
                    <div className="text-center space-y-4">
                        <span className="text-indigo-500 font-black text-4xl italic opacity-20">05</span>
                        <h3 className="text-5xl font-black tracking-tight italic">Teaching the Brain</h3>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            We feed these vectors into an algorithm. It learns that words like "Amazing" and "Love" cluster together near the concept of "Positive".
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
                            <h4 className="text-xs uppercase font-black text-indigo-400 tracking-widest">Feature Weight</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase"><span>Amazing</span><span>88%</span></div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[88%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase"><span>Love</span><span>72%</span></div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[72%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-center gap-4">
                            <button className="w-full py-4 bg-indigo-500 text-white font-black rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                                <span className="material-symbols-outlined">psychology</span>
                                Train Naive Bayes
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="py-3 bg-slate-800 text-slate-400 font-bold rounded-xl text-xs hover:bg-slate-700 transition-colors">Logistic</button>
                                <button className="py-3 bg-slate-800 text-slate-400 font-bold rounded-xl text-xs hover:bg-slate-700 transition-colors">Random Forest</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
            <section id="step6" className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-24 relative overflow-hidden bg-[#020617]">
                <div className="max-w-4xl w-full text-center space-y-12">
                    <div className="space-y-4">
                        <span className="text-rose-500 font-black text-4xl italic opacity-20">06</span>
                        <h3 className="text-6xl font-black tracking-tight">The Moment of Truth</h3>
                        <p className="text-lg text-slate-400">
                            The pipeline is complete. Give it a new sentence and watch it think.
                        </p>
                    </div>
                    <div className="relative p-12 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 border-2 border-indigo-500/30 rounded-[4rem] backdrop-blur-xl overflow-hidden group">
                        <div className="absolute top-4 right-8 flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                            </span>
                            <span className="text-[10px] font-black text-green-500 uppercase">Live Prediction Engine</span>
                        </div>
                        <div className="space-y-8 relative z-10">
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                                <p className="text-3xl font-bold text-white">
                                    "{result ? result.input : 'This movie was amazing'}"
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Sentiment</p>
                                    <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-rose-500">
                                        {result ? result.prediction : 'Positive'}
                                    </p>
                                </div>
                                <div className="w-px h-16 bg-slate-800 hidden md:block" />
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Confidence</p>
                                    <p className="text-5xl font-black text-white">
                                        {result ? `${Math.round(result.confidence * 100)}%` : '92%'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => setShowTryIt(!showTryIt)}
                            className="px-10 py-5 bg-indigo-500 text-white font-black rounded-full shadow-2xl shadow-indigo-500/20 hover:-translate-y-1 transition-all flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined">rocket_launch</span>
                            {showTryIt ? 'Close Panel' : 'Run Custom Test'}
                        </button>
                    </div>

                    
                    {showTryIt && (
                        <div className="w-full text-left space-y-6 animate-[fadeSlideIn_0.4s_ease-out]">
                            <div>
                                <h3 className="text-4xl font-black text-white">Try It Now</h3>
                                <p className="text-slate-400 mt-2">See the pipeline in action with real-time analysis</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 space-y-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Input Text</p>
                                    <textarea
                                        value={customText}
                                        onChange={(e) => setCustomText(e.target.value)}
                                        placeholder="Type or paste your text here... e.g. I absolutely love this product!"
                                        className="w-full h-40 bg-[#0a0f1e] border border-indigo-500/30 rounded-2xl p-5 text-slate-200 placeholder-slate-500 text-sm resize-y focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                    <button
                                        onClick={handlePredict}
                                        disabled={loading || !customText.trim()}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 text-sm"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">bolt</span>
                                                Predict
                                            </>
                                        )}
                                    </button>
                                </div>

                                
                                <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">Output Analysis</p>
                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-red-400 text-sm">
                                            <span className="material-symbols-outlined align-middle mr-2 text-lg">error</span>
                                            {error}
                                        </div>
                                    )}
                                    {!result && !error && (
                                        <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                                            <span className="material-symbols-outlined text-5xl mb-4 opacity-40">manage_search</span>
                                            <p className="text-sm">Results will appear here after prediction</p>
                                        </div>
                                    )}
                                    {result && !error && (
                                        <div className="space-y-6 animate-[fadeSlideIn_0.3s_ease-out]">
                                            <div className="flex items-center gap-6">
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Sentiment</p>
                                                    <p className={`text-3xl font-black ${result.prediction === 'Positive' ? 'text-green-400' : result.prediction === 'Negative' ? 'text-red-400' : 'text-yellow-400'}`}>
                                                        {result.prediction}
                                                    </p>
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Confidence</p>
                                                    <p className="text-3xl font-black text-white">{Math.round(result.confidence * 100)}%</p>
                                                </div>
                                            </div>
                                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${result.prediction === 'Positive' ? 'bg-green-500' : result.prediction === 'Negative' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                                    style={{ width: `${Math.round(result.confidence * 100)}%` }}
                                                />
                                            </div>
                                            {result.keyDrivers && result.keyDrivers.length > 0 && (
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Key Drivers</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.keyDrivers.map((d, i) => (
                                                            <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-500/20">{d}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {result.pipeline && (
                                                <div className="grid grid-cols-2 gap-3 pt-2">
                                                    <div className="bg-slate-900/60 rounded-xl p-3 text-center">
                                                        <p className="text-lg font-black text-indigo-400">{result.pipeline.tokens?.length ?? '—'}</p>
                                                        <p className="text-[9px] uppercase font-bold text-slate-500">Tokens</p>
                                                    </div>
                                                    <div className="bg-slate-900/60 rounded-xl p-3 text-center">
                                                        <p className="text-lg font-black text-indigo-400">{result.pipeline.vectorSize ?? '—'}</p>
                                                        <p className="text-[9px] uppercase font-bold text-slate-500">Vector Size</p>
                                                    </div>
                                                    <div className="bg-slate-900/60 rounded-xl p-3 text-center">
                                                        <p className="text-lg font-black text-indigo-400">{result.pipeline.ngrams?.length ?? '—'}</p>
                                                        <p className="text-[9px] uppercase font-bold text-slate-500">N-grams</p>
                                                    </div>
                                                    <div className="bg-slate-900/60 rounded-xl p-3 text-center">
                                                        <p className="text-lg font-black text-indigo-400">{result.pipeline.modelUsed ?? '—'}</p>
                                                        <p className="text-[9px] uppercase font-bold text-slate-500">Model</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            
            <footer className="py-20 border-t border-slate-900 text-center">
                <div className="max-w-4xl mx-auto px-6 space-y-8">
                    <div className="flex items-center justify-center gap-2 text-indigo-500/50 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <h1 className="text-lg font-extrabold tracking-tighter uppercase italic">NLP Journey</h1>
                    </div>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        You've reached the end of the pipeline. Ready to dive into the code?
                    </p>
                    <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-600">
                        <a className="hover:text-indigo-400 transition-colors" href="https:
                        <a className="hover:text-indigo-400 transition-colors" href="https:

                    </div>
                    <p className="text-[10px] text-slate-700 uppercase font-black">© 2026 NLP Lab - Educational Experience</p>
                </div>
            </footer>

            
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes fadeSlideIn {
                    0% { opacity: 0; transform: translateY(24px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default NlpPipelineVisual;