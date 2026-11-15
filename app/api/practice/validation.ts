export function validData(data:any){
 if(!data||typeof data!=='object')return false;
 if(data.kind==='library')return Array.isArray(data.speeches)&&data.speeches.length<=200&&data.speeches.every((s:any)=>s&&/^[a-zA-Z0-9-]{1,80}$/.test(s.id)&&typeof s.title==='string'&&s.title.length<=160&&typeof s.projectId==='string'&&typeof s.date==='string');
 const validSections=(ss:any)=>Array.isArray(ss)&&ss.length>0&&ss.length<=100&&ss.every((s:any)=>s&&['en','zh','title','label','cue','tip'].every(k=>typeof s[k]==='string')&&s.en.length<=80000);
 return validSections(data.sections)&&Array.isArray(data.history)&&data.history.length<=100&&data.history.every((h:any)=>h&&Number.isFinite(h.seconds)&&h.seconds>=0&&typeof h.date==='string'&&typeof h.scope==='string')&&Array.isArray(data.done)&&data.done.every((d:any)=>Number.isInteger(d)&&d>=0&&d<data.sections.length)&&(!data.versions||(Array.isArray(data.versions)&&data.versions.length<=5&&data.versions.every((v:any)=>v&&typeof v.date==='string'&&validSections(v.sections))));
}
