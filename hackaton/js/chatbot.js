const chat = document.getElementById('chat');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const status = document.getElementById('status');
    const tplMsg = document.getElementById('tplMsg');
    const suggestions = document.querySelectorAll('.suggestion');
    let messages=[];

    // --- Diccionario de tecnologías ---
    const securityKnowledge={
    "BACKUP": {
        importance: "Los sistemas de BACKUP garantizan la continuidad del negocio: permiten recuperar datos ante ransomware, errores humanos, fallos hardware o desastres. Estrategias recomendadas: 3-2-1, versionado y pruebas regulares de restauración.",
        vendors: ["ACRONIS","VEAM","BARRACUDA","IBM"],
        tips: "Automatizar backups, cifrar copias, almacenar offsite y probar restauraciones."
      },
      "ANTIBOT": {
        importance: "Previene automatizaciones maliciosas que afectan APIs y aplicaciones web (scraping, fraude, account takeover).",
        vendors: ["TREND MICRO","CROWDSTRIKE","SOPHOS","PALO ALTO"],
        tips: "Combinar con WAF y analítica de comportamiento; configurar rate-limiting."
      },
      "ANTIMALWARE": {
        importance: "Protege endpoints y servidores contra malware y ransomware; EDR/XDR añade detección basada en comportamiento.",
        vendors: ["TREND MICRO","CROWDSTRIKE","SOPHOS","PALO ALTO"],
        tips: "Habilitar telemetría, centralizar alertas y aplicar actualizaciones automáticas."
      },
      "CONTROL DE APLICACIONES": {
        importance: "Permite controlar qué aplicaciones pueden ejecutarse en los dispositivos, previniendo el uso de software no autorizado o malicioso.",
        vendors: ["TREND MICRO","NETSKOPE","PALO ALTO","PROOFPOINT"],
        tips: "Implementar políticas de whitelisting y mantener listas actualizadas de aplicaciones permitidas."
      },
      "CONTROLADOR DE URL": {
        importance: "Filtra y controla el acceso a sitios web basándose en categorías, reputación y contenido malicioso.",
        vendors: ["NETSKOPE","PALO ALTO","TREND MICRO","APP GATE"],
        tips: "Actualizar regularmente las categorías de URL y combinar con análisis de seguridad en tiempo real."
      },
      "FIREWALL": {
        importance: "Controla el tráfico de red y segmenta ambientes; NGFW ofrece inspección de aplicaciones y SSL/TLS.",
        vendors: ["PALO ALTO","SOPHOS","HILLSTONE","BARRACUDA"],
        tips: "Políticas por zonas, inspección SSL y revisión periódica de reglas."
      },
      "CONTROL DE VULNERABILIDADES": {
        importance: "Identifica, evalúa y prioriza vulnerabilidades en sistemas y aplicaciones para reducir la superficie de ataque.",
        vendors: ["CROWDSTRIKE","TREND MICRO","TENABLE","SOPHOS"],
        tips: "Escaneos regulares, integración con sistemas de parcheo and priorización basada en riesgo."
      },
      "CORRELACIONADOR DE LOGS": {
        importance: "Agrega y correlaciona eventos de seguridad de múltiples fuentes para detectar patrones de ataque y amenazas complejas.",
        vendors: ["CROWDSTRIKE","SPLUNK","IBM","LEVEL BLUE"],
        tips: "Configurar reglas de correlación específicas para el entorno y revisar regularmente las alertas generadas."
      },
      "ANÁLISIS DE VULNERABILIDADES": {
        importance: "Examina sistemas y aplicaciones para identificar vulnerabilidades conocidas y desconocidas antes de que sean explotadas.",
        vendors: ["TENABLE","SECPOINT","RIGDE SECURITY","PICUS"],
        tips: "Realizar escaneos regulares, priorizar remediación y validar correcciones."
      },
      "CERTIFICADO DIGITAL": {
        importance: "Proporciona autenticación, integridad y confidencialidad en comunicaciones digitales mediante criptografía de clave pública.",
        vendors: ["ENTRUST"],
        tips: "Gestionar el ciclo de vida completo de los certificados, incluyendo renovación y revocación."
      },
      "PROXY": {
        importance: "Intermediario entre usuarios e Internet que proporciona control de acceso, filtrado de contenido y anonimato.",
        vendors: ["TREND MICRO","BARRACUDA","NETSKOPE","GOOGLE CLOUD"],
        tips: "Configurar políticas de acceso granular y monitorear el tráfico para detectar anomalías."
      },
      "ANTI PHISHING": {
        importance: "Protege contra ataques de suplantación de identidad que buscan robar credenciales e información sensible.",
        vendors: ["TREND MICRO","SOPHOS","PALOALTO","GFI SOFTWARE"],
        tips: "Capacitar usuarios, implementar autenticación multifactor y verificar enlaces y remitentes."
      },
      "ANTI SPAM": {
        importance: "Filtra y bloquea correos electrónicos no deseados y maliciosos para mejorar la productividad y seguridad.",
        vendors: ["TREND MICRO","SOPHOS","PALOALTO","GFI SOFTWARE"],
        tips: "Combinar filtros basados en reputación, contenido y comportamiento para mayor efectividad."
      },
      "ANTIVIRUS DE CORREO": {
        importance: "Escanea y protege el correo electrónico contra malware, ransomware y otras amenazas transmitidas por este medio.",
        vendors: ["TREND MICRO","SOPHOS","PALOALTO","GFI SOFTWARE"],
        tips: "Actualizar firmas regularmente y escanear archivos adjuntos en sandbox."
      },
      "CONTROL DE AMENAZAS AVANZADAS": {
        importance: "Detecta y previene amenazas sofisticadas y dirigidas que evaden las defensas tradicionales.",
        vendors: ["TREND MICRO","CROWDSTRIKE","PALO ALTO","SOPHOS"],
        tips: "Implementar análisis de comportamiento y capacidades de hunting proactivo."
      },
      "DDOS": {
        importance: "Protege contra ataques de denegación de servicio que buscan saturar recursos y interrumpir servicios.",
        vendors: ["A10","RADWARE","THALES","PROGRESS"],
        tips: "Implementar mitigación en capas (red, aplicación) y tener un plan de respuesta ante incidentes."
      },
      "ADMINISTRADOR DE CANAL": {
        importance: "Optimiza y gestiona el ancho de banda para garantizar el rendimiento de aplicaciones críticas.",
        vendors: ["EXINDA","ALLOT","LEVELBLUE"],
        tips: "Priorizar tráfico crítico y monitorear continuamente el rendimiento de la red."
      },
      "SERVIDOR VIRTUAL": {
        importance: "Proporciona entornos aislados y seguros para ejecutar aplicaciones y servicios en infraestructura virtualizada.",
        vendors: ["TREND MICRO","SOPHOS","PROGRESS","CROWDSTRIKE"],
        tips: "Asegurar la hipervisión, segmentar redes virtuales y monitorear el rendimiento."
      },
      "IPS": {
        importance: "Inspecciona el tráfico de red en busca de actividades maliciosas y puede bloquearlas automáticamente.",
        vendors: ["TREND MICRO","PALO ALTO","HILLSTONE","SOPHOS"],
        tips: "Actualizar firmas regularmente y ajustar políticas para minimizar falsos positivos."
      },
      "FUGA DE INFORMACIÓN": {
        importance: "Previene la pérdida o filtración de datos sensibles mediante el monitoreo y control de transferencias.",
        vendors: ["FORCEPOINT","TREND MICRO","SOPHOS","NETSKOPE"],
        tips: "Clasificar datos sensibles, implementar políticas DLP y monitorear canales de exfiltración."
      },
      "GESTIÓN DE IDENTIDAD": {
        importance: "Administra y controla el acceso de usuarios a sistemas y recursos basedo en políticas de seguridad.",
        vendors: ["THALES","SEGURA","DELINEA","IBM"],
        tips: "Implementar autenticación multifactor, revisar privilegios regularmente y seguir el principio de mínimo privilegio."
      },
      "MONITOREO DE INTEGRIDAD": {
        importance: "Verifica que los sistemas y archivos críticos no han sido modificados o alterados sin autorización.",
        vendors: ["TREND MICRO","SPLUNK","IMPERVA","SOPHOS"],
        tips: "Establecer líneas base de integridad y alertar sobre cambios no autorizados."
      },
      "WAF": {
        importance: "Protege aplicaciones web de vulnerabilidades comunes como inyección SQL, XSS y otros ataques OWASP Top 10.",
        vendors: ["A10","IMPERVA","PROGRESS","BARRACUDA"],
        tips: "Actualizar reglas regularmente, realizar pruebas de penetración y configurar políticas personalizadas."
      },
      "BALANCEADOR DE CARGA": {
        importance: "Distribuye el tráfico entre múltiples servidores para optimizar rendimiento y disponibilidad.",
        vendors: ["A10","IMPERVA","PROGRESS","RADWARE"],
        tips: "Configurar checks de salud, implementar SSL offloading y monitorear el rendimiento."
      },
      "IPV4/IPV6": {
        importance: "Gestiona y asegura la transición y coexistencia entre protocolos IPv4 e IPv6.",
        vendors: ["A10"],
        tips: "Planificar la transición, asegurar ambos protocolos y monitorear el tráfico dual-stack."
      },
      "EDR ANALISIS FORENCE": {
        importance: "Proporciona capacidades avanzadas de detección, respuesta e investigación forense en endpoints.",
        vendors: ["TREND MICRO","CROWDSTRIKE","SOPHOS","PALO ALTO"],
        tips: "Recopilar y retener datos forenses, realizar investigaciones proactivas y integrar con SIEM."
      },
      "CIBER CÁMARA": {
        importance: "Protege sistemas de videovigilancia contra accesos no autorizados y manipulación maliciosa.",
        vendors: ["MOBOTIX"],
        tips: "Cambiar credenciales por defecto, segmentar red de videovigilancia y actualizar firmware regularmente."
      },
      "NAC NETWORK ACCESS CONTROL": {
        importance: "Controla el acceso a la red basedo en identidad, dispositivo y cumplimiento de políticas de seguridad.",
        vendors: ["SOLAR WINDS","IBM","PANDORA"],
        tips: "Autenticar dispositivos, verificar cumplimiento y segmentar acceso basedo en roles."
      },
      "ANÁLISIS FORENCE": {
        importance: "Investiga incidentes de seguridad mediante la recolección y análisis de evidencias digitales.",
        vendors: ["BHA","CROWDSTRIKE","IBM","SPLUNK"],
        tips: "Preservar evidencias, documentar procesos y seguir metodologías forenses establecidas."
      },
      "ANTIPISHING": {
        importance: "Protege específicamente contra ataques de phishing mediante técnicas avanzadas de detección.",
        vendors: ["TREND MICRO","SOPHOS","PALOALTO","GFI SOFTWARE"],
        tips: "Capacitar usuarios, implementar DMARC/DKIM/SPF y verificar enlaces en tiempo real."
      },
      "FIRMAS DIGITALES": {
        importance: "Garantiza autenticidad, integridad y no repudio en documentos y transacciones digitales.",
        vendors: ["ENTRUST","VERYCLAVE"],
        tips: "Gestionar claves de firma, validar certificados y seguir estándares de firma electrónica."
      },
      "CIFRADO": {
        importance: "Protege la confidencialidad de datos en reposo y en tránsito mediante algoritmos criptográficos.",
        vendors: ["VERYCLAVE","SOPHOS","ENTRUST","TREND MICRO"],
        tips: "Gestionar claves de cifrado, usar algoritmos robustos y cifrar datos sensibles por defecto."
      },
      "ANTIVIRUS DE NAVEGACIÓN": {
        importance: "Protege contra malware y amenazas durante la navegación web mediante análisis en tiempo real.",
        vendors: ["NETSKOPE","SOPHOS","TREND MICRO","PALO ALTO"],
        tips: "Actualizar motores de escaneo, analizar descargas y bloquear sitios maliciosos."
      },
      "CIFRADO DE CANAL": {
        importance: "Protege la confidencialidad e integridad de las comunicaciones mediante cifrado de canales.",
        vendors: ["A10","ENTRUST"],
        tips: "Implementar TLS/SSL, usar certificados válidos y deshabilitar protocolos obsoletos."
      },
      "SEGURIDAD ACTIVA": {
        importance: "Medidas preventivas y de detección que operan proactivamente para evitar incidentes de seguridad.",
        vendors: ["TX ONE"],
        tips: "Implementar defensas en profundidad, monitorear continuamente y actualizar defensas regularmente."
      },
      "SEGURIDAD PASIVA": {
        importance: "Medidas de respuesta y recuperación que se activan después de un incidente de seguridad.",
        vendors: ["TX ONE"],
        tips: "Mantener backups, tener planes de respuesta y realizar drills de recuperación."
      },
      "SEGUIMIENTO FORENCE": {
        importance: "Realiza investigaciones posteriores a incidentes para determinar causas y mejorar defensas.",
        vendors: ["TX ONE"],
        tips: "Documentar evidencias, analizar root cause y implementar medidas correctivas."
      },
      "SWITCH": {
        importance: "Dispositivo de red que conecta equipos y permite la segmentación y gestión del tráfico.",
        vendors: ["TX ONE"],
        tips: "Configurar VLANs, deshabilitar puertos no usados y monitorear tráfico de red."
      }
    };

    // --- Diccionario de áreas ---
    const areaKnowledge={
      "NUBE":"es una red global de servidores remotos que proveen servicios de procesamiento, almacenamiento, bases de datos, software, análisis e inteligencia a través de Internet. En lugar de gestionar tu propia infraestructura física, accedes a estos recursos de forma remota, pagando solo por el uso, lo que ofrece flexibilidad, escalabilidad y acceso a tus datos y aplicaciones desde casi cualquier dispositivo con conexión a Internet. ",
      "DMZ":"es una subred de red que actúa como una zona de amortiguamiento entre la red interna de una organización y una red externa no confiable, como Internet. Su función es alojar servidores y servicios que necesitan ser accesibles públicamente, como servidores web, de correo o DNS, aislándolos y protegiendo así la red interna.",
      "DATA CENTER":"instalación física que centraliza y alberga toda la infraestructura tecnológica necesaria para almacenar, procesar y gestionar grandes volúmenes de datos y aplicaciones de una organización.",
      "LAN":"Red que conecta dispositivos (computadoras, impresoras, etc.) dentro de un área geográfica pequeña y limitada, como una casa o una oficina. Permite que estos dispositivos se comuniquen entre sí, compartan recursos como impresoras o archivos, y se conecten a Internet de forma local. ",
      "OT":"Se refiere a hardware y software que se usan para monitorear y controlar equipos y procesos industriales físicos, como los de la manufactura, redes eléctricas, sistemas de agua o transporte. ",
      "SWITCH":"Dispositivo de red que conecta y gestiona la comunicación entre múltiples dispositivos (como computadoras, impresoras y servidores) dentro de una red local (LAN). Su función principal es recibir paquetes de datos y reenviarlos de manera inteligente y directa al dispositivo de destino específico, en lugar de enviarlos a todos, lo que optimiza el tráfico y mejora la eficiencia de la red. "
    };

    // --- Manejo mensajes ---
    function pushMessage(role,text){
      const el=tplMsg.content.firstElementChild.cloneNode();
      el.innerHTML=text;
      el.className='msg '+role;
      chat.appendChild(el);
      chat.scrollTop=chat.scrollHeight;
      messages.push({role,text});
    }

    function escapeHtml(unsafe){return unsafe.replace(/[&<"'>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

    function findKnowledgeKeyFromText(txt){
      txt=txt.toUpperCase();
      return Object.keys(securityKnowledge).find(k=>txt.includes(k));
    }

    function findAreaFromText(txt){
      txt=txt.toUpperCase();
      return Object.keys(areaKnowledge).find(a=>txt.includes(a));
    }

 function buildCombinedResponse(key) {
  const data = securityKnowledge[key];
  let response = `<strong>${key}</strong><br/>${data.importance}.<br/>
    <span class="small">Proveedores: ${data.vendors.join(", ")}</span>`;
  
  if (data.tips) {
    response += `<br/><em>Sugerencias:</em> ${data.tips}`;
  }

  return response;
}

  


    // --- Lógica principal ---
    function handleSend(){
      const raw=userInput.value.trim();
      if(!raw) return;
      pushMessage('user',escapeHtml(raw));
      userInput.value='';
      status.textContent='Procesando...';
      pushMessage('bot','Escribiendo...');
      setTimeout(()=>{
        messages.pop();chat.lastChild.remove();
        const key=findKnowledgeKeyFromText(raw);
        const area=findAreaFromText(raw);
        let response='';
        if(/^hola|^buenas/i.test(raw)) response="¡Hola! Pregúntame por tecnologías (BACKUP, FIREWALL, WAF...) o áreas (NUBE, LAN, OT...).";
        else if(/gracias/i.test(raw)) response="Con gusto 🙌";
        else if(/adios|chao/i.test(raw)) response="Hasta luego 👋";
        else if(key) response=buildCombinedResponse(key);
        else if(area) response=`<strong>${area}</strong><br/>${areaKnowledge[area]}`;
        else response="No encuentro coincidencia. Intenta con un área (NUBE, LAN, DMZ) o tecnología (BACKUP, FIREWALL...).";
        pushMessage('bot',response);
        status.textContent='Listo';
      },600);
    }

    sendBtn.addEventListener('click',handleSend);
    userInput.addEventListener('keydown',e=>{if(e.key==='Enter') handleSend();});
    suggestions.forEach(s=>s.addEventListener('click',()=>{userInput.value=s.dataset.q;handleSend();}));

    

    const toggleBtn = document.getElementById('toggleChat');
const chatApp = document.querySelector('.app');

toggleBtn.addEventListener('click', () => {
  chatApp.classList.toggle('hidden');
});

window.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");

  const welcomeMsg = document.createElement("div");
  welcomeMsg.classList.add("msg", "bot");
  welcomeMsg.innerHTML = `
    👋 ¡Hola! Soy tu <strong>Asistente de Seguridad Informática</strong>.<br/><br/>
    Estoy diseñado para ayudarte a conocer <strong>áreas, tecnologías y soluciones de seguridad</strong>. 🔐<br/><br/>
    👉 Puedes:<br/>
    • Hacer clic en los botones de sugerencia (ej: <em>BACKUP</em>, <em>FIREWALL</em>, <em>NUBE</em>).<br/>
    • Escribir una pregunta en la caja de texto (ej: "¿Qué es un antibot?").<br/>
    • Usar el botón 🎙️ para hablarme directamente.
  `;
  chat.appendChild(welcomeMsg);
});
