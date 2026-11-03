
const labels={
 p_q1:"Beruf gelernt",p_q2:"Aufgaben bekommen",p_q3:"Selbst mitgearbeitet",p_q4:"Passende Aufgaben",
 p_q5:"Nur Hilfsarbeiten",p_q6:"Respektvoll behandelt",p_q7:"Ansprechperson",p_q8:"Pausen",
 p_q9:"Arbeitszeiten",p_q10:"Realistischer Einblick",p_q11:"Nochmal dort",p_q12:"Empfehlung",
 a_q1:"Lernfaktor",a_q2:"Erklärungen",a_q3:"Passende Aufgaben",a_q4:"Selbstständigkeit",
 a_q5:"Nur Hilfsarbeiten",a_q6:"Zeit des Ausbilders",a_q7:"Respekt",a_q8:"Ausbildungsinhalte",
 a_q9:"Schule & Prüfungen",a_q10:"Arbeitsklima",a_q11:"Nochmal entscheiden",a_q12:"Empfehlung"
};
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
async function load(){
 const box=document.getElementById("reviews");
 try{
  const r=await fetch("/api/reviews",{cache:"no-store"}); const data=await r.json();
  if(!data.reviews?.length){box.innerHTML='<div class="empty">Noch keine Bewertungen vorhanden.</div>';return}
  box.innerHTML=data.reviews.map(x=>{
    const prefix=x.bewertungsart==="Ausbildung"?"a_q":"p_q";
    const answers=Object.entries(x).filter(([k,v])=>k.startsWith(prefix)&&!k.endsWith("_kommentar")&&v)
      .map(([k,v])=>`<div class="answer"><b>${esc(labels[k]||k)}</b>${esc(v)}</div>`).join("");
    return `<article class="review">
      <h3>${esc(x.firma)}</h3>
      <div class="meta">${esc(x.ort)} · ${esc(x.beruf)} · ${esc(x.bewertungsart)} ${x.zeitraum? "· "+esc(x.zeitraum):""}</div>
      <div class="tag">Ungeprüfte Bewertung</div>
      ${x.erfahrungsbericht?`<p>${esc(x.erfahrungsbericht)}</p>`:""}
      <div class="answergrid">${answers}</div>
      <div class="meta" style="margin-top:12px">${new Date(x.createdAt).toLocaleDateString("de-DE")}</div>
    </article>`
  }).join("");
 }catch(e){box.innerHTML='<div class="alert">Bewertungen konnten gerade nicht geladen werden.</div>'}
}
load();
