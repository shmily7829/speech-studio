import assert from 'node:assert/strict';
import {createSpeechPlayer} from '../app/speech-player.mjs';
class Utterance{constructor(text){this.text=text}}
const spoken=[],events=[],errors=[];let resumed=0,canceled=0;
const voices=[{voiceURI:'us',lang:'en-US'},{voiceURI:'uk',lang:'en-GB'}];
const synth={getVoices:()=>voices,cancel:()=>canceled++,resume:()=>resumed++,speak:u=>spoken.push(u)};
const player=createSpeechPlayer(synth,Utterance,{onState:p=>events.push(p),onError:e=>errors.push(e)});
player.play(['One.','Two.'],{voiceURI:'uk',rate:.8,pitch:1.1});
assert.equal(spoken.length,2,'all chunks must be queued synchronously');
assert.equal(spoken[0].lang,'en-GB');assert.equal(spoken[0].rate,.8);assert.equal(spoken[0].pitch,1.1);assert.equal(resumed,1);
const oldError=spoken[0].onerror;player.play(['New.'],{voiceURI:'stale-voice'});assert.equal(spoken.at(-1).voice.voiceURI,'us');oldError({error:'canceled'});assert.equal(events.at(-1),true,'old cancellation must not stop the new session');assert.equal(errors.length,0);
spoken.at(-1).onend();assert.equal(events.at(-1),false);
player.play(['Again.']);const u=spoken.at(-1);player.stop();assert.equal(u.onerror,null);assert.equal(u.onend,null);assert.equal(events.at(-1),false);
player.play(['Error.']);spoken.at(-1).onerror({error:'not-allowed'});assert.equal(errors.length,1);assert.equal(events.at(-1),false);
player.play(['  ']);assert.equal(errors.length,2);assert(canceled>0);
console.log('Native speech checks passed: synchronous queue, retained utterances, language, resume, stale events, stop and errors.');
