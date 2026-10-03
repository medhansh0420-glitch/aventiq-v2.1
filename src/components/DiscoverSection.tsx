'use client';
import {useMemo,useState} from 'react';
import {Search,SlidersHorizontal,Bookmark} from 'lucide-react';
import {OPPORTUNITIES,OpportunityCategory,EducationLevel} from '@/data/opportunities';
import {useSavedOpportunities} from '@/hooks/useSavedOpportunities';

const CATEGORIES:OpportunityCategory[]=['Scholarship','Competition','Research','Internship','Entrepreneurship','Hackathon','Volunteering','Fellowship'];
const LOCATIONS=['Global','Remote','USA','UK','Europe','Asia','Africa','India','Canada','Australia'];
const EDUCATION_LEVELS:EducationLevel[]=['High School','Undergraduate','Graduate','Postgraduate'];

export default function DiscoverSection(){
 const {toggleSave,isSaved}=useSavedOpportunities();
 const [query,setQuery]=useState(''),[category,setCategory]=useState<OpportunityCategory|'All'>('All'),[location,setLocation]=useState('All'),[days,setDays]=useState(9999),[education,setEducation]=useState<EducationLevel|'All'>('All'),[freeOnly,setFreeOnly]=useState(false),[show,setShow]=useState(false);
 const filtered=useMemo(()=>OPPORTUNITIES.filter(o=>o.status!=='Closed').filter(o=>{const q=query.trim().toLowerCase();return(!q||[o.title,o.organization,o.description,...o.tags].join(' ').toLowerCase().includes(q))&&(category==='All'||o.category===category)&&(location==='All'||o.locationTag===location)&&o.deadlineDaysLeft<=days&&(education==='All'||o.educationLevel.includes(education))&&(!freeOnly||o.isFree)}).sort((a,b)=>a.deadlineDaysLeft-b.deadlineDaysLeft),[query,category,location,days,education,freeOnly]);
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
     <div className="tags">{o.tags.slice(0,3).map(t=><span className="tag" key={t}>{t}</span>)}</div>
     <div className="bottom"><span className="deadline">{o.deadlineDaysLeft<=7?'Closing soon · ':''}{o.deadline}</span>{o.status!=='Closed'?<a className="apply" href={o.applicationUrl} target="_blank" rel="noreferrer">View & apply ↗</a>:<span className="meta">Closed</span>}</div>
   </article>)}
   </div>
   {!filtered.length&&<div className="empty">No active opportunities match those filters. Try resetting the search.</div>}
 </section>
}