let cached: {at:number;data:any}|null=null;
let flight:Promise<any>|null=null;
async function upstream(path:string){
 const r=await fetch('https://api.skinport.com/v1/'+path+'?app_id=730&currency=USD'+(path==='items'?'&tradable=1':''),{headers:{'Accept-Encoding':'br'},signal:AbortSignal.timeout(20000)});
 if(!r.ok)throw new Error('Skinport returned HTTP '+r.status);
 const data=await r.json();if(!Array.isArray(data))throw new Error('Unexpected provider response');return data;
}
export async function GET(){
 if(cached&&Date.now()-cached.at<300000)return Response.json({...cached.data,cached:true});
 try{
 if(!flight)flight=(async()=>{const [items,sales]=await Promise.allSettled([upstream('items'),upstream('sales/history')]);
 if(items.status==='rejected')throw items.reason;
 const data={items:items.value,sales:sales.status==='fulfilled'?sales.value:[],fetchedAt:new Date().toISOString(),source:'Skinport',salesError:sales.status==='rejected'?'Sales feed unavailable; valuation signals are withheld.':null};cached={at:Date.now(),data};return data;})();
 return Response.json(await flight,{headers:{'Cache-Control':'private, max-age=60'}});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Provider unavailable'}, {status:502});}finally{flight=null;}
}
