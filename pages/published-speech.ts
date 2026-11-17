// Apply an explicitly published revision once, retaining the device's prior draft.
export function applyPublishedSpeech(record:any,published:any){
 if(!published?.publishedVersion||!record.data||record.data.publishedVersion===published.publishedVersion)return record;
 const previous=record.data;
 return {revision:record.revision+1,data:{...previous,sections:published.sections,done:[],publishedVersion:published.publishedVersion,lastEditedAt:published.lastEditedAt,versions:[{date:previous.lastEditedAt||new Date().toISOString(),sections:previous.sections},...(previous.versions||[])].filter(v=>v.sections?.length).slice(0,5)}};
}
