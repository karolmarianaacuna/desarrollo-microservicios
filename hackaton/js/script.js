const mapa = document.getElementById("mapa");
const iconos = document.querySelectorAll(".icono");
const infoCard = document.getElementById("infoCard");
const cardImg = document.getElementById("cardImg");
const cardTitle = document.getElementById("cardTitle");
const cardDesc = document.getElementById("cardDesc");
const searchInput = document.getElementById("searchInput");
const iconCards = document.querySelectorAll(".icon-card");
const contenedorMapa = document.querySelector(".contenedor-mapa");
const btnInstrucciones = document.querySelector(".btn-video");
const popup = document.querySelector(".popup-video");
const closevideo= document.querySelector(".close-video");

const imgParaExportar = document.querySelector('.mapa-img-export');
const overlay = document.querySelector('.mapa-overlay');
const controles = document.querySelector('.controls');






let startX, startY;
let scrollLeft, scrollTop;
let lastX, lastY;
let scale = 1;         
let isMovingMap = false;



document.addEventListener("DOMContentLoaded", function () {
  iconsDesc();
  initDragAndDrop();
  initSearchAndFilter();
  initMapControls();
  initInfoCard();
  initHandNavigation();

  const btnGenerarDiagrama = document.getElementById('btnGenerateDiagram');
    if (btnGenerarDiagrama) {
        btnGenerarDiagrama.addEventListener('click', descargarDiagramaPDF);
    }

});

// -------------------------
// mostrar descripción iconos estando en el panel de iconos
// -------------------------

function iconsDesc() {
  iconos.forEach((icono) => {
    icono.addEventListener("click", (e) => {
      showInfoCard(icono);
    });
  });
}

btnInstrucciones.addEventListener("click", () => {
  popup.style.display = "block";
});

closevideo.addEventListener("click", () => {
  popup.style.display = "none";
});

// -------------------------
// Sistema de arrastrar y soltar
// -------------------------

function initDragAndDrop() {
  iconos.forEach((icono) => {
    icono.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("key", icono.dataset.key);
      e.dataTransfer.setData("img", icono.getAttribute("data-img"));
      e.dataTransfer.setData("desc", icono.getAttribute("data-desc"));
      e.dataTransfer.setData("alt", icono.alt);
    });
  });

  mapa.addEventListener("dragover", (e) => e.preventDefault());

  mapa.addEventListener("drop", (e) => {
    e.preventDefault();

    const key = e.dataTransfer.getData("key");
    const img = e.dataTransfer.getData("img");
    const desc = e.dataTransfer.getData("desc");
    const alt = e.dataTransfer.getData("alt");
    const original = document.querySelector(`[data-key="${key}"]`);

    const clon = original.cloneNode(true);

    const rect = mapa.getBoundingClientRect();
    const x = e.clientX - rect.left - 15;
    const y = e.clientY - rect.top - 15;

    clon.style.position = "absolute";
    clon.style.left = `${x}px`;
    clon.style.top = `${y}px`;
    clon.style.width = "20px";
    clon.style.height = "20px";
    clon.style.cursor = "move";

    clon.setAttribute("data-img", img);
    clon.setAttribute("data-desc", desc);
    clon.setAttribute("alt", alt);

    // Añadir evento de clic para mostrar información
    clon.addEventListener("click", function () {
      showInfoCard(this);
    });

    makeDraggable(clon);
    mapa.appendChild(clon);

    // Ocultar overlay instructivo cuando se añade el primer elemento
    const overlay = document.querySelector(".mapa-overlay");
    if (overlay) {
      overlay.style.display = "none";
    }
  });
}

// -------------------------
// Función draggable para mapa
// -------------------------
function makeDraggable(el) {
  let offsetX,
    offsetY,
    isDragging = false;

  el.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    el.style.zIndex = "1000"; // Traer al frente durante el arrastre

    function mover(ev) {
      if (!isDragging) return;
      const rect = mapa.getBoundingClientRect();
      el.style.left = ev.clientX - rect.left - offsetX + "px";
      el.style.top = ev.clientY - rect.top - offsetY + "px";
    }

    function soltar() {
      isDragging = false;
      el.style.zIndex = "1"; // Restaurar z-index
      document.removeEventListener("mousemove", mover);
      document.removeEventListener("mouseup", soltar);
    }

    document.addEventListener("mousemove", mover);
    document.addEventListener("mouseup", soltar);
    e.stopPropagation(); // Evitar que se active el evento del mapa
  });
}

