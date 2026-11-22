import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownUp, ArrowRight, BarChart3, Bookmark, Check, ChevronDown,
  ChevronRight, CircleHelp, Command, Cpu, ExternalLink, Filter, FlaskConical,
  Gauge, GitCompareArrows, Globe2, Layers3, LayoutDashboard, Menu, Search,
  SlidersHorizontal, Sparkles, X, Zap
} from "lucide-react";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const money = n => n === 0 ? "Free" : `$${Number(n).toFixed(n < 1 ? 2 : 2)}`;
const compact = n => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${Math.round(n/1000)}K` : n;
const initials = name => name.split(/[\s-]/).map(x => x[0]).join("").slice(0,2).toUpperCase();

function App() {
  const [page,setPage] = useState("Discover");
  const [models,setModels] = useState([]);
  const [providers,setProviders] = useState([]);
  const [labs,setLabs] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const [query,setQuery] = useState("");
  const [company,setCompany] = useState("");
  const [provider,setProvider] = useState("");
  const [capability,setCapability] = useState("");
  const [type,setType] = useState("");
  const [sort,setSort] = useState("featured");
  const [selected,setSelected] = useState([]);
  const [detail,setDetail] = useState(null);
  const [benchmark,setBenchmark] = useState("reasoning");
  const [mobileOpen,setMobileOpen] = useState(false);

  const loadModels = async () => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ sort, limit:"100" });
      if(query) params.set("q",query);
      if(company) params.set("company",company);
      if(provider) params.set("provider",provider);
      if(capability) params.set("capability",capability);
      if(type) params.set("type",type);
      const response = await fetch(`${API}/models?${params}`);
      if(!response.ok) throw new Error("Could not load models");
      const data = await response.json(); setModels(data.items || []);
    } catch(e) { setError(`${e.message}. Check that the API and MongoDB are running.`); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadModels(); }, [query,company,provider,capability,type,sort]);
  useEffect(() => {
    Promise.all([fetch(`${API}/providers`).then(r=>r.json()),fetch(`${API}/labs`).then(r=>r.json())])
      .then(([p,l])=>{setProviders(Array.isArray(p)?p:[]);setLabs(Array.isArray(l)?l:[]);}).catch(()=>{});
  }, []);

  const openDetail = async model => {
    try { const r = await fetch(`${API}/models/${model.slug}`); if(r.ok) setDetail(await r.json()); }
    catch { setDetail(model); }
  };
  const toggleCompare = id => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : s.length < 4 ? [...s,id] : s);
  const compareItems = models.filter(m=>selected.includes(m._id));
  const nav = [
    {name:"Discover",icon:LayoutDashboard},
    {name:"Rankings",icon:BarChart3},
    {name:"Compare",icon:GitCompareArrows},
    {name:"AI Labs",icon:FlaskConical},
    {name:"Providers",icon:Globe2}
  ];
  const changePage = name => { setPage(name); setMobileOpen(false); if(name!=="Compare") setDetail(null); };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen?"open":""}`}>
      <div className="brand"><div className="brand-mark"><Layers3 size={21}/></div><span>oneatlas<span className="brand-dot">.</span></span></div>
      <div className="workspace"><div className="workspace-icon">OA</div><div><b>Personal workspace</b><small>Free plan</small></div><ChevronDown size={15}/></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav.map(item=><button key={item.name} className={`nav-item ${page===item.name?"active":""}`} onClick={()=>changePage(item.name)}><item.icon size={17}/><span>{item.name}</span>{item.name==="Compare"&&selected.length>0&&<em>{selected.length}</em>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="nav-label">RESOURCES</div><a href="https://www.litellm.ai/" target="_blank" rel="noreferrer"><CircleHelp size={16}/> Developer docs <ExternalLink size={12}/></a><div className="profile"><div className="avatar">OA</div><div><b>OneAtlas user</b><small>Developer</small></div><ChevronDown size={15}/></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><button className="mobile-menu icon-btn" onClick={()=>setMobileOpen(!mobileOpen)}><Menu size={19}/></button><div className="crumb">Workspace <ChevronRight size={14}/> <b>{page}</b></div><div className="top-actions"><div className="status"><span/> All systems operational</div><button className="icon-btn"><CircleHelp size={18}/></button><div className="avatar small">OA</div></div></header>
      <div className="content">
        {page==="Discover"&&<DiscoverPage {...{models,providers,loading,error,query,setQuery,company,setCompany,provider,setProvider,capability,setCapability,type,setType,sort,setSort,selected,toggleCompare,openDetail,changePage}}/>}
        {page==="Rankings"&&<RankingsPage benchmark={benchmark} setBenchmark={setBenchmark} openDetail={openDetail}/>}
        {page==="Compare"&&<ComparePage items={compareItems} selected={selected} models={models} toggleCompare={toggleCompare} openDetail={openDetail} changePage={changePage}/>}
        {page==="AI Labs"&&<DirectoryPage title="AI Labs" subtitle="Explore the research organizations shaping the AI ecosystem." items={labs} icon={FlaskConical} empty="No labs found yet."/>}
        {page==="Providers"&&<DirectoryPage title="Provider directory" subtitle="Find infrastructure providers and the models available through them." items={providers} icon={Globe2} empty="No providers found yet."/>}
      </div>
      <footer className="footer"><span>© 2026 OneAtlas</span><span>Model intelligence for builders <Sparkles size={13}/></span></footer>
    </main>
    {detail&&<DetailPanel model={detail} onClose={()=>setDetail(null)} onCompare={()=>{toggleCompare(detail._id);setDetail(null);setPage("Compare");}}/>}
    {selected.length>0&&<div className="compare-dock"><div><GitCompareArrows size={17}/><b>{selected.length} models selected</b><span className="dock-hint">Select up to 4 models</span></div><button className="dock-clear" onClick={()=>setSelected([])}>Clear</button><button className="btn-primary compact" onClick={()=>changePage("Compare")}>Compare models <ArrowRight size={15}/></button></div>}
  </div>;
}

function DiscoverPage(p) {
  const companies=[...new Set(p.models.map(m=>m.company))].sort();
  const capabilities=[...new Set(p.models.flatMap(m=>m.capabilities||[]))].sort();
  return <>
    <div className="hero"><div className="eyebrow"><span className="eyebrow-dot"/> THE AI MODEL INTELLIGENCE PLATFORM</div><h1>Find the right model.<br/><span>Build what’s next.</span></h1><p>Explore, compare and evaluate the world’s leading AI models — all in one place.</p>
      <div className="hero-search"><Search size={19}/><input value={p.query} onChange={e=>p.setQuery(e.target.value)} placeholder="Search models, providers, capabilities..." /><kbd>⌘ K</kbd><button onClick={()=>document.querySelector(".catalogue")?.scrollIntoView({behavior:"smooth"})}>Explore</button></div>
      <div className="hero-meta"><span><Zap size={14}/> {p.models.length || "—"} models indexed</span><span><Globe2 size={14}/> {p.providers.length || "—"} providers</span><span><Activity size={14}/> Updated demo catalogue</span></div>
    </div>
    <div className="stats-grid">
      <Stat icon={Cpu} label="AI models" value={p.models.length||"—"} note="Across model families"/>
      <Stat icon={Globe2} label="Providers" value={p.providers.length||"—"} note="Inference destinations"/>
      <Stat icon={FlaskConical} label="Research labs" value="5" note="Leading AI organizations"/>
      <Stat icon={Gauge} label="Benchmarks" value="4" note="Performance dimensions"/>
    </div>
    <section className="catalogue">
      <div className="section-heading"><div><div className="eyebrow">MODEL EXPLORER</div><h2>Discover models</h2><p>Search and filter a curated catalogue of AI models.</p></div><div className="result-count">{p.models.length} results <span>·</span> Demo dataset</div></div>
      <div className="filter-bar"><div className="filter-search"><Search size={16}/><input value={p.query} onChange={e=>p.setQuery(e.target.value)} placeholder="Search catalogue..."/></div>
        <select value={p.company} onChange={e=>p.setCompany(e.target.value)}><option value="">All companies</option>{companies.map(x=><option key={x}>{x}</option>)}</select>
        <select value={p.provider} onChange={e=>p.setProvider(e.target.value)}><option value="">All providers</option>{p.providers.map(x=><option key={x.name}>{x.name}</option>)}</select>
        <select value={p.capability} onChange={e=>p.setCapability(e.target.value)}><option value="">All capabilities</option>{capabilities.map(x=><option key={x}>{x}</option>)}</select>
        <select value={p.type} onChange={e=>p.setType(e.target.value)}><option value="">All types</option>{[...new Set(p.models.map(m=>m.type))].map(x=><option key={x}>{x}</option>)}</select>
        <select value={p.sort} onChange={e=>p.setSort(e.target.value)}><option value="featured">Featured</option><option value="price_asc">Lowest input price</option><option value="price_desc">Highest input price</option><option value="context">Largest context</option><option value="newest">Newest release</option><option value="reasoning">Top reasoning</option></select>
      </div>
      {p.error&&<div className="error-box">{p.error}</div>}
      {p.loading?<div className="loading">Loading model catalogue…</div>:p.models.length===0?<div className="empty-state">No models match those filters. Try clearing a filter.</div>:
        <div className="model-grid">{p.models.map(m=><ModelCard key={m._id} model={m} selected={p.selected.includes(m._id)} onCompare={()=>p.toggleCompare(m._id)} onOpen={()=>p.openDetail(m)}/>)}</div>}
    </section>
  </>;
}

function Stat({icon:Icon,label,value,note}) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><Icon size={17}/></div><strong>{value}</strong><small>{note}</small></div>; }

