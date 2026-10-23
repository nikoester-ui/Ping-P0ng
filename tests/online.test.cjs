'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
process.env.DATA_DIR=fs.mkdtempSync(path.join(os.tmpdir(),'npa-online-test-'));const svc=require('../server/server.cjs');
const sleep=t=>new Promise(r=>setTimeout(r,t));
function connect(url,token){return new Promise((resolve,reject)=>{const ws=new WebSocket(url),messages=[];const api={ws,messages,send:m=>ws.send(JSON.stringify(m)),async wait(type,timeout=6000){const start=Date.now();while(Date.now()-start<timeout){const m=messages.find(x=>x.type===type);if(m)return m;await sleep(10);}throw Error('Timeout: '+type+' '+JSON.stringify(messages.map(m=>m.type)));}};ws.addEventListener('error',reject);ws.addEventListener('message',ev=>messages.push(JSON.parse(ev.data)));ws.addEventListener('open',()=>{api.send({type:'hello',token});resolve(api);});});}
(async()=>{await new Promise(r=>svc.server.listen(0,'127.0.0.1',r));const port=svc.server.address().port,base='http://127.0.0.1:'+port;let checks=0;const ok=s=>{checks++;console.log('PASS',s);};const post=async(name,country='CH')=>{const r=await fetch(base+'/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,country})});return {status:r.status,data:await r.json()};};
try{const health=await (await fetch(base+'/api/health')).json();assert.equal(health.service,'neon-ping-arena');ok('health endpoint');
 const bad=await post('Player');assert.equal(bad.status,400);const profane=await post('f_u_c_k');assert.equal(profane.status,400);ok('server rejects default and profane names');
 const a=await post('OrbitFox'),b=await post('SkyBolt','DE');assert.equal(a.status,200);assert.equal(b.status,200);ok('two separate profiles and tokens');
 const dup=await post('OrbitFox');assert.equal(dup.status,409);ok('name ownership prevents impersonation');
 const ca=await connect('ws://127.0.0.1:'+port+'/arena',a.data.token),cb=await connect('ws://127.0.0.1:'+port+'/arena',b.data.token);await ca.wait('hello');await cb.wait('hello');ca.send({type:'queue'});await ca.wait('queued');cb.send({type:'queue'});const ma=await ca.wait('match'),mb=await cb.wait('match');assert.equal(ma.room,mb.room);assert.notEqual(ma.side,mb.side);ok('real WebSocket matchmaking assigns two clients to one room');
 ca.send({type:'score',score:99999,winner:0});await ca.wait('error');const room=svc.rooms.get(ma.room);assert.deepEqual(room.g.score,[0,0]);ok('client score forgery rejected');
 ca.send({type:'input',x:300,y:200});cb.send({type:'input',x:900,y:500});await sleep(160);assert.equal(room.g.paddles[0].ty,200);assert.equal(room.g.paddles[1].ty,500);ok('independent paddle inputs reach shared simulation');
 const snap=await ca.wait('state');assert.equal(snap.state.mode,'versus');assert.equal(snap.state.phase,'countdown');ok('authoritative snapshots delivered to clients');
 // This test fixture changes SERVER simulation state, never a client-supplied score.
 room.g.phase='play';room.g.activeTime=12;room.g.score=[4,0];room.g.ball.x=1230;room.g.ball.y=340;room.g.ball.vx=1040;room.g.ball.vy=0;
 const ra=await ca.wait('result'),rb=await cb.wait('result');assert.equal(ra.state.winner,0);assert.equal(rb.state.winner,0);assert.equal(ra.profile.xp,180);assert.equal(ra.profile.earnedCoins,30);assert.equal(rb.profile.xp,0);ok('server result persists correct XP and reward');
 const table=await (await fetch(base+'/api/leaderboard')).json();assert.equal(table.players.length,1);assert.equal(table.players[0].name,'OrbitFox');assert.equal(table.players[0].country,'CH');assert.equal(table.players[0].xp,180);ok('leaderboard contains verified named profile with flag');
 svc.settle(room);const row=svc.db.prepare('SELECT xp FROM players WHERE id=?').get(a.data.profile.id);assert.equal(row.xp,180);ok('repeat finalization cannot duplicate XP');
 assert.equal((await fetch(base+'/server/data/arena.sqlite')).status,404);assert.equal((await fetch(base+'/server/server.cjs')).status,404);ok('private database and server code not served');
 assert.equal((await fetch(base+'/api/leaderboard',{headers:{Origin:'https://unapproved.invalid'}})).status,403);ok('unapproved origins rejected');
 ca.ws.close();cb.ws.close();await sleep(50);console.log('ONLINE CHECKS PASSED:',checks);
}catch(e){console.error(e);process.exitCode=1;}finally{await svc.close();fs.rmSync(process.env.DATA_DIR,{recursive:true,force:true});}})();
