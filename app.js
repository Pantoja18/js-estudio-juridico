const CONTACTOS = [
  { pretty: "+51 995 149 635", wa: "51995149635", tel: "+51995149635" },
  { pretty: "+51 956 764 364", wa: "51956764364", tel: "+51956764364" },
];

const $ = (id) => document.getElementById(id);

function waLink(c, msg){
  return `https://wa.me/${c.wa}?text=${encodeURIComponent(msg)}`;
}

function toast(msg){
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove("show"), 1400);
}

function setContacto(idx){
  const c = CONTACTOS[idx];

  $("numeroPretty").textContent = c.pretty;
  $("waTxt").textContent = c.pretty;
  $("telTxt").textContent = c.pretty;

  const baseMsg = "Hola, deseo hacer una consulta legal.";
  const url = waLink(c, baseMsg);

  $("waBtn").href = url;
  $("waMini").href = url;
  $("waFloat").href = url;
  $("draWhats").href = url;

  $("callBtn").href = `tel:${c.tel}`;
  $("callMini").href = `tel:${c.tel}`;

  toast(`Número seleccionado: ${c.pretty}`);
}

function init(){
  $("year").textContent = new Date().getFullYear();
  $("c1").textContent = CONTACTOS[0].pretty;
  $("c2").textContent = CONTACTOS[1].pretty;

  // Reveal on load
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add("in");
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // Scroll progress
  window.addEventListener("scroll", () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    $("scrollFill").style.width = `${pct}%`;
  });

  // Select change
  $("numeroSelect").addEventListener("change", () => {
    setContacto(Number($("numeroSelect").value));
  });

  // Servicios -> WhatsApp
  document.querySelectorAll("[data-service]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const servicio = btn.getAttribute("data-service");
      const idx = Number($("numeroSelect").value);
      const c = CONTACTOS[idx];
      const texto = `Hola, deseo consultar sobre: ${servicio}.`;
      window.open(waLink(c, texto), "_blank");
    });
  });

  // Formulario -> WhatsApp
  $("form").addEventListener("submit", (e) => {
    e.preventDefault();

    const idx = Number($("numeroSelect").value);
    const c = CONTACTOS[idx];

    const nombre = $("nombre").value.trim();
    const tel = $("telefono").value.trim();
    const serv = $("serv").value;
    const msg = $("mensaje").value.trim();

    const texto =
`Hola, deseo una consulta legal.
Soy: ${nombre}
Mi WhatsApp: ${tel}
Servicio: ${serv}
Consulta: ${msg}`;

    window.open(waLink(c, texto), "_blank");
    $("estado").textContent = "Abriendo WhatsApp… ✅";
    toast("Consulta lista. Abriendo WhatsApp…");
    e.target.reset();
  });

  // Default
  setContacto(0);
}

init();