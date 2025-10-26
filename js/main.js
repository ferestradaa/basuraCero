// ---------- Utilities & shared init ----------
const $ = (q,root=document)=>root.querySelector(q);
const $$ = (q,root=document)=>[...root.querySelectorAll(q)];
const params = new URLSearchParams(location.search);
const setYear = () => $('#year') && ($('#year').textContent = new Date().getFullYear());

// Tiny inline-icons rendered as SVGs into [data-icon]
const ICONS = {
  bottle:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#15803d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4v3a2 2 0 0 1-2 2h0a2 2 0 0 0-2 2v1"/><rect x="7" y="8" width="10" height="14" rx="3"/></svg>',
  cap:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#15803d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18"/><path d="M5 12a7 7 0 0 1 14 0"/><rect x="4" y="12" width="16" height="6" rx="2"/></svg>',
  box:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#15803d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M21 7v10l-9 4-9-4V7"/><path d="M12 11v10"/></svg>',
  glass:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#15803d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l-1 8a4 4 0 0 1-4 3 4 4 0 0 1-4-3L7 3z"/><path d="M12 14v7"/></svg>',
  paper:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#15803d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8M8 9h3"/></svg>',
  battery:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#15803d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 10v4"/><path d="M9 9l-2 3h3l-2 3"/></svg>',
  check:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#15803d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  leaf:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#15803d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4s-6 0-10 4-4 10-4 10 6 0 10-4 4-10 4-10Z"/><path d="M4 18C9 13 13 9 20 4"/></svg>',
  arrowLeft:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#15803d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>'
};

function mountIcons(){ $$('[data-icon]').forEach(el=>{ const n = el.getAttribute('data-icon'); el.innerHTML = ICONS[n] || ''; }); }

// ---------- Page: Home ----------
function initHome(){
  setYear(); mountIcons();
  const slides = $('#slides'); const dots = $('#dots');
  if(!slides || !dots) return;
  const total = slides.children.length; let idx=0;
  for(let i=0;i<total;i++){ const d=document.createElement('span'); d.className='dot'+(i===0?' active':''); dots.appendChild(d); }
  const go = n=>{ idx=(n+total)%total; slides.style.transform = `translateX(-${idx*100}%)`; [...dots.children].forEach((d,j)=>d.classList.toggle('active', j===idx)); };
  setInterval(()=>go(idx+1),4200);
}

// ---------- Page: Upload ----------
function initUpload(){
  setYear(); mountIcons();
  const activity = params.get('activity') || 'Actividad';
  $('#chosenText').textContent = activity;

  const drop = $('#dropzone'); const input = $('#file'); const preview = $('#preview'); const confirm = $('#confirmBtn');

  function setPreview(file){
    if(!file) return;
    const r=new FileReader();
    r.onload=e=>{
      sessionStorage.setItem('rec_activity', activity);
      sessionStorage.setItem('rec_image', e.target.result);
      preview.src = e.target.result; preview.hidden=false; confirm.disabled=false;
    };
    r.readAsDataURL(file);
  }

  drop.addEventListener('dragover', e=>{e.preventDefault(); drop.classList.add('dragover')});
  drop.addEventListener('dragleave', ()=> drop.classList.remove('dragover'));
  drop.addEventListener('drop', e=>{ e.preventDefault(); drop.classList.remove('dragover'); setPreview(e.dataTransfer.files[0]); });
  drop.addEventListener('click', ()=> input.click());
  drop.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); input.click(); } });
  input.addEventListener('change', ()=> setPreview(input.files[0]));
  confirm.addEventListener('click', ()=>{ location.href = 'done.html'; });
}

// ---------- Page: Done ----------
function initDone(){
  setYear(); mountIcons();
  const a = sessionStorage.getItem('rec_activity');
  const img = sessionStorage.getItem('rec_image');
  $('#doneActivity').textContent = a || 'Actividad';
  if(img){ $('#doneImage').src = img; }
}

// ---------- Router by data-page ----------
document.addEventListener('DOMContentLoaded', ()=>{
  const page = document.body.getAttribute('data-page');
  if(page==='home') return initHome();
  if(page==='upload') return initUpload();
  if(page==='done') return initDone();
});
