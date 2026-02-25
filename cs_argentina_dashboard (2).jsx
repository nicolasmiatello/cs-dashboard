import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const R="#cc0000";
const C={femsa:"#ee0000",lee:"#ff6b6b",andina:"#ff7043",arca:"#e68e02",arg:"#888888"};
const BM={Femsa:C.femsa,Lee:C.lee,Andina:C.andina,Arca:C.arca};

const TR={
  "TOTAL CANAL":[
    {m:"Ene'25",F:85.6,L:85.9,A:78.7,AR:83.3,T:81.6},{m:"Feb'25",F:89.7,L:87.9,A:79.6,AR:86.9,T:83.4},
    {m:"Mar'25",F:88.8,L:91.7,A:72.0,AR:81.8,T:78.6},{m:"Abr'25",F:85.9,L:90.5,A:80.5,AR:88.2,T:83.9},
    {m:"May'25",F:89.2,L:92.0,A:86.1,AR:86.3,T:87.3},{m:"Jun'25",F:93.8,L:93.8,A:87.9,AR:89.4,T:90.0},
    {m:"Jul'25",F:90.8,L:91.6,A:89.6,AR:88.8,T:89.9},{m:"Ago'25",F:88.5,L:92.5,A:90.9,AR:90.8,T:90.2},
    {m:"Sep'25",F:84.4,L:91.8,A:82.5,AR:90.0,T:85.1},{m:"Oct'25",F:85.0,L:92.9,A:86.0,AR:84.6,T:85.8},
    {m:"Nov'25",F:85.7,L:91.2,A:87.0,AR:85.2,T:86.5},{m:"Dic'25",F:85.3,L:93.8,A:82.1,AR:85.1,T:84.3},
    {m:"Ene'26",F:86.5,L:89.2,A:81.6,AR:79.0,T:83.9},
  ],
  GDN:[
    {m:"Ene'25",F:83.5,L:88.0,A:82.0,AR:82.0,T:83.0},{m:"Feb'25",F:87.0,L:90.0,A:84.0,AR:85.0,T:85.5},
    {m:"Mar'25",F:86.0,L:92.0,A:79.0,AR:83.0,T:83.0},{m:"Abr'25",F:84.5,L:91.0,A:81.5,AR:86.0,T:84.0},
    {m:"May'25",F:88.0,L:93.0,A:85.0,AR:87.0,T:87.5},{m:"Jun'25",F:92.0,L:94.5,A:87.0,AR:89.0,T:90.5},
    {m:"Jul'25",F:90.0,L:92.5,A:88.5,AR:88.0,T:89.5},{m:"Ago'25",F:87.0,L:93.0,A:89.0,AR:90.0,T:89.5},
    {m:"Sep'25",F:83.0,L:92.0,A:82.0,AR:89.5,T:85.0},{m:"Oct'25",F:84.0,L:93.5,A:85.0,AR:84.0,T:85.5},
    {m:"Nov'25",F:84.5,L:92.0,A:86.0,AR:85.0,T:86.0},{m:"Dic'25",F:84.0,L:93.5,A:82.0,AR:84.0,T:84.0},
    {m:"Ene'26",F:85.9,L:90.0,A:83.7,AR:85.8,T:85.4},
  ],
  CRF:[
    {m:"Ene'25",F:83.0,L:87.0,A:81.0,AR:71.0,T:81.6},{m:"Feb'25",F:86.5,L:89.0,A:82.0,AR:75.0,T:82.5},
    {m:"Mar'25",F:84.0,L:90.5,A:75.0,AR:72.0,T:79.0},{m:"Abr'25",F:83.5,L:89.0,A:80.0,AR:76.0,T:82.0},
    {m:"May'25",F:87.0,L:91.0,A:85.0,AR:78.0,T:85.0},{m:"Jun'25",F:91.5,L:92.5,A:86.5,AR:80.0,T:88.5},
    {m:"Jul'25",F:89.0,L:90.0,A:88.0,AR:79.0,T:87.5},{m:"Ago'25",F:86.5,L:91.5,A:89.0,AR:80.5,T:87.0},
    {m:"Sep'25",F:83.5,L:90.0,A:82.5,AR:80.0,T:84.0},{m:"Oct'25",F:84.0,L:92.0,A:85.0,AR:75.0,T:84.5},
    {m:"Nov'25",F:84.5,L:91.0,A:85.5,AR:74.0,T:84.5},{m:"Dic'25",F:84.5,L:92.0,A:83.5,AR:73.0,T:83.5},
    {m:"Ene'26",F:86.0,L:88.6,A:86.5,AR:74.4,T:85.3},
  ],
  CENCOSUD:[
    {m:"Ene'25",F:88.0,L:88.0,A:76.0,AR:78.0,T:82.7},{m:"Jun'25",F:93.5,L:93.5,A:83.0,AR:84.5,T:89.5},
    {m:"Sep'25",F:88.5,L:92.0,A:79.5,AR:84.0,T:85.5},{m:"Dic'25",F:91.0,L:93.0,A:78.5,AR:80.5,T:85.0},
    {m:"Ene'26",F:92.1,L:90.1,A:77.9,AR:79.3,T:84.1},
  ],
  LIBERTAD:[{m:"Ene'25",F:null,L:null,A:78.0,AR:72.0,T:76.0},{m:"Ene'26",F:98.3,L:null,A:84.6,AR:73.4,T:79.1}],
  "LA ANONIMA":[{m:"Ene'25",F:null,L:null,A:76.0,AR:null,T:76.0},{m:"Ene'26",F:97.8,L:null,A:78.3,AR:null,T:78.4}],
  DIA:[{m:"Ene'26",F:84.7,L:null,A:null,AR:null,T:84.7}],
};

