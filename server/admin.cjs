/* Server-owner-only moderation. Not exposed by HTTP. */
'use strict';
const {DatabaseSync}=require('node:sqlite'),path=require('node:path');
const action=process.argv[2],name=process.argv.slice(3).join(' ');
if(!['ban','unban','list'].includes(action)){console.log('Usage: node server/admin.cjs ban|unban <nickname>\n       node server/admin.cjs list');process.exit(1);}
const db=new DatabaseSync(path.join(process.env.DATA_DIR||path.join(__dirname,'data'),'arena.sqlite'));
if(action==='list')console.table(db.prepare('SELECT name,country,xp,wins,banned FROM players ORDER BY created DESC LIMIT 100').all());
else{const p=db.prepare('SELECT id FROM players WHERE name_key=?').get(name.toLowerCase());if(!p){console.error('Name not found');process.exitCode=1;}else{db.prepare('UPDATE players SET banned=? WHERE id=?').run(action==='ban'?1:0,p.id);console.log(action+': '+name+'. Restart the server to close any existing session.');}}db.close();