function ModelCard({model:m,selected,onCompare,onOpen}) {
  return <article className="model-card"><div className="card-top"><div className={`model-logo ${m.company.toLowerCase().replace(/[^a-z]/g,"")}`}>{initials(m.company)}</div><div className="card-company"><b>{m.company}</b><small>{m.provider}</small></div><button className={`bookmark ${selected?"chosen":""}`} title="Add to comparison" onClick={onCompare}>{selected?<Check size={16}/>:<GitCompareArrows size={16}/>}</button></div>
    <button className="model-title" onClick={onOpen}>{m.name}<ArrowUpRightIcon/></button><p className="model-description">{m.description}</p>
    <div className="tag-row">{(m.capabilities||[]).slice(0,3).map(t=><span className="tag" key={t}>{t}</span>)}</div>
    <div className="card-metrics"><div><small>CONTEXT</small><b>{compact(m.contextWindow)}</b></div><div><small>INPUT / 1M</small><b>{money(m.inputPrice)}</b></div><div><small>OUTPUT / 1M</small><b>{money(m.outputPrice)}</b></div></div>
    <div className="card-bottom"><span className="type-label">{m.type}</span><button onClick={onOpen}>View details <ArrowRight size={14}/></button></div>
  </article>;
}
function ArrowUpRightIcon(){return <ChevronRight size={17}/>}

