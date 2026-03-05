import { useNavigate } from 'react-router-dom';
import sachinImage from "./assets/sachin_image.jpeg";
const AboutMe = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#0a0c10] text-slate-300 min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Dot pattern background */}
            <div
                className="fixed inset-0 z-[-1] opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#3c83f6 0.5px, transparent 0.5px)',
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/10 bg-[#0a0c10]/80 backdrop-blur-md px-6 md:px-20 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 text-blue-500 cursor-pointer group" onClick={() => navigate('/')}>
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                        <h2 className="text-slate-100 text-xl font-bold tracking-tight ml-2 font-display group-hover:text-blue-400 transition-colors">NLP Lab</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-10">
                        {[{ label: 'Home', path: '/' }, { label: 'Pipeline', path: '/pipeline-visual' }].map((item) => (
                            <a key={item.label} className="text-slate-400 hover:text-blue-500 text-sm font-medium transition-colors cursor-pointer" onClick={() => navigate(item.path)}>{item.label}</a>
                        ))}
                        <a className="text-slate-400 hover:text-blue-500 text-sm font-medium transition-colors cursor-pointer" onClick={() => navigate('/about')}>About</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/upload')} className="flex items-center justify-center rounded-lg h-10 px-6 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-600/90 transition-all">
                            Launch Experiment
                        </button>
                        <div className="bg-slate-800 rounded-full w-10 h-10 flex items-center justify-center border border-slate-700 cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => navigate('/about')}>
                            <span className="material-symbols-outlined text-slate-400">person</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="min-h-screen p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
                {/* ── Top Bar ── */}
                <div className="flex items-center justify-between mb-8 rounded-xl px-6 py-3 border-l-4 border-l-[#3c83f6]"
                    style={{
                        background: 'rgba(22, 27, 34, 0.7)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderLeft: '4px solid #3c83f6',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="h-4 w-[1px] bg-slate-700 mx-2" />
                        <div className="flex items-center gap-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.05em' }}>
                            <span className="text-[#3c83f6] font-bold">SYSTEM_USER:</span>
                            <span className="text-slate-400">SACHIN_YADAV // KANPUR_NODE_IN</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-6 uppercase tracking-widest text-slate-500" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>
                        <span>Uptime: 99.9%</span>
                        <span>Status: <span className="text-green-500">Online</span></span>
                        <span className="text-slate-200">2024.V2.PRO</span>
                    </div>
                </div>

                {/* ── Grid Layout ── */}
                <div className="grid grid-cols-12 gap-6">
                    {/* ── LEFT COLUMN ── */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        {/* Profile Card */}
                        <GlassWidget className="rounded-2xl overflow-hidden p-6 relative">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 rounded-full border-2 border-[#3c83f6]/50 p-1 relative z-10 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={sachinImage}
                                            alt="Sachin Yadav"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                                </div>

                                <h1 className="text-2xl font-black text-white mb-1 tracking-tight">
                                    SACHIN YADAV
                                </h1>

                                <p
                                    className="text-[#3c83f6] text-xs font-bold uppercase tracking-[0.2em] mb-6"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    AI & NLP ARCHITECT
                                </p>

                                <div className="flex flex-col w-full gap-2 text-left bg-black/40 p-4 rounded-xl border border-white/5 text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 uppercase">Location:</span>
                                        <span className="text-slate-300">Kanpur, India</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 uppercase">Email:</span>
                                        <span className="text-slate-300">2k23.csai2310567@gmail.com</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 uppercase">Access:</span>
                                        <span className="text-green-500">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </GlassWidget>

                        {/* Contact Form */}
                        <GlassWidget className="rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-[#3c83f6] text-sm">terminal</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Comm_Link</h3>
                            </div>
                            <form className="space-y-3" onSubmit={e => e.preventDefault()}>
                                <input className="w-full bg-black/50 border border-slate-800 rounded-lg p-3 text-xs focus:ring-1 focus:ring-[#3c83f6] outline-none transition-all placeholder:text-slate-600 text-slate-200" placeholder="NAME_INPUT" type="text" />
                                <input className="w-full bg-black/50 border border-slate-800 rounded-lg p-3 text-xs focus:ring-1 focus:ring-[#3c83f6] outline-none transition-all placeholder:text-slate-600 text-slate-200" placeholder="EMAIL_ADDRESS" type="email" />
                                <textarea className="w-full bg-black/50 border border-slate-800 rounded-lg p-3 text-xs focus:ring-1 focus:ring-[#3c83f6] outline-none transition-all resize-none placeholder:text-slate-600 text-slate-200" placeholder="MESSAGE_PAYLOAD" rows={3} />
                                <button className="w-full py-3 bg-[#3c83f6]/20 border border-[#3c83f6]/50 text-[#3c83f6] rounded-lg text-[10px] font-bold hover:bg-[#3c83f6] hover:text-white transition-all uppercase flex items-center justify-center gap-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    Transmit Data
                                    <span className="material-symbols-outlined text-xs">send</span>
                                </button>
                            </form>
                        </GlassWidget>
                    </div>

                    {/* ── CENTER COLUMN ── */}
                    <div className="col-span-12 lg:col-span-6 space-y-6">
                        <GlassWidget className="rounded-3xl p-8 h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>memory</span>
                            </div>
                            <div className="flex items-end justify-between mb-10 border-b border-white/5 pb-4">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Technical_Stack</h2>
                                    <p className="text-slate-500 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>System Expertise &amp; Core Competencies</p>
                                </div>
                                <div className="text-right text-[10px] text-[#3c83f6]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    ANALYSIS_COMPLETE [OK]
                                </div>
                            </div>

                            {/* Skill Bars */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {[
                                    { name: 'Java', pct: 70 },
                                    { name: 'Natural Language Processing', pct: 60 },
                                    { name: 'Spring boot ', pct: 55 },
                                    { name: 'Agentic AI', pct: 30 },
                                    { name: 'SQL', pct: 40 },
                                    { name: 'Python', pct: 50 },
                                ].map(skill => (
                                    <div key={skill.name} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">{skill.name}</span>
                                            <span className="text-xs text-[#3c83f6]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{skill.pct}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#3c83f6] rounded-full transition-all duration-1000"
                                                style={{ width: `${skill.pct}%`, boxShadow: '0 0 10px rgba(60, 131, 246, 0.5)' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tech Ecosystem */}
                            <div className="mt-12">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 border-l-2 border-[#3c83f6] pl-3">Ecosystem_Matrix</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Python', 'Spring boot', 'Java', 'LangChain', 'OpenAI API', 'Docker', 'SQL'].map(tech => (
                                        <div key={tech} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs flex items-center gap-2 hover:bg-[#3c83f6]/10 hover:border-[#3c83f6]/50 transition-all cursor-default group" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#3c83f6] group-hover:animate-ping" /> {tech}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3c83f6]/50 to-transparent" />
                        </GlassWidget>
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        {/* Brief */}
                        <GlassWidget className="rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute -right-2 -top-2 text-[#3c83f6]/5 select-none font-black text-6xl">01</div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-[#3c83f6] text-sm">psychology</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Brief_Core</h3>
                            </div>
                            <p className="text-[13px] leading-relaxed text-slate-400 italic" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                "Specializing in LLM fine-tuning and sentiment analysis frameworks. Engineering high-performance machine learning models with human-centric software interface."
                            </p>
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <button onClick={() => navigate('/')} className="text-[10px] text-[#3c83f6] uppercase font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    Back to Dashboard <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                </button>
                            </div>
                        </GlassWidget>

                        {/* External Links */}
                        <GlassWidget className="rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute -right-2 -top-2 text-[#3c83f6]/5 select-none font-black text-6xl">02</div>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-[#3c83f6] text-sm">hub</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">External_Nodes</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { icon: 'public', label: 'Portfolio', url: 'https://yadavsachin.vercel.app/' },
                                    { icon: 'share', label: 'LinkedIn', url: 'https://www.linkedin.com/in/sachin-yadav-007814270/' },
                                    { icon: 'terminal', label: 'GitHub', url: 'https://github.com/brutalsachin/nlp-studio' },
                                ].map(link => (
                                    <a key={link.label} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5 hover:border-[#3c83f6]/50 hover:bg-[#3c83f6]/5 transition-all group" href={link.url} target="_blank" rel="noopener noreferrer">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#3c83f6] text-lg">{link.icon}</span>
                                            <span className="text-xs uppercase tracking-tighter" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{link.label}</span>
                                        </div>
                                        <span className="material-symbols-outlined text-xs text-slate-600 group-hover:text-[#3c83f6] transition-colors">call_made</span>
                                    </a>
                                ))}
                            </div>
                        </GlassWidget>
                    </div>
                </div>

                {/* ── Footer ── */}
                <footer className="mt-12 mb-4 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4"
                    style={{
                        background: 'rgba(22, 27, 34, 0.7)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase italic" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <span className="material-symbols-outlined text-xs">copyright</span> 2024 SACHIN_YADAV.CORE // ALL_RIGHTS_RESERVED
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-[#3c83f6] px-6 py-2 rounded-lg text-white text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_15px_rgba(60,131,246,0.6)] transition-all">
                            Download_CV.exe
                        </button>
                        <div className="flex items-center gap-3 px-4 border-l border-white/10">
                            <a className="text-slate-500 hover:text-[#3c83f6] transition-colors" href="https://yadavsachin.vercel.app/" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-lg">public</span></a>
                            <a className="text-slate-500 hover:text-[#3c83f6] transition-colors" href="https://www.linkedin.com/in/sachin-yadav-007814270/" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-lg">share</span></a>
                            <a className="text-slate-500 hover:text-[#3c83f6] transition-colors" href="https://github.com/brutalsachin/nlp-studio" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-lg">terminal</span></a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

/* ── Reusable glass-widget wrapper ── */
const GlassWidget = ({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
    <div
        className={className}
        style={{
            background: 'rgba(22, 27, 34, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
            ...style,
        }}
    >
        {children}
    </div>
);

export default AboutMe;
