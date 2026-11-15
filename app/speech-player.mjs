// Keep native utterances alive and queue them during the user's click gesture.
export function createSpeechPlayer(synth,Utterance,{onState=()=>{},onError=()=>{}}={}){
 let session=0,queue=[];
 function clear(){session++;for(const u of queue){u.onstart=null;u.onend=null;u.onerror=null}queue=[];synth.cancel();onState(false)}
 function play(texts,{voiceURI='',rate=1,pitch=1}={}){
  clear();const current=session;
  const available=synth.getVoices().filter(v=>/^en(?:[-_]|$)/i.test(v.lang));
  const voice=available.find(v=>v.voiceURI===voiceURI)||available.find(v=>/^en[-_]US$/i.test(v.lang))||available[0];
  const parts=texts.map(t=>t.trim()).filter(Boolean);
  if(!parts.length){onError('沒有可朗讀的英文內容');return}
  queue=parts.map(text=>{const u=new Utterance(text);if(voice)u.voice=voice;u.lang=voice?.lang||'en-US';u.rate=rate;u.pitch=pitch;return u});
  const last=queue.length-1;
  queue.forEach((u,i)=>{u.onstart=()=>{if(current===session)onState(true)};u.onend=()=>{if(current===session&&i===last){queue=[];onState(false)}};u.onerror=e=>{if(current!==session)return;clear();if(e.error==='canceled'||e.error==='interrupted')return;onError(e.error==='not-allowed'?'瀏覽器未允許朗讀，請直接點擊朗讀按鈕重試。':e.error==='voice-unavailable'||e.error==='language-unavailable'?'這個聲音無法使用，請改選裝置預設聲音。':`朗讀未完成（${e.error||'未知錯誤'}），請試聽或更換聲音。`)}});
  // cancel() does not reset the paused state. Resume before starting a new queue.
  try{synth.resume();onState(true);for(const u of queue)synth.speak(u)}catch(e){clear();onError('無法啟動裝置朗讀，請重新點擊按鈕或更換聲音。')}
 }
 return {play,stop:clear};
}
