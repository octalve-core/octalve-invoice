/* eslint-disable @typescript-eslint/no-require-imports -- standalone project text guard */
const fs=require("node:fs");
const path=require("node:path");
/**
 * Keep developer/test-environment terminology out of customer-facing application modules.
 * This scans all UI/source files. Historical engineering decisions and integration
 * credential names are documented separately and must not be rewritten blindly.
 */
const roots=["app","components","src"];
const ext=new Set([".ts",".tsx",".js",".jsx",".css"]);
const forbidden=new RegExp("\\b"+"sand"+"box"+"\\b","i");
const hits=[];
function walk(where){
 for(const entry of fs.readdirSync(where,{withFileTypes:true})){
  if(entry.name.startsWith(".")||entry.name==="node_modules")continue;
  const file=path.join(where,entry.name);
  if(entry.isDirectory()){walk(file);continue;}
  if(!entry.isFile()||!ext.has(path.extname(entry.name)))continue;
  const lines=fs.readFileSync(file,"utf8").split(/\r?\n/);
  for(let i=0;i<lines.length;i++)if(forbidden.test(lines[i]))hits.push(file+":"+(i+1));
 }
}
for(const root of roots)if(fs.existsSync(root))walk(root);
if(hits.length){console.error("Customer-facing source uses prohibited development terminology at:\n"+hits.join("\n"));process.exitCode=1;}
else console.log("Customer-facing terminology check passed: no forbidden text in app/components/src.");
