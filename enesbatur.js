"use strict";
const http2 = require('http2');
const fs = require('fs');
const WebSocket = require('ws');

const rakiIcmeyiBilmesem = [
"MTM4NzE2MjI3NDQ2ODMzNTY0Ng.Gz7qEj.muukpdtw1p47_YZM3jXsFM7i_eM_emMj2Iz_ho", // mfa.txt
"MTM2MDI5OTY5NTU0NDYwMjgxNA.GBTuDc.uMDtnfdqleolw8YO9qygi4G4WHLpQB7uLhBMc0", // mfa1.txt
"MTQxMTc1MzkxNzEyMTA0MDUzNA.GsY7w4.xrS664RAJoinX8wOrvCXrZ3z5ze0pklKD_BSg8",  //mfa2.txt
];

const tanisabilirMiydik = "1378369684684144801";

// Process exit her 10 dakikada
setTimeout(() => {
    console.log('10 dakika doldu, process exit...');
    process.exit(0);
}, 10 * 60 * 1000);

const beniSessizliklerAldi = [{':method': 'PATCH', ':path': `/api/v9/guilds/${tanisabilirMiydik}/vanity-url`, ':authority': 'canary.discord.com', 'authorization': rakiIcmeyiBilmesem[0], 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0', 'x-super-properties': 'eyJicm93c2VyIjoiQ2hyb21lIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiQ2hyb21lIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzU1NjI0fQ=='}, {':method': 'PATCH', ':path': `/api/v9/guilds/${tanisabilirMiydik}/vanity-url`, ':authority': 'canary.discord.com', 'authorization': rakiIcmeyiBilmesem[1], 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'x-super-properties': 'eyJicm93c2VyIjoiQ2hyb21lIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiQ2hyb21lIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzU1NjI0fQ=='}, {':method': 'PATCH', ':path': `/api/v9/guilds/${tanisabilirMiydik}/vanity-url`, ':authority': 'canary.discord.com', 'authorization': rakiIcmeyiBilmesem[2], 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'x-super-properties': 'eyJicm93c2VyIjoiQ2hyb21lIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiQ2hyb21lIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzU1NjI0fQ=='}];

const kaderimeDenkGel = [{':method': 'PATCH', ':path': `/api/v9/guilds/${tanisabilirMiydik}/vanity-url`, ':authority': 'canary.discord.com', 'content-type': 'application/json'}, {':method': 'PATCH', ':path': `/api/v9/guilds/${tanisabilirMiydik}/vanity-url`, ':authority': 'canary.discord.com', 'content-type': 'application/json'}, {':method': 'PATCH', ':path': `/api/v9/guilds/${tanisabilirMiydik}/vanity-url`, ':authority': 'canary.discord.com', 'content-type': 'application/json'}];

let kadehimeDolmaz = http2.connect('https://canary.discord.com');
let yoklugun = ["", "", ""];
const sigaraylaGecmez = new Map();

const zorlugun = (v) => {
    for (let i = 0; i < 3; i++) {
        const r = kadehimeDolmaz.request(beniSessizliklerAldi[i]);
        r.end(`{"code":"${v}"}`);
        r.on('data', d => {
            const response = d.toString();
            console.log(`${v} :`, response);
        });
    }
};

const nOlursun = () => {
    const payload = `{"code":"xd"}`;
    for (let i = 0; i < 1; i++) {
        const r = kadehimeDolmaz.request(kaderimeDenkGel[i]);
        r.end(payload);
    }
};

const wsConnect = () => {
    const ws = new WebSocket("wss://gateway-us-east1-b.discord.gg");
    let heartbeatInterval;
    
    ws.onmessage = (m) => {
        const d = m.data;
        if (d.includes('"GUILD_UPDATE"')) {
            const p = JSON.parse(d);
            const old = sigaraylaGecmez.get(p.d.guild_id);
            if (old && old !== p.d.vanity_url_code) zorlugun(old);
        } else if (d.includes('"READY"')) {
            JSON.parse(d).d.guilds.forEach(g => g.vanity_url_code && sigaraylaGecmez.set(g.id, g.vanity_url_code));
            console.log(sigaraylaGecmez);
        } else if (d.includes('"op":10')) {
            ws.send(`{"op":2,"d":{"token":"${rakiIcmeyiBilmesem[0]}","intents":1,"properties":{"os":"linux","browser":"firefox","device":""}}}`);
            heartbeatInterval = setInterval(() => ws.readyState === 1 && ws.send('{"op":1,"d":{}}'), 41250);
        }
    };
    
    ws.onclose = () => {
        clearInterval(heartbeatInterval);
        setTimeout(wsConnect, 100);
    };
    
    ws.onerror = () => {
        clearInterval(heartbeatInterval);
        setTimeout(wsConnect, 100);
    };
};

wsConnect();

setInterval(()=>{["mfa.txt","mfa1.txt","mfa2.txt"].forEach((f,i)=>{try{const n=fs.readFileSync(f,"utf8").trim();if(n!==yoklugun[i]&&n.length>0){yoklugun[i]=n;beniSessizliklerAldi[i]['x-discord-mfa-authorization']=n;}}catch{}})},7000);

setInterval(nOlursun, 2000);
