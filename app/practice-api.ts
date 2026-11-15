export const localMode=import.meta.env.VITE_STATIC==='true';
export async function practiceFetch(input:string,init?:RequestInit):Promise<Response>{
 if(!localMode)return fetch(input,init);
 try{const {localRequest}=await import('../pages/storage');return await localRequest(input,init)}catch(e){return Response.json({error:'無法保存至這台裝置，請匯出備份。'+String(e)},{status:507})}
}
