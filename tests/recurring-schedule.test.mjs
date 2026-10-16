import test from "node:test";
import assert from "node:assert/strict";
import {isValidRecurringDate,previewRecurringDates} from "../src/features/finance/recurring-schedule.ts";
test("date-only recurring preview rejects impossible and out-of-range dates",()=>{
 for(const date of ["2026-02-29","2026-02-30","2026-13-01","2026-00-01","2026-04-31","2026-2-1","1999-12-31","2101-01-01"]){
  assert.equal(isValidRecurringDate(date),false,date);
  assert.throws(()=>previewRecurringDates({start:date,cadence:"monthly",count:2}),/real start date/);
 }
 assert.equal(isValidRecurringDate("2028-02-29"),true);
});
test("month-end schedules retain their original calendar anchor",()=>{
 assert.deepEqual(previewRecurringDates({start:"2026-01-31",cadence:"monthly",count:4}),["2026-01-31","2026-02-28","2026-03-31","2026-04-30"]);
 assert.deepEqual(previewRecurringDates({start:"2028-02-29",cadence:"monthly",count:3}),["2028-02-29","2028-03-31","2028-04-30"]);
 assert.deepEqual(previewRecurringDates({start:"2026-01-30",cadence:"monthly",count:3}),["2026-01-30","2026-02-28","2026-03-30"]);
});
test("weekly, quarterly and yearly repeats use date-only calendar arithmetic",()=>{
 assert.deepEqual(previewRecurringDates({start:"2026-10-16",cadence:"weekly",count:3}),["2026-10-16","2026-10-23","2026-10-30"]);
 assert.deepEqual(previewRecurringDates({start:"2026-01-31",cadence:"quarterly",count:4}),["2026-01-31","2026-04-30","2026-07-31","2026-10-31"]);
 assert.deepEqual(previewRecurringDates({start:"2028-02-29",cadence:"yearly",count:3}),["2028-02-29","2029-02-28","2030-02-28"]);
});
test("inclusive optional cutoff prevents excess occurrences",()=>{
 assert.deepEqual(previewRecurringDates({start:"2026-11-01",end:"2027-01-01",cadence:"monthly",count:12}),["2026-11-01","2026-12-01","2027-01-01"]);
 assert.deepEqual(previewRecurringDates({start:"2026-11-01",end:"2026-11-01",cadence:"monthly",count:12}),["2026-11-01"]);
 assert.throws(()=>previewRecurringDates({start:"2026-11-01",end:"2026-10-31",cadence:"monthly",count:3}),/End date/);
 assert.throws(()=>previewRecurringDates({start:"2026-11-01",end:"2026-11-31",cadence:"monthly",count:3}),/End date/);
});
test("no unbounded preview counts or unsupported frequency",()=>{
 for(const count of [-1,0,1.5,13,Infinity,NaN])assert.throws(()=>previewRecurringDates({start:"2026-11-01",cadence:"monthly",count}),/between 1 and 12/);
 assert.throws(()=>previewRecurringDates({start:"2026-11-01",cadence:"daily",count:2}),/supported/);
 assert.deepEqual(previewRecurringDates({start:"2100-12-31",cadence:"yearly",count:2}),["2100-12-31"]);
});
