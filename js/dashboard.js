const u=Auth.user();
if(u){const s=SF.stats(u.id);document.getElementById('un').textContent=u.username;
 const tgt={hs:[s.high,v=>v],bt:[s.bestTime,SF.fmt],gp:[s.games,v=>v],kl:[s.kills,v=>v]};
 const t0=performance.now();(function a(t){const k=Math.min(1,(t-t0)/900),e=1-Math.pow(1-k,3);
  for(const id in tgt)document.getElementById(id).textContent=tgt[id][1](Math.round(tgt[id][0]*e));if(k<1)requestAnimationFrame(a)})(t0);
 const b=SF.board().slice(0,5),lb=document.getElementById('lb');lb.textContent='';
 if(!b.length){lb.innerHTML='<tr><td>Belum ada skor. Mainkan game pertamamu!</td></tr>'}
 b.forEach((r,i)=>{const tr=lb.insertRow();[i+1,r.name,r.score,SF.fmt(r.time)].forEach(v=>tr.insertCell().textContent=v)})}
