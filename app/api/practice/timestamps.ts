import {getDb} from '../../../db';
import {practice} from '../../../db/schema';
import {inArray} from 'drizzle-orm';
export async function enrichLibrary(data:any,userId:string){
 if(data?.kind!=='library')return data;
 const ids=data.speeches.map((s:any)=>s.id==='leadership'?userId:userId+':'+s.id);
 const saved=new Map<string,any>();
 for(let i=0;i<ids.length;i+=40){const rows=await getDb().select().from(practice).where(inArray(practice.userId,ids.slice(i,i+40))).all();for(const row of rows){try{saved.set(row.userId,JSON.parse(row.data))}catch{}}}
 return {...data,speeches:data.speeches.map((s:any)=>{const record=saved.get(s.id==='leadership'?userId:userId+':'+s.id);return {...s,lastEditedAt:record?.lastEditedAt||undefined}})};
}
