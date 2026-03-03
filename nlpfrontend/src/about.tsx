import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#0F172A] text-slate-100 min-h-screen font-sans flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-md px-6 lg:px-20 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <span className="material-symbols-outlined">account_tree</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-100">NLP Lab</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-medium text-slate-400 hover:text-blue-500 transition-colors cursor-pointer" onClick={() => navigate('/')}>Home</a>
                        <a className="text-sm font-medium text-slate-400 hover:text-blue-500 transition-colors" href="#">Pipeline</a>
                        <a className="text-sm font-medium text-slate-400 hover:text-blue-500 transition-colors" href="#">Experiments</a>
                        <a className="text-sm font-medium text-slate-400 hover:text-blue-500 transition-colors" href="#">Analytics</a>
                        <a className="text-sm font-medium text-blue-500 cursor-pointer">About</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/upload')}
                            className="flex items-center justify-center rounded-lg h-10 px-6 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-600/90 transition-all"
                        >
                            Launch Experiment
                        </button>
                        <div className="bg-slate-800 rounded-full w-10 h-10 flex items-center justify-center border border-slate-700">
                            <span className="material-symbols-outlined text-slate-400">person</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-20 py-12 space-y-24">

                {/* Vision Section */}
                <section className="relative pt-8">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="max-w-3xl">
                        <p className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-4">Vision &amp; Mission</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 mb-6 leading-tight">
                            About the NLP <br /><span className="text-blue-500">Experimentation Platform</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
                            A virtual laboratory for configuring preprocessing, N-gram generation, vectorization, and machine learning models to analyze performance impact. This platform provides researchers and students with a controlled environment to visualize the nuances of natural language processing workflows.
                        </p>
                    </div>
                </section>

                {/* System Architecture Section */}
                <section className="space-y-12">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4 text-slate-100">System Architecture</h2>
                        <p className="text-slate-400">Built on modular principles using Strategy and Factory design patterns for seamless runtime interchangeability of pipeline components.</p>
                    </div>
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Architecture Map */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border-l-4 border border-slate-700 border-l-blue-500 shadow-[0_0_20px_-5px_rgba(60,131,246,0.2)]">
                                    <span className="material-symbols-outlined text-blue-500">web</span>
                                    <div>
                                        <h4 className="font-bold text-slate-100">Frontend Layer</h4>
                                        <p className="text-sm text-slate-500">React &amp; Tailwind UI</p>
                                    </div>
                                </div>
                                <div className="ml-8 h-6 w-0.5 bg-gradient-to-b from-blue-500 to-slate-800"></div>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border-l-4 border border-slate-700 border-l-blue-500 shadow-[0_0_20px_-5px_rgba(60,131,246,0.2)]">
                                    <span className="material-symbols-outlined text-blue-500">dns</span>
                                    <div>
                                        <h4 className="font-bold text-slate-100">REST API Gateway</h4>
                                        <p className="text-sm text-slate-500">Spring Boot Backend</p>
                                    </div>
                                </div>
                                <div className="ml-8 h-6 w-0.5 bg-gradient-to-b from-blue-500 to-slate-800"></div>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border-l-4 border border-slate-700 border-l-blue-500 shadow-[0_0_20px_-5px_rgba(60,131,246,0.2)]">
                                    <span className="material-symbols-outlined text-blue-500">settings_input_component</span>
                                    <div>
                                        <h4 className="font-bold text-slate-100">NLP Pipeline Engine</h4>
                                        <p className="text-sm text-slate-500">Core Orchestrator</p>
                                    </div>
                                </div>
                                <div className="ml-8 h-6 w-0.5 bg-slate-800"></div>
                                <div className="grid grid-cols-4 gap-3">
                                    {['Preprocessor', 'N-Grams', 'Vectorizer', 'Model'].map(item => (
                                        <div key={item} className="p-3 text-center rounded-lg border border-slate-800 text-xs font-mono text-slate-400 bg-slate-900/50">{item}</div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Architecture Details */}
                        <div className="flex flex-col justify-center h-full space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-100">
                                    <span className="material-symbols-outlined text-blue-500">auto_fix_high</span>
                                    Modular Design Patterns
                                </h3>
                                <p className="text-slate-400 leading-relaxed">
                                    By implementing the <strong className="text-slate-200">Strategy Pattern</strong>, our NLP Engine treats every step (Preprocessing, Vectorizing, etc.) as an interchangeable algorithm. This allows users to hot-swap between techniques like TF-IDF and Word2Vec during runtime without restarting the analysis.
                                </p>
                                <p className="text-slate-400 leading-relaxed">
                                    The <strong className="text-slate-200">Factory Pattern</strong> manages the instantiation of complex machine learning models, ensuring that Naive Bayes or Logistic Regression configurations are generated consistently based on user input parameters.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technology Stack Section */}
                <section className="space-y-12">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4 text-slate-100">Core Technology Stack</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: 'terminal', title: 'Backend', items: ['Spring Boot Framework', 'Java Performance Engine', 'RESTful Service APIs'] },
                            { icon: 'psychology', title: 'NLP Engine', items: ['Custom Tokenization', 'TF-IDF & Vectorization', 'Naive Bayes / Logistic'] },
                            { icon: 'dashboard_customize', title: 'Frontend', items: ['React 18 & Vite', 'Tailwind CSS Styling', 'Chart.js Visualization'] }
                        ].map((card, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-slate-700 hover:border-t-blue-500 transition-all group">
                                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-blue-500">{card.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-slate-100">{card.title}</h3>
                                <ul className="space-y-3 text-slate-500">
                                    {card.items.map(item => (
                                        <li key={item} className="flex items-center gap-2 text-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Educational Purpose Section */}
                <section className="pb-20">
                    <div className="rounded-3xl bg-slate-900/50 p-8 md:p-12 border border-slate-800 flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2 space-y-6">
                            <h2 className="text-3xl font-bold text-slate-100">Educational Purpose</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                This platform is designed primarily as an <strong className="text-slate-200">experimental learning tool</strong>. Its goal is to demystify the "black box" of NLP by allowing users to tweak small variables—like the number of N-grams or specific cleaning steps—and immediately see the delta in accuracy and precision metrics.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-blue-500 font-semibold">
                                    <span className="material-symbols-outlined">school</span>
                                    Academic Focus
                                </div>
                                <div className="flex items-center gap-2 text-blue-500 font-semibold">
                                    <span className="material-symbols-outlined">biotech</span>
                                    Research Driven
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 grid grid-cols-2 gap-4">
                            {[
                                { icon: 'bar_chart', highlight: true },
                                { icon: 'insights', highlight: false },
                                { icon: 'developer_board', highlight: false },
                                { icon: 'account_tree', highlight: true },
                            ].map((item, idx) => (
                                <div key={idx} className={`aspect-square rounded-2xl flex items-center justify-center border ${item.highlight ? 'bg-gradient-to-br from-blue-500/20 to-transparent border-blue-500/20' : 'bg-slate-800/50 border-slate-700'}`}>
                                    <span className={`material-symbols-outlined text-5xl ${item.highlight ? 'text-blue-500' : 'text-slate-500'}`}>{item.icon}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-slate-800 py-12 px-6 lg:px-20 bg-[#020617]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <span className="material-symbols-outlined text-blue-500">account_tree</span>
                        <span className="font-bold text-lg tracking-tight">NLP Lab</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-10 text-sm font-medium text-slate-500">
                        <a className="hover:text-white transition-colors" href="#">Contact Us</a>
                        <a className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/about')}>About Us</a>
                    </div>
                    <p className="text-slate-600 text-sm">© 2026 NLP Lab ~ Sachin Yadav.</p>
                </div>
            </footer>
        </div>
    );
};

export default About;
