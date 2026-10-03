import DiscoverSection from '@/components/DiscoverSection';

export default function Home(){
  return <main className="grid-bg" style={{minHeight:'100vh'}}>
    <header className="nav container">
      <a href="#" className="brand"><span className="brandmark">A</span>AventIQ</a>
      <nav className="navlinks"><a href="#discover">Discover</a><a href="#how">How it works</a><a href="#about">About</a></nav>
      <a href="#discover" className="secondary" style={{padding:'9px 13px',fontSize:13}}>Explore</a>
    </header>

    <section className="hero container">
      <div className="eyebrow"><span className="dot"/> Opportunity intelligence for ambitious students</div>
      <h1>Find the opportunities <span>worth your time.</span></h1>
      <p>Scholarships, competitions, research, internships and more — brought together so you can spend less time searching and more time applying.</p>
      <div className="hero-actions">
        <a href="#discover" className="primary">Explore opportunities →</a>
        <a href="#how" className="secondary">See how it works</a>
      </div>
      <div className="stats">
        <div className="stat"><strong>Curated</strong><span>Opportunities organized for discovery</span></div>
        <div className="stat"><strong>Filterable</strong><span>Find by category, location and fit</span></div>
        <div className="stat"><strong>Actionable</strong><span>Go from discovery to official application</span></div>
      </div>
    </section>

    <DiscoverSection/>

    <section id="how" className="section container">
      <div className="section-head"><div><div className="section-kicker">Simple by design</div><h2>From “what's out there?” to “I'm applying.”</h2></div>
      <p>AventIQ is built around the moment after discovery: understanding whether an opportunity fits, then taking the next step.</p></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:15}}>
        {[
          ['01','Discover','Search a focused collection instead of opening dozens of tabs.'],
          ['02','Filter','Narrow opportunities by what actually matters to you.'],
          ['03','Act','Read the essentials and jump to the official application.']
        ].map(([n,t,d])=><div key={n} style={{background:'white',border:'1px solid var(--line)',borderRadius:18,padding:22}}>
          <div style={{fontSize:11,color:'var(--accent)',fontWeight:700}}>{n}</div><h3 style={{fontFamily:'Space Grotesk',fontSize:22,margin:'22px 0 8px'}}>{t}</h3><p style={{color:'var(--muted)',fontSize:13,lineHeight:1.55,margin:0}}>{d}</p>
        </div>)}
      </div>
    </section>

    <section id="about" className="container" style={{padding:'35px 0 85px'}}>
      <div style={{background:'var(--ink)',color:'white',borderRadius:22,padding:'38px 34px',display:'flex',justifyContent:'space-between',gap:30,alignItems:'end',flexWrap:'wrap'}}>
        <div><div style={{fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:'#9fb7ff',fontWeight:700}}>AventIQ V2</div>
        <h2 style={{fontFamily:'Space Grotesk',fontSize:'clamp(28px,4vw,46px)',margin:'8px 0 10px',letterSpacing:'-.035em'}}>Your next opportunity should not be buried in a search result.</h2>
        <p style={{color:'#aeb7c8',maxWidth:600,lineHeight:1.55,margin:0}}>A calmer, clearer way to discover what could be next.</p></div>
        <a href="#discover" style={{background:'white',color:'var(--ink)',padding:'12px 16px',borderRadius:11,fontWeight:700,fontSize:13}}>Start exploring →</a>
      </div>
    </section>

    <footer><div className="container">AventIQ · Verify deadlines, eligibility and application details on the official source before applying.</div></footer>
  </main>
}