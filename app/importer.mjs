export function parseSpeech(raw,mode='paragraphs'){
 const text=raw.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').trim();
 if(!text)throw Error('檔案沒有文字');
 if(text.includes('\uFFFD'))throw Error('文字編碼有問題，請另存成 UTF-8 再匯入');
 if(text.length>80000)throw Error('一篇講稿上限為 80,000 字元');
 const hasHeading=/^#{1,3}\s+.+$/m.test(text);
 if(mode==='headings'&&!hasHeading)throw Error('未找到標題，請以 ## 段落名稱 標示，或改用空白行分段');
 let groups=[];
 if(mode==='headings'){
  let title='',lines=[]; const push=()=>{if(lines.join('\n').trim())groups.push({title,body:lines.join('\n')});lines=[]};
  for(const line of text.split('\n')){if(/^#{1,3}\s+/.test(line)){push();title=line.replace(/^#{1,3}\s+/,'').trim()}else lines.push(line)}push();
 }else groups=text.split(/\n\s*\n/).filter(Boolean).map((body,i)=>({title:`段落 ${i+1}`,body}));
 if(groups.length>100)throw Error('段落超過 100，請合併相近段落');
 return groups.map((g,i)=>{let en=[],zh=[],lang='en';for(const line of g.body.split('\n')){const m=line.match(/^\s*(EN|ZH|英文|中文)\s*[:：]\s*(.*)$/i);if(m){lang=/^(ZH|中文)$/i.test(m[1])?'zh':'en';(lang==='en'?en:zh).push(m[2])}else (lang==='en'?en:zh).push(line)}const english=en.join('\n').replace(/^#{1,3}\s+.+$/gm,'').trim();if(!english)throw Error(`第 ${i+1} 段沒有英文正文`);if(/[\u3400-\u9fff]/u.test(english))throw Error(`第 ${i+1} 段英文中含中文。雙語稿請用 ## 標題分段，並以 EN: / ZH: 標示語言`);return {title:g.title||`段落 ${i+1}`,label:`Section ${i+1}`,cue:'請編輯本段，加入自己的關鍵字提示',en:english,zh:zh.join('\n').trim(),tip:'新匯入段落：請確認內容及分段，再開始練習。'}});
}
export function spokenText(text){return text.replace(/\[[^\]]*\]/g,'').replace(/\([^)]*\)/g,'').replace(/\*+/g,'').replace(/\/{1,2}/g,' ').replace(/\s+/g,' ').trim()}
export function speechChunks(text){const clean=spokenText(text);if(!clean)return [];if(typeof Intl.Segmenter==='function')return [...new Intl.Segmenter('en',{granularity:'sentence'}).segment(clean)].flatMap(s=>{const w=s.segment.trim().split(/\s+/);const chunks=[];for(let i=0;i<w.length;i+=35)chunks.push(w.slice(i,i+35).join(' '));return chunks});return clean.match(/.{1,220}(?:\s|$)|\S+/g)||[]}