const YTD={
  "TOTAL CANAL":{F:86.5,L:89.2,A:81.6,AR:79.0,T:83.9},
  GDN:{F:85.9,L:90.0,A:83.7,AR:85.8,T:85.4},
  CRF:{F:86.0,L:88.6,A:86.5,AR:74.4,T:85.3},
  LIBERTAD:{F:98.3,A:84.6,AR:73.4,T:79.1},
  CENCOSUD:{F:92.1,L:90.1,A:77.9,AR:79.3,T:84.1},
  "LA ANONIMA":{F:97.8,A:78.3,T:78.4},
  DIA:{F:84.7,T:84.7},
};

const LS=[{k:"F",lb:"Femsa",c:C.femsa},{k:"L",lb:"Reg. Lee",c:C.lee},{k:"A",lb:"Andina",c:C.andina},{k:"AR",lb:"Arca",c:C.arca},{k:"T",lb:"ARG",c:C.arg}];

const BAR={
  ARG:[{n:"GDN",a:83.0,b:85.4},{n:"CRF",a:81.6,b:85.3},{n:"Cencosud",a:82.7,b:84.1},{n:"Libertad",a:76.0,b:79.1},{n:"La Anonima",a:81.3,b:78.4},{n:"Dia",a:null,b:84.7}],
  FEMSA:[{n:"GDN",a:83.5,b:85.9},{n:"CRF",a:83.0,b:86.0},{n:"Cencosud",a:88.0,b:92.1},{n:"Libertad",a:null,b:98.3},{n:"La Anonima",a:null,b:97.8},{n:"Dia",a:null,b:84.7}],
  LEE:[{n:"GDN",a:88.0,b:90.0},{n:"CRF",a:87.0,b:88.6},{n:"Cencosud",a:88.0,b:90.1},{n:"Libertad",a:null,b:null},{n:"La Anonima",a:null,b:null},{n:"Dia",a:null,b:null}],
  ANDINA:[{n:"GDN",a:82.0,b:83.7},{n:"CRF",a:81.0,b:86.5},{n:"Cencosud",a:76.0,b:77.9},{n:"Libertad",a:78.0,b:84.6},{n:"La Anonima",a:76.0,b:78.3},{n:"Dia",a:null,b:null}],
  ARCA:[{n:"GDN",a:82.0,b:85.8},{n:"CRF",a:71.0,b:74.4},{n:"Cencosud",a:78.0,b:79.3},{n:"Libertad",a:72.0,b:73.4},{n:"La Anonima",a:null,b:null},{n:"Dia",a:null,b:null}],
};

const RNK=[
  {c:"GDN",f:85.4,p:83.0,b:{Femsa:85.9,Andina:83.7,Lee:90.0,Arca:85.8}},
  {c:"CRF",f:85.3,p:81.6,b:{Femsa:86.0,Andina:86.5,Lee:88.6,Arca:74.4}},
  {c:"Dia",f:84.7,p:null,b:{Femsa:84.7}},
  {c:"Cencosud",f:84.1,p:82.7,b:{Femsa:92.1,Andina:77.9,Lee:90.1,Arca:79.3}},
  {c:"Libertad",f:79.1,p:76.0,b:{Femsa:98.3,Andina:84.6,Arca:73.4}},
  {c:"La Anonima",f:78.4,p:81.3,b:{Andina:78.3,Femsa:97.8}},
].sort((a,b)=>b.f-a.f);

const DLT=[{n:"Reg. Lee",d:3.3,c:C.lee},{n:"Andina",d:2.9,c:C.andina},{n:"Femsa",d:0.9,c:C.femsa},{n:"Arca",d:-4.3,c:C.arca}];