// -------------------------
// Búsqueda y Filtrado
// -------------------------
function initSearchAndFilter() {
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    filterIcons(searchTerm);
  });
}

function filterIcons(searchTerm) {
  iconCards.forEach((card) => {
    const cardText = card.querySelector("p").textContent.toLowerCase();
    const matchesSearch = cardText.includes(searchTerm);

    card.style.display = matchesSearch ? "flex" : "none";
  });
}

function initHandNavigation() {
  contenedorMapa.addEventListener("mousedown", function (e) {
    // Solo iniciar navegación si no se está arrastrando un icono y es clic principal
    if (e.button !== 0 || e.target.closest(".icono")) return;

    isMovingMap = true;
    contenedorMapa.classList.add("moviendo");

    startX = e.pageX - contenedorMapa.offsetLeft;
    startY = e.pageY - contenedorMapa.offsetTop;
    scrollLeft = parseInt(mapa.style.left || 0);
    scrollTop = parseInt(mapa.style.top || 0);

    e.preventDefault();
  });

  contenedorMapa.addEventListener("mouseleave", function () {
    if (isMovingMap) {
      isMovingMap = false;
      contenedorMapa.classList.remove("moviendo");
    }
  });

  contenedorMapa.addEventListener("mouseup", function () {
    if (isMovingMap) {
      isMovingMap = false;
      contenedorMapa.classList.remove("moviendo");
    }
  });

  contenedorMapa.addEventListener("mousemove", function (e) {
    if (!isMovingMap) return;

    e.preventDefault();

    const x = e.pageX - contenedorMapa.offsetLeft;
    const y = e.pageY - contenedorMapa.offsetTop;

    const walkX = x - startX;
    const walkY = y - startY;

    // Calcular nueva posición
    let newLeft = scrollLeft + walkX;
    let newTop = scrollTop + walkY;

    // Limitar el desplazamiento para no salir del contenedor
    const maxX = (mapa.offsetWidth * scale - contenedorMapa.offsetWidth) / 2;
    const maxY = (mapa.offsetHeight * scale - contenedorMapa.offsetHeight) / 2;

    if (scale > 1) {
      newLeft = Math.min(Math.max(newLeft, -maxX), maxX);
      newTop = Math.min(Math.max(newTop, -maxY), maxY);
    } else {
      newLeft = 0;
      newTop = 0;
    }

    mapa.style.left = `${newLeft}px`;
    mapa.style.top = `${newTop}px`;
    lastX = newLeft;
    lastY = newTop;

    updateStatus();
  });
}

// -------------------------
// Controles del Mapa
// -------------------------
function initMapControls() {
  

  document.getElementById("btnZoomIn").addEventListener("click", () => {
    scale += 0.1;
    mapa.style.transform = `scale(${scale})`;
  });

  document.getElementById("btnZoomOut").addEventListener("click", () => {
    if (scale > 0.5) {
      scale -= 0.1;
      mapa.style.transform = `scale(${scale})`;
    }
  });

  document.getElementById("btnCenter").addEventListener("click", () => {
    mapa.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  });

  document.getElementById("btnClear").addEventListener("click", () => {
    if (confirm("¿Estás seguro de que quieres limpiar el mapa?")) {
      const icons = document.querySelectorAll("#mapa .icono");
      icons.forEach((icon) => icon.remove());
      document.getElementById("infoCard").classList.add("hidden");

      // Mostrar overlay instructivo nuevamente
      const overlay = document.querySelector(".mapa-overlay");
      if (overlay) {
        overlay.style.display = "flex";
      }
    }
  });
}

// -------------------------
// Tarjeta de Información
// -------------------------
function initInfoCard() {
  // Cerrar tarjeta de información
  document.querySelector(".close-card").addEventListener("click", () => {
    document.getElementById("infoCard").classList.add("hidden");
  });
}

function showInfoCard(icon) {
  const card = document.getElementById("infoCard");
  card.classList.remove("hidden");

  cardImg.src = icon.getAttribute("data-img");
  cardTitle.textContent = icon.alt;
  cardDesc.textContent = icon.getAttribute("data-desc");
}