function RankingsPage({benchmark,setBenchmark,openDetail}) {
  const [items,setItems]=useState([]),[category,setCategory]=useState("");
  useEffect(()=>{const p=new URLSearchParams({benchmark});if(category)p.set("category",category);fetch(`${API}/rankings?${p}`).then(r=>r.json()).then(d=>setItems(d.items||[])).catch(()=>setItems([]));},[benchmark,category]);
  return <><PageIntro eyebrow="PERFORMANCE INDEX" title="Model rankings" subtitle="Explore model performance across benchmark dimensions. Scores shown are illustrative demo values."/>
    <div className="ranking-controls"><div className="tabs">{["reasoning","coding","math","knowledge"].map(x=><button className={benchmark===x?"selected":""} onClick={()=>setBenchmark(x)} key={x}>{x[0].toUpperCase()+x.slice(1)}</button>)}</div><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All capabilities</option>{["Reasoning","Coding","Math","Vision","Tool use"].map(x=><option key={x}>{x}</option>)}</select></div>
    <div className="panel"><div className="panel-head"><div><b>Leaderboard</b><small>Relative performance score · out of 100</small></div><span className="live-pill">DEMO DATA</span></div>
      {items.map((m,i)=><div className="rank-row" key={m._id} onClick={()=>openDetail(m)}><div className="rank-number">{String(i+1).padStart(2,"0")}</div><div className="model-logo tiny">{initials(m.company)}</div><div className="rank-name"><b>{m.name}</b><small>{m.company} · {m.provider}</small></div><div className="score-track"><span style={{width:`${m.benchmarks?.[benchmark]||0}%`}}/></div><b className="score">{m.benchmarks?.[benchmark]||0}</b><ChevronRight size={16}/></div>)}
      {items.length===0&&<div className="empty-state">No ranking data available. Check the API connection.</div>}
    </div>
  </>;
}

