import { useState, useEffect } from "react";
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
  LIBERTAD:[
    {m:"Ene'25",F:null,L:null,A:71.1,AR:78.5,T:76.0},{m:"Feb'25",F:null,L:null,A:74.3,AR:86.5,T:82.9},
    {m:"Mar'25",F:null,L:null,A:73.5,AR:87.3,T:82.9},{m:"Abr'25",F:null,L:null,A:79.8,AR:83.4,T:82.2},
    {m:"May'25",F:null,L:null,A:80.9,AR:80.2,T:80.4},{m:"Jun'25",F:null,L:null,A:90.2,AR:93.6,T:93.2},
    {m:"Jul'25",F:null,L:null,A:89.6,AR:87.4,T:88.1},{m:"Ago'25",F:null,L:null,A:87.4,AR:83.1,T:87.4},
    {m:"Sep'25",F:null,L:null,A:91.6,AR:80.6,T:85.6},{m:"Oct'25",F:null,L:null,A:84.4,AR:95.3,T:81.9},
    {m:"Nov'25",F:null,L:null,A:85.7,AR:88.8,T:91.5},{m:"Dic'25",F:null,L:null,A:87.2,AR:null,T:88.2},
    {m:"Ene'26",F:98.3,L:null,A:84.6,AR:73.4,T:79.1},
  ],
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
  ANDINA:[{n:"GDN",a:82.0,b:83.7},{n:"CRF",a:81.0,b:86.5},{n:"Cencosud",a:76.0,b:77.9},{n:"Libertad",a:71.1,b:84.6},{n:"La Anonima",a:76.0,b:78.3},{n:"Dia",a:null,b:null}],
  ARCA:[{n:"GDN",a:82.0,b:85.8},{n:"CRF",a:71.0,b:74.4},{n:"Cencosud",a:78.0,b:79.3},{n:"Libertad",a:78.5,b:73.4},{n:"La Anonima",a:null,b:null},{n:"Dia",a:null,b:null}],
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