const BYTD=[
  {n:"Reg. Lee",v:89.2,c:C.lee,s:{GDN:90.0,CRF:88.6,Cencosud:90.1}},
  {n:"Femsa",v:86.5,c:C.femsa,s:{GDN:85.9,CRF:86.0,Cencosud:92.1,Libertad:98.3,"La An.":97.8,Dia:84.7}},
  {n:"ARG Total",v:83.9,c:C.arg,s:{GDN:85.4,CRF:85.3,Cencosud:84.1,Libertad:79.1,"La An.":78.4,Dia:84.7}},
  {n:"Andina",v:81.6,c:C.andina,s:{GDN:83.7,CRF:86.5,Cencosud:77.9,Libertad:84.6,"La An.":78.3}},
  {n:"Arca",v:79.0,c:C.arca,s:{GDN:85.8,CRF:74.4,Cencosud:79.3,Libertad:73.4}},
];

const CYTD=[
  {n:"GDN",v:85.4,c:R,s:{Femsa:85.9,Andina:83.7,Lee:90.0,Arca:85.8}},
  {n:"CRF",v:85.3,c:R,s:{Femsa:86.0,Andina:86.5,Lee:88.6,Arca:74.4}},
  {n:"Dia",v:84.7,c:R,s:{Femsa:84.7}},
  {n:"Cencosud",v:84.1,c:R,s:{Femsa:92.1,Andina:77.9,Lee:90.1,Arca:79.3}},
  {n:"Libertad",v:79.1,c:R,s:{Femsa:98.3,Andina:84.6,Arca:73.4}},
  {n:"La Anonima",v:78.4,c:R,s:{Andina:78.3,Femsa:97.8}},
];

const RCARS={
  LEE:{lb:"Reg. Lee",sh:"LEE",c:C.lee,n:"1"},
  FEMSA:{lb:"Femsa",sh:"FEM",c:C.femsa,n:"4"},
  ANDINA:{lb:"Andina",sh:"AND",c:C.andina,n:"11"},
  ARCA:{lb:"Arca",sh:"ARC",c:C.arca,n:"44"},
};
const RDATA=[{m:"Ene'26",FEMSA:86.5,LEE:89.2,ANDINA:81.6,ARCA:79.0}];

function pct(v){return Math.min(96,Math.max(0,((v-68)/28)*96));}

function Tag({lb,v,c,sub}){
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:4,background:c+"18",border:"1px solid "+c+"44",borderRadius:12,padding:"3px 9px",fontSize:12,color:c,fontWeight:800,whiteSpace:"nowrap"}}>
      {lb} {v.toFixed(1)}%
    </span>
  );
}

function Car({c,n,spd}){
  return(
    <svg width={90} height={30} viewBox="0 0 120 40" style={{overflow:"visible"}}>
      {spd&&<g><line x1={6} y1={16} x2={-12} y2={16} stroke={c} strokeWidth={1.5} opacity={0.6} strokeDasharray="4 3"/><line x1={6} y1={20} x2={-18} y2={20} stroke={c} strokeWidth={1} opacity={0.35} strokeDasharray="6 4"/></g>}
      <rect x={3} y={3} width={9} height={5} rx={1.5} fill={c}/>
      <path d="M10 11 L20 8 L65 8 L76 12 L78 18 L76 24 L65 27 L20 27 L10 23Z" fill={c}/>
      <path d="M20 8 L65 8 L65 10 L20 10Z" fill="rgba(255,255,255,.2)"/>
      <path d="M38 10 L43 4 L57 4 L62 10" fill="#0c0c0c" stroke={c} strokeWidth={0.8}/>
      <path d="M43 4 Q50 0.5 57 4" fill="none" stroke={c} strokeWidth={2.5} strokeLinecap="round"/>
      <text x={34} y={20} fontSize={7} fontWeight={900} fill="rgba(255,255,255,.6)" fontFamily="monospace" textAnchor="middle">{n}</text>
      <path d="M88 13 L107 11 L110 15 L110 21 L107 25 L88 23Z" fill={c}/>
      <ellipse cx={22} cy={26} rx={5} ry={9} fill="#111" stroke={c} strokeWidth={2}/>
      <ellipse cx={22} cy={26} rx={2} ry={5} fill={c}/>
      <ellipse cx={82} cy={26} rx={4} ry={8} fill="#111" stroke={c} strokeWidth={2}/>
      <ellipse cx={82} cy={26} rx={1.5} ry={4} fill={c}/>
    </svg>
  );
}

