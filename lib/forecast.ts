export type Point={date:string;price:number};
function solve(a:number[][],b:number[]){const n=b.length;const m=a.map((r,i)=>[...r,b[i]]);for(let i=0;i<n;i++){let p=i;for(let j=i+1;j<n;j++)if(Math.abs(m[j][i])>Math.abs(m[p][i]))p=j;[m[i],m[p]]=[m[p],m[i]];const d=m[i][i];if(Math.abs(d)<1e-12)return Array(n).fill(0);for(let k=i;k<=n;k++)m[i][k]/=d;for(let j=0;j<n;j++)if(j!==i){const f=m[j][i];for(let k=i;k<=n;k++)m[j][k]-=f*m[i][k];}}return m.map(r=>r[n]);}
export function predict(values:number[],h:number,kind:string){
 const logs=values.map(Math.log);const anchor=logs.at(-1)!;
 if(kind==='naive')return Array(h).fill(values.at(-1));
 if(kind==='trend'){const y=logs.slice(-30),n=y.length,m=(n-1)/2,avg=y.reduce((a,b)=>a+b,0)/n;let cov=0,v=0;y.forEach((z,i)=>{cov+=(i-m)*(z-avg);v+=(i-m)**2;});const slope=Math.max(-.03,Math.min(.03,cov/v));return Array.from({length:h},(_,i)=>Math.exp(anchor+slope*(i+1)));}
 const ret=logs.slice(1).map((v,i)=>v-logs[i]);const a=Array.from({length:6},()=>Array(6).fill(0)),b=Array(6).fill(0);
 for(let t=5;t<ret.length;t++){const x=[1,...ret.slice(t-5,t).reverse()];for(let i=0;i<6;i++){b[i]+=x[i]*ret[t];for(let j=0;j<6;j++)a[i][j]+=x[i]*x[j];}}
 for(let i=1;i<6;i++)a[i][i]+=.1;
 const w=solve(a,b);let current=anchor;const out=[];for(let i=0;i<h;i++){const x=[1,...ret.slice(-5).reverse()];const r=Math.max(-.05,Math.min(.05,x.reduce((s,v,j)=>s+v*w[j],0)));ret.push(r);current+=r;out.push(Math.exp(current));}return out;
}
export function forecast(points:Point[],h:number,kind:string){
 if(points.length<90)throw new Error('At least 90 consecutive daily prices are required.');
 const values=points.map(p=>p.price),errors:number[]=[],base:number[]=[],residuals:number[]=[];
 const start=Math.max(45,values.length-60-h);for(let t=start;t+h<=values.length;t+=h){const train=values.slice(0,t),actual=values[t+h-1],p=predict(train,h,kind).at(-1)!;errors.push(Math.abs(p-actual)/actual);base.push(Math.abs(train.at(-1)!-actual)/actual);residuals.push(Math.abs(Math.log(actual/p)));}
 if(errors.length<2)throw new Error('Not enough holdout windows for this horizon. Import more history.');
 const mean=(a:number[])=>a.reduce((x,y)=>x+y,0)/a.length;const path=predict(values,h,kind);const spread=Math.max(...residuals);
 return {path,mape:mean(errors)*100,baseline:mean(base)*100,folds:errors.length,low:path.at(-1)!*Math.exp(-spread),high:path.at(-1)!*Math.exp(spread),last:values.at(-1)!};
}
export function parseHistory(text:string):Point[]{
 const rows=text.trim().split(/\r?\n/);if(rows.shift()?.replace(/\s/g,'').toLowerCase()!=='date,price')throw new Error('CSV header must be date,price. Prices must be USD for the selected exact item.');
 const pts=rows.filter(r=>r.trim()).map(row=>{const [date,raw,...extra]=row.split(',');const price=Number(raw);if(extra.length||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(price)||price<=0||Number.isNaN(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw new Error('Invalid date or price in CSV.');return {date,price};}).sort((a,b)=>a.date.localeCompare(b.date));
 for(let i=1;i<pts.length;i++)if(Date.parse(pts[i].date)-Date.parse(pts[i-1].date)!==86400000)throw new Error('Use exactly one observation per day, without gaps or duplicate dates.');
 if(pts.length<90||pts.length>5000)throw new Error('Import 90–5,000 daily observations.');if(Date.parse(pts.at(-1)!.date)>Date.now())throw new Error('Future observations cannot be training data.');return pts;
}