function getF1HTML(dk){return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>F1 Fill Rate Race · Argentina 2025-2026</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;700&display=swap');

  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:${dk?"#0a0a0a":"#f0f0f0"}; color:${dk?"#fff":"#111"}; font-family:'IBM Plex Mono',monospace; overflow:hidden; }

  .header {
    background: linear-gradient(90deg, ${dk?"#1a0000":"#cc0000"} 0%, #cc0000 50%, ${dk?"#1a0000":"#cc0000"} 100%);
    padding: 12px 24px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 3px solid #ff0000;
    position: relative;
  }
  .header::before {
    content:''; position:absolute; left:0; right:0; height:4px;
    background: repeating-linear-gradient(90deg, #fff 0, #fff 8px, ${dk?"#111":"#cc0000"} 8px, ${dk?"#111":"#cc0000"} 16px);
    top:0;
  }

  .header h1 { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:4px; color:#fff; text-shadow:0 0 20px rgba(255,0,0,.6); }
  .header .sub { font-size:10px; color:rgba(255,255,255,.5); letter-spacing:3px; }

  .race-container {
    width:100%; max-width:none; margin:0; padding:0;
  }

  .track-wrap {
    width:100%; background: ${dk?"#111":"#fff"}; border: none; overflow: hidden;
    position: relative;
  }

  canvas#raceCanvas { display:block; width:100%; }

  .controls {
    background: ${dk?"#0d0d0d":"#f4f4f4"}; border-top: 1px solid ${dk?"#222":"#ddd"};
    padding: 12px 20px; display: flex; align-items: center; gap: 8px; justify-content: center;
  }
  .btn {
    background: ${dk?"#1a1a1a":"#fff"}; border: 1.5px solid ${dk?"#333":"#ccc"}; border-radius: 8px;
    color: ${dk?"#ccc":"#444"}; font-family: 'IBM Plex Mono',monospace; font-size: 11px; font-weight: 700;
    padding: 8px 16px; cursor: pointer; transition: all .15s;
    letter-spacing: 1px;
  }
  .btn:hover { border-color:#cc0000; color:${dk?"#fff":"#cc0000"}; }
  .btn.active { background:rgba(204,0,0,.2); border-color:#cc0000; color:#ff3333; }
  .btn.primary { background:#cc0000; border-color:#cc0000; color:#fff; font-size:14px; padding:8px 24px; }
  .btn.primary:hover { background:#ee0000; }

  .speed-btns { display:flex; gap:2px; background:${dk?"#111":"#e8e8e8"}; border:1px solid ${dk?"#333":"#ccc"}; border-radius:6px; padding:2px; }
  .speed-btns .btn { border:none; border-radius:4px; padding:5px 10px; font-size:10px; }
  .speed-btns .btn.active { background:#cc0000; color:#fff; }

  .lights { display:flex; gap:5px; }
  .light { width:14px; height:14px; border-radius:50%; background:#2a0000; transition:all .2s; }
  .light.on { background:#cc0000; box-shadow:0 0 10px #cc0000; }
  .light.go { background:#22c55e; box-shadow:0 0 10px #22c55e; }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>🏁 FILL RATE GRAND PRIX · ARGENTINA</h1>
    <div class="sub">COCA-COLA · TEMPORADA 2026 · <span id="lapLabel" style="color:rgba(255,255,255,.8);">YTD Ene'26</span></div>
  </div>
  <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:rgba(255,255,255,.15);letter-spacing:6px;">F1</div>
</div>

<div class="race-container">
  <div class="track-wrap">

    <canvas id="raceCanvas" width="1060" height="380"></canvas>

    <div class="controls">
      <button class="btn" id="btnReset" onclick="doReset()">↺ RESET</button>
      <button class="btn" id="btnPrev" onclick="prevLap()">◀</button>
      <button class="btn primary" id="btnPlay" onclick="togglePlay()">▶ START</button>
      <button class="btn" id="btnNext" onclick="nextLap()">▶</button>
      <div class="speed-btns">
        <button class="btn active" onclick="setSpeed(1500,this)">1x</button>
        <button class="btn" onclick="setSpeed(800,this)">2x</button>
        <button class="btn" onclick="setSpeed(350,this)">5x</button>
      </div>
    </div>

    </div>
  </div>
</div>

<script>
const DARK = ${dk};
const T = {
  bg: DARK ? '#0a0a0a' : '#f0f0f0',
  grandA: DARK ? '#1a0000' : '#f5e6e6',
  grandB: DARK ? '#220000' : '#edd8d8',
  seats: DARK ? 'rgba(255,255,255,.04)' : 'rgba(204,0,0,.06)',
  watermark: DARK ? 'rgba(255,255,255,.03)' : 'rgba(204,0,0,.04)',
  roadA: DARK ? '#1a1a1a' : '#e0e0e0',
  roadB: DARK ? '#222' : '#d5d5d5',
  lane: DARK ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.08)',
  startB: DARK ? '#333' : '#ccc',
  finishB: DARK ? '#111' : '#ddd',
  gridLine: DARK ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.06)',
  gridTxt: DARK ? '#444' : '#999',
  metaTxt: DARK ? '#555' : '#999',
  nameTxt: DARK ? undefined : undefined, // uses car.color
  trail: '33',
  cockpit: DARK ? '#0c0c0c' : '#333',
  wheel: DARK ? '#111' : '#444',
  numTxt: DARK ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.7)',
  labelShadow: DARK ? 6 : 3,
  overlay: DARK ? 'rgba(0,0,0,' : 'rgba(0,0,0,',
  lightOff: DARK ? '#1a0000' : '#ddd',
  lightHouse: DARK ? '#111' : '#e0e0e0',
  lightRim: DARK ? '#444' : '#bbb',
};
const RACE_DATA = [
  { mes:"Ene'26", FEMSA:86.5, LEE:89.2, ANDINA:81.6, ARCA:79.0 },
];

const CARS = [
  { key:"FEMSA",  label:"Femsa",        color:"#ee0000", accent:"#ff4444", num:"04" },
  { key:"LEE",    label:"Reginald Lee", color:"#ff6b6b", accent:"#ffaaaa", num:"01" },
  { key:"ANDINA", label:"Andina",       color:"#ff7043", accent:"#ffab91", num:"11" },
  { key:"ARCA",   label:"Arca",         color:"#e68e02", accent:"#ffc107", num:"44" },
];

const canvas = document.getElementById('raceCanvas');
const ctx = canvas.getContext('2d');
let CW, CH;

function resize() {
  const w = canvas.parentElement.clientWidth;
  CW = w; CH = Math.round(w * 0.40);
  canvas.width = CW; canvas.height = CH;
  canvas.style.height = CH + 'px';
}
resize();
window.addEventListener('resize', () => { resize(); drawScene(); });

let currentLap = 0;
let playing = false;
let playInterval = null;
let speed = 1500;
let carPositions = {}; // 0 to 1 animated
let targetPositions = {};
let animFrame = null;

CARS.forEach(c => { carPositions[c.key] = 0; targetPositions[c.key] = 0; });

// Margins
const ML = 0.16, MR = 0.05;
const LANE_TOP = 0.18, LANE_TOTAL = 0.64;

function getLaneY(i) {
  const h = CH * LANE_TOTAL / 4;
  return CH * LANE_TOP + i * h + h/2;
}
function getX(progress) {
  return CW * ML + progress * CW * (1 - ML - MR);
}
function frToProgress(fr) {
  return Math.max(0, Math.min(1, (fr - 65) / 35));
}

// ── DRAW ──
function drawScene() {
  ctx.clearRect(0,0,CW,CH);
  drawGrandstands();
  drawRoad();
  drawStartLine();
  drawFinishLine();
  drawGridLines();
  drawCars();
}

function drawGrandstands() {
  // Top
  const rows = 4;
  const h = CH * LANE_TOP;
  for (let r=0;r<rows;r++) {
    const rh = h/rows;
    const y = r * rh;
    ctx.fillStyle = r%2===0 ? T.grandA : T.grandB;
    ctx.fillRect(0, y, CW, rh-1);
    ctx.fillStyle = T.seats;
    for (let x=8; x<CW; x+=16) {
      ctx.beginPath(); ctx.arc(x, y+rh/2, 2, 0, Math.PI*2); ctx.fill();
    }
  }
  // Bottom
  const bTop = CH * (LANE_TOP + LANE_TOTAL);
  const bH = CH - bTop;
  for (let r=0;r<3;r++) {
    const rh = bH/3;
    ctx.fillStyle = r%2===0 ? T.grandA : T.grandB;
    ctx.fillRect(0, bTop + r*rh, CW, rh-1);
    ctx.fillStyle = T.seats;
    for (let x=12; x<CW; x+=16) {
      ctx.beginPath(); ctx.arc(x, bTop + r*rh + rh/2, 2, 0, Math.PI*2); ctx.fill();
    }
  }
  // Coca-Cola text on track
  ctx.save();
  ctx.font = \`bold \${CW*0.06}px 'Bebas Neue', sans-serif\`;
  ctx.fillStyle = T.watermark;
  ctx.textAlign = 'center';
  ctx.fillText('COCA-COLA', CW*0.5, CH*0.55);
  ctx.restore();
}

function drawRoad() {
  const y = CH * LANE_TOP;
  const h = CH * LANE_TOTAL;
  const grad = ctx.createLinearGradient(0, y, 0, y+h);
  grad.addColorStop(0, T.roadA);
  grad.addColorStop(0.5, T.roadB);
  grad.addColorStop(1, T.roadA);
  ctx.fillStyle = grad;
  ctx.fillRect(0, y, CW, h);
  for (let i=1;i<4;i++) {
    const ly = getLaneY(i) - CH*LANE_TOTAL/8;
    ctx.strokeStyle = T.lane;
    ctx.setLineDash([12,8]);
    ctx.beginPath(); ctx.moveTo(CW*ML, ly); ctx.lineTo(CW*(1-MR), ly); ctx.stroke();
    ctx.setLineDash([]);
  }
  [y, y+h].forEach(by => {
    for (let x=0; x<CW; x+=20) {
      ctx.fillStyle = x%40<20 ? '#cc0000' : '#fff';
      ctx.fillRect(x, by-3, 20, 6);
    }
  });
}

function drawStartLine() {
  const x = CW * ML;
  for (let r=0; r<Math.ceil(CH*LANE_TOTAL/8); r++) {
    const y = CH*LANE_TOP + r*8;
    ctx.fillStyle = r%2===0 ? '#fff' : T.startB;
    ctx.fillRect(x-4, y, 8, 8);
  }
}

function drawFinishLine() {
  const x = CW * (1-MR) - 6;
  for (let r=0; r<Math.ceil(CH*LANE_TOTAL/8); r++) {
    const y = CH*LANE_TOP + r*8;
    for (let c=0;c<3;c++) {
      ctx.fillStyle = (r+c)%2===0 ? '#fff' : T.finishB;
      ctx.fillRect(x - 12 + c*8, y, 8, 8);
    }
  }
  // FLAG text
  ctx.save();
  ctx.font = \`bold 9px 'IBM Plex Mono', monospace\`;
  ctx.fillStyle = T.metaTxt;
  ctx.textAlign = 'center';
  ctx.fillText('META', x, CH*LANE_TOP - 6);
  ctx.restore();
}

function drawGridLines() {
  ctx.save();
  ctx.font = \`8px 'IBM Plex Mono', monospace\`;
  ctx.textAlign = 'center';
  [70,75,80,85,90,95].forEach(v => {
    const x = getX(frToProgress(v));
    ctx.strokeStyle = T.gridLine;
    ctx.beginPath(); ctx.moveTo(x, CH*LANE_TOP); ctx.lineTo(x, CH*(LANE_TOP+LANE_TOTAL)); ctx.stroke();
    ctx.fillStyle = T.gridTxt;
    ctx.fillText(v+'%', x, CH*(LANE_TOP+LANE_TOTAL)+12);
  });
  ctx.restore();
}

function drawF1Car(x, y, car, scale) {
  const s = scale || 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  // Exhaust flames when moving
  if (playing) {
    const fl = 8 + Math.random()*12;
    ctx.fillStyle = \`rgba(255,\${100+Math.random()*100},0,\${0.4+Math.random()*0.3})\`;
    ctx.beginPath();
    ctx.moveTo(-28, -2); ctx.lineTo(-28-fl, 0); ctx.lineTo(-28, 2); ctx.fill();
    ctx.fillStyle = \`rgba(255,200,0,\${0.2+Math.random()*0.2})\`;
    ctx.beginPath();
    ctx.moveTo(-28, -1); ctx.lineTo(-28-fl*0.6, 0); ctx.lineTo(-28, 1); ctx.fill();
  }

  // Body
  ctx.fillStyle = car.color;
  ctx.beginPath();
  ctx.moveTo(-26, -6);
  ctx.lineTo(-10, -8);
  ctx.lineTo(16, -8);
  ctx.lineTo(26, -5);
  ctx.lineTo(28, -2);
  ctx.lineTo(28, 2);
  ctx.lineTo(26, 5);
  ctx.lineTo(16, 8);
  ctx.lineTo(-10, 8);
  ctx.lineTo(-26, 6);
  ctx.closePath();
  ctx.fill();

  // Cockpit
  ctx.fillStyle = T.cockpit;
  ctx.beginPath();
  ctx.moveTo(2, -6); ctx.lineTo(8, -10); ctx.lineTo(18, -10); ctx.lineTo(22, -6);
  ctx.closePath(); ctx.fill();
  // Halo
  ctx.strokeStyle = car.color; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8,-10); ctx.quadraticCurveTo(13,-14,18,-10); ctx.stroke();

  // Front wing
  ctx.fillStyle = car.color;
  ctx.fillRect(26, -10, 4, 20);

  // Rear wing
  ctx.fillStyle = car.color;
  ctx.fillRect(-28, -10, 3, 4);
  ctx.fillRect(-28, 6, 3, 4);
  ctx.fillRect(-30, -11, 2, 22);

  // Wheels
  ctx.fillStyle = T.wheel; ctx.strokeStyle = car.color; ctx.lineWidth = 1.5;
  [[-12,9],[-12,-9],[20,8],[20,-8]].forEach(([wx,wy]) => {
    ctx.beginPath(); ctx.ellipse(wx, wy, 4, 6, 0, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();
  });

  ctx.restore();
}

function drawCars() {
  // Sort by position for drawing order
  const sorted = [...CARS].sort((a,b) => carPositions[a.key] - carPositions[b.key]);
  sorted.forEach((car, di) => {
    const i = CARS.indexOf(car);
    const ly = getLaneY(i);
    const p = carPositions[car.key];
    const x = getX(p);

    // Trail
    const trailGrad = ctx.createLinearGradient(CW*ML, 0, x, 0);
    trailGrad.addColorStop(0, 'transparent');
    trailGrad.addColorStop(1, car.color + '33');
    ctx.fillStyle = trailGrad;
    ctx.fillRect(CW*ML, ly-4, x-CW*ML, 8);

    drawF1Car(x, ly, car, 1.7);

    // Value label (right of car)
    const val = getCurrentValue(car.key);
    ctx.save();
    ctx.font = \`bold 22px 'IBM Plex Mono', monospace\`;
    ctx.fillStyle = car.color;
    ctx.textAlign = 'left';
    ctx.shadowColor = car.color; ctx.shadowBlur = T.labelShadow;
    ctx.fillText(val.toFixed(1)+'%', x + 58, ly + 7);
    ctx.restore();

    // Name on left outside track
    ctx.save();
    ctx.font = \`bold 28px 'Bebas Neue', sans-serif\`;
    ctx.fillStyle = car.color;
    ctx.textAlign = 'left';
    ctx.fillText(car.label, CW*0.02, ly + 8);
    ctx.restore();
  });
}

function getCurrentValue(key) {
  return displayValues[key] || 0;
}

// ── ANIMATION ──
let displayValues = {};
let animating = false;
CARS.forEach(c => { displayValues[c.key] = 0; });

function animateRace() {
  if (!animating) return;
  let allDone = true;
  const d = RACE_DATA[currentLap];
  CARS.forEach(c => {
    const target = d[c.key];
    const targetP = frToProgress(target);
    const diff = targetP - carPositions[c.key];
    const valDiff = target - displayValues[c.key];
    if (Math.abs(diff) > 0.0005) {
      carPositions[c.key] += diff * 0.012;
      displayValues[c.key] += valDiff * 0.012;
      allDone = false;
    } else {
      carPositions[c.key] = targetP;
      displayValues[c.key] = target;
    }
  });
  drawScene();
  if (!allDone) {
    animFrame = requestAnimationFrame(animateRace);
  } else {
    animating = false;
    playing = false;
    document.getElementById('btnPlay').innerHTML = '▶ START';
  }
}

function startRaceAnimation() {
  const d = RACE_DATA[currentLap];
  document.getElementById('lapLabel').textContent = \`YTD \${d.mes}\`;
  animating = true;
  cancelAnimationFrame(animFrame);
  animateRace();
}

// ── CONTROLS ──
function togglePlay() {
  if (animating) {
    animating = false;
    playing = false;
    cancelAnimationFrame(animFrame);
    document.getElementById('btnPlay').innerHTML = '▶ START';
    return;
  }
  // Reset to 0 and launch
  CARS.forEach(c => { carPositions[c.key] = 0; displayValues[c.key] = 0; });
  drawScene();
  doLightsSequence(() => {
    playing = true;
    document.getElementById('btnPlay').innerHTML = '⏸ PAUSA';
    startRaceAnimation();
  });
}

function doLightsSequence(cb) {
  let phase = 0;
  let lightsOn = [false,false,false,false,false];
  let goPhase = false;
  let fadeOut = 0;

  function drawLights() {
    // Semi-transparent overlay
    const alpha = goPhase ? Math.max(0, 0.7 - fadeOut) : 0.7;
    ctx.fillStyle = \`rgba(0,0,0,\${alpha})\`;
    ctx.fillRect(0, 0, CW, CH);

    // Light housing
    const totalW = 280;
    const lx = CW/2 - totalW/2;
    const ly = CH/2 - 30;
    const houseH = 60;

    if (alpha > 0.05) {
      // Housing background
      ctx.fillStyle = T.lightHouse;
      ctx.strokeStyle = T.lightRim;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(lx - 10, ly - 10, totalW + 20, houseH + 20, 10);
      ctx.fill(); ctx.stroke();

      // 5 lights
      for (let i = 0; i < 5; i++) {
        const cx = lx + 28 + i * 56;
        const cy = ly + houseH/2;

        // Glow
        if (lightsOn[i]) {
          const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
          glow.addColorStop(0, goPhase ? 'rgba(34,197,94,.6)' : 'rgba(204,0,0,.6)');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fillRect(cx-40, cy-40, 80, 80);
        }

        // Light circle
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI*2);
        if (lightsOn[i]) {
          ctx.fillStyle = goPhase ? '#22c55e' : '#cc0000';
          ctx.shadowColor = goPhase ? '#22c55e' : '#cc0000';
          ctx.shadowBlur = 20;
        } else {
          ctx.fillStyle = T.lightOff;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Rim
        ctx.strokeStyle = T.lightRim;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Text
      if (goPhase) {
        ctx.save();
        ctx.font = \`bold 36px 'Bebas Neue', sans-serif\`;
        ctx.fillStyle = '#22c55e';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#22c55e'; ctx.shadowBlur = 30;
        ctx.fillText('GO!', CW/2, ly + houseH + 50);
        ctx.shadowBlur = 0;
        ctx.restore();
      }
    }
  }

  const iv = setInterval(() => {
    if (phase < 5) {
      lightsOn[phase] = true;
      drawScene();
      drawLights();
    } else if (phase === 5) {
      goPhase = true;
      lightsOn = [true,true,true,true,true];
      drawScene();
      drawLights();
      clearInterval(iv);
      // Fade out
      let fade = 0;
      const fadeIv = setInterval(() => {
        fade += 0.08;
        fadeOut = fade;
        drawScene();
        if (fade < 1) drawLights();
        if (fade >= 1) {
          clearInterval(fadeIv);
          drawScene();
          cb();
        }
      }, 30);
    }
    phase++;
  }, 400);
}

function nextLap() {
  if (currentLap < RACE_DATA.length - 1) { currentLap++; startRaceAnimation(); }
}
function prevLap() {
  if (currentLap > 0) { currentLap--; startRaceAnimation(); }
}
function doReset() {
  playing = false; animating = false; clearInterval(playInterval); cancelAnimationFrame(animFrame);
  currentLap = 0;
  CARS.forEach(c => { carPositions[c.key] = 0; targetPositions[c.key] = 0; displayValues[c.key] = 0; });
  document.getElementById('btnPlay').innerHTML = '▶ START';
  document.getElementById('lapLabel').textContent = 'YTD Ene\\'26';
  drawScene();
}
function resetPositions() {
  CARS.forEach(c => { carPositions[c.key] = 0; targetPositions[c.key] = 0; displayValues[c.key] = 0; });
}
function setSpeed(s, btn) {
  speed = s;
  document.querySelectorAll('.speed-btns .btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// Init - start at 0
CARS.forEach(c => { carPositions[c.key] = 0; displayValues[c.key] = 0; });
drawScene();

// Report height to parent
function reportHeight(){
  const h = document.documentElement.scrollHeight;
  window.parent.postMessage({type:'f1-race-height',height:h},'*');
}
reportHeight();
new ResizeObserver(reportHeight).observe(document.body);
</script>
</body>
</html>
`;}

function Tag({lb,v,c,sub}){
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:4,background:c+"18",border:"1px solid "+c+"44",borderRadius:12,padding:"3px 9px",fontSize:12,color:c,fontWeight:800,whiteSpace:"nowrap"}}>
      {lb} {v.toFixed(1)}%
    </span>
  );
}

export default function App(){
  const [dark,setDark]=useState(true);
  const [view,setView]=useState("TOTAL CANAL");
  const [act,setAct]=useState({F:true,L:true,A:true,AR:true,T:true});
  const [ytdT,setYtdT]=useState("b");
  const [bflt,setBflt]=useState("ARG");
  const [raceH,setRaceH]=useState(620);

  useEffect(()=>{
    const handler=(e)=>{
      if(e.data&&e.data.type==='f1-race-height'&&e.data.height){
        setRaceH(e.data.height);
      }
    };
    window.addEventListener('message',handler);
    return()=>window.removeEventListener('message',handler);
  },[]);

  const bg=dark?"#111":"#f4f4f4";
  const cd=dark?"#1a1a1a":"#fff";
  const br=dark?"#2a2a2a":"#e5e5e5";
  const tx=dark?"#f0f0f0":"#111";
  const sb=dark?"#555":"#999";

  const cd2=TR[view]||TR["TOTAL CANAL"];
  const ytd=YTD[view]||{};
  const yi=ytdT==="b"?BYTD:CYTD;
  const bd=BAR[bflt]||BAR.ARG;
  const bc=bflt==="ARG"?R:(C[bflt.toLowerCase()]||R);
  const VIEWS=["TOTAL CANAL","GDN","CRF","LIBERTAD","CENCOSUD","LA ANONIMA","DIA"];

  function sb2(on,col){return{padding:"4px 9px",borderRadius:14,fontSize:10,fontWeight:700,cursor:"pointer",border:"1.5px solid "+(on?col:br),background:on?col+"22":cd,color:on?col:tx,whiteSpace:"nowrap"};}
  function sb3(on,col){return{padding:"4px 9px",borderRadius:14,fontSize:10,fontWeight:700,cursor:"pointer",border:"1.5px solid "+(on?col:col+"66"),background:on?col+"22":cd,color:col,whiteSpace:"nowrap"};}

  return(
    <div style={{background:bg,color:tx,fontFamily:"sans-serif",minHeight:"100vh"}}>

      {/* HEADER */}
      <div style={{background:R,padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <h1 style={{margin:0,fontSize:24,color:"#fff",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3,fontWeight:900}}>CS DASHBOARD · ARGENTINA · COCA-COLA</h1>
          <div style={{fontSize:10,color:"rgba(255,255,255,.5)",letterSpacing:3,marginTop:2,fontFamily:"monospace"}}>ENERO 2026</div>
        </div>
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

        {/* ROW 6: F1 RACE + CLASIFICACION */}
        <div style={{display:"grid",gridTemplateColumns:"3fr 1fr",gap:0,borderRadius:14,overflow:"hidden",border:"1px solid "+br}}>
          {/* LEFT: Race iframe */}
          <div style={{position:"relative",overflow:"hidden"}}>
            <iframe
              srcDoc={getF1HTML(dark)}
              scrolling="no"
              style={{width:"100%",height:raceH,border:"none",display:"block",overflow:"hidden"}}
              title="F1 Fill Rate Race"
            />
          </div>
          {/* RIGHT: Clasificacion */}
          {(()=>{
            const _cars=[
              {key:"LEE",label:"Reginald Lee",color:"#ff6b6b",val:89.2},
              {key:"FEMSA",label:"Femsa",color:"#ee0000",val:86.5},
              {key:"ANDINA",label:"Andina",color:"#ff7043",val:81.6},
              {key:"ARCA",label:"Arca",color:"#e68e02",val:79.0},
            ].sort((a,b)=>b.val-a.val);
            const _leader=_cars[0];
            const _second=_cars[1];
            const _worst=_cars[_cars.length-1];
            const _gapVs2=(_leader.val-_second.val).toFixed(1);
            const _gapWorst=(_leader.val-_worst.val).toFixed(1);
            const _sep=dark?"#1a1a1a":"#e5e5e5";
            const _sub=dark?"#666":"#999";
            return(
            <div style={{background:dark?"#0d0d0d":"#fff",borderLeft:"2px solid "+R,display:"flex",flexDirection:"column",height:"100%"}}>
              {/* Header */}
              <div style={{background:R,padding:"10px 14px",flexShrink:0}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:3,color:"#fff",fontWeight:900}}>CLASIFICACIÓN</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.6)",letterSpacing:2,marginTop:1}}>YTD 2026</div>
              </div>

              {/* Insights */}
              <div style={{padding:"14px 14px",borderBottom:"1px solid "+_sep,flexShrink:0}}>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:_sub,marginBottom:10}}>INSIGHTS</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,color:_sub,fontWeight:600}}>Leader</span>
                    <span style={{fontSize:14,fontWeight:800,color:_leader.color,fontFamily:"'IBM Plex Mono',monospace"}}>{_leader.label} {_leader.val}%</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,color:_sub,fontWeight:600}}>Gap vs #2</span>
                    <span style={{fontSize:14,fontWeight:800,color:"#22c55e",fontFamily:"'IBM Plex Mono',monospace"}}>+{_gapVs2}pp</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,color:_sub,fontWeight:600}}>Worst</span>
                    <span style={{fontSize:14,fontWeight:800,color:"#f70505",fontFamily:"'IBM Plex Mono',monospace"}}>{_worst.label} {_worst.val}% <span style={{fontSize:11,opacity:.8}}>(-{_gapWorst}pp)</span></span>
                  </div>
                </div>
              </div>

              {/* Ranking */}
              <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-evenly",padding:"10px 14px"}}>
                {_cars.map((car,i)=>{
                  const w=Math.max(8,((car.val-70)/30)*100);
                  const isFirst=i===0;
                  const isTop3=i<3;
                  const nameSize=isFirst?16:isTop3?14:12;
                  const valSize=isFirst?26:isTop3?22:18;
                  const medalSize=isFirst?24:isTop3?20:14;
                  const barH=isFirst?12:isTop3?10:8;
                  const medalBox=isFirst?32:isTop3?28:26;
                  return(
                    <div key={car.key} style={{padding:isFirst?"12px 0":isTop3?"10px 0":"8px 0",borderBottom:i<_cars.length-1?"1px solid "+_sep:"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                        <div style={{width:medalBox,height:medalBox,borderRadius:6,background:isTop3?"transparent":(dark?"#1a1a1a":"#eee"),border:isTop3?"none":"1.5px solid "+(dark?"#333":"#ccc"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:medalSize,fontWeight:900,color:isTop3?"#000":car.color,flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:nameSize,fontWeight:700,color:car.color,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{car.label}</div>
                        </div>
                        <div style={{fontSize:valSize,fontWeight:900,color:car.color,flexShrink:0,textShadow:isFirst?"0 0 12px "+car.color+"66":"none",fontFamily:"'IBM Plex Mono',monospace"}}>{car.val.toFixed(1)}%</div>
                      </div>
                      <div style={{height:barH,background:dark?"#1a1a1a":"#e5e5e5",borderRadius:barH/2,overflow:"hidden"}}>
                        <div style={{width:w+"%",height:"100%",background:"linear-gradient(90deg,"+car.color+"66,"+car.color+")",borderRadius:barH/2,transition:"width .7s ease"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gap vs Líder */}
              <div style={{padding:"14px 14px",borderTop:"1px solid "+_sep,flexShrink:0}}>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:_sub,marginBottom:10}}>GAP VS LÍDER</div>
                {_cars.map((car,i)=>{
                  const g=(_leader.val-car.val).toFixed(1);
                  const isLeader=i===0;
                  return(
                    <div key={car.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i<_cars.length-1?"1px solid "+(dark?"#111":"#f0f0f0"):"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:car.color,flexShrink:0}}/>
                        <span style={{fontSize:13,fontWeight:700,color:car.color}}>{car.label}</span>
                      </div>
                      <span style={{fontSize:14,fontWeight:800,fontFamily:"'IBM Plex Mono',monospace",color:isLeader?(dark?"#888":"#aaa"):"#f70505"}}>{isLeader?"0.0":"-"+g}pp</span>
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })()}
        </div>

      </div>
    </div>
  );
}
