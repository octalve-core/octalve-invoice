"use client";
import type {ReactNode} from "react";
import {ChevronRight} from "lucide-react";

export type RecordTableCell={value:ReactNode;emphasis?:boolean;className?:string};
export type RecordTableRow={
 id:string;
 cells:RecordTableCell[];
 action?:{label:string;onClick:()=>void};
};
/** Canonical desktop table for RecordDirectory-adjacent modules.
 * Column sizing, visual rhythm, navigation, and focus treatment remain consistent
 * while specialized business modules control their own permitted content/actions.
 * Mobile layouts continue to use RecordMobileCard rather than a scrollable table.
 */
export function RecordDataTable({headers,rows,label}:{
 headers:readonly string[];
 rows:readonly RecordTableRow[];
 label:string;
}){
 const hasActions=rows.some(r=>r.action);
 if(rows.some(r=>r.cells.length!==headers.length))throw new Error("Record table columns and cells must align");
 return <table aria-label={label} className="w-full table-fixed text-left text-sm">
  <thead className="bg-[#F5F8FC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
   <tr>{headers.map((h,i)=><th key={i} scope="col" className={"break-words px-4 py-3 font-semibold "+(i===0?"w-[18%]":"")}>{h||<span className="sr-only">Actions</span>}</th>)}{hasActions?<th scope="col" className="w-[52px] px-2 py-3"><span className="sr-only">Actions</span></th>:null}</tr>
  </thead>
  <tbody className="divide-y divide-[#EEF2F6]">
   {rows.map(row=><tr key={row.id} className="hover:bg-[#F7FAFF]">
    {row.cells.map((cell,i)=><td key={i} className={"break-words px-4 py-4 text-xs "+(cell.emphasis?"font-semibold text-[#0064E0]":"text-[#3B5068]")+(cell.className?" "+cell.className:"")}>{cell.value}</td>)}
    {hasActions?<td className="px-2 py-3">{row.action?<button type="button" aria-label={row.action.label} onClick={row.action.onClick} className="rounded-lg p-2 text-[#0064E0] hover:bg-[#EAF3FF] focus-visible:outline-2 focus-visible:outline-[#0064E0]"><ChevronRight size={17}/></button>:null}</td>:null}
   </tr>)}
  </tbody>
 </table>;
}
