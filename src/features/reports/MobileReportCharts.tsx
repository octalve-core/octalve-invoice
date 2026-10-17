"use client";
type MonthPoint={name:string;billed:number;collected:number};
type StatusPoint={name:string;count:number};
const colours:Record<string,string>={paid:"#118660",pending:"#EFA637",draft:"#95B3D8",overdue:"#F05A69",partial:"#0064E0",refunded:"#7C75A7"};
const format=(amount:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(amount);
function compact(n:number){return n>=1000000?(n/1000000).toFixed(1)+"m":n>=1000?Math.round(n/1000)+"k":String(n);}
export function MobileCollectionChart({data}:{data:MonthPoint[]}){
 const values=data.slice(-12),max=Math.max(1,...values.flatMap(x=>[x.billed,x.collected])),width=320,height=220;
 const plot={left:37,right:11,top:20,bottom:36},usableW=width-plot.left-plot.right,usableH=height-plot.top-plot.bottom;
 const n=Math.max(1,values.length),step=usableW/n,barWidth=Math.max(7,Math.min(22,step*0.42));
 const points=values.map((d,i)=>[plot.left+step*(i+0.5),plot.top+usableH-d.collected/max*usableH]);
 return <div className="w-full overflow-hidden md:hidden" aria-label="Mobile invoiced and collected amounts chart">
  <svg role="img" aria-label={values.length+" monthly values of invoicing and collections"} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="block h-auto w-full">
   {[0,0.5,1].map(t=><g key={t}><line x1={plot.left} y1={plot.top+usableH*(1-t)} x2={width-plot.right} y2={plot.top+usableH*(1-t)} stroke="#E7EEF6"/><text x={plot.left-6} y={plot.top+usableH*(1-t)+3} fontSize="9" textAnchor="end" fill="#64748B">{compact(max*t)}</text></g>)}
   {values.map((d,i)=>{const x=plot.left+step*(i+0.5),barHeight=d.billed/max*usableH;return <g key={i}><rect x={x-barWidth/2} y={plot.top+usableH-barHeight} width={barWidth} height={barHeight} fill="#B5D6FF" rx="3"/><text x={x} y={height-18} textAnchor="middle" fontSize="9" fill="#64748B">{d.name}</text></g>;})}
   {points.length>0?<polyline points={points.map(p=>p.join(",")).join(" ")} fill="none" stroke="#0064E0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>:null}
   {points.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.8" fill="#0064E0" stroke="white" strokeWidth="1"/>)}
  </svg>
  <details className="mt-3 rounded-xl border border-[#E6EEF7] px-3 py-2 text-xs text-slate-600"><summary className="cursor-pointer font-semibold text-[#193955]">See exact monthly amounts</summary><div className="mt-2 divide-y divide-slate-100">{values.map((d,i)=><div className="flex items-center justify-between gap-2 py-2" key={i}><span>{d.name}</span><span className="text-right">Invoiced {format(d.billed)} · Collected {format(d.collected)}</span></div>)}</div></details>
 </div>;
}
export function MobileStatusChart({data,issuedCount}:{data:StatusPoint[];issuedCount:number}){
 const total=data.reduce((sum,d)=>sum+d.count,0),circumference=2*Math.PI*74;
 const sections=data.map((d,i)=>({ ...d,start:total?data.slice(0,i).reduce((sum,previous)=>sum+previous.count,0)/total*circumference:0,size:total?d.count/total*circumference:0 }));
 return <div className="md:hidden">
  <div className="mx-auto relative h-[208px] w-[208px]">
   <svg role="img" aria-label={total+" sample invoices grouped by status"} viewBox="0 0 200 200" className="h-full w-full">
    <circle cx="100" cy="100" r="74" fill="none" stroke="#EAF0F6" strokeWidth="22"/>
    {sections.map(s=><circle key={s.name} cx="100" cy="100" r="74" fill="none" stroke={colours[s.name]||"#94A3B8"} strokeWidth="22" strokeDasharray={`${s.size} ${circumference-s.size}`} strokeDashoffset={-s.start} transform="rotate(-90 100 100)"/>)}
   </svg>
   <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><strong className="text-2xl text-[#173652]">{issuedCount}</strong><span className="text-xs text-slate-500">Issued invoices</span></div>
  </div>
 </div>;
}