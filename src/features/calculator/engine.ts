/** Octalve finance calculators. Illustrative what-if maths, never authority to post ledger or tax entries.
 * All inputs are checked for finite bounded magnitudes. The backend must use integer minor units
 * or decimal arithmetic for invoices/payments. Rates are supplied by merchants, not legal defaults.
 */
export type CalculatorGroup="Borrowing"|"Savings & investment"|"Sales & pricing"|"Cash flow"|"Business analysis";
export type Field={key:string;label:string;unit:"NGN"|"%"|"months"|"years"|"count"|"days";min:number;max:number;initial:number;step?:number};
export type CalculatorDef={id:string;title:string;group:CalculatorGroup;description:string;fields:Field[];method:string};
export type Calculation={label:string;value:number;unit:"NGN"|"%"|"months"|"years"|"count"|"days";metrics:{label:string;value:number;unit:"NGN"|"%"|"months"|"years"|"count"|"days"}[];columns:string[];rows:number[][];notes:string;breakdown?:{label:string;value:number}[]};
type U=Field["unit"];
const field=(key:string,label:string,unit:U,initial:number,min=0,max=10000000000,step=1):Field=>({key,label,unit,initial,min,max,step});
const n=(key:string,initial:number,label=key)=>field(key,label,"NGN",initial);
const p=(key:string,initial:number,label=key)=>field(key,label,"%",initial,-100,100);
const months=field("months","Duration (months)","months",24,1,480);
const annual=field("years","Years","years",5,1,40);
export const calculatorDefinitions:CalculatorDef[]=[
 {id:"loan",title:"Loan repayments",group:"Borrowing",description:"Equal monthly repayments with a fixed nominal annual rate.",method:"Monthly amortization; fees and insurance excluded.",fields:[n("principal",2500000,"Loan amount"),field("rate","Interest per year","%",14,0,100),months]},
 {id:"loan-compare",title:"Loan comparison",group:"Borrowing",description:"Compare the lifetime repayment cost of two borrowing offers.",method:"Fixed-rate amortization. Compare fees and eligibility separately.",fields:[n("principal",2000000,"Loan amount"),field("rateA","Option A annual rate","%",16,0,100),field("rateB","Option B annual rate","%",12,0,100),months]},
 {id:"savings",title:"Savings goal",group:"Savings & investment",description:"Estimate the monthly amount needed to reach a savings target.",method:"End-of-month deposits and fixed monthly compounding; variable rates can change results.",fields:[n("target",5000000,"Savings goal"),n("initial",500000,"Current savings"),field("rate","Annual return","%",10,0,100),field("months","Time to goal (months)","months",36,1,480)]},
 {id:"investment",title:"Investment growth",group:"Savings & investment",description:"Project an initial investment with recurring monthly contributions.",method:"Monthly compounding and contributions at the end of each month; returns not guaranteed.",fields:[n("initial",1000000,"Initial investment"),n("deposit",50000,"Monthly contribution"),field("rate","Annual expected return","%",12,-99,100),annual]},
 {id:"compound",title:"Compound interest",group:"Savings & investment",description:"See how a lump sum could grow with compound interest.",method:"Nominal annual interest with monthly compounding, no deposits.",fields:[n("principal",1000000,"Starting amount"),field("rate","Annual interest","%",10,-99,100),annual]},
 {id:"rule72",title:"Rule of 72",group:"Savings & investment",description:"Quick approximation of years to double money.",method:"72 ÷ annual rate is an approximation, not a guaranteed outcome.",fields:[field("rate","Annual growth rate","%",12,0.01,100,0.25)]},
 {id:"roi",title:"Return on investment",group:"Business analysis",description:"Calculate the percentage gain or loss on a business investment.",method:"Net benefit is net proceeds minus the full investment cost; taxes excluded.",fields:[n("cost",500000,"Investment cost"),n("proceeds",650000,"Net amount received")]},
 {id:"npv",title:"Net present value",group:"Business analysis",description:"Discount a repeated annual cash inflow against today's investment.",method:"Assumes equal year-end net cash flows and a fixed discount rate; no terminal value.",fields:[n("cost",1000000,"Initial investment"),n("inflow",300000,"Annual net inflow"),field("rate","Annual discount rate","%",12,0,100),annual]},
 {id:"breakeven",title:"Break-even units",group:"Sales & pricing",description:"Work out how many units cover your fixed operating cost.",method:"Fixed cost ÷ (unit selling price − unit variable cost), rounded up.",fields:[n("fixed",300000,"Total fixed costs"),n("price",5000,"Price per unit"),n("variable",3000,"Variable cost per unit")]},
 {id:"margin",title:"Margin & markup",group:"Sales & pricing",description:"Determine gross profit, margin on sales and markup on cost.",method:"Gross margin uses sales price as denominator; markup uses cost.",fields:[n("cost",8500,"Cost price"),n("price",12000,"Selling price")]},
 {id:"pricing",title:"Target selling price",group:"Sales & pricing",description:"Find a selling price that achieves a desired gross margin.",method:"Selling price = unit cost ÷ (1 − target margin). Does not account for tax.",fields:[n("cost",5000,"Cost per unit"),field("rate","Target gross margin","%",30,0,99.9,0.5)]},
 {id:"discount",title:"Discount & sales tax",group:"Sales & pricing",description:"Calculate a customer discount and a separately entered sales tax.",method:"Discount applied before the user-entered tax rate. Do not treat as automatic NRS tax classification.",fields:[n("price",100000,"Listed price"),field("discount","Discount rate","%",10,0,100),field("rate","Applicable tax rate","%",0,0,100)]},
 {id:"tax-exclusive",title:"Inclusive / exclusive tax",group:"Sales & pricing",description:"Separate a tax-inclusive price into base and tax components.",method:"Tax portion = gross × rate/(100+rate). Rate must be verified for the line.",fields:[n("gross",107500,"Total including tax"),field("rate","Applicable tax rate","%",0,0,100)]},
 {id:"runway",title:"Cash runway",group:"Cash flow",description:"Estimate how many months business cash will cover net operating burn.",method:"Net burn = recurring monthly expenses − recurring monthly cash collections, assuming no other cash flows.",fields:[n("cash",1200000,"Cash on hand"),n("expenses",450000,"Monthly operating cash outflow"),n("income",250000,"Monthly incoming cash")]},
 {id:"working-capital",title:"Working capital",group:"Cash flow",description:"Check short-term liquidity and current ratio.",method:"Current assets less current liabilities; excludes noncurrent items.",fields:[n("assets",2500000,"Current assets"),n("liabilities",1250000,"Current liabilities")]},
 {id:"cash-forecast",title:"Cash-flow projection",group:"Cash flow",description:"Forecast monthly cash at a constant inflow and outflow.",method:"Deterministic forecast from user assumptions; does not pull actual bank movements.",fields:[n("cash",700000,"Opening cash"),n("income",350000,"Monthly receipts"),n("expenses",250000,"Monthly payments"),field("months","Projection length (months)","months",12,1,60)]},
 {id:"dso",title:"Days sales outstanding",group:"Business analysis",description:"Estimate average receivable collection time.",method:"Average receivables ÷ net credit sales × period days; not based on receipt count.",fields:[n("receivables",400000,"Average receivables"),n("sales",1800000,"Net credit sales"),field("days","Period days","days",90,1,366)]},
 {id:"depreciation",title:"Straight-line depreciation",group:"Business analysis",description:"Annual asset depreciation over its useful life.",method:"(Purchase cost − residual value) ÷ useful life; excludes local tax allowances.",fields:[n("cost",1000000,"Asset purchase cost"),n("salvage",100000,"Estimated residual value"),annual]},
 {id:"payroll",title:"Payroll cost budget",group:"Cash flow",description:"Estimate total monthly staff cost, excluding statutory deductions.",method:"Gross base pay plus user-entered employer-side additional costs; not Nigerian payroll tax compliance.",fields:[n("salary",120000,"Gross pay per employee"),field("count","Number of employees","count",6,1,10000),field("rate","Employer cost uplift","%",10,0,100)]},
 {id:"payment-plan",title:"Invoice installment split",group:"Sales & pricing",description:"Preview two proposed invoice installments without recording a payment.",method:"Percentages allocate the invoice amount, not cash receipts; exact posting needs integer kobo ledger.",fields:[n("total",150000,"Invoice amount"),field("rate","First installment","%",70,1,99)]}
];
export const calculatorGroups:CalculatorGroup[]=["Borrowing","Savings & investment","Sales & pricing","Cash flow","Business analysis"];
export const getCalculator=(id:string)=>calculatorDefinitions.find(x=>x.id===id);
const valid=(n:number)=>Number.isFinite(n)&&Math.abs(n)<=1e15;
function enforce(id:string,values:Record<string,number>){
 const def=getCalculator(id);if(!def)throw new Error("Unknown calculator");
 const out:Record<string,number>={};
 for(const f of def.fields){
  const x=values[f.key];if(!valid(x)||x<f.min||x>f.max||(["count","days","months","years"].includes(f.unit)&&!Number.isInteger(x)))throw new Error("Check "+f.label+": enter a valid number within the stated range");
  out[f.key]=x;
 }
 return out;
}
const money=(label:string,value:number)=>({label,value,unit:"NGN" as const});
const pct=(label:string,value:number)=>({label,value,unit:"%" as const});
const count=(label:string,value:number,unit:"count"|"days"|"months"|"years"="count")=>({label,value,unit});
function loanPayment(amount:number,annualRate:number,periods:number){
 const r=annualRate/1200;
 return r===0?amount/periods:amount*r/(-Math.expm1(-periods*Math.log1p(r)));
}
function growthSeries(initial:number,deposit:number,rate:number,periods:number){
 let balance=initial;const rows:number[][]=[];let contributions=initial,earnings=0;
 for(let i=1;i<=periods;i++){
  const gain=balance*rate;
  balance+=gain+deposit;contributions+=deposit;earnings+=gain;
  if(!valid(balance))throw new Error("Projection exceeds supported range");
  rows.push([i,deposit,gain,contributions,balance]);
 }
 return {balance,contributions,earnings,rows};
}
function loanRows(principal:number,rate:number,months:number){
 let balance=principal,totalInterest=0;const pmt=loanPayment(principal,rate,months);const rows:number[][]=[];
 for(let i=1;i<=months;i++){
  const interest=balance*rate/1200;
  const applied=i===months?balance:Math.min(balance,Math.max(0,pmt-interest));
  const payment=applied+interest;balance=Math.max(0,balance-applied);totalInterest+=interest;
  rows.push([i,payment,applied,interest,balance]);
 }
 return {rows,totalInterest,monthly:pmt};
}
const create=(label:string,value:number,unit:Calculation["unit"],metrics:Calculation["metrics"],notes:string,columns:string[]=[],rows:number[][]=[],breakdown?:Calculation["breakdown"]):Calculation=>{
 if(!valid(value)||!metrics.every(m=>valid(m.value))||!rows.every(r=>r.every(valid)))throw new Error("Result is outside supported range. Reduce amounts or term.");
 return {label,value,unit,metrics,columns,rows,notes,breakdown};
};
export function calculateFinance(id:string,provided:Record<string,number>):Calculation{
 const v=enforce(id,provided);const d=getCalculator(id)!;
 switch(id){
 case "loan":{
  const a=loanRows(v.principal,v.rate,v.months);
  return create("Monthly repayment",a.monthly,"NGN",[money("Total interest",a.totalInterest),money("Total repayment",v.principal+a.totalInterest),money("Loan amount",v.principal)],d.method,["Month","Payment","Principal","Interest","Remaining"],a.rows,[{label:"Principal",value:v.principal},{label:"Interest",value:a.totalInterest}]);
 }
 case "loan-compare":{
  const a=loanRows(v.principal,v.rateA,v.months),b=loanRows(v.principal,v.rateB,v.months);
  return create("Monthly payment — option B",b.monthly,"NGN",[money("Option A monthly",a.monthly),money("Option B total interest",b.totalInterest),money("Interest saved with B",a.totalInterest-b.totalInterest)],d.method,["Month","Option A balance","Option B balance"],a.rows.map((r,i)=>[i+1,r[4],b.rows[i][4]]));
 }
 case "savings":{
  const rate=v.rate/1200,factor=Math.pow(1+rate,v.months);
  const annuity=rate===0?v.months:(factor-1)/rate;
  const deposit=Math.max(0,(v.target-v.initial*factor)/annuity);
  const a=growthSeries(v.initial,deposit,rate,v.months);
  return create("Monthly savings needed",deposit,"NGN",[money("Your contributions",a.contributions),money("Projected earnings",a.earnings),money("Projected balance",a.balance)],d.method,["Month","Deposit","Interest","Contributions","Balance"],a.rows,[{label:"Contributions",value:a.contributions},{label:"Earnings",value:Math.max(0,a.earnings)}]);
 }
 case "investment":case "compound":{
  const principal=id==="investment"?v.initial:v.principal;
  const a=growthSeries(principal,id==="investment"?v.deposit:0,v.rate/1200,v.years*12);
  return create("Projected future value",a.balance,"NGN",[money("Total invested",a.contributions),money("Estimated growth",a.earnings),count("Years",v.years,"years")],d.method,["Month","Contribution","Growth","Invested","Value"],a.rows,[{label:"Contributions",value:a.contributions},{label:"Growth",value:Math.max(0,a.earnings)}]);
 }
 case "rule72":return create("Approximate doubling period",72/v.rate,"years",[count("Doubling time (years)",72/v.rate,"years"),pct("Assumed rate",v.rate)],d.method);
 case "roi":{
  if(v.cost<=0)throw new Error("Investment cost must exceed zero");
  const net=v.proceeds-v.cost;
  return create("Investment ROI",net/v.cost*100,"%",[money("Investment cost",v.cost),money("Net result",net),money("Proceeds",v.proceeds)],d.method);
 }
 case "npv":{
  let npv=-v.cost;const rows:number[][]=[];
  for(let i=1;i<=v.years;i++){const pv=v.inflow/Math.pow(1+v.rate/100,i);npv+=pv;rows.push([i,v.inflow,pv,npv]);}
  return create("Net present value",npv,"NGN",[money("Initial cost",v.cost),money("Undiscounted receipts",v.inflow*v.years),money("NPV",npv)],d.method,["Year","Cash inflow","Discounted value","Cumulative NPV"],rows);
 }
 case "breakeven":{
  const cm=v.price-v.variable;if(cm<=0)throw new Error("Selling price must exceed variable cost");
  const units=Math.ceil(v.fixed/cm);
  return create("Units to break even",units,"count",[money("Contribution per unit",cm),money("Break-even sales",units*v.price),money("Fixed costs",v.fixed)],d.method);
 }
 case "margin":{
  if(v.cost<=0||v.price<=0)throw new Error("Cost and selling price must exceed zero");
  const profit=v.price-v.cost;
  return create("Gross margin",profit/v.price*100,"%",[money("Unit gross profit",profit),pct("Markup on cost",profit/v.cost*100),money("Selling price",v.price)],d.method);
 }
 case "pricing":{
  if(v.rate>=100)throw new Error("Margin must be below 100%");
  const price=v.cost/(1-v.rate/100);
  return create("Target selling price",price,"NGN",[money("Unit cost",v.cost),money("Required gross profit",price-v.cost),pct("Target margin",v.rate)],d.method);
 }
 case "discount":{
  const amount=v.price*v.discount/100,base=v.price-amount,tax=base*v.rate/100;
  return create("Customer total",base+tax,"NGN",[money("Discount",amount),money("Tax (user-entered rate)",tax),money("Subtotal after discount",base)],d.method);
 }
 case "tax-exclusive":{
  const base=v.gross/(1+v.rate/100);
  return create("Price before tax",base,"NGN",[money("Tax portion",v.gross-base),money("Price incl. tax",v.gross),pct("User-entered rate",v.rate)],d.method);
 }
 case "runway":{
  const burn=v.expenses-v.income;
  if(burn<=0)return create("Net monthly cash surplus",-burn,"NGN",[money("Available cash",v.cash),money("Monthly surplus",-burn)],"No finite burn-based runway while estimated income covers expenses.");
  return create("Estimated cash runway",v.cash/burn,"months",[money("Net monthly burn",burn),money("Opening cash",v.cash),count("Whole months funded",Math.floor(v.cash/burn),"months")],d.method);
 }
 case "working-capital":{
  const capital=v.assets-v.liabilities,ratio=v.liabilities===0?null:v.assets/v.liabilities;
  return create("Net working capital",capital,"NGN",[money("Current assets",v.assets),money("Current liabilities",v.liabilities),...(ratio==null?[]:[count("Current ratio",ratio)])],ratio==null?"Current ratio is undefined because liabilities are zero.":d.method);
 }
 case "cash-forecast":{
  let cash=v.cash;const rows:number[][]=[];
  for(let i=1;i<=v.months;i++){const opening=cash;cash+=v.income-v.expenses;rows.push([i,opening,v.income,v.expenses,cash]);}
  return create("Closing cash estimate",cash,"NGN",[money("Net monthly change",v.income-v.expenses),money("Opening cash",v.cash),count("Months projected",v.months,"months")],d.method,["Month","Opening","Inflows","Outflows","Closing"],rows);
 }
 case "dso":{
  if(v.sales<=0)throw new Error("Credit sales must exceed zero");
  const days=v.receivables/v.sales*v.days;
  return create("Days sales outstanding",days,"days",[money("Average receivables",v.receivables),money("Period credit sales",v.sales),count("Period length",v.days,"days")],d.method);
 }
 case "depreciation":{
  if(v.salvage>v.cost)throw new Error("Residual value cannot exceed purchase cost");
  const annual=(v.cost-v.salvage)/v.years,rows:number[][]=[];
  for(let i=1;i<=v.years;i++)rows.push([i,annual,Math.max(v.salvage,v.cost-i*annual)]);
  return create("Annual depreciation",annual,"NGN",[money("Depreciable amount",v.cost-v.salvage),money("Residual value",v.salvage),count("Useful life",v.years,"years")],d.method,["Year","Depreciation","Book value"],rows);
 }
 case "payroll":{
  const total=v.salary*v.count*(1+v.rate/100);
  return create("Estimated monthly staff cost",total,"NGN",[money("Base monthly payroll",v.salary*v.count),money("Employer-side costs",total-v.salary*v.count),money("Annual budget",total*12)],d.method);
 }
 case "payment-plan":{
  if(v.total<=0)throw new Error("Invoice total must exceed zero");
  const cents=Math.round(v.total*100);
  if(!Number.isSafeInteger(cents))throw new Error("Invoice amount exceeds safe minor-unit range");
  const first=Number(BigInt(cents)*BigInt(v.rate)/BigInt(100))/100,remaining=(cents-Math.round(first*100))/100;
  return create("First installment",first,"NGN",[money("Remaining installment",remaining),pct("First milestone percentage",v.rate),money("Invoice total",v.total)],d.method);
 }
 default:throw new Error("Unsupported calculator");
 }
}
