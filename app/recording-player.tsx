'use client';
import {useRef,useState} from 'react';
const recordingUrl=new URL('./audio/learning-bigger-picture-20261119.mp3',import.meta.url).href;
export default function RecordingPlayer({onPlay}:{onPlay:()=>void}){
 const audio=useRef<HTMLAudioElement>(null);
 const [rate,setRate]=useState(1),[failed,setFailed]=useState(false);
 return <section aria-label="演講音檔"><div className="overline">RECORDING / 演講音檔</div><p>Learning to See the Bigger Picture<br/><span className="fine">2026-11-19 · MP3</span></p><audio ref={audio} controls preload="metadata" src={recordingUrl} style={{width:'100%'}} onPlay={onPlay} onError={()=>setFailed(true)}>你的瀏覽器不支援音檔播放。</audio><label>播放速度<select value={rate} onChange={e=>{const value=Number(e.target.value);setRate(value);if(audio.current)audio.current.playbackRate=value}}><option value="0.75">0.75×</option><option value="0.85">0.85×</option><option value="1">1× 原速</option><option value="1.15">1.15×</option></select></label>{failed&&<p role="alert">音檔載入失敗，請重新整理後再試。</p>}<div className="divider"/></section>
}