// -------------------------
// Funcionalidades adicionales
// -------------------------
// Vista previa
document.getElementById("btnPreview").addEventListener("click", () => {
  // Aquí puedes implementar la funcionalidad de vista previa
  alert("Vista previa del mapa");
});

function descargarDiagramaPDF() {
// Ocultamos elementos que no queremos en el PDF
  if (overlay) overlay.style.display = 'none';
  if (controles) controles.style.display = 'none';

  // Sincronizamos la transformación (zoom/paneo) de tu mapa interactivo
  // a nuestra imagen de exportación.
  const estiloMapa = window.getComputedStyle(mapa);
  const transformacionActual = estiloMapa.transform;
  imgParaExportar.style.transform = transformacionActual;

  // Hacemos el cambio de capas: mostramos la <img> y ocultamos el background-image
  imgParaExportar.style.display = 'block';
  mapa.style.backgroundImage = 'none';

  // --- 3. CAPTURAR CON HTML2CANVAS ---
  html2canvas(contenedorMapa, {
    useCORS: true,
    backgroundColor: '#ffffff', // Fondo blanco por si hay transparencias
    scale: 2 // Doble resolución para una imagen más nítida
  }).then(canvas => {
    
    // --- 4. CREAR Y GUARDAR EL PDF ---
    const imgData = canvas.toDataURL('image/png');
    const pdf = new window.jspdf.jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('diagrama-seguridad-arquitectura.pdf');

  }).finally(() => {
    // --- 5. LIMPIEZA (MUY IMPORTANTE) ---
    // Este bloque se ejecuta siempre, haya éxito o error,
    // para restaurar la vista del usuario.
    
    console.log("Restaurando la vista...");
    
    // Dejamos todo como estaba
    if (overlay) overlay.style.display = 'block';
    if (controles) controles.style.display = 'flex'; // 'flex' porque así está en tu layout
    imgParaExportar.style.display = 'none';
    mapa.style.backgroundImage = "url('./assets/images/fondo.png')"; // Asegúrate que la ruta sea correcta desde el CSS
  });

}


// -------------------------
// Generar pdf
// -------------------------

