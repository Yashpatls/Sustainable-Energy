import React, { useState, useEffect } from 'react';
import { 
  Leaf, Zap, Server, CloudRain, ShieldAlert, Cpu, 
  TerminalSquare, RefreshCw, BarChart2, Calculator, Search, TrendingUp,
  MessageSquare, Activity, User, LogOut, Lock, Mail, Play,
  ArrowRight, UserPlus, Award, Camera, ShieldCheck, Trophy, Plus, Minus, Wand,
  Car, Coffee, TreePine, Smartphone, Lightbulb, HelpCircle,
  ClipboardList, Clock, TrendingDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import AuthScreen from './components/AuthScreen';

function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  // Lifetime Stats Profile State
  const [lifetimeTokens, setLifetimeTokens] = useState(0);
  const [sessionLog, setSessionLog] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editNameVal, setEditNameVal] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Shared Constants
  const kWhPerToken = 0.00005;

  // Daily Eco Tips
  const ecoTips = [
    "💡 Short prompts use up to 70% less energy. Be precise!",
    "🌿 Reusing AI responses via caching saves up to 90% of compute.",
    "⚡ Smaller AI models (7B params) use 80% less energy than large ones.",
    "🌍 Schedule heavy AI tasks at night when grid electricity is greener.",
    "📊 Setting max_tokens limits prevents wasteful verbose output.",
    "🔄 Batch similar API calls together to reduce inference overhead.",
  ];
  const [tipIdx] = useState(() => Math.floor(Math.random() * ecoTips.length));

  // Badge System
  const badges = [
    { id: 1, label: "🌱 Seedling", desc: "First 100 tokens", req: 100 },
    { id: 2, label: "⚡ Spark", desc: "Reach 1,000 tokens", req: 1000 },
    { id: 3, label: "🌿 EcoWarrior", desc: "Reach 5,000 tokens", req: 5000 },
    { id: 4, label: "🏆 GreenChampion", desc: "Reach 10,000 tokens", req: 10000 },
  ];
  const unlockedBadges = badges.filter(b => lifetimeTokens >= b.req);

  // Eco Score (100 = perfect green, drops as tokens grow)
  const ecoScore = Math.max(0, Math.round(100 - (lifetimeTokens / 100)));
  const ecoScoreColor = ecoScore > 70 ? '#34d399' : ecoScore > 40 ? '#fbbf24' : '#f43f5e';
  const ecoScoreLabel = ecoScore > 70 ? 'Excellent 🌱' : ecoScore > 40 ? 'Moderate ⚡' : 'High Usage 🔴';

  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [prompts, setPrompts] = useState(5000);
  const [tokensPerPrompt, setTokensPerPrompt] = useState(1000);
  const [optimizationSaving, setOptimizationSaving] = useState(40);
  const [greenMode, setGreenMode] = useState(false);

  // Device Comparison State
  const devices = [
    { id: "cpu", name: "Standard Cloud CPU", powerW: 250, tps: 150, costPer1M: 3.50 },
    { id: "a100", name: "NVIDIA A100 GPU", powerW: 400, tps: 2000, costPer1M: 0.80 },
    { id: "h100", name: "NVIDIA H100 GPU", powerW: 700, tps: 6000, costPer1M: 0.50 },
    { id: "edge", name: "Apple M3 Max", powerW: 40, tps: 800, costPer1M: 0.10 },
    { id: "t4", name: "NVIDIA T4 GPU", powerW: 70, tps: 400, costPer1M: 0.15 },
    { id: "tpu", name: "Google TPU v4", powerW: 200, tps: 5000, costPer1M: 0.40 },
    { id: "mobile", name: "Snapdragon 8 Gen 3", powerW: 5, tps: 100, costPer1M: 0.01 },
    { id: "pi", name: "Raspberry Pi 5", powerW: 12, tps: 15, costPer1M: 0.01 },
  ];
  const [device1Id, setDevice1Id] = useState("cpu");
  const [device2Id, setDevice2Id] = useState("h100");

  const dev1 = devices.find(d => d.id === device1Id) || devices[0];
  const dev2 = devices.find(d => d.id === device2Id) || devices[1];

  const deviceCompareData = [
    { 
      name: 'Energy/1M Tokens (kWh)', 
      [dev1.name]: parseFloat(((1000000 / dev1.tps) * dev1.powerW / 3600000).toFixed(4)), 
      [dev2.name]: parseFloat(((1000000 / dev2.tps) * dev2.powerW / 3600000).toFixed(4)) 
    },
    { 
      name: 'Cost/1M Tokens ($)', 
      [dev1.name]: dev1.costPer1M, 
      [dev2.name]: dev2.costPer1M 
    }
  ];

  const totalTokens = prompts * tokensPerPrompt;
  const energyKWh = (totalTokens * kWhPerToken).toFixed(2);
  const carbonGrams = (energyKWh * 400).toFixed(0); 
  
  const optimizedTokens = totalTokens * (1 - optimizationSaving / 100);
  const optEnergyKWh = (optimizedTokens * kWhPerToken).toFixed(2);
  const optCarbonGrams = (optEnergyKWh * 400).toFixed(0);

  // Prompt Optimizer State
  const [promptText, setPromptText] = useState("Explain how renewable energy affects cloud networking nodes...");
  const liveTokens = Math.ceil(promptText.length / 4);
  const liveEnergy = (liveTokens * kWhPerToken).toFixed(5); 
  const liveCarbon = (liveEnergy * 400).toFixed(3);

  const handleSuggestion = () => {
    setPromptText("Summarize how renewable energy impacts cloud data centers.");
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target.result;
        setProfilePic(base64);
        // Sync to DB
        try {
          await fetch('http://localhost:3000/api/update-profile-pic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: currentUser, profilePic: base64 })
          });
        } catch(err) {
          console.error("Profile Pic Sync Error:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateExecution = async () => {
    let finalTokens = liveTokens;
    let savingsMsg = "";

    if (greenMode) {
      finalTokens = Math.ceil(liveTokens * 0.6);
      savingsMsg = ` (Green Mode saved ${liveTokens - finalTokens} tokens!)`;
    }

    const newTokensCount = lifetimeTokens + finalTokens;
    setLifetimeTokens(newTokensCount);

    // Create session object
    const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const newSession = { 
      time: timeStr, 
      tokens: finalTokens, 
      energy: (finalTokens * kWhPerToken).toFixed(5), 
      text: (greenMode ? "🌿 " : "") + promptText.slice(0, 50) + (promptText.length > 50 ? '...' : '') 
    };

    // Update local state
    setSessionLog(prev => [newSession, ...prev.slice(0, 9)]);
    
    // Save persistently to local secure Database API
    try {
      await fetch('http://localhost:3000/api/update-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: currentUser, 
          tokensAdded: finalTokens,
          session: newSession 
        })
      });
    } catch(err) {
      console.error("DB Sync Error:", err);
    }

    alert(`Execution Success! Added ${finalTokens} tokens to your Profile.${savingsMsg}`);
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="cursor-glow" style={{ transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)` }} />
        <AuthScreen onLogin={(userName, tokens, sessions, existingPic) => {
          setCurrentUser(userName);
          setDisplayName(userName);
          setLifetimeTokens(tokens);
          setSessionLog(sessions || []);
          setProfilePic(existingPic || null);
          setIsAuthenticated(true);
        }} />
      </>
    );
  }

  return (
    <div className="app-container">
      <div 
        className="cursor-glow" 
        style={{ transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)` }}
      />
      <header>
        <div className="nav-container">
          <div className="logo">
            <Leaf size={28} />
            Eco<span>AI</span>
          </div>
          <nav className="nav-links">
            <a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>Home</a>
            <a href="#solutions" onClick={(e) => { if(activeTab === 'profile') { e.preventDefault(); setActiveTab('home'); setTimeout(()=>window.location.hash='solutions', 100); } }}>Solutions</a>
            <a href="#optimizer" onClick={(e) => { if(activeTab === 'profile') { e.preventDefault(); setActiveTab('home'); setTimeout(()=>window.location.hash='optimizer', 100); } }}>Optimizer</a>
            <a href="#comparison" onClick={(e) => { if(activeTab === 'profile') { e.preventDefault(); setActiveTab('home'); setTimeout(()=>window.location.hash='comparison', 100); } }}>Hardware</a>
            <a href="#calculator" onClick={(e) => { if(activeTab === 'profile') { e.preventDefault(); setActiveTab('home'); setTimeout(()=>window.location.hash='calculator', 100); } }}>Calculator</a>
          </nav>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => { setActiveTab(activeTab === 'profile' ? 'home' : 'profile'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.9rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Mini avatar */}
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: '#000', flexShrink: 0 }}>
                {profilePic ? (
                  <img src={profilePic} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (displayName || currentUser).charAt(0).toUpperCase()
                )}
              </div>
              <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName || currentUser}</span>
            </button>
            <button onClick={() => { 
              setIsAuthenticated(false); 
              setActiveTab('home'); 
              setDisplayName(''); 
              setSessionLog([]); 
              setProfilePic(null); 
            }} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)', whiteSpace: 'nowrap' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main>
        {activeTab === 'profile' ? (
        <div style={{ minHeight: '100vh', paddingTop: '80px' }}>

          {/* Cover Banner */}
          <div style={{ height: '200px', background: 'linear-gradient(135deg, #0c1a3a 0%, #0d2338 40%, #06150f 100%)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(56,189,248,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(52,211,153,0.1) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '60px', background: 'linear-gradient(to top, var(--bg-dark), transparent)' }} />
          </div>

          {/* Profile Hero Card */}
          <div className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 2 }}>
            <div className="card glass" style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                
                {/* Left: Avatar + Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  {/* Avatar */}
                  <label htmlFor="pic-upload" style={{ cursor: 'pointer', position: 'relative', flexShrink: 0, marginTop: '-64px' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--bg-dark)', boxShadow: '0 0 0 3px var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#000' }}>{(displayName || currentUser).charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '26px', height: '26px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', border: '2px solid var(--bg-dark)' }}>📷</div>
                    <input id="pic-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePicChange} />
                  </label>

                  {/* Name & Role */}
                  <div style={{ paddingTop: '8px' }}>
                    {editingName ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          value={editNameVal}
                          onChange={e => setEditNameVal(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (setDisplayName(editNameVal), setEditingName(false))}
                          style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-subtle)', color: '#fff', fontFamily: 'inherit', fontSize: '1.1rem', outline: 'none', minWidth: '200px' }}
                          autoFocus
                        />
                        <button className="btn-primary" style={{ padding: '8px 18px' }} onClick={() => { setDisplayName(editNameVal); setEditingName(false); }}>Save</button>
                        <button className="btn-secondary" style={{ padding: '8px 14px' }} onClick={() => setEditingName(false)}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <h2 style={{ margin: '0 0 6px 0', fontSize: '1.9rem', fontWeight: '700', lineHeight: 1.2 }}>{displayName || currentUser}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--secondary)', padding: '3px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.03em' }}>✓ Verified Eco-User</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }}></span>
                            DB Sync: Active
                          </span>
                          <span style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: '800', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(52,211,153,0.2)' }}>
                            🎖️ {lifetimeTokens < 1000 ? "Eco-Seedling" : lifetimeTokens < 5000 ? "Green-Guardian" : "Carbon-Hero"}
                          </span>
                        </div>
                        
                        {/* Milestone Progress */}
                        <div style={{ marginTop: '16px', maxWidth: '300px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
                            <span>Sustainability Goal</span>
                            <span>{Math.min(100, Math.round((lifetimeTokens / 5000) * 100))}%</span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, (lifetimeTokens / 5000) * 100)}%`, background: 'linear-gradient(to right, var(--primary), var(--secondary))', boxShadow: '0 0 10px var(--secondary)' }} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Action buttons */}
                {!editingName && (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={() => { setEditingName(true); setEditNameVal(displayName || currentUser); }} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>✏️ Edit Name</button>
                    <button onClick={() => setActiveTab('home')} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>← Return</button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {[
                { icon: <Activity size={22} color="var(--primary)"/>, label: 'Lifetime Tokens', value: lifetimeTokens.toLocaleString(), sub: 'in database' },
                { icon: <Zap size={22} color="var(--secondary)"/>, label: 'Energy Used', value: `${(lifetimeTokens * kWhPerToken).toFixed(4)}`, sub: 'kWh' },
                { icon: <CloudRain size={22} color="#f43f5e"/>, label: 'Carbon Trace', value: `${((lifetimeTokens * kWhPerToken) * 400).toFixed(1)}`, sub: 'gCO₂' },
                { icon: <Activity size={22} color="#a78bfa"/>, label: 'Water Used', value: `${(lifetimeTokens * 0.01).toFixed(1)}`, sub: 'ml H₂O' },
              ].map((stat, i) => (
                <div key={i} className="card glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{stat.icon}<span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</span></div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Badges + Session — Two Column */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              {/* Badges */}
              <div className="card glass" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>🏆 Achievement Badges</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {badges.map(b => {
                    const unlocked = lifetimeTokens >= b.req;
                    return (
                      <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: unlocked ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${unlocked ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.05)'}`, opacity: unlocked ? 1 : 0.45 }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{b.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.desc}</div>
                        </div>
                        {unlocked && <div style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: '700', background: 'rgba(52,211,153,0.15)', padding: '2px 8px', borderRadius: '20px' }}>✓ DONE</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Session History */}
              <div className="card glass" style={{ padding: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                  <ClipboardList size={18} /> Session History
                </h3>
                {sessionLog.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Run a prompt in the Optimizer to log sessions here.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sessionLog.map((s, i) => (
                      <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                            <Clock size={12} /> {s.time}
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '700', background: 'rgba(56,189,248,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{s.tokens} tokens</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: '700', background: 'rgba(52,211,153,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{s.energy} kWh</span>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '4px', fontStyle: 'italic', opacity: 0.9 }}>"{s.text}"</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#f43f5e', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                          <TrendingDown size={12} /> { (parseFloat(s.energy || 0) * 400).toFixed(2) } gCO₂ Impact
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ height: '60px' }} />
          </div>
        </div>
        ) : (
          <>
            {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-glow"></div>
          <div className="container">
            <h1>Welcome, <span className="text-gradient">{displayName || currentUser}</span></h1>
            <p>
              Your sustainable journey with AI starts here. Discover how optimizing tokens, using efficient models, and adopting sustainable infrastructure can balance innovation with environmental responsibility.
            </p>
            <div className="cta-buttons">
              <a href="#comparison" className="btn-primary" onClick={() => window.scrollTo({top: document.getElementById('comparison').offsetTop - 100, behavior: 'smooth'})}>
                Get Started <Play size={18} />
              </a>
              <a href="#calculator" className="btn-secondary">
                Calculate Impact <Calculator size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* SOLUTIONS SECTION */}
        <section id="solutions" className="section container">
          <div className="section-header">
            <h2>Methods to Reduce Energy Usage</h2>
            <p>From algorithmic efficiency to smart prompt engineering, adopting Sustainable Tokens is essential for the future of AI.</p>
          </div>
          
          <div className="grid-2">
            <div className="card glass" style={{ padding: '40px' }}>
              <TerminalSquare size={48} className="text-gradient" style={{ marginBottom: '24px' }} />
              <h3 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Token Optimization</h3>
              <p style={{ fontSize: '1.05rem', marginBottom: '24px' }}>
                Every token generated or processed requires complex matrix multiplications. By treating tokens as a valuable and costly currency, we can dramatically reduce energy output.
              </p>
              <ul className="method-list" style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                <li className="method-item">
                  <div className="method-icon"><Search size={24} /></div>
                  <div className="method-content">
                    <h3>Concise Prompting</h3>
                    <p>Draft precise queries and enforce strict <code>max_tokens</code> limits to stop verbose output generation.</p>
                  </div>
                </li>
                <li className="method-item">
                  <div className="method-icon"><RefreshCw size={24} /></div>
                  <div className="method-content">
                    <h3>Semantic Caching</h3>
                    <p>Cache responses to common queries. If a user asks a similar question, retrieve the cache instead of firing up the model.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="card glass" style={{ padding: '40px' }}>
              <Cpu size={48} className="text-gradient" style={{ marginBottom: '24px', color: '#34d399' }} />
              <h3 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Efficient AI Models</h3>
              <p style={{ fontSize: '1.05rem', marginBottom: '24px' }}>
                Right-sizing your AI model is one of the most effective strategies for sustainability. Not every task requires a 100-billion parameter titan.
              </p>
              <ul className="method-list" style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                <li className="method-item">
                  <div className="method-icon"><BarChart2 size={24} /></div>
                  <div className="method-content">
                    <h3>Quantization & Pruning</h3>
                    <p>Compress models by reducing mathematical precision (e.g. 8-bit) and removing redundant parameters to accelerate lower-power inference.</p>
                  </div>
                </li>
                <li className="method-item">
                  <div className="method-icon"><Zap size={24} /></div>
                  <div className="method-content">
                    <h3>Retrieval-Augmented Gen (RAG)</h3>
                    <p>Instead of gigantic input prompts, inject only the strict relevant data contexts into smaller, specialized models.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* LIVE PROMPT OPTIMIZER SECTION */}
        <section id="optimizer" className="section container">
          <div className="section-header">
            <h2>Live Token Optimizer & Tracker</h2>
            <p>Type in the box below to see real-time energy usage. When you click 'Execute Prompt', the data will be logged and matched to your Account Profile Footprint.</p>
          </div>
          <div className="card glass" style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <div className="prompt-container">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: '600' }}>
                <MessageSquare size={20} className="text-gradient" />
                Prompt Input Simulator
              </div>
              <textarea 
                className="prompt-textarea"
                placeholder="Type your prompt here..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
              />
              
              <div className="live-stats">
                <div className="stat-pill">
                  <Activity size={16} color="var(--primary)" />
                  <strong>{liveTokens}</strong> Tokens
                </div>
                <div className="stat-pill">
                  <Zap size={16} color="var(--secondary)" />
                  <strong>{liveEnergy} kWh</strong>
                </div>
                <div className="stat-pill" style={{ borderColor: 'rgba(244,63,94,0.3)', color: '#f43f5e' }}>
                  <CloudRain size={16} color="#f43f5e" />
                  <strong>{liveCarbon} gCO₂</strong>
                </div>
              </div>

              <div style={{ display: 'flex',justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <div className="suggestions-box" style={{ marginTop: 0, paddingTop: 0, border: 'none' }}>
                  <h4 style={{ marginBottom: '8px' }}><Wand size={14} style={{ display: 'inline', marginRight: '6px' }} /> Auto Suggestions</h4>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button onClick={handleSuggestion} className="suggestion-btn">
                      ✨ Make concise (-70% tokens)
                    </button>
                    <button onClick={() => setPromptText("")} className="suggestion-btn">
                      Clear
                    </button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div 
                    onClick={() => setGreenMode(!greenMode)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      cursor: 'pointer', 
                      background: greenMode ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: `1px solid ${greenMode ? 'var(--secondary)' : 'rgba(255,255,255,0.1)'}`,
                      transition: 'all 0.3s ease',
                      boxShadow: greenMode ? '0 0 15px rgba(52,211,153,0.2)' : 'none'
                    }}
                  >
                    <Leaf size={16} color={greenMode ? 'var(--secondary)' : 'var(--text-muted)'} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: greenMode ? 'var(--secondary)' : 'var(--text-muted)' }}>
                      {greenMode ? 'GREEN MODE ON' : 'ENABLE GREEN MODE'}
                    </span>
                    <div style={{ width: '32px', height: '18px', background: greenMode ? 'var(--secondary)' : '#444', borderRadius: '10px', position: 'relative', transition: '0.3s' }}>
                      <div style={{ width: '12px', height: '12px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: greenMode ? '17px' : '3px', transition: '0.3s' }} />
                    </div>
                  </div>

                  <button onClick={handleSimulateExecution} className="btn-primary" style={{ padding: '12px 24px', background: 'var(--secondary)' }}>
                     <Play size={18} /> Execute & Log
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HARDWARE DEVICE COMPARISON SECTION */}
        <section id="comparison" className="section container">
          <div className="section-header">
            <h2>Hardware Device Comparison</h2>
            <p>Select two AI processing devices to compare their energy and cost efficiency when generating 1 Million Tokens.</p>
          </div>
          <div className="card glass" style={{ padding: '40px' }}>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select Device 1 (Red Bar)</label>
                <select 
                  value={device1Id} 
                  onChange={(e) => setDevice1Id(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(15, 22, 41, 0.8)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                VS
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select Device 2 (Green Bar)</label>
                <select 
                  value={device2Id} 
                  onChange={(e) => setDevice2Id(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(15, 22, 41, 0.8)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceCompareData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1629', borderColor: 'rgba(100, 116, 139, 0.2)', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                    cursor={{fill: 'rgba(255, 255, 255, 0.02)'}}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey={dev1.name} fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={dev2.name} fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </section>

        {/* CALCULATOR SECTION */}
        <section id="calculator" className="section container">
          <div className="section-header">
            <h2>Interactive Token Energy Calculator</h2>
            <p>Simulate how optimization choices actively reduce both electricity usage and carbon emissions in your application.</p>
          </div>

          <div className="calculator-box glass">
            <div className="calc-grid">
              
              <div>
                <h3 style={{ marginBottom: '24px' }}>AI Application Scale</h3>
                
                <div className="input-group">
                  <label>1. Questions (Prompts) Asked Everyday</label>
                  <div className="stepper-container">
                    <button onClick={() => setPrompts(Math.max(100, prompts - 500))} className="stepper-btn">−</button>
                    <div className="stepper-value">{prompts.toLocaleString()} Prompts</div>
                    <button onClick={() => setPrompts(Math.min(100000, prompts + 500))} className="stepper-btn">+</button>
                  </div>
                </div>

                <div className="input-group">
                  <label>2. Average Words (Tokens) per Question & Answer</label>
                  <div className="stepper-container">
                    <button onClick={() => setTokensPerPrompt(Math.max(50, tokensPerPrompt - 100))} className="stepper-btn">−</button>
                    <div className="stepper-value">{tokensPerPrompt.toLocaleString()} Tokens</div>
                    <button onClick={() => setTokensPerPrompt(Math.min(8000, tokensPerPrompt + 100))} className="stepper-btn">+</button>
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: '40px' }}>
                  <label style={{ color: 'var(--secondary)' }}>3. Energy Savings Goal (%)</label>
                  <div className="stepper-container">
                    <button onClick={() => setOptimizationSaving(Math.max(0, optimizationSaving - 5))} className="stepper-btn">−</button>
                    <div className="stepper-value" style={{ color: 'var(--secondary)' }}>{optimizationSaving}% Saved</div>
                    <button onClick={() => setOptimizationSaving(Math.min(90, optimizationSaving + 5))} className="stepper-btn">+</button>
                  </div>
                </div>
              </div>

              <div className="result-card">
                <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>Daily Estimated Impact</h3>
                
                <div className="res-item">
                  <span className="res-label">Base Energy Consumption (kWh)</span>
                  <span className="res-val bad">{energyKWh} <span>kWh</span></span>
                </div>
                <div className="res-item">
                  <span className="res-label">Optimized Energy Consumption</span>
                  <span className="res-val good">{optEnergyKWh} <span>kWh</span></span>
                </div>
                
                <div className="res-item" style={{ marginTop: '16px' }}>
                  <span className="res-label">Base Carbon Emission (gCO₂e)</span>
                  <span className="res-val bad">{carbonGrams} <span>g</span></span>
                </div>
                <div className="res-item">
                  <span className="res-label">Optimized Carbon Emission</span>
                  <span className="res-val good">{optCarbonGrams} <span>g</span></span>
                </div>

                <div style={{ marginTop: '32px', textAlign: 'center', color: 'var(--primary)' }}>
                  <strong>{(energyKWh - optEnergyKWh).toFixed(2)} kWh & {(carbonGrams - optCarbonGrams).toFixed(0)}g CO₂ Saved Daily!</strong>
                </div>
              </div>

            </div>
          </div>
        </section>

          </>
        )}
      </main>

      <footer>
        <div className="container">
          <Leaf size={32} style={{ color: 'var(--secondary)', marginBottom: '16px' }} />
          <h3>EcoAI Research</h3>
          <p>Built with sustainability in mind. Optimizing tokens for a greener intelligent future.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