export default function App(){
  const [dark,setDark]=useState(true);
  const [view,setView]=useState("TOTAL CANAL");
  const [act,setAct]=useState({F:true,L:true,A:true,AR:true,T:true});
  const [ytdT,setYtdT]=useState("b");
  const [bflt,setBflt]=useState("ARG");
  const [lap,setLap]=useState(0);
  const [play,setPlay]=useState(false);
  const [spd,setSpd]=useState(1000);
  const [lph,setLph]=useState(0);
  const [strt,setStrt]=useState(false);
  const rr=useRef(null);
  const lr=useRef(null);

  const bg=dark?"#111":"#f4f4f4";
  const cd=dark?"#1a1a1a":"#fff";
  const br=dark?"#2a2a2a":"#e5e5e5";
  const tx=dark?"#f0f0f0":"#111";
  const sb=dark?"#555":"#999";

  useEffect(()=>{
    clearInterval(rr.current);
    if(play){rr.current=setInterval(()=>setLap(l=>{if(l>=RDATA.length-1){setPlay(false);return l;}return l+1;}),spd);}
    return()=>{clearInterval(rr.current);clearInterval(lr.current);};
  },[play,spd]);

  function doPlay(){
    if(play){setPlay(false);return;}
    if(!strt||lap===0){
      setStrt(true);setLph(0);let ph=0;
      lr.current=setInterval(()=>{ph++;setLph(ph);if(ph>=6){clearInterval(lr.current);setTimeout(()=>{setLph(0);setPlay(true);},600);}},350);
    } else setPlay(true);
  }
  function doReset(){setPlay(false);setStrt(false);setLph(0);setLap(0);clearInterval(rr.current);clearInterval(lr.current);}

  const cd2=TR[view]||TR["TOTAL CANAL"];
  const ytd=YTD[view]||{};
  const yi=ytdT==="b"?BYTD:CYTD;
  const bd=BAR[bflt]||BAR.ARG;
  const bc=bflt==="ARG"?R:(C[bflt.toLowerCase()]||R);
  const cur=RDATA[lap];
  const rnkd=Object.entries(RCARS).map(([k,v])=>({k,...v})).sort((a,b)=>(cur[b.k]||0)-(cur[a.k]||0));
  const VIEWS=["TOTAL CANAL","GDN","CRF","LIBERTAD","CENCOSUD","LA ANONIMA","DIA"];

  function sb2(on,col){return{padding:"4px 9px",borderRadius:14,fontSize:10,fontWeight:700,cursor:"pointer",border:"1.5px solid "+(on?col:br),background:on?col+"22":cd,color:on?col:tx,whiteSpace:"nowrap"};}
  function sb3(on,col){return{padding:"4px 9px",borderRadius:14,fontSize:10,fontWeight:700,cursor:"pointer",border:"1.5px solid "+(on?col:col+"66"),background:on?col+"22":cd,color:col,whiteSpace:"nowrap"};}

  return(
    <div style={{background:bg,color:tx,fontFamily:"sans-serif",minHeight:"100vh"}}>

      {/* HEADER */}
      <div style={{background:R,padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <h1 style={{margin:0,fontSize:16,color:"#fff",fontFamily:"monospace",letterSpacing:1}}>CS DASHBOARD · ARGENTINA · COCA-COLA</h1>
        <button onClick={()=>setDark(d=>!d)} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:6,padding:"5px 12px",color:"#fff",cursor:"pointer",fontSize:11}}>
          {dark?"Modo Claro":"Modo Oscuro"}
        </button>
      </div>

      <div style={{padding:"14px 20px",display:"flex",flexDirection:"column",gap:14}}>

        {/* ROW 1: KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
          {[
            {lb:"ARG Total",v:"83.9%",s:"YTD",c:C.arg,d:"+2.3pp"},
            {lb:"Femsa",v:"86.5%",s:"Ene'26",c:C.femsa,d:"+0.9pp"},
            {lb:"Reginald Lee",v:"89.2%",s:"Ene'26",c:C.lee,d:"+3.3pp"},
            {lb:"Andina",v:"81.6%",s:"Ene'26",c:C.andina,d:"+2.9pp"},
            {lb:"Arca",v:"79.0%",s:"Ene'26",c:C.arca,d:"-4.3pp"},
          ].map((k,i)=>{
            const isP=k.d.startsWith("+");
            const dc=isP?"#22c55e":"#f70505";
            const arrow=isP?"▲":"▼";
            return(
              <div key={i} style={{background:cd,border:"1px solid "+br,borderRadius:12,padding:"14px 16px",borderTop:"3px solid "+k.c}}>
                <div style={{fontSize:11,color:sb,marginBottom:4}}>{k.lb}</div>
                <div style={{fontSize:32,fontWeight:900,color:dark?"#ffffff":"#111111",lineHeight:1,letterSpacing:-0.5}}>{k.v}</div>
                <div style={{fontSize:10,color:sb,marginTop:3,marginBottom:6}}>{k.s}</div>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:14,color:dc,lineHeight:1}}>{arrow}</span>
                  <span style={{fontSize:12,fontWeight:800,color:dc}}>{k.d.replace(/^[+-]/,"")} vs Ene 25</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ROW 2: LINE CHART */}
        <div style={{background:cd,border:"1px solid "+br,borderRadius:14,padding:"14px 18px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:tx,fontFamily:"monospace",letterSpacing:1}}>EVOLUCION FILL RATE MENSUAL</div>
              <div style={{fontSize:10,color:sb}}>{view}</div>
            </div>
            <div style={{display:"flex",gap:3,flexWrap:"nowrap"}}>
              {VIEWS.map(v=><button key={v} onClick={()=>setView(v)} style={sb2(view===v,R)}>{v}</button>)}
            </div>
          </div>
          <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
            {LS.map(s=><button key={s.k} onClick={()=>setAct(a=>({...a,[s.k]:!a[s.k]}))} style={sb2(act[s.k],s.c)}>{s.lb}</button>)}
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={cd2} margin={{top:16,right:16,left:0,bottom:0}}>
              <XAxis dataKey="m" tick={{fill:sb,fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:sb,fontSize:9}} axisLine={false} tickLine={false} domain={["auto","auto"]} tickFormatter={v=>v+"%"}/>
              <Tooltip formatter={v=>v?v.toFixed(1)+"%":"N/D"} contentStyle={{background:cd,border:"1px solid "+br,borderRadius:6,color:tx,fontSize:11}}/>
              {LS.map(s=>act[s.k]&&(
                <Line key={s.k} type="monotone" dataKey={s.k} stroke={s.c} strokeWidth={2} dot={{r:2,fill:s.c}} connectNulls={false}>
                  <LabelList dataKey={s.k} position="top" style={{fill:s.c,fontSize:11,fontWeight:800}} formatter={v=>v!=null?v.toFixed(1):""}/>
                </Line>
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",paddingTop:8,borderTop:"1px solid "+br}}>
            {LS.map(s=>ytd[s.k]!=null&&(
              <span key={s.k} style={{fontSize:11,color:sb,display:"flex",alignItems:"center",gap:4}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:s.c,display:"inline-block"}}/>
                {s.lb} <b style={{color:s.c}}>{ytd[s.k].toFixed(1)}%</b>
              </span>
            ))}
          </div>
        </div>

        {/* ROW 3: BAR + DELTA + IN STOCK */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 220px 200px",gap:14}}>
          <div style={{background:cd,border:"1px solid "+br,borderRadius:14,padding:"14px 18px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:800,color:tx,fontFamily:"monospace"}}>FILL RATE POR CLIENTE</div>
              <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                {[{k:"ARG",l:"ARG",c:C.arg},{k:"FEMSA",l:"Femsa",c:C.femsa},{k:"LEE",l:"Lee",c:C.lee},{k:"ANDINA",l:"Andina",c:C.andina},{k:"ARCA",l:"Arca",c:C.arca}].map(b=>(
                  <button key={b.k} onClick={()=>setBflt(b.k)} style={sb3(bflt===b.k,b.c)}>{b.l}</button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bd} margin={{top:52,right:36,left:0,bottom:0}} barCategoryGap="15%" barGap={3}>
                <XAxis dataKey="n" tick={{fill:sb,fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:sb,fontSize:10}} axisLine={false} tickLine={false} domain={[60,100]} tickFormatter={v=>v+"%"}/>
                <Tooltip formatter={v=>v?v.toFixed(1)+"%":"N/D"} contentStyle={{background:cd,border:"1px solid "+br,borderRadius:6,color:tx,fontSize:11}}/>
                <Bar dataKey="a" fill={dark?"#333":"#ddd"} opacity={1} radius={[3,3,0,0]}>
                  <LabelList dataKey="a" position="top" style={{fill:dark?"#aaa":"#666",fontSize:13}} formatter={v=>v?v.toFixed(1)+"%":""}/>
                </Bar>
                <Bar dataKey="b" fill={bc} radius={[3,3,0,0]}>
                  <LabelList dataKey="b" position="top" style={{fill:bc,fontSize:13,fontWeight:800}} formatter={v=>v?v.toFixed(1)+"%":""}/>
                  <LabelList dataKey="b" content={(props)=>{
                    const {x,y,width,value,index}=props;
                    const row=bd[index];
                    if(!value||!row.a) return null;
                    const d=+(value-row.a).toFixed(1);
                    const isP=d>=0;
                    const col=isP?"#22c55e":"#f70505";
                    return(
                      <text x={x+width/2} y={y-28} textAnchor="middle" fontSize={10} fontWeight={800} fill={col}>
                        {isP?"+":""}{d}pp
                      </text>
                    );
                  }}/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{background:cd,border:"1px solid "+br,borderRadius:14,padding:"14px 16px"}}>
            <div style={{fontSize:13,fontWeight:800,color:tx,fontFamily:"monospace",marginBottom:14}}>DELTA ENE'26 vs ENE'25</div>
            {DLT.map((row,i)=>{
              const ip=row.d>=0;const lc=ip?"#22c55e":"#f70505";const bp=Math.abs(row.d)/6*48;
              return(
                <div key={i} style={{padding:"10px 0",borderBottom:i<DLT.length-1?"1px solid "+br:"none"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:14,fontWeight:700,color:tx}}>{row.n}</span>
                    <span style={{fontSize:18,fontWeight:900,color:lc,letterSpacing:-0.5}}>{ip?"+":""}{row.d}pp</span>
                  </div>
                  <div style={{height:10,background:dark?"#222":"#eee",borderRadius:5,position:"relative"}}>
                    <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:2,background:dark?"#444":"#bbb"}}/>
                    <div style={{position:"absolute",top:1,bottom:1,left:"50%",width:bp+"%",background:lc,borderRadius:"0 5px 5px 0",minWidth:5}}/>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{background:cd,border:"1px solid "+br,borderRadius:14,padding:"14px 16px"}}>
            <div style={{fontSize:13,fontWeight:800,color:tx,fontFamily:"monospace",marginBottom:14}}>INSTOCK - ENE'26</div>
            {[{n:"Femsa",v:86.2,c:C.femsa},{n:"Reg. Lee",v:94.2,c:C.lee},{n:"Andina",v:89.4,c:C.andina},{n:"Arca",v:90.5,c:C.arca}].map((e,i)=>{
              const w=((e.v-68)/32)*100;
              return(
                <div key={i} style={{padding:"10px 0",borderBottom:i<3?"1px solid "+br:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:14,color:tx,fontWeight:700}}>{e.n}</span>
                    <span style={{fontSize:18,fontWeight:900,color:e.c,letterSpacing:-0.5}}>{e.v}%</span>
                  </div>
                  <div style={{height:10,background:dark?"#222":"#eee",borderRadius:5,overflow:"hidden"}}>
                    <div style={{width:w+"%",height:"100%",background:e.c,borderRadius:5}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 4: RANKING */}
        <div style={{background:cd,border:"1px solid "+br,borderRadius:14,padding:"14px 18px"}}>
          <div style={{fontSize:13,fontWeight:800,color:tx,fontFamily:"monospace",marginBottom:10}}>RANKING CLIENTES - ENE 2026</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {RNK.map((row,i)=>{
              const d=row.p!=null?+(row.f-row.p).toFixed(1):null;
              const ip=d!=null&&d>=0;
              const w=Math.max(4,((row.f-70)/30)*100);
              return(
                <div key={i} style={{background:dark?"#111":"#f8f8f8",border:"1px solid "+br,borderRadius:10,padding:"10px 12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:14,fontWeight:800,color:tx}}>{row.c}</span>
                    {d!=null&&<span style={{fontSize:11,fontWeight:700,color:ip?"#22c55e":"#f70505",background:ip?"rgba(34,197,94,.12)":"rgba(239,68,68,.12)",border:"1px solid "+(ip?"#22c55e":"#f70505"),borderRadius:6,padding:"1px 6px"}}>{ip?"+":""}{d}pp</span>}
                  </div>
                  <div style={{height:22,background:dark?"#222":"#eee",borderRadius:14,position:"relative",overflow:"hidden",marginBottom:8}}>
                    <div style={{width:w+"%",height:"100%",background:dark?"#444":"#ccc",borderRadius:14}}/>
                    <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:12,fontWeight:800,color:dark?"#fff":"#fff"}}>{row.f.toFixed(1)}%</span>
                  </div>
                  <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                    {Object.entries(row.b).map(([b,v])=><Tag key={b} lb={b} v={v} c={BM[b]||"#888"}/>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 5: YTD */}
        <div style={{background:cd,border:"1px solid "+br,borderRadius:14,padding:"14px 18px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{fontSize:13,fontWeight:800,color:tx,fontFamily:"monospace"}}>FILL RATE YTD 2026</div>
            <div style={{display:"flex",gap:4}}>
              <button onClick={()=>setYtdT("b")} style={sb2(ytdT==="b",R)}>POR BOTTLER</button>
              <button onClick={()=>setYtdT("c")} style={sb2(ytdT==="c",R)}>POR CADENA</button>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {yi.map((row,i)=>{
              const w=Math.max(8,((row.v-70)/30)*100);
              const bg2=dark?"#444":"#ccc";
              return(
                <div key={i} style={{display:"grid",gridTemplateColumns:"120px 1fr auto",gap:10,alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:row.c,flexShrink:0}}/>
                    <span style={{fontSize:13,fontWeight:700,color:tx}}>{row.n}</span>
                  </div>
                  <div style={{height:22,background:dark?"#222":"#eee",borderRadius:14,position:"relative",overflow:"hidden"}}>
                    <div style={{width:w+"%",height:"100%",background:bg2,borderRadius:14}}/>
                    <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:11,fontWeight:800,color:dark?"#ffffff":"#111111",textShadow:dark?"0 1px 2px rgba(0,0,0,.5)":"none"}}>{row.v.toFixed(1)}%</span>
                    <div style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",display:"flex",gap:3,flexWrap:"nowrap",overflow:"hidden"}}>
                      {Object.entries(row.s).map(([k,v])=><Tag key={k} lb={k} v={v} c={ytdT==="b"?"#888":(BM[k]||"#888")}/>)}
                    </div>
                  </div>
                  <span style={{fontSize:14,fontWeight:800,color:dark?"#ffffff":"#111111",width:48,textAlign:"right"}}>{row.v.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 6: F1 RACE */}
        {(()=>{
          const rBg=cd;
          const rHdr=dark?"linear-gradient(90deg,#111,#181818)":cd;
          const rTrack=dark?"#0a0a0a":bg;
          const rLane=dark?"rgba(255,255,255,.015)":"rgba(0,0,0,.03)";
          const rLaneBrd=br;
          const rSide=dark?"#0d0d0d":cd;
          const rSideBrd=br;
          const rNameCol=tx;
          const rSubCol=sb;
          const rGridLine=dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.06)";
          const rGridTxt=sb;
          const rCtrlBg=dark?"#1a1a1a":bg;
          const rCtrlBrd=br;
          return(
            <div style={{background:rBg,border:"1px solid "+rCtrlBrd,borderRadius:14,overflow:"hidden"}}>
              <div style={{background:rHdr,borderBottom:"2px solid "+R,padding:"10px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{background:R,color:"#fff",fontWeight:900,fontSize:12,letterSpacing:2,padding:"3px 9px",borderRadius:3}}>F1</div>
                  <div style={{color:tx,fontSize:14,fontWeight:800,letterSpacing:2,fontFamily:"monospace"}}>FILL RATE RACE 2026</div>
                  <div style={{color:sb,fontSize:10,letterSpacing:1,marginTop:2}}>{(()=>{const mn={"Ene":"Enero","Feb":"Febrero","Mar":"Marzo","Abr":"Abril","May":"Mayo","Jun":"Junio","Jul":"Julio","Ago":"Agosto","Sep":"Septiembre","Oct":"Octubre","Nov":"Noviembre","Dic":"Diciembre"};const k=(RDATA[lap].m||"").split("'")[0];return"YTD "+(mn[k]||k)+" 2026";})()}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  {lph>0&&lph<7&&(
                    <div style={{display:"flex",gap:4,background:rCtrlBg,border:"2px solid #333",borderRadius:7,padding:"5px 7px"}}>
                      {[0,1,2,3,4].map(i=>(
                        <div key={i} style={{width:14,height:14,borderRadius:"50%",background:(lph>i&&lph<6)?R:dark?"#2a0000":"#eee",boxShadow:(lph>i&&lph<6)?"0 0 8px "+R:"none",transition:"all .15s"}}/>
                      ))}
                      {lph===6&&<span style={{fontSize:10,fontWeight:900,color:"#22c55e",letterSpacing:2,marginLeft:4}}>GO!</span>}
                    </div>
                  )}
                  <div style={{display:"flex",gap:1,background:rCtrlBg,border:"1px solid "+rCtrlBrd,borderRadius:7,padding:2}}>
                    {[{v:2000,l:"1x"},{v:1000,l:"2x"},{v:400,l:"5x"}].map(s=>(
                      <button key={s.v} onClick={()=>setSpd(s.v)} style={{padding:"3px 9px",borderRadius:5,fontSize:10,fontWeight:700,cursor:"pointer",border:"none",background:spd===s.v?R:"transparent",color:spd===s.v?"#fff":"#666"}}>{s.l}</button>
                    ))}
                  </div>
                  <button onClick={doReset} style={{width:32,height:32,borderRadius:7,border:"1px solid "+rCtrlBrd,background:rCtrlBg,color:"#888",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>{"<<"}</button>
                  <button onClick={doPlay} style={{width:44,height:44,borderRadius:10,border:"2px solid "+(play?"#f70505":R),background:play?"rgba(239,68,68,.15)":"rgba(200,0,0,.15)",color:play?"#f70505":R,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>
                    {play?"||":">"}
                  </button>
                </div>
              </div>

              <div style={{display:"flex"}}>
                <div style={{flex:1,position:"relative",padding:"22px 70px 36px 150px",background:rTrack}}>
                  <div style={{position:"absolute",right:70,top:0,bottom:0,width:4,background:"repeating-linear-gradient(180deg,#fff 0,#fff 6px,#222 6px,#222 12px)",opacity:.5,zIndex:5}}/>
                  <div style={{position:"absolute",left:150,top:0,bottom:0,width:1,background:"rgba(255,255,255,.1)",zIndex:5}}/>
                  {[76,80,84,88,92].map(v=>(
                    <div key={v} style={{position:"absolute",top:0,bottom:0,width:1,left:"calc(150px + "+pct(v)+"%)",background:rGridLine}}>
                      <div style={{position:"absolute",bottom:-14,left:-8,fontSize:7,color:rGridTxt}}>{v}%</div>
                    </div>
                  ))}
                  {rnkd.map((car,pos)=>{
                    const val=cur[car.k]||0;
                    const p=pct(val);
                    return(
                      <div key={car.k} style={{height:"24%",display:"flex",alignItems:"center",marginBottom:1,position:"relative"}}>
                        <div style={{position:"absolute",left:-145,width:138,display:"flex",alignItems:"center",gap:7}}>
                          <div style={{width:26,height:26,borderRadius:"50%",background:car.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff",flexShrink:0}}>{pos+1}</div>
                          <div>
                            <div style={{fontSize:10,fontWeight:800,color:rNameCol,fontFamily:"monospace"}}>{car.lb}</div>
                            <div style={{fontSize:8,color:car.c,fontWeight:700,letterSpacing:1}}>{car.sh}</div>                          </div>
                        </div>
                        <div style={{flex:1,height:48,background:rLane,borderTop:"1px solid "+rLaneBrd,borderBottom:"1px solid "+rLaneBrd,position:"relative",overflow:"visible"}}>
                          <div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",height:7,width:p+"%",background:"linear-gradient(90deg,transparent,"+car.c+"66)",borderRadius:"0 3px 3px 0",transition:"width .7s cubic-bezier(.4,0,.2,1)"}}/>
                          <div style={{position:"absolute",left:p+"%",top:"50%",transform:"translateY(-55%) translateX(-50%)",transition:"left .7s cubic-bezier(.4,0,.2,1)",zIndex:10}}>
                            <Car c={car.c} n={car.n} spd={play}/>
                          </div>
                          <div style={{position:"absolute",left:p+"%",top:-20,transform:"translateX(-50%)",fontSize:14,fontWeight:900,color:car.c,whiteSpace:"nowrap",transition:"left .7s cubic-bezier(.4,0,.2,1)",fontFamily:"monospace",textShadow:"0 1px 4px rgba(0,0,0,.8)"}}>
                            {val.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{height:18}}/>
                </div>

                <div style={{width:170,background:rSide,borderLeft:"2px solid "+R,flexShrink:0}}>
                  <div style={{background:R,padding:"8px 12px",fontSize:10,fontWeight:900,letterSpacing:2,color:"#fff"}}>CLASIFICACION</div>
                  {rnkd.map((car,pos)=>{
                    const val=cur[car.k]||0;
                    const leader=cur[rnkd[0].k]||0;
                    const gap=pos>0?(leader-val).toFixed(1):null;
                    return(
                      <div key={car.k} style={{padding:"8px 10px",borderBottom:"1px solid "+rSideBrd,display:"flex",alignItems:"center",gap:7}}>
                        <div style={{width:24,height:24,borderRadius:5,background:pos===0?car.c:rCtrlBg,border:"1.5px solid "+(pos===0?car.c:rCtrlBrd),display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:pos===0?"#fff":car.c,flexShrink:0}}>{pos+1}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:10,fontWeight:800,color:tx,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontFamily:"monospace"}}>{car.lb}</div>
                          <div style={{fontSize:14,fontWeight:900,color:car.c}}>{val.toFixed(1)}%</div>
                        </div>
                        {gap&&<div style={{fontSize:8,fontWeight:800,color:"#f70505",background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:3,padding:"1px 4px",whiteSpace:"nowrap"}}>-{gap}pp</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