const techToSolutions = {
  BACKUP: ["ACRONIS", "VEAM", "BARRACUDA", "IBM"],
  ANTIBOT: ["TREND MICRO", "CROWDSTRIKE", "SOPHOS", "PALO ALTO"],
  ANTIMALWARE: ["TREND MICRO", "CROWDSTRIKE", "SOPHOS", "PALO ALTO"],
  "CONTROL DE APLICACIONES": [
    "TREND MICRO",
    "NETSKOPE",
    "PALO ALTO",
    "PROOFPOINT",
  ],
  "CONTROLADOR DE URL": ["NETSKOPE", "PALO ALTO", "TREND MICRO", "APP GATE"],
  FIREWALL: ["PALO ALTO", "SOPHOS", "HILLSTONE", "BARRACUDA"],
  "CONTROL DE VULNERABILIDADES": [
    "CROWDSTRIKE",
    "TREND MICRO",
    "TENABLE",
    "SOPHOS",
  ],
  "CORRELACION DE LOGS": ["CROWDSTRIKE", "SPLUNK", "IBM", "LEVEL BLUE"],
  "ANALISIS DE VULNERABILIDADES": [
    "TENABLE",
    "SECPOINT",
    "RIGDE SECURITY",
    "PICUS",
  ],
  "CERTIFICADO DIGITAL": ["ENTRUST"],
  PROXY: ["TREND MICRO", "BARRACUDA", "NETSKOPE", "GOOGLE CLOUD"],
  "ANTI PHISHING": ["TREND MICRO", "SOPHOS", "PALO ALTO", "GFI SOFTWARE"],
  "ANTI SPAM": ["TREND MICRO", "SOPHOS", "PALO ALTO", "GFI SOFTWARE"],
  "ANTIVIRUS DE CORREO": ["TREND MICRO", "SOPHOS", "PALO ALTO", "GFI SOFTWARE"],
  "CONTROL DE AMENAZAS AVANZADAS": [
    "TREND MICRO",
    "CROWDSTRIKE",
    "PALO ALTO",
    "SOPHOS",
  ],
  DDOS: ["A10", "RADWARE", "THALES", "PROGRESS"],
  "ADMINISTRADOR DE CANAL": ["EXINDA", "ALLOT", "LEVELBLUE"],
  "SERVIDOR VIRTUAL": ["TREND MICRO", "SOPHOS", "PROGRESS", "CROWDSTRIKE"],
  IPS: ["TREND MICRO", "PALO ALTO", "HILLSTONE", "SOPHOS"],
  "FUGA DE INFORMACION": ["FORCEPOINT", "TREND MICRO", "SOPHOS", "NETSKOPE"],
  "GESTION DE IDENTIDAD": ["THALES", "SEGURA", "DELINEA", "IBM"],
  "MONITOREO DE INTEGRIDAD": ["TREND MICRO", "SPLUNK", "IMPERVA", "SOPHOS"],
  "CIFRADO DE CANAL": ["A10", "ENTRUST"],
  WAF: ["A10", "IMPERVA", "PROGRESS", "BARRACUDA"],
  "BALANCEADOR DE CARGA": ["A10", "IMPERVA", "PROGRESS", "RADWARE"],
  "IPV4/IPV6": ["A10"],
  "EDR ANALISIS FORENSE": ["TREND MICRO", "CROWDSTRIKE", "SOPHOS", "PALO ALTO"],
  "CIBER CAMARA": ["MOBOTIX"],
  "NAC NETWORK ACCESS CONTROL": ["SOLAR WINDS", "IBM", "PANDORA"],
  "ANALISIS FORENSE": ["BHA", "CROWDSTRIKE", "IBM", "SPLUNK"],
  ANTIPISHING: ["TREND MICRO", "SOPHOS", "PALO ALTO", "GFI SOFTWARE"],
  "FIRMAS DIGITALES": ["ENTRUST", "VERYCLAVE"],
  CIFRADO: ["VERYCLAVE", "SOPHOS", "ENTRUST", "TREND MICRO"],
  "ANTIVIRUS DE NAVEGACION": ["NETSKOPE", "SOPHOS", "TREND MICRO", "PALO ALTO"],
  "SEGURIDAD ACTIVA": ["TX ONE"],
  "SEGURIDAD PASIVA": ["TX ONE"],
  "SEGUIMIENTO FORENSE": ["TX ONE"],
  SWITCH: ["TX ONE"],
  "CORREO ELECTRONICO": [
    "PROOFPOINT",
    "MICROSOFT DEFENDER",
    "GOOGLE",
    "TITANIUM",
  ],
  "DATA LOSS PREVENTION (DLP)": [
    "NETSKOPE",
    "FORCEPOINT",
    "SYMANTEC",
    "DIGITAL GUARDIAN",
  ],
  "DETECCION Y RESPUESTA EXTENDIDA (XDR)": [
    "CROWDSTRIKE",
    "PALO ALTO",
    "TREND MICRO",
    "SOPHOS",
  ],
  "DNS SECURITY": ["PALO ALTO", "CISCO UMBRELLA", "AKAMAI", "INFIBOX"],
  ENCRYPTION: ["SYMANTEC", "MICROSOFT", "TREND MICRO", "SOPHOS"],
  "GESTION DE IDENTIDADES (IAM)": [
    "OKTA",
    "MICROSOFT AZURE AD",
    "CYBERARK",
    "PING IDENTITY",
  ],
  "MFA (MULTI FACTOR AUTHENTICATION)": [
    "DUO SECURITY",
    "MICROSOFT AUTHENTICATOR",
    "OKTA",
    "RSA SECURID",
  ],
  "NAC (NETWORK ACCESS CONTROL)": [
    "CISCO ISE",
    "ARUBA CLEARPASS",
    "FORTINAC",
    "FORESCOUT",
  ],
  "PROTECCION ENDPOINT (EPP/EDR)": [
    "CROWDSTRIKE",
    "TREND MICRO",
    "SOPHOS",
    "SENTINELONE",
  ],
  "SEGURIDAD APLICACIONES WEB (WAF)": [
    "F5",
    "CLOUDFLARE",
    "AKAMAI",
    "PALO ALTO",
  ],
  "SEGURIDAD RED": ["CISCO", "PALO ALTO", "FORTINET", "CHECKPOINT"],
  SIEM: ["SPLUNK", "IBM QRADAR", "ARCSIGHT", "MICROSOFT SENTINEL"],
  SOAR: ["PALO ALTO CORTEX", "IBM RESILIENT", "SPLUNK PHANTOM", "DFLABS"],
  VPN: ["CISCO ANYCONNECT", "PALO ALTO GLOBAL PROTECT", "FORTINET", "ZSCALER"],
  "ZERO TRUST": ["ZSCALER", "NETSKOPE", "PALO ALTO", "MICROSOFT"],
};

