
function setType(type){
  const p = type === "Praktikum";
  document.getElementById("typeInput").value = type;
  document.getElementById("pQuestions").classList.toggle("hidden", !p);
  document.getElementById("aQuestions").classList.toggle("hidden", p);
  document.getElementById("btnP").classList.toggle("active", p);
  document.getElementById("btnA").classList.toggle("active", !p);
}
const form=document.getElementById("reviewForm");
if(form){
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const btn=document.getElementById("submitBtn");
    const msg=document.getElementById("message");
    btn.disabled=true; btn.textContent="Wird veröffentlicht…"; msg.classList.add("hidden");
    try{
      const fd=new FormData(form); const data={};
      for(const [k,v] of fd.entries()) data[k]=v;
      data.bestaetigung=fd.has("bestaetigung");
      const r=await fetch("/api/reviews",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
      const out=await r.json();
      if(!r.ok) throw new Error(out.error||"Fehler beim Speichern");
      location.href="/danke.html";
    }catch(err){
      msg.textContent=err.message; msg.classList.remove("hidden");
      btn.disabled=false; btn.textContent="Bewertung veröffentlichen";
    }
  });
}