function ComparePage({items,selected,models,toggleCompare,openDetail,changePage}) {
  const [adding,setAdding]=useState(false);
  const available=models.filter(m=>!selected.includes(m._id));
  return <><PageIntro eyebrow="DECISION WORKSPACE" title="Compare models" subtitle="Evaluate pricing, context, capabilities and benchmark scores side by side."/>
    {items.length===0?<div className="empty-panel"><div className="empty-icon"><GitCompareArrows size={25}/></div><h3>Your comparison workspace is empty</h3><p>Add models from the discovery catalogue to compare their specifications.</p><button className="btn-primary" onClick={()=>changePage("Discover")}>Explore models <ArrowRight size={15}/></button></div>:
      <><div className="compare-header"><span>{items.length} of 4 models selected</span><button className="text-button" onClick={()=>setAdding(!adding)}><span>＋</span> Add model</button></div>
      {adding&&<div className="add-models">{available.map(m=><button key={m._id} onClick={()=>{toggleCompare(m._id);setAdding(false)}}>{m.name}<span>＋</span></button>)}</div>}
      <div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>SPECIFICATION</th>{items.map(m=><th key={m._id}><div className="compare-model-head"><div className="model-logo tiny">{initials(m.company)}</div><b>{m.name}</b><button onClick={()=>toggleCompare(m._id)}><X size={14}/></button></div></th>)}</tr></thead><tbody>
        <CompareRow label="Company" items={items} get={m=>m.company}/><CompareRow label="Provider" items={items} get={m=>m.provider}/><CompareRow label="Model type" items={items} get={m=>m.type}/><CompareRow label="Context window" items={items} get={m=>compact(m.contextWindow)}/><CompareRow label="Input / 1M tokens" items={items} get={m=>money(m.inputPrice)}/><CompareRow label="Output / 1M tokens" items={items} get={m=>money(m.outputPrice)}/><CompareRow label="Modalities" items={items} get={m=>(m.modalities||[]).join(", ")}/><CompareRow label="Capabilities" items={items} get={m=>(m.capabilities||[]).join(", ")}/>{["reasoning","coding","math","knowledge"].map(k=><CompareRow key={k} label={`${k[0].toUpperCase()+k.slice(1)} score`} items={items} get={m=>`${m.benchmarks?.[k]||0}/100`}/>)}
      </tbody></table></div></>}
  </>;
}
function CompareRow({label,items,get}){return <tr><td>{label}</td>{items.map(m=><td key={m._id}>{get(m)}</td>)}</tr>}

function DirectoryPage({title,subtitle,items,icon:Icon,empty}) {
  return <><PageIntro eyebrow="ECOSYSTEM DIRECTORY" title={title} subtitle={subtitle}/><div className="directory-grid">{items.map(item=><article className="directory-card" key={item._id||item.slug}><div className="directory-top"><div className="directory-icon"><Icon size={21}/></div><span className="directory-count">{item.modelCount||0} models</span></div><h3>{item.name}</h3><p>{item.description}</p><div className="directory-foot"><span>{item.region||item.headquarters||"AI ecosystem"}</span>{item.website&&<a href={item.website} target="_blank" rel="noreferrer">Website <ExternalLink size={13}/></a>}</div></article>)}{items.length===0&&<div className="empty-state">{empty} Check the API connection.</div>}</div></>;
}

function PageIntro({eyebrow,title,subtitle}){return <div className="page-intro"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>}

function DetailPanel({model:m,onClose,onCompare}) {
  return <div className="detail-backdrop" onClick={onClose}><aside className="detail-panel" onClick={e=>e.stopPropagation()}><div className="detail-head"><span>MODEL SPECIFICATION</span><button className="icon-btn" onClick={onClose}><X size={19}/></button></div><div className="detail-identity"><div className="model-logo large">{initials(m.company)}</div><div><span className="type-label">{m.type}</span><h2>{m.name}</h2><p>{m.company} · {m.provider}</p></div></div><p className="detail-description">{m.description}</p><div className="detail-section"><h3>Core specifications</h3><div className="spec-grid"><div><small>Context window</small><b>{Number(m.contextWindow).toLocaleString()} tokens</b></div><div><small>Release date</small><b>{m.releaseDate?new Date(m.releaseDate).toLocaleDateString():"Not listed"}</b></div><div><small>Input price / 1M</small><b>{money(m.inputPrice)}</b></div><div><small>Output price / 1M</small><b>{money(m.outputPrice)}</b></div></div></div><div className="detail-section"><h3>Modalities</h3><div className="tag-row">{(m.modalities||[]).map(x=><span className="tag" key={x}>{x}</span>)}</div></div><div className="detail-section"><h3>Capabilities</h3><div className="tag-row">{(m.capabilities||[]).map(x=><span className="tag" key={x}>{x}</span>)}</div></div><div className="detail-section"><h3>Benchmark snapshot <span className="demo-note">Illustrative</span></h3>{Object.entries(m.benchmarks||{}).map(([k,v])=><div className="benchmark-line" key={k}><span>{k}</span><div className="score-track"><span style={{width:`${v}%`}}/></div><b>{v}</b></div>)}</div><div className="detail-section"><h3>Available providers</h3>{(m.providerOptions||[]).map(p=><div className="provider-option" key={p.name}><span>{p.name}</span><b>{money(p.inputPrice)} / {money(p.outputPrice)}</b></div>)}</div><button className="btn-primary full" onClick={onCompare}><GitCompareArrows size={16}/> Add to comparison</button><p className="detail-disclaimer">Pricing and benchmark values are sample data for this MVP and may not reflect current provider information.</p></aside></div>;
}

export default App;