// Función inteligente para encontrar la clave de tecnología
function encontrarClaveTecnologia(nombreTecnologia) {
  const nombreNormalizado = nombreTecnologia
    .toUpperCase()
    .replace(/_/g, " ") // Reemplazar guiones bajos con espacios
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .trim();

  console.log("Buscando solución para:", nombreNormalizado);

  // Mapeo directo de nombres de iconos a claves de diccionario
  const mapeoDirecto = {
    BACKUP: "BACKUP",
    "ADMINISTRADOR DE CANAL": "ADMINISTRADOR DE CANAL",
    "ANALISIS DE VULNERABILIDAD": "ANALISIS DE VULNERABILIDADES",
    "ANTI SPAM": "ANTI SPAM",
    ANTIBOT: "ANTIBOT",
    ANTIMALWARE: "ANTIMALWARE",
    "ANTIVIRUS DE NAVEGACION": "ANTIVIRUS DE NAVEGACION",
    "ANTIVIRUS DE CORREO": "ANTIVIRUS DE CORREO",
    "AREA DE SEGURIDAD": "SEGURIDAD ACTIVA",
    "BALANCEADOR DE CARGA": "BALANCEADOR DE CARGA",
    "CAR SERVICIOS": "CORRELACION DE LOGS",
    CAR: "CORRELACION DE LOGS",
    "CERTIFICADO DIGITAL": "CERTIFICADO DIGITAL",
    "CIBER CAMARA": "CIBER CAMARA",
    "CIFRADO DE CANAL": "CIFRADO DE CANAL",
    CIFRADO: "CIFRADO",
    "CONTROL DE AMENAZAS AVANZADAS": "CONTROL DE AMENAZAS AVANZADAS",
    "CONTROL DE APLICACIONES": "CONTROL DE APLICACIONES",
    "CONTROL DE VULNERABILIDAD": "CONTROL DE VULNERABILIDADES",
    "CONTROLADOR DE URL": "CONTROLADOR DE URL",
    "CORRELACION DE LOGS": "CORRELACION DE LOGS",
    "DATA CENTER": "SEGURIDAD ACTIVA",
    DDOS: "DDOS",
    "DISPOSITIVO MOVIL": "SEGURIDAD ACTIVA",
    DMZ: "FIREWALL",
    "EDR ANALISIS FORENSE": "EDR ANALISIS FORENSE",
    FIREWALL: "FIREWALL",
    "FIRMAS DIGITALES": "FIRMAS DIGITALES",
    "FUGA DE INFORMACION": "FUGA DE INFORMACION",
    "GESTOR DE IDENTIDAD": "GESTION DE IDENTIDAD",
    IPS: "IPS",
    "IPV4-IPV6": "IPV4/IPV6",
    LAN: "SEGURIDAD ACTIVA",
    "MODEM WIFI": "SEGURIDAD ACTIVA",
    "MONITOREO DE INTEGRIDAD": "MONITOREO DE INTEGRIDAD",
    "NAC NETWORK ACCESS CONTROL": "NAC NETWORK ACCESS CONTROL",
    NUBE: "SEGURIDAD ACTIVA",
    "PC PUNTO FINAL": "SEGURIDAD ACTIVA",
    PROXY: "PROXY",
    SERVIDOR: "SEGURIDAD ACTIVA",
    "SERVIDOR VIRTUAL": "SERVIDOR VIRTUAL",
    SWITCH: "SWITCH",
    USB: "SEGURIDAD ACTIVA",
    WAF: "WAF",
    "ANTI PHISHING": "ANTI PHISHING",
    "GESTION DE IDENTIDAD": "GESTION DE IDENTIDAD",
    ANTIPISHING: "ANTIPISHING",
    "ANALISIS FORENSE": "ANALISIS FORENSE",
    "SEGURIDAD ACTIVA": "SEGURIDAD ACTIVA",
    "SEGURIDAD PASIVA": "SEGURIDAD PASIVA",
    "SEGUIMIENTO FORENSE": "SEGUIMIENTO FORENSE",
    "CORREO ELECTRONICO": "CORREO ELECTRONICO",
    "DATA LOSS PREVENTION": "DATA LOSS PREVENTION (DLP)",
    XDR: "DETECCION Y RESPUESTA EXTENDIDA (XDR)",
    "DNS SECURITY": "DNS SECURITY",
    ENCRYPTION: "ENCRYPTION",
    IAM: "GESTION DE IDENTIDADES (IAM)",
    MFA: "MFA (MULTI FACTOR AUTHENTICATION)",
    NAC: "NAC (NETWORK ACCESS CONTROL)",
    "PROTECCION ENDPOINT": "PROTECCION ENDPOINT (EPP/EDR)",
    "SEGURIDAD WEB": "SEGURIDAD APLICACIONES WEB (WAF)",
    "SEGURIDAD DE RED": "SEGURIDAD RED",
    SIEM: "SIEM",
    SOAR: "SOAR",
    VPN: "VPN",
    "ZERO TRUST": "ZERO TRUST",
  };

  // Primero intentar con mapeo directo
  if (mapeoDirecto[nombreNormalizado]) {
    return mapeoDirecto[nombreNormalizado];
  }

  // Buscar coincidencias parciales en las claves del mapeo directo
  for (const clave in mapeoDirecto) {
    if (
      nombreNormalizado.includes(clave) ||
      clave.includes(nombreNormalizado)
    ) {
      return mapeoDirecto[clave];
    }
  }

  // Buscar coincidencias parciales en las claves del diccionario principal
  for (const clave in techToSolutions) {
    if (
      nombreNormalizado.includes(clave) ||
      clave.includes(nombreNormalizado)
    ) {
      return clave;
    }
  }

  // Si no se encuentra ninguna coincidencia
  console.log("No se encontró coincidencia para:", nombreNormalizado);
  return null;
}

