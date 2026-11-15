const home='https://apps.basecamp.toastmasters.org/learning/course/course-v1:Toastmasters+8707+08_17_2023/home';
export const projects=[
{id:'ice',level:1,en:'Ice Breaker',zh:'破冰演講'},
{id:'purpose',level:1,en:'Writing a Speech with Purpose',zh:'有目的的演講寫作'},
{id:'vocal',level:1,en:'Introduction to Vocal Variety and Body Language',zh:'聲音變化與肢體語言入門'},
{id:'feedback',level:1,en:'Evaluation and Feedback',zh:'評估與回饋'},
{id:'leadership',level:2,en:'Understanding Your Leadership Style',zh:'了解你的領導風格'},
{id:'listening',level:2,en:'Active Listening',zh:'積極聆聽'},
{id:'mentoring',level:2,en:'Introduction to Toastmasters Mentoring',zh:'Toastmasters 導師制度入門'}
].map(p=>({...p,url:home}));
export type SpeechMeta={id:string;title:string;projectId:string;date:string;lastEditedAt?:string;deletedAt?:string};
export const defaultSpeech:SpeechMeta={id:'leadership',title:'Learning to See the Bigger Picture',projectId:'leadership',date:'2026-11-19'};

