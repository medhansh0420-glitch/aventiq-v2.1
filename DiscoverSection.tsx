

'use client';
import {useMemo,useState} from 'react';
import {Search,SlidersHorizontal,Bookmark} from 'lucide-react';
import {OPPORTUNITIES,OpportunityCategory,EducationLevel} from '@/data/opportunities';
import {useSavedOpportunities} from '@/hooks/useSavedOpportunities';
const CATEGORIES:OpportunityCategory[]=['Scholarship','Competition','Research','Internship','Entrepreneurship','Hackathon','Volunteering','Fellowship'];
const LOCATIONS=['Global','Remote','USA','UK','Europe','Asia','Africa','India','Canada','Australia'];
const EDUCATION_LEVELS:EducationLevel[]=['High School','Undergraduate','Graduate','Postgraduate'];
const todayISO = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth()+1).padStart(2,'0');
  const d = String(now.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
};
const isActiveOpportunity = (deadline:string,status:string) => {
  if(status === 'Closed') return false;
  if(/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return deadline >= todayISO();
  return true;
};
const daysUntil = (deadline:string) => {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return 9999;
  const today = new Date(`${todayISO()}T00:00:00`);
  const end = new Date(`${deadline}T00:00:00`);
  return Math.max(0, Math.ceil((end.getTime()-today.getTime())/86400000));
};
export default function DiscoverSection(){
  const {toggleSave,isSaved}=useSavedOpportunities();
  const [query,setQuery]=useState(''),[category,setCategory]=useState<OpportunityCategory|'All'>('All'),[location,setLocation]=useState('All'),[days,setDays]=useState(9999),[education,setEducation]=useState<EducationLevel|'All'>('All'),[freeOnly,setFreeOnly]=useState(false),[show,setShow]=useState(false);
  const filtered=useMemo(()=>OPPORTUNITIES.filter(o=>isActiveOpportunity(o.deadline,o.status)).filter(o=>{const q=query.trim().toLowerCase();const remaining=daysUntil(o.deadline);return(!q||[o.title,o.organization,o.description,o.category,o.location].join(' ').toLowerCase().includes(q))&&(category==='All'||o.category===category)&&(location==='All'||o.location===location)&&remaining<=days&&(education==='All'||o.educationLevel.includes(education))}).sort((a,b)=>daysUntil(a.deadline)-daysUntil(b.deadline)),[query,category,location,days,education]);
  const clear=()=>{setQuery('');setCategory('All');setLocation('All');setDays(9999);setEducation('All');setFreeOnly(false)};
  return <section id="discover" className="section container">
    <div className="section-head"><div><div className="section-kicker">Discover</div><h2>Opportunities with a reason to care.</h2></div><p>Search the current AventIQ collection. Always verify details on the official source before applying.</p></div>
    <div className="toolbar">
      <div className="searchrow">
        <div className="searchbox"><Search className="searchicon" size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by opportunity, organization, skill..."/></div>
        <button className="filterbtn" onClick={()=>setShow(!show)}><SlidersHorizontal size={15} style={{verticalAlign:'-2px',marginRight:7}}/>Filters</button>
        <button className="filterbtn" onClick={clear}>Reset</button>
      </div>
      {show&&<div className="filters">
        <select value={category} onChange={e=>setCategory(e.target.value as any)}><option value="All">All categories</option>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select>
        <select value={location} onChange={e=>setLocation(e.target.value)}><option>All locations</option>{LOCATIONS.map(x=><option key={x}>{x}</option>)}</select>
        <select value={days} onChange={e=>setDays(+e.target.value)}><option value="14">Next 14 days</option><option value="30">Next 30 days</option><option value="60">Next 60 days</option><option value="9999">Any time</option></select>
        <select value={education} onChange={e=>setEducation(e.target.value as any)}><option value="All">All education</option>{EDUCATION_LEVELS.map(x=><option key={x}>{x}</option>)}</select>
      </div>}
      <div style={{display:'flex',alignItems:'center',gap:7,marginTop:10,fontSize:12,color:'var(--muted)'}}>
        <input id="free" type="checkbox" checked={freeOnly} onChange={e=>setFreeOnly(e.target.checked)}/><label htmlFor="free">Free only</label>
        <span style={{marginLeft:'auto'}}>{filtered.length} active opportunities</span>
      </div>
    </div>
    <div className="cards">
    {filtered.map(o=><article className="opp-card" key={o.id}>
      <div className="cardtop"><div><div className="meta">{o.category} · {o.location}</div><h3>{o.title}</h3><div className="org">{o.organization}</div></div>
        <button className={'save '+(isSaved(o.id)?'active':'')} onClick={()=>toggleSave(o.id)} aria-label="Save opportunity"><Bookmark size={18} fill={isSaved(o.id)?'currentColor':'none'}/></button>
      </div>
      <p className="desc">{o.description}</p>
      <div className="tags">{[o.category].map(t=><span className="tag" key={t}>{t}</span>)}</div>
      <div className="bottom"><span className="deadline">{daysUntil(o.deadline)<=7?'Closing soon · ':''}{o.deadline}</span>{o.status!=='Closed'?<a className="apply" href={o.url} target="_blank" rel="noreferrer">View & apply ↗</a>:<span className="meta">Closed</span>}</div>
    </article>)}
    </div>
    {!filtered.length&&<div className="empty">No active opportunities match those filters. Try resetting the search.</div>}
  </section>
}
