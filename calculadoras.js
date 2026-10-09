/* ============================================================
   RoutingLab · calculadoras VLSM, wildcard e IPv6
   Compartido por herramientas.html (es) y en/tools.html (en):
   el idioma sale de <html lang>. Todo se calcula en el navegador.
   ============================================================ */
(function () {
  const EN = (document.documentElement.lang || 'es').startsWith('en');
  const LOC = EN ? 'en-US' : 'es-ES';
  const T = EN ? {
    redInvalida: 'Enter the base network as 192.168.10.0/24.',
    sinSubredes: 'Add at least one subnet with the hosts it needs.',
    hostsInvalidos: n => `"${n}": the number of hosts must be 1 or more.`,
    noCabe: (usado, total) => `They do not fit: you need ${usado.toLocaleString(LOC)} addresses and the network only has ${total.toLocaleString(LOC)}. Use a larger network (a shorter prefix).`,
    ajustada: (escrita, red) => `You wrote ${escrita}, which is not a network address. I used ${red} instead.`,
    cols: ['Subnet', 'Needs', 'Network', 'Mask', 'Usable range', 'Broadcast', 'Usable'],
    resumen: (usado, total, libre, pct) => `Used ${usado.toLocaleString(LOC)} of ${total.toLocaleString(LOC)} addresses (${pct} %). Free from ${libre}.`,
    resumenLleno: (usado, total) => `Used ${usado.toLocaleString(LOC)} of ${total.toLocaleString(LOC)} addresses: the network is full.`,
    nombreDefecto: i => `Subnet ${i}`,
    quitar: 'Remove',
    nombrePh: 'Name',
    hostsPh: 'Hosts',
    // wildcard
    ipInvalida: 'That IPv4 address is not valid. Format: 192.168.1.0',
    wcInvalida: 'That wildcard is not valid. Format: 0.0.0.255',
    coincide: 'Matches',
    direcciones: n => `${n.toLocaleString(LOC)} address${n === 1 ? '' : 'es'}`,
    desde: 'First match',
    hasta: 'Last match',
    equivale: 'Same as',
    noContigua: 'Non-contiguous wildcard: it matches addresses that are not consecutive (for example, only even or odd ones).',
    ejemplos: 'Examples that match',
    ajusteBits: (escrita, base) => `Bits that the wildcard ignores were set in ${escrita}; the router treats it as ${base}.`,
    lineaACL: 'Standard ACL',
    lineaExt: 'Extended ACL (any destination)',
    lineaOSPF: 'OSPF',
    // ipv6
    ip6Vacia: 'Enter an IPv6 address, for example 2001:db8:acad:1::1/64',
    ip6Invalida: m => `That IPv6 address is not valid: ${m}`,
    prefijoInvalido: 'The prefix must be between /0 and /128.',
    completa: 'Full (expanded)',
    comprimida: 'Compressed (RFC 5952)',
    tipo: 'Type',
    prefijoRed: 'Network prefix',
    idInterfaz: 'Interface ID (last 64 bits)',
    macInvalida: 'That MAC is not valid. Formats: 00:1A:2B:3C:4D:5E or 001a.2b3c.4d5e',
    eui: 'EUI-64 interface ID',
    linkLocal: 'Link-local address',
    global: 'Global address (EUI-64)',
    errores: {
      vacia: 'it is empty', dobles: "only one '::' is allowed", nada: "'::' compresses nothing",
      grupos: 'it must have 8 groups', grupo: g => `invalid group "${g}"`
    },
    tipos: {
      noesp: 'Unspecified (::)', loop: 'Loopback (::1)', link: 'Link-local (fe80::/10)',
      ula: 'Unique local (fc00::/7)', multi: 'Multicast (ff00::/8)', doc: 'Documentation (2001:db8::/32)',
      global: 'Global unicast (2000::/3)', mapeada: 'IPv4-mapped (::ffff:0:0/96)', otra: 'Reserved / other'
    }
  } : {
    redInvalida: 'Escribe la red de partida como 192.168.10.0/24.',
    sinSubredes: 'Añade al menos una subred con los hosts que necesita.',
    hostsInvalidos: n => `«${n}»: el número de hosts tiene que ser 1 o más.`,
    noCabe: (usado, total) => `No caben: necesitas ${usado.toLocaleString(LOC)} direcciones y la red solo tiene ${total.toLocaleString(LOC)}. Usa una red más grande (un prefijo más corto).`,
    ajustada: (escrita, red) => `Has escrito ${escrita}, que no es una dirección de red. He usado ${red}.`,
    cols: ['Subred', 'Necesita', 'Red', 'Máscara', 'Rango útil', 'Broadcast', 'Útiles'],
    resumen: (usado, total, libre, pct) => `Usadas ${usado.toLocaleString(LOC)} de ${total.toLocaleString(LOC)} direcciones (${pct} %). Libre a partir de ${libre}.`,
    resumenLleno: (usado, total) => `Usadas ${usado.toLocaleString(LOC)} de ${total.toLocaleString(LOC)} direcciones: la red queda llena.`,
    nombreDefecto: i => `Subred ${i}`,
    quitar: 'Quitar',
    nombrePh: 'Nombre',
    hostsPh: 'Hosts',
    ipInvalida: 'Esa dirección IPv4 no es válida. Formato: 192.168.1.0',
    wcInvalida: 'Esa wildcard no es válida. Formato: 0.0.0.255',
    coincide: 'Coincide con',
    direcciones: n => `${n.toLocaleString(LOC)} ${n === 1 ? 'dirección' : 'direcciones'}`,
    desde: 'Primera que coincide',
    hasta: 'Última que coincide',
    equivale: 'Equivale a',
    noContigua: 'Wildcard no contigua: coincide con direcciones que no son seguidas (por ejemplo, solo las pares o las impares).',
    ejemplos: 'Ejemplos que coinciden',
    ajusteBits: (escrita, base) => `En ${escrita} había bits que la wildcard ignora; el router la trata como ${base}.`,
    lineaACL: 'ACL estándar',
    lineaExt: 'ACL extendida (a cualquier destino)',
    lineaOSPF: 'OSPF',
    ip6Vacia: 'Escribe una dirección IPv6, por ejemplo 2001:db8:acad:1::1/64',
    ip6Invalida: m => `Esa IPv6 no es válida: ${m}`,
    prefijoInvalido: 'El prefijo tiene que estar entre /0 y /128.',
    completa: 'Completa (expandida)',
    comprimida: 'Comprimida (RFC 5952)',
    tipo: 'Tipo',
    prefijoRed: 'Prefijo de red',
    idInterfaz: 'ID de interfaz (últimos 64 bits)',
    macInvalida: 'Esa MAC no es válida. Formatos: 00:1A:2B:3C:4D:5E o 001a.2b3c.4d5e',
    eui: 'ID de interfaz EUI-64',
    linkLocal: 'Dirección link-local',
    global: 'Dirección global (EUI-64)',
    errores: {
      vacia: 'está vacía', dobles: "solo se permite un '::'", nada: "el '::' no comprime nada",
      grupos: 'tiene que tener 8 grupos', grupo: g => `grupo «${g}» no válido`
    },
    tipos: {
      noesp: 'No especificada (::)', loop: 'Loopback (::1)', link: 'Link-local (fe80::/10)',
      ula: 'Única local (fc00::/7)', multi: 'Multicast (ff00::/8)', doc: 'Documentación (2001:db8::/32)',
      global: 'Unicast global (2000::/3)', mapeada: 'IPv4 mapeada (::ffff:0:0/96)', otra: 'Reservada / otra'
    }
  };

  // ---------- utilidades IPv4 ----------
  const aEntero = ip => ip.split('.').reduce((a, o) => ((a << 8) >>> 0) + parseInt(o, 10), 0) >>> 0;
  const aTexto = n => [24, 16, 8, 0].map(d => (n >>> d) & 255).join('.');
  const ipValida = t => {
    const p = t.trim().split('.');
    return p.length === 4 && p.every(o => /^\d{1,3}$/.test(o) && +o <= 255);
  };
  const mascaraDe = c => (c === 0 ? 0 : (0xFFFFFFFF << (32 - c)) >>> 0);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const error = msg => `<div class="error-caja">${esc(msg)}</div>`;
  const aviso = msg => `<div class="aviso-caja">${esc(msg)}</div>`;
  const res = (etiqueta, valor, destaca) =>
    `<div class="res${destaca ? ' destaca' : ''}"><span>${esc(etiqueta)}</span><b>${esc(valor)}</b></div>`;

  /* ================= VLSM ================= */
  (function vlsm() {
    const $red = document.getElementById('vlsmRed');
    const $filas = document.getElementById('vlsmFilas');
    const $anadir = document.getElementById('vlsmAnadir');
    const $salida = document.getElementById('vlsmSalida');
    if (!$red || !$filas) return;

    const EJEMPLO = EN
      ? [['Sales', 100], ['IT', 50], ['Management', 20], ['WAN link', 2]]
      : [['Ventas', 100], ['Informática', 50], ['Dirección', 20], ['Enlace WAN', 2]];

    function nuevaFila(nombre = '', hosts = '') {
      const fila = document.createElement('div');
      fila.className = 'vlsm-fila';
      fila.innerHTML = `
        <input class="campo" type="text" maxlength="30" placeholder="${esc(T.nombrePh)}" aria-label="${esc(T.nombrePh)}">
        <input class="campo mono" type="number" min="1" max="16777214" inputmode="numeric" placeholder="${esc(T.hostsPh)}" aria-label="${esc(T.hostsPh)}">
        <button class="vlsm-quitar" type="button" aria-label="${esc(T.quitar)}" title="${esc(T.quitar)}">✕</button>`;
      const [n, h] = fila.querySelectorAll('input');
      n.value = nombre; h.value = hosts;
      n.addEventListener('input', calcular); h.addEventListener('input', calcular);
      fila.querySelector('button').addEventListener('click', () => { fila.remove(); calcular(); });
      $filas.appendChild(fila);
      return fila;
    }

    function calcular() {
      const m = $red.value.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\s*\/\s*(\d{1,2})$/);
      if (!m || !ipValida(m[1]) || +m[2] > 30) { $salida.innerHTML = error(T.redInvalida); return; }
      const cidrBase = +m[2];
      const escrita = aEntero(m[1]);
      const base = (escrita & mascaraDe(cidrBase)) >>> 0;
      const total = 2 ** (32 - cidrBase);

      const pedidas = [];
      let i = 0;
      for (const fila of $filas.querySelectorAll('.vlsm-fila')) {
        i++;
        const [n, h] = fila.querySelectorAll('input');
        if (h.value.trim() === '' && n.value.trim() === '') continue;
        const nombre = n.value.trim() || T.nombreDefecto(i);
        const hosts = parseInt(h.value, 10);
        if (!(hosts >= 1)) { $salida.innerHTML = error(T.hostsInvalidos(nombre)); return; }
        pedidas.push({ nombre, hosts, orden: i });
      }
      if (!pedidas.length) { $salida.innerHTML = error(T.sinSubredes); return; }

      // VLSM clásico: de mayor a menor, cada bloque es la potencia de 2 que cabe hosts + red + broadcast
      pedidas.sort((a, b) => b.hosts - a.hosts || a.orden - b.orden);
      let cursor = base, usado = 0;
      const filas = [];
      for (const p of pedidas) {
        let bits = 2;
        while (2 ** bits - 2 < p.hosts) bits++;
        const tam = 2 ** bits;
        usado += tam;
        if (usado > total) { $salida.innerHTML = error(T.noCabe(pedidas.reduce((s, q) => { let b = 2; while (2 ** b - 2 < q.hosts) b++; return s + 2 ** b; }, 0), total)); return; }
        const cidr = 32 - bits;
        filas.push({ ...p, red: cursor, cidr, bc: cursor + tam - 1, utiles: tam - 2 });
        cursor += tam;
      }

      const ajuste = escrita !== base ? aviso(T.ajustada(m[1], `${aTexto(base)}/${cidrBase}`)) : '';
      const pct = Math.round((usado / total) * 100);
      const resumen = usado < total
        ? T.resumen(usado, total, aTexto(cursor), pct)
        : T.resumenLleno(usado, total);

      $salida.innerHTML = `${ajuste}
        <div class="tabla-envoltura"><table class="tabla-vlsm">
          <thead><tr>${T.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
          <tbody>${filas.map(f => `<tr>
            <td><strong>${esc(f.nombre)}</strong></td>
            <td class="mono">${f.hosts.toLocaleString(LOC)}</td>
            <td class="puerto">${aTexto(f.red)}/${f.cidr}</td>
            <td class="mono texto-sec">${aTexto(mascaraDe(f.cidr))}</td>
            <td class="mono">${aTexto(f.red + 1)} – ${aTexto(f.bc - 1)}</td>
            <td class="mono texto-sec">${aTexto(f.bc)}</td>
            <td class="mono">${f.utiles.toLocaleString(LOC)}</td></tr>`).join('')}</tbody>
        </table></div>
        <div class="barra-uso" role="img" aria-label="${esc(resumen)}"><div style="width:${pct}%"></div></div>
        <p class="texto-sec" style="margin:10px 0 0;font-size:.92rem">${esc(resumen)}</p>`;
    }

    EJEMPLO.forEach(([n, h]) => nuevaFila(n, h));
    $red.addEventListener('input', calcular);
    $anadir.addEventListener('click', () => { nuevaFila().querySelector('input').focus(); calcular(); });
    calcular();
  })();

  /* ================= Wildcard ================= */
  (function wildcard() {
    const $ip = document.getElementById('wcIp');
    const $wc = document.getElementById('wcMascara');
    const $pref = document.getElementById('wcPrefijo');
    const $salida = document.getElementById('wcSalida');
    if (!$ip || !$wc) return;

    for (let c = 0; c <= 32; c++) {
      const o = document.createElement('option');
      o.value = c; o.textContent = `/${c} → ${aTexto((~mascaraDe(c)) >>> 0)}`;
      $pref.appendChild(o);
    }
    $pref.value = '';

    function calcular() {
      if (!ipValida($ip.value)) { $salida.innerHTML = error(T.ipInvalida); return; }
      if (!ipValida($wc.value)) { $salida.innerHTML = error(T.wcInvalida); return; }
      const ip = aEntero($ip.value.trim());
      const wc = aEntero($wc.value.trim());
      const base = (ip & ~wc) >>> 0;
      let unos = 0; for (let b = 0; b < 32; b++) if ((wc >>> b) & 1) unos++;
      const cuantos = 2 ** unos;
      const primera = base, ultima = (base | wc) >>> 0;
      // contigua = los bits a 1 forman un bloque al final (wc+1 es potencia de 2)
      const contigua = ((wc + 1) & wc) === 0 || wc === 0xFFFFFFFF;
      const ipTxt = aTexto(base), wcTxt = aTexto(wc);

      let html = '';
      if (ip !== base) html += aviso(T.ajusteBits($ip.value.trim(), ipTxt));
      html += '<div class="resultados">';
      html += res(T.coincide, T.direcciones(cuantos), true);
      html += res(T.desde, aTexto(primera));
      html += res(T.hasta, aTexto(ultima));
      if (contigua) html += res(T.equivale, `${ipTxt}/${32 - unos}`, true);
      html += '</div>';
      if (!contigua) {
        // primeros ejemplos: recorre las combinaciones de los bits libres
        const libres = []; for (let b = 0; b < 32; b++) if ((wc >>> b) & 1) libres.push(b);
        const ej = [];
        for (let k = 0; k < Math.min(cuantos, 6); k++) {
          let v = base;
          libres.forEach((bit, j) => { if ((k >>> j) & 1) v = (v | (1 << bit)) >>> 0; });
          ej.push(aTexto(v >>> 0));
        }
        html += aviso(T.noContigua);
        html += `<p class="texto-sec" style="margin:12px 0 0;font-size:.92rem"><strong>${esc(T.ejemplos)}:</strong> <span class="mono">${ej.map(esc).join(' · ')}${cuantos > 6 ? ' …' : ''}</span></p>`;
      }
      const objetivo = wc === 0 ? `host ${ipTxt}` : (wc === 0xFFFFFFFF ? 'any' : `${ipTxt} ${wcTxt}`);
      html += `<div class="cli-bloque" aria-label="Cisco IOS">
        <div><span class="cli-com">! ${esc(T.lineaACL)}</span></div>
        <div>access-list 10 permit ${objetivo}</div>
        <div><span class="cli-com">! ${esc(T.lineaExt)}</span></div>
        <div>access-list 110 permit ip ${objetivo} any</div>
        ${contigua && wc !== 0xFFFFFFFF ? `<div><span class="cli-com">! ${esc(T.lineaOSPF)}</span></div>
        <div>router ospf 1</div><div>&nbsp;network ${ipTxt} ${wcTxt} area 0</div>` : ''}
      </div>`;
      $salida.innerHTML = html;
    }

    $ip.addEventListener('input', calcular);
    $wc.addEventListener('input', () => { $pref.value = ''; calcular(); });
    $pref.addEventListener('change', () => {
      if ($pref.value === '') return;
      $wc.value = aTexto((~mascaraDe(+$pref.value)) >>> 0); calcular();
    });
    document.querySelectorAll('[data-wc]').forEach(b => b.addEventListener('click', () => {
      const [ip, w] = b.dataset.wc.split(' ');
      $ip.value = ip; $wc.value = w; $pref.value = ''; calcular();
    }));
    calcular();
  })();

  /* ================= IPv6 ================= */
  (function ipv6() {
    const $dir = document.getElementById('v6Dir');
    const $mac = document.getElementById('v6Mac');
    const $salida = document.getElementById('v6Salida');
    const $salidaMac = document.getElementById('v6SalidaMac');
    if (!$dir) return;

    // Mismo motor que la app (CalculadoraIPv6.kt): expandir, comprimir RFC 5952, tipo y EUI-64
    function expandir(d) {
      const dir = d.trim().toLowerCase();
      if (!dir) throw T.errores.vacia;
      let grupos;
      if (dir.includes('::')) {
        const partes = dir.split('::');
        if (partes.length !== 2) throw T.errores.dobles;
        const izq = partes[0].split(':').filter(Boolean), der = partes[1].split(':').filter(Boolean);
        const faltan = 8 - izq.length - der.length;
        if (faltan < 1) throw T.errores.nada;
        grupos = [...izq, ...Array(faltan).fill('0'), ...der];
      } else grupos = dir.split(':');
      if (grupos.length !== 8) throw T.errores.grupos;
      return grupos.map(g => {
        if (!/^[0-9a-f]{1,4}$/.test(g)) throw T.errores.grupo(g);
        return g.padStart(4, '0');
      });
    }
    function comprimir(g8) {
      const g = g8.map(x => x.replace(/^0+/, '') || '0');
      let ini = -1, lon = 0;
      for (let i = 0; i < 8;) {
        if (g[i] === '0') { let j = i; while (j < 8 && g[j] === '0') j++; if (j - i > lon) { lon = j - i; ini = i; } i = j; } else i++;
      }
      if (lon < 2) return g.join(':');
      return g.slice(0, ini).join(':') + '::' + g.slice(ini + lon).join(':');
    }
    function tipo(g8) {
      const n = g8.map(x => parseInt(x, 16)), p = n[0];
      if (n.every(x => x === 0)) return T.tipos.noesp;
      if (n.slice(0, 7).every(x => x === 0) && n[7] === 1) return T.tipos.loop;
      if (n.slice(0, 5).every(x => x === 0) && n[5] === 0xffff) return T.tipos.mapeada;
      if (p >= 0xfe80 && p <= 0xfebf) return T.tipos.link;
      if (p >= 0xfc00 && p <= 0xfdff) return T.tipos.ula;
      if (p >= 0xff00) return T.tipos.multi;
      if (p === 0x2001 && n[1] === 0x0db8) return T.tipos.doc;
      if (p >= 0x2000 && p <= 0x3fff) return T.tipos.global;
      return T.tipos.otra;
    }
    // Aplica el prefijo con BigInt para no perder bits
    function aplicarPrefijo(g8, pref) {
      let v = BigInt('0x' + g8.join(''));
      const masc = pref === 0 ? 0n : ((1n << 128n) - 1n) ^ ((1n << BigInt(128 - pref)) - 1n);
      v &= masc;
      const hex = v.toString(16).padStart(32, '0');
      return hex.match(/.{4}/g);
    }
    function eui64(mac) {
      const hex = mac.replace(/[.:\-\s]/g, '').toLowerCase();
      if (!/^[0-9a-f]{12}$/.test(hex)) return null;
      const b = hex.match(/.{2}/g).map(x => parseInt(x, 16));
      b[0] ^= 0x02;
      const h = x => x.toString(16).padStart(2, '0');
      return [h(b[0]) + h(b[1]), h(b[2]) + 'ff', 'fe' + h(b[3]), h(b[4]) + h(b[5])];
    }

    let ultimoPrefijo64 = null;   // para construir la global con EUI-64

    function calcularDir() {
      const t = $dir.value.trim();
      if (!t) { $salida.innerHTML = error(T.ip6Vacia); ultimoPrefijo64 = null; calcularMac(); return; }
      const [dir, pref] = t.split('/');
      let g8;
      try { g8 = expandir(dir); } catch (m) { $salida.innerHTML = error(T.ip6Invalida(m)); ultimoPrefijo64 = null; calcularMac(); return; }
      let html = '<div class="resultados">';
      html += res(T.comprimida, comprimir(g8), true);
      html += res(T.tipo, tipo(g8));
      html += `</div><div class="resultados" style="margin-top:12px">${res(T.completa, g8.join(':'))}</div>`;
      ultimoPrefijo64 = null;
      if (pref !== undefined) {
        const p = parseInt(pref, 10);
        if (!/^\d{1,3}$/.test(pref) || p > 128) { $salida.innerHTML = html + error(T.prefijoInvalido); calcularMac(); return; }
        const red = aplicarPrefijo(g8, p);
        html += `<div class="resultados" style="margin-top:12px">
          ${res(T.prefijoRed, `${comprimir(red)}/${p}`, true)}
          ${res(T.idInterfaz, g8.slice(4).join(':'))}</div>`;
        if (p <= 64) ultimoPrefijo64 = { red: aplicarPrefijo(g8, 64), p };
      }
      $salida.innerHTML = html;
      calcularMac();
    }

    function calcularMac() {
      if (!$mac || !$salidaMac) return;
      const t = $mac.value.trim();
      if (!t) { $salidaMac.innerHTML = ''; return; }
      const id = eui64(t);
      if (!id) { $salidaMac.innerHTML = error(T.macInvalida); return; }
      let html = '<div class="resultados">';
      html += res(T.eui, id.join(':'), true);
      html += res(T.linkLocal, comprimir(['fe80', '0000', '0000', '0000', ...id]));
      if (ultimoPrefijo64) {
        html += res(T.global, comprimir([...ultimoPrefijo64.red.slice(0, 4), ...id]), true);
      }
      $salidaMac.innerHTML = html + '</div>';
    }

    $dir.addEventListener('input', calcularDir);
    $mac?.addEventListener('input', calcularMac);
    document.querySelectorAll('[data-v6]').forEach(b => b.addEventListener('click', () => {
      $dir.value = b.dataset.v6; calcularDir();
    }));
    calcularDir();
  })();
})();
