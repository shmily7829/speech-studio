import {getChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {practice} from '../../../db/schema';
import {eq,and} from 'drizzle-orm';
import {validData} from './validation';
import {enrichLibrary} from './timestamps';
export const dynamic='force-dynamic';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
function key(request:Request,userId:string){const id=new URL(request.url).searchParams.get('speech')||'leadership';if(!/^[a-zA-Z0-9-]{1,80}$/.test(id))throw Error('無效的講稿');return id==='leadership'?userId:userId+':'+id;}
export async function GET(request:Request){const user=await getChatGPTUser();if(!user)return reply({error:'請登入後同步'},401);let id;try{id=key(request,user.userId)}catch{return reply({error:'無效的講稿'},400)}const row=await getDb().select().from(practice).where(eq(practice.userId,id)).get();return reply(row?{data:await enrichLibrary(JSON.parse(row.data),user.userId),revision:row.revision}:{data:null,revision:0});}
export async function POST(request:Request){const user=await getChatGPTUser();if(!user)return reply({error:'請登入後同步'},401);if(request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'不允許的來源'},403);let id;try{id=key(request,user.userId)}catch{return reply({error:'無效的講稿'},400)}const raw=await request.text();if(raw.length>3000000)return reply({error:'內容過長，請先匯出舊版本備份'},413);let b;try{b=JSON.parse(raw)}catch{return reply({error:'格式錯誤'},400)}if(!Number.isInteger(b.revision)||b.revision<0||!validData(b.data))return reply({error:'資料格式錯誤'},400);const db=getDb();const previous=await db.select().from(practice).where(eq(practice.userId,id)).get();const old=previous?JSON.parse(previous.data):null;if(b.data.kind!=='library'){const changed=!old||JSON.stringify(old.sections)!==JSON.stringify(b.data.sections);b.data.lastEditedAt=changed?new Date().toISOString():old.lastEditedAt;}
if(b.revision===0){const result=await db.insert(practice).values({userId:id,data:JSON.stringify(b.data),revision:1}).onConflictDoNothing().returning().get();return result?reply({revision:1,lastEditedAt:b.data.lastEditedAt}):reply({error:'另一台裝置有更新，請先重新載入'},409)}const result=await db.update(practice).set({data:JSON.stringify(b.data),revision:b.revision+1}).where(and(eq(practice.userId,id),eq(practice.revision,b.revision))).returning().get();return result?reply({revision:result.revision,lastEditedAt:b.data.lastEditedAt}):reply({error:'另一台裝置有更新，請先匯出備份再重新載入'},409);}

