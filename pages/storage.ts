import manifest from '../speeches/manifest.json';
import {validData} from '../app/api/practice/validation';
const files=import.meta.glob('../speeches/*/speech.json',{eager:true,import:'default'}) as Record<string,any>;
const prefix='speech-studio-pages:v1:';
type RecordData={data:any;revision:number};
function seed(id:string):RecordData{if(id==='library')return {revision:0,data:{kind:'library',speeches:manifest.map(s=>({...s}))}};const f=files[`../speeches/${id}/speech.json`];return {revision:0,data:f?{sections:f.sections,history:f.history||[],done:f.done||[],versions:f.versions||[],lastEditedAt:f.lastEditedAt}:null}}
function read(id:string):RecordData{const item=localStorage.getItem(prefix+id);return item?JSON.parse(item):seed(id)}
function enrich(data:any){if(data?.kind!=='library')return data;return {...data,speeches:data.speeches.map((s:any)=>({...s,lastEditedAt:read(s.id).data?.lastEditedAt}))}}
export async function localRequest(input:string,init?:RequestInit){const id=new URL(input,location.origin).searchParams.get('speech')||'leadership';if(!/^[a-zA-Z0-9-]{1,80}$/.test(id))return Response.json({error:'講稿編號錯誤'},{status:400});
 // Prevent two tabs from overwriting one another when the browser supports Web Locks.
 const run=()=>{const old=read(id);if(!init?.method||init.method==='GET')return Response.json({...old,data:enrich(old.data)});const b=JSON.parse(String(init.body));if(!validData(b.data))return Response.json({error:'資料格式錯誤'},{status:400});if(b.revision!==old.revision)return Response.json({error:'另一個分頁已更新，請先備份再重新載入'},{status:409});if(b.data.kind!=='library')b.data.lastEditedAt=JSON.stringify(b.data.sections)!==JSON.stringify(old.data?.sections)?new Date().toISOString():old.data?.lastEditedAt;const result={data:b.data,revision:old.revision+1};localStorage.setItem(prefix+id,JSON.stringify(result));return Response.json({revision:result.revision,lastEditedAt:b.data.lastEditedAt})};
 return navigator.locks?navigator.locks.request(prefix+id,run):run();
}
export function exportBackup(){const data:Record<string,RecordData>={};const library=read('library');data.library=library;for(const s of library.data.speeches)data[s.id]=read(s.id);return {format:'speech-studio-backup',version:1,exportedAt:new Date().toISOString(),records:data}}
export async function importBackup(value:any){if(value?.format!=='speech-studio-backup'||value.version!==1||!value.records?.library||!validData(value.records.library.data))throw Error('不是有效的演講庫備份');const entries=Object.entries(value.records) as [string,RecordData][];if(entries.length>201)throw Error('講稿數量過多');for(const [id,record]of entries){if(!/^[a-zA-Z0-9-]{1,80}$/.test(id)||!validData(record?.data))throw Error('備份內容不完整')}for(const s of value.records.library.data.speeches)if(!value.records[s.id])throw Error('缺少講稿內容');
 const before=entries.map(([id])=>[prefix+id,localStorage.getItem(prefix+id)] as const);try{for(const [id,record]of entries)localStorage.setItem(prefix+id,JSON.stringify({data:record.data,revision:read(id).revision+1}))}catch(e){for(const [key,old]of before){if(old===null)localStorage.removeItem(key);else localStorage.setItem(key,old)}throw e}
}
