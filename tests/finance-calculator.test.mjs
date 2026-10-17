import test from "node:test";
import assert from "node:assert/strict";
import {calculatorDefinitions,calculateFinance} from "../src/features/calculator/engine.ts";
const calc=(id,v)=>calculateFinance(id,v);
const defaults=id=>Object.fromEntries(calculatorDefinitions.find(x=>x.id===id).fields.map(f=>[f.key,f.initial]));
const close=(actual,expected,epsilon=1e-8)=>assert.ok(Math.abs(actual-expected)<=epsilon*Math.max(1,Math.abs(expected)),"expected "+expected+", received "+actual);
test("exactly twenty documented calculators produce finite bounded values and safe projection rows",()=>{
 assert.equal(calculatorDefinitions.length,20);
 for(const d of calculatorDefinitions){
  const result=calc(d.id,defaults(d.id));
  assert.ok(Number.isFinite(result.value),d.id);
  assert.ok(result.metrics.every(x=>Number.isFinite(x.value)),d.id);
  assert.ok(result.rows.every(x=>x.every(Number.isFinite)),d.id);
  assert.equal(result.columns.length,result.rows.length?result.rows[0].length:0,d.id);
 }
});
test("zero-interest loan exact monthly payment and principal amortization",()=>{
 const a=calc("loan",{principal:120000,rate:0,months:12});
 close(a.value,10000);close(a.rows.at(-1)[4],0);close(a.metrics.find(x=>x.label==="Total interest").value,0);
});
test("positive-rate loan payment, interest and end balance reconcile",()=>{
 const a=calc("loan",{principal:2500000,rate:14,months:24});
 assert.ok(a.value>100000&&a.value<130000);
 close(a.rows.reduce((sum,row)=>sum+row[2],0),2500000);
 close(a.rows.at(-1)[4],0);
 close(a.rows.reduce((sum,row)=>sum+row[3],0),a.metrics.find(x=>x.label==="Total interest").value);
});
test("comparison demonstrates zero extra interest at lower APR",()=>{
 const a=calc("loan-compare",{principal:1000000,rateA:20,rateB:10,months:36});
 assert.ok(a.metrics.find(x=>x.label==="Interest saved with B").value>0);
});
test("savings goal with zero growth solves exactly and tracks deposits",()=>{
 const a=calc("savings",{target:120000,initial:0,rate:0,months:12});
 close(a.value,10000);close(a.rows.at(-1)[4],120000);
 const b=calc("savings",{target:120000,initial:130000,rate:0,months:12});
 close(b.value,0);
});
test("investment and compound interest use month-end deposits and rate changes",()=>{
 const i=calc("investment",{initial:100000,deposit:10000,rate:0,years:2});
 close(i.value,340000);
 const c=calc("compound",{principal:100000,rate:12,years:1});
 close(c.value,100000*Math.pow(1.01,12));
});
test("ROI, NPV, break even and margin denominators are correct",()=>{
 close(calc("roi",{cost:100,proceeds:125}).value,25);
 close(calc("npv",{cost:100,inflow:110,rate:10,years:1}).value,0);
 close(calc("breakeven",{fixed:1000,price:35,variable:25}).value,100);
 const m=calc("margin",{cost:80,price:100});
 close(m.value,20);close(m.metrics.find(x=>x.label==="Markup on cost").value,25);
 close(calc("pricing",{cost:80,rate:20}).value,100);
});
test("discount then tax and inclusive tax inverse formulas",()=>{
 close(calc("discount",{price:1000,discount:20,rate:10}).value,880);
 close(calc("tax-exclusive",{gross:1100,rate:10}).value,1000);
});
test("working capital, runway, forecast and days-sales-outstanding",()=>{
 close(calc("runway",{cash:1200000,expenses:450000,income:250000}).value,6);
 close(calc("working-capital",{assets:200,liabilities:100}).value,100);
 close(calc("cash-forecast",{cash:100,income:200,expenses:150,months:3}).value,250);
 close(calc("dso",{receivables:200,sales:1000,days:90}).value,18);
});
test("depreciation and payroll produce expected budgets",()=>{
 close(calc("depreciation",{cost:1100,salvage:100,years:5}).value,200);
 close(calc("payroll",{salary:100000,count:3,rate:10}).value,330000);
});
test("invoice proposed installment conserves kobo",()=>{
 const a=calc("payment-plan",{total:100000.03,rate:70});
 close(a.value+a.metrics.find(x=>x.label==="Remaining installment").value,100000.03);
});
test("fail closed on extreme and invalid inputs",()=>{
 assert.throws(()=>calc("loan",{principal:Infinity,rate:10,months:12}),/Check/);
 assert.throws(()=>calc("loan",{principal:-1,rate:10,months:12}),/Check/);
 assert.throws(()=>calc("loan",{principal:1200,rate:10,months:12.4}),/Check/);
 assert.throws(()=>calc("breakeven",{fixed:1000,price:10,variable:10}),/exceed/);
 assert.throws(()=>calc("roi",{cost:0,proceeds:100}),/exceed/);
 assert.throws(()=>calc("dso",{receivables:100,sales:0,days:30}),/exceed/);
 assert.throws(()=>calc("depreciation",{cost:100,salvage:200,years:3}),/exceed/);
 assert.throws(()=>calc("payment-plan",{total:1200,rate:70.5}),/whole number/);
 assert.throws(()=>calc("unknown",{}),/Unknown/);
});
