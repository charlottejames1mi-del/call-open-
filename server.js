import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
const app=express(); app.use(cors());
app.get('/',(_req,res)=>res.json({name:'Open Call signaling server',status:'ok'}));
const server=http.createServer(app); const wss=new WebSocketServer({server}); const rooms=new Map();
function send(ws,msg){if(ws.readyState===ws.OPEN) ws.send(JSON.stringify(msg));}
function leave(ws){if(!ws.roomId)return; const room=rooms.get(ws.roomId); if(room){room.delete(ws); for(const peer of room)send(peer,{type:'peer-left'}); if(!room.size)rooms.delete(ws.roomId);} ws.roomId=null;}
wss.on('connection',ws=>{ws.on('message',raw=>{let m; try{m=JSON.parse(raw.toString())}catch{return send(ws,{type:'error',message:'Invalid JSON'})}
if(m.type==='join'){const id=String(m.roomId||'').trim(); if(!id)return send(ws,{type:'error',message:'Room ID is required'}); leave(ws); let room=rooms.get(id); if(!room){room=new Set();rooms.set(id,room)} if(room.size>=2)return send(ws,{type:'full'}); ws.roomId=id; const peers=room.size; room.add(ws); send(ws,{type:'joined',roomId:id,peers}); if(peers===1)for(const peer of room)if(peer!==ws)send(peer,{type:'peer-joined'}); return;}
if(!ws.roomId)return; const room=rooms.get(ws.roomId); if(!room)return; if(['offer','answer','ice-candidate'].includes(m.type))for(const peer of room)if(peer!==ws)send(peer,m);
}); ws.on('close',()=>leave(ws)); ws.on('error',()=>leave(ws));});
const port=Number(process.env.PORT||3000); server.listen(port,'0.0.0.0',()=>console.log(`Open Call signaling server listening on ${port}`));
