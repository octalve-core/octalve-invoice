"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,Calculator,Check,ChevronRight,Copy,Download,Info,RotateCcw,Search,ShieldCheck,SlidersHorizontal,TrendingUp} from "lucide-react";
import {calculateFinance,calculatorDefinitions,calculatorGroups,getCalculator,type CalculatorGroup,type Calculation,type Field} from "./engine";

type Unit=Field["unit"];
const format=(v:number,unit:Unit)=>{
 if(!Number.isFinite(v))return "—";
 if(unit==="NGN")return new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:2}).format(v);
 return new Intl.NumberFormat("en-NG",{maximumFractionDigits:2}).format(v)+(unit==="%"?"%":unit==="count"?"":" "+unit);
};
const defaults=(id:string)=>Object.fromEntries((getCalculator(id)?.fields||[]).map(f=>[f.key,String(f.initial)]));
const sanitizeCsv=(value:string)=>/^[=+\-@\t\r]/.test(value)?"'"+value:value;
function csvString(rows:string[][]){return rows.map(row=>row.map(cell=>'"'+sanitizeCsv(cell).replace(/"/g,'""')+'"').join(",")).join("\r\n");}
function ProjectionChart({result}:{result:Calculation}){
 const rows=result.rows;
 if(rows.length<2)return null;
 const chosen=rows.filter((_,i)=>i===0||i===rows.length-1||i%Math.max(1,Math.floor(rows.length/25))===0).slice(0,50);
 const lastColumn=chosen.map(r=>r[r.length-1]);
 const lo=Math.min(0,...lastColumn),hi=Math.max(1,...lastColumn),span=Math.max(1,hi-lo);
 const points=lastColumn.map((v,i)=>(22+i*336/Math.max(1,lastColumn.length-1)).toFixed(1)+","+(128-(v-lo)/span*105).toFixed(1)).join(" ");
 return <section className="rounded-2xl border border-[#E7EFF9] bg-white p-4" aria-label="Financial projection graph">
  <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h3 className="text-xs font-semibold text-[#193955]">Projected trend</h3><span className="text-[10px] text-slate-500">Model estimate · not historical business data</span></div>
  <svg role="img" aria-label={"Projection of "+rows.length+" periods; opening "+format(lastColumn[0],"NGN")+", closing "+format(lastColumn[lastColumn.length-1],"NGN")} viewBox="0 0 380 152" className="h-auto w-full" preserveAspectRatio="xMidYMid meet">
   {[22,75,128].map(y=><line key={y} x1="22" x2="360" y1={y} y2={y} stroke="#E5EEF9" strokeWidth="1"/>)}
   <polyline points={points} fill="none" stroke="#0064E0" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
   {lastColumn.map((v,i)=>i===0||i===lastColumn.length-1?<circle key={i} cx={22+i*336/Math.max(1,lastColumn.length-1)} cy={128-(v-lo)/span*105} r="4" fill="#0064E0" stroke="white" strokeWidth="1.5"/>:null)}
   <text x="22" y="148" fontSize="10" fill="#8698AF">Period 1</text><text x="360" y="148" fontSize="10" textAnchor="end" fill="#8698AF">Period {rows.length}</text>
  </svg>
 </section>;
}
export default function FinanceCalculatorWorkspace(){
 const [group,setGroup]=useState<CalculatorGroup>("Borrowing"),[search,setSearch]=useState(""),[active,setActive]=useState("loan");
 const [values,setValues]=useState<Record<string,string>>(()=>defaults("loan")),[showAll,setShowAll]=useState(false),[notification,setNotification]=useState("");
 const definition=getCalculator(active)||calculatorDefinitions[0];
 const entries=useMemo(()=>calculatorDefinitions.filter(d=>d.group===group&&d.title.toLowerCase().includes(search.trim().toLowerCase())),[group,search]);
 const {result,error}=useMemo(()=>{
  try{return {result:calculateFinance(active,Object.fromEntries(definition.fields.map(f=>[f.key,values[f.key]?.trim()===""?NaN:Number(values[f.key])]))),error:""};}
  catch(e){return {result:null,error:e instanceof Error?e.message:"Invalid calculation"};}
 },[active,values,definition]);
 const choose=(id:string)=>{setActive(id);setValues(defaults(id));setShowAll(false);setNotification("");};
 const selectGroup=(value:CalculatorGroup)=>{setGroup(value);setSearch("");const first=calculatorDefinitions.find(x=>x.group===value);if(first)choose(first.id);};
 const summary=result?definition.title+"\n"+result.label+": "+format(result.value,result.unit)+"\n"+result.metrics.map(x=>x.label+": "+format(x.value,x.unit)).join("\n")+"\nAssumptions: "+result.notes+"\nIllustrative estimate only.":null;
 const exportRows=()=>{if(!result?.rows.length)return;const lines=[result.columns,...result.rows.map(r=>r.map((v,i)=>i===0?String(v):Number(v).toFixed(2)))];const blob=new Blob(["\uFEFF",csvString(lines)],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="octalve-"+active+"-projection.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);setNotification("Projection exported as CSV. Calculations are estimates, not posted business transactions.");};
 const copy=async()=>{if(!summary)return;try{await navigator.clipboard.writeText(summary);setNotification("Summary copied.");}catch{setNotification("Copy is not available in this browser.");}};
 const numeric=(f:Field)=>Number(values[f.key]);
 return <main className="min-w-0 space-y-5 pb-14">
  <header className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><Link href="/dashboard/other-services" className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[#0064E0]"><ArrowLeft size={17}/> More services</Link><h1 className="text-2xl font-bold tracking-tight text-[#173652] sm:text-3xl">Finance Calculator</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Explore business decisions with transparent calculations, readable projections and assumptions you control.</p></div><span className="inline-flex items-center gap-2 rounded-full border border-[#D8E8FA] bg-[#F2F8FF] px-3 py-2 text-xs font-semibold text-[#0064E0]"><Calculator size={17}/> {calculatorDefinitions.length} practical tools</span></header>
  <div className="flex items-start gap-3 rounded-xl border border-[#DBE9FB] bg-[#F2F8FF] p-3 text-xs leading-6 text-[#315777]"><ShieldCheck className="mt-1 shrink-0 text-[#0064E0]" size={17}/><p>All calculations happen in this browser using your inputs. They are independent what-if estimates; they do not access private bank records, issue invoices, file taxes or change your financial ledger. Interest, tax and return rates are your assumptions, not provider quotations or legal advice.</p></div>
  <div className="flex flex-wrap gap-2" role="group" aria-label="Finance calculator categories">{calculatorGroups.map(g=><button type="button" key={g} aria-pressed={group===g} onClick={()=>selectGroup(g)} className={"rounded-full px-4 py-2.5 text-xs font-semibold transition-colors "+(group===g?"bg-[#0064E0] text-white":"border border-[#E4ECF6] bg-white text-[#536B84] hover:text-[#0064E0]")}>{g}</button>)}</div>
  <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[230px_minmax(0,1fr)]">
   <aside className="min-w-0 space-y-3 rounded-2xl border border-[#E9EFF6] bg-white p-4 shadow-sm"><h2 className="text-xs font-bold uppercase tracking-wider text-[#8B9BB0]">Choose a calculator</h2><label className="relative block"><Search size={16} className="absolute left-3 top-3 text-slate-400"/><input aria-label="Search finance calculators" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a calculator" className="h-10 w-full min-w-0 rounded-xl border border-[#E0EAF5] pl-9 pr-3 text-xs outline-none focus:border-[#0064E0]"/></label><div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-1">{entries.map(d=><button type="button" key={d.id} onClick={()=>choose(d.id)} aria-pressed={active===d.id} className={"flex min-w-0 items-center justify-between gap-2 rounded-xl px-3 py-3 text-left text-xs font-semibold "+(active===d.id?"bg-[#EAF3FF] text-[#0064E0]":"text-[#45617E] hover:bg-[#F7FAFF]")}><span>{d.title}</span><ChevronRight size={15} className="shrink-0"/></button>)}{!entries.length?<p className="p-3 text-xs text-slate-500">No tools match this search.</p>:null}</div></aside>
   <div className="min-w-0 space-y-4">
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.91fr)_minmax(0,1.09fr)]">
     <section className="min-w-0 rounded-2xl border border-[#E9EFF6] bg-white p-4 shadow-sm sm:p-6" aria-label={definition.title+" inputs"}>
      <div className="mb-6 flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#ECF4FF] text-[#0064E0]"><SlidersHorizontal size={20}/></span><div><h2 className="text-base font-bold text-[#173652]">{definition.title}</h2><p className="mt-1 text-xs leading-5 text-[#8192A8]">{definition.description}</p></div></div>
      <div className="space-y-5">{definition.fields.map(f=><label key={f.key} className="block"><span className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold text-[#4E6581]"><span>{f.label}</span><span className="text-[11px] text-slate-400">{f.unit==="NGN"?"NGN":f.unit==="%"?"Per cent":f.unit}</span></span><div className="flex h-[54px] items-center rounded-xl border border-[#DEE9F6] bg-white focus-within:border-[#0064E0] focus-within:ring-2 focus-within:ring-blue-100">{f.unit==="NGN"?<span className="pl-4 text-sm font-semibold text-[#94A7BF]">₦</span>:null}<input aria-label={f.label} inputMode="decimal" type="number" min={f.min} max={f.max} step={f.step||"any"} value={values[f.key]??""} onChange={e=>{setValues(v=>({...v,[f.key]:e.target.value}));setNotification("");}} className="h-full min-w-0 flex-1 rounded-xl bg-transparent px-3 text-lg font-semibold tabular-nums text-[#193955] outline-none"/>{f.unit!=="NGN"?<span className="pr-4 text-xs font-semibold text-[#94A7BF]">{f.unit==="%"?"%":f.unit}</span>:null}</div>{(f.max-f.min<=150||f.unit==="months"||f.unit==="years")&&f.min>=0?<><input aria-label={"Adjust "+f.label} type="range" min={f.min} max={f.max} step={f.step||1} value={Number.isFinite(numeric(f))?Math.max(f.min,Math.min(f.max,numeric(f))):f.initial} onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))} className="mt-3 w-full accent-[#0064E0]"/><div className="flex justify-between text-[10px] text-[#9DACC0]"><span>{f.min}</span><span>{f.max}</span></div></>:null}</label>)}</div>
      <div className="mt-6 rounded-xl bg-[#F3F8FF] p-3 text-xs leading-6 text-[#617E9F]"><Info size={16} className="mr-2 inline text-[#0064E0]"/>{definition.method}</div>
      <div className="mt-5 flex gap-2"><button type="button" onClick={()=>{setValues(defaults(active));setShowAll(false);setNotification("");}} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9E5F3] px-4 py-3 text-xs font-semibold text-[#54708B]"><RotateCcw size={16}/> Reset</button><button type="button" onClick={copy} disabled={!result} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0064E0] px-4 py-3 text-xs font-semibold text-white disabled:opacity-45"><Copy size={16}/> Copy summary</button></div>
     </section>
     <section className="min-w-0 overflow-hidden rounded-2xl border border-[#E9EFF6] bg-white shadow-sm" aria-label="Calculator results">
      <div className="bg-gradient-to-r from-[#EDF5FF] to-[#F8FAFE] px-4 py-5 sm:px-6"><div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-wide text-[#577EA7]"><span>Your estimated result</span><span className="rounded-full bg-[#E0F7ED] px-2 py-1 text-[10px] font-semibold normal-case tracking-normal text-[#117956]">Live calculation</span></div>
       {result?<><p className="mt-6 text-xs font-medium text-[#6A86A3]">{result.label}</p><h2 className="mt-2 break-words text-3xl font-extrabold tracking-tight text-[#0064E0] sm:text-4xl">{format(result.value,result.unit)}</h2><p className="mt-3 text-xs text-[#8B9CB1]">{definition.method}</p></>:<div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error||"Check calculator inputs"}</div>}</div>
      {result?<div className="space-y-5 p-4 sm:p-6"><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{result.metrics.map(m=><div key={m.label} className="min-w-0 rounded-xl border border-[#E8EEF6] p-3"><span className="block text-[10px] text-[#8A9BB0]">{m.label}</span><strong className="mt-2 block break-words text-sm tabular-nums text-[#183955]">{format(m.value,m.unit)}</strong></div>)}</div>
       {result.breakdown?.length?<div><h3 className="mb-3 text-xs font-semibold text-[#193955]">Calculation breakdown</h3><div className="flex h-2.5 overflow-hidden rounded-full bg-[#DDEAFF]">{result.breakdown.map((x,i)=>{const total=result.breakdown!.reduce((sum,item)=>sum+Math.max(0,item.value),0);return <div key={x.label} style={{width:(total?Math.max(0,x.value)/total*100:0)+"%",backgroundColor:i===0?"#0064E0":"#B5D2FC"}}/>;})}</div><div className="mt-3 flex flex-wrap gap-4">{result.breakdown.map((x,i)=><div key={x.label} className="text-xs"><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{backgroundColor:i===0?"#0064E0":"#B5D2FC"}}/><span className="text-[#8294A9]">{x.label}: </span><strong className="text-[#1E3B5A]">{format(x.value,"NGN")}</strong></div>)}</div></div>:null}
       <ProjectionChart result={result}/>
       <div className="rounded-xl bg-[#F6F9FD] p-4 text-xs leading-6 text-[#778BA5]"><Info size={16} className="mr-2 inline text-[#0064E0]"/>This is a planning estimate based entirely on your chosen assumptions. Actual results, charges, returns and taxes may differ.</div>
      </div>:null}
     </section>
    </div>
    {result?.rows.length?<section aria-label="Calculator projection schedule" className="min-w-0 overflow-hidden rounded-2xl border border-[#E9EFF6] bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDF2F8] p-4 sm:p-5"><div><h2 className="text-base font-bold text-[#173652]">Your projection schedule</h2><p className="mt-1 text-xs text-[#92A2B5]">{result.rows.length} periods · values rounded for display</p></div><div className="flex gap-2"><button type="button" onClick={()=>setShowAll(x=>!x)} className="rounded-full border border-[#DCE7F5] px-4 py-2 text-xs font-semibold text-[#416481]">{showAll?"Show fewer":"Show all rows"}</button><button type="button" onClick={exportRows} className="inline-flex items-center gap-2 rounded-full border border-[#DCE7F5] px-4 py-2 text-xs font-semibold text-[#416481]"><Download size={15}/> Export CSV</button></div></div>
      <div className="divide-y divide-slate-100 lg:hidden">{result.rows.slice(0,showAll?undefined:6).map((row,i)=><article key={i} className="p-4"><div className="flex items-center justify-between gap-3"><strong className="text-xs text-[#0064E0]">{result.columns[0]} {row[0]}</strong><span className="text-xs font-bold text-[#193955]">{format(row[row.length-1],"NGN")}</span></div><dl className="mt-3 grid grid-cols-2 gap-2">{row.slice(1,-1).map((v,j)=><div key={j} className="rounded-lg bg-[#F6F8FB] p-2"><dt className="text-[10px] text-[#8A9BAF]">{result.columns[j+1]}</dt><dd className="mt-1 break-words text-xs tabular-nums text-[#34536F]">{format(v,"NGN")}</dd></div>)}</dl></article>)}</div>
      <div className="hidden lg:block"><table className="w-full table-fixed text-left text-xs"><thead className="bg-[#F4F8FC] text-[#6E839B]"><tr>{result.columns.map(c=><th key={c} className="px-4 py-3 font-semibold">{c}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{result.rows.slice(0,showAll?undefined:6).map((row,i)=><tr key={i} className="hover:bg-[#F9FBFE]">{row.map((v,j)=><td key={j} className="break-words px-4 py-3 tabular-nums text-[#31516E]">{j===0?v:format(v,"NGN")}</td>)}</tr>)}</tbody></table></div>
     </section>:null}
    {notification?<p role="status" className="flex items-center gap-2 rounded-xl border border-[#DDEAF9] bg-[#F1F8FF] p-3 text-xs text-[#285783]"><Check size={16}/>{notification}</p>:null}
   </div>
  </div>
  <p className="flex items-start gap-2 text-xs leading-5 text-slate-500"><TrendingUp size={16} className="mt-0.5 shrink-0"/>These tools support business planning. They do not replace a qualified accountant, lender offer or independently verified tax rules.</p>
 </main>;
}
