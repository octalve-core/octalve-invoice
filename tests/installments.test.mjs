import test from "node:test";
import assert from "node:assert/strict";
import {splitInstallment,allocateStages} from "../src/features/invoices/lib/installments.ts";
test("70/30 splits exact kobo without an invented extra charge",()=>{
 const [a,b]=splitInstallment(10000001,70);
 assert.equal(a,7000000);assert.equal(b,3000001);assert.equal(a+b,10000001);
});
test("arbitrary N-stage percentages have exact residual allocation",()=>{
 for(const amount of [1,3,11,10000001,Number.MAX_SAFE_INTEGER]){
  const parts=allocateStages(amount,[33,33,34]);
  assert.equal(parts.reduce((a,b)=>a+b,0),amount);
  assert.ok(parts.every(Number.isSafeInteger));
 }
});
test("invalid payment plans fail closed",()=>{
 for(const p of [-1,0,99.5,100,101,NaN])assert.throws(()=>splitInstallment(100000,p),/Invalid installment plan/);
 assert.throws(()=>splitInstallment(-1,70));
 assert.throws(()=>splitInstallment(Number.MAX_SAFE_INTEGER+1,70));
 assert.throws(()=>allocateStages(10000,[50,40]),/Stage percentages/);
 assert.throws(()=>allocateStages(10000,[0,100]),/Stage percentages/);
});