// -------------------------
// Botón Generar PDF (basado en iconos del mapa) - VERSIÓN MEJORADA
// -------------------------
const botonInforme = document.querySelector(".btn-informe");

botonInforme.addEventListener("click", () => {
  alert("Generando informe PDF...");

  // Lista maestra (lateral izquierda)
  const listaMaestra = Array.from(
    document.querySelectorAll(".lateral-izquierda .icono")
  ).map((icono) => icono.alt);

  // Tomamos en cuenta los iconos del mapa
  const iconosMapa = Array.from(document.querySelectorAll("#mapa .icono")).map(
    (i) => i.alt
  );

  // Implementados = los que están en el mapa
  const implementados = listaMaestra.filter((nombre) =>
    iconosMapa.includes(nombre)
  );

  // No implementados = los que no están en el mapa
  const noImplementados = listaMaestra.filter(
    (nombre) => !iconosMapa.includes(nombre)
  );

  // Generar PDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Configuración de colores
  const colorPrincipal = [15, 15, 18]; // negro
  const colorExito = [46, 204, 113]; // Verde
  const colorError = [231, 76, 60]; // Rojo
  const colorSecundario = [149, 165, 166]; // Gris
  const colorFondo = [245, 245, 245]; // Gris claro

  // Configuración de dimensiones
  const marginLeft = 20;
  const marginRight = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - marginLeft - marginRight;
  let y = 40;
  const lineHeight = 10;
  const sectionSpacing = 20;

  // Función para agregar texto con estilo
  function addText(text, x, y, options = {}) {
    const {
      bold = false,
      italic = false,
      fontSize = 12,
      color = [0, 0, 0],
      align = "left",
      maxWidth = contentWidth,
    } = options;

    doc.setFont("helvetica", bold ? "bold" : italic ? "italic" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);

    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y, { align });

    return lines.length * (fontSize / 2.8) + 2;
  }

  // Función para dibujar un rectángulo con fondo
  function drawBox(x, y, width, height, fillColor = null) {
    if (fillColor) {
      doc.setFillColor(...fillColor);
      doc.rect(x, y, width, height, "F");
    }
    doc.setDrawColor(200, 200, 200);
    doc.rect(x, y, width, height);
  }

  // Encabezado
  doc.setFillColor(...colorPrincipal);
  doc.rect(0, 0, pageWidth, 30, "F");

  addText("INFORME DE ARQUITECTURA DE SEGURIDAD", pageWidth / 2, 20, {
    bold: true,
    fontSize: 16,
    color: [255, 255, 255],
    align: "center",
  });

  // Fecha de generación
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString() + " " + ahora.toLocaleTimeString();
  y += addText(`Generado: ${fecha}`, marginLeft, y, {
    fontSize: 10,
    color: colorSecundario,
  });

  y += 5;

  // Resumen ejecutivo
  drawBox(marginLeft, y, contentWidth, 30, colorFondo);
  y += 8;

  y += addText("RESUMEN EJECUTIVO", marginLeft + 5, y, {
    bold: true,
    fontSize: 14,
    color: colorPrincipal,
  });

  const porcentaje = Math.round(
    (implementados.length / listaMaestra.length) * 100
  );
  y += addText(
    `${porcentaje}% de tecnologías implementadas (${implementados.length} de ${listaMaestra.length})`,
    marginLeft + 5,
    y
  );

  y += sectionSpacing + 15;

  // Tecnologías implementadas
  y += addText("TECNOLOGÍAS IMPLEMENTADAS", marginLeft, y, {
    bold: true,
    fontSize: 14,
    color: colorExito,
  });

  // Línea decorativa
  doc.setDrawColor(...colorExito);
  doc.line(marginLeft, y - 3, marginLeft + 70, y - 3);

  if (implementados.length === 0) {
    y += addText("No hay tecnologías implementadas", marginLeft, y, {
      italic: true,
      color: colorSecundario,
    });
  } else {
    implementados.forEach((item) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      y += addText(`✓ ${item}`, marginLeft + 5, y, {
        color: colorExito,
      });
    });
  }

  y += sectionSpacing;

  // Tecnologías no implementadas
  y += addText("TECNOLOGÍAS NO IMPLEMENTADAS", marginLeft, y, {
    bold: true,
    fontSize: 14,
    color: colorError,
  });

  // Línea decorativa
  doc.setDrawColor(...colorError);
  doc.line(marginLeft, y - 3, marginLeft + 85, y - 3);

  if (noImplementados.length === 0) {
    y += addText("Todas las tecnologías están implementadas", marginLeft, y, {
      italic: true,
      color: colorSecundario,
    });
  } else {
    noImplementados.forEach((item) => {
      if (y > 250) {
        doc.addPage();
        y = 20;

        // Volver a dibujar el título en la nueva página
        y += addText("TECNOLOGÍAS NO IMPLEMENTADAS", marginLeft, y, {
          bold: true,
          fontSize: 14,
          color: colorError,
        });

        doc.setDrawColor(...colorError);
        doc.line(marginLeft, y - 3, marginLeft + 85, y - 3);
        y += 5;
      }

      y += addText(`✗ ${item}`, marginLeft + 5, y, {
        color: colorError,
      });

      // Buscar la clave usando nuestra función inteligente
      const claveTecnologia = encontrarClaveTecnologia(item);

      // Si encontramos una clave, mostrar las soluciones
      if (claveTecnologia && techToSolutions[claveTecnologia]) {
        const soluciones = techToSolutions[claveTecnologia].join(", ");
        y += addText(`  Soluciones: ${soluciones}`, marginLeft + 10, y, {
          fontSize: 10,
          color: [100, 100, 100],
        });
      } else {
        y += addText(
          `  No se encontraron soluciones para esta tecnología`,
          marginLeft + 10,
          y,
          {
            fontSize: 10,
            color: [100, 100, 100],
            italic: true,
          }
        );
      }

      y += 2; // Espacio entre elementos
    });
  }

  // Pie de página en todas las páginas
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(...colorSecundario);
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      {
        align: "center",
      }
    );
  }

  doc.save("informe-arquitectura-seguridad.pdf");
});
