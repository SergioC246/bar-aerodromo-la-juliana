/* Acceso del personal (cocina y barra).
   - Guarda el token y la contraseña del personal en este dispositivo.
   - Si el token falta o caduca, vuelve a entrar solo con la contraseña guardada.
   - Solo muestra el formulario la primera vez o si la contraseña ya no vale. */
(function () {
  'use strict';

  var CLAVE_TOKEN = 'staffToken';
  var CLAVE_PASS = 'staffPass';
  var RENOVAR_CADA = 30 * 60 * 1000;
  var callbacks = [];
  var enCurso = null;
  var ultimaRenovacion = Date.now();

  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function borrar(k) { try { localStorage.removeItem(k); } catch (e) {} }

  function getToken() { return leer(CLAVE_TOKEN) || leer('adminToken'); }

  function avisar() {
    callbacks.forEach(function (cb) { try { cb(); } catch (e) {} });
  }

  function pedirToken(password) {
    return fetch('/api/auth/staff-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        return { status: r.status, data: d };
      });
    });
  }

  function loginSilencioso() {
    var p = leer(CLAVE_PASS);
    if (!p) return Promise.resolve(false);
    return pedirToken(p).then(function (r) {
      if (r.status === 200 && r.data.token) { guardar(CLAVE_TOKEN, r.data.token); return true; }
      if (r.status === 401) borrar(CLAVE_PASS);
      return false;
    }).catch(function () { return false; });
  }

  function inyectarEstilos() {
    if (document.getElementById('staff-auth-css')) return;
    var s = document.createElement('style');
    s.id = 'staff-auth-css';
    s.textContent =
      '#staff-auth{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;' +
      'background:rgba(12,11,9,.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:Inter,sans-serif}' +
      '#staff-auth .sa-box{width:100%;max-width:420px;background:#1e1c18;border:1px solid rgba(212,168,83,.35);border-radius:20px;' +
      'padding:40px 32px;text-align:center;box-shadow:0 24px 70px rgba(0,0,0,.6)}' +
      '#staff-auth .sa-ico{font-size:52px;display:block;margin-bottom:10px}' +
      '#staff-auth h2{font-family:"Cormorant Garamond",serif;font-size:34px;font-weight:700;color:#d4a853;margin:0 0 8px}' +
      '#staff-auth p{font-size:15px;color:#9a9080;line-height:1.5;margin:0 0 26px}' +
      '#staff-auth input{width:100%;box-sizing:border-box;background:#0c0b09;border:2px solid rgba(255,255,255,.13);border-radius:12px;' +
      'color:#f2ede6;font-size:20px;padding:16px 18px;text-align:center;font-family:Inter,sans-serif;outline:none;transition:border-color .2s}' +
      '#staff-auth input:focus{border-color:#d4a853}' +
      '#staff-auth button{width:100%;margin-top:14px;min-height:60px;background:#d4a853;color:#0c0b09;border:none;border-radius:12px;' +
      'font-size:20px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;transition:background .2s}' +
      '#staff-auth button:hover{background:#e0b865}' +
      '#staff-auth button:disabled{opacity:.6;cursor:wait}' +
      '#staff-auth .sa-err{min-height:22px;margin-top:14px;font-size:15px;font-weight:600;color:#ff8a75}';
    document.head.appendChild(s);
  }

  function mostrarFormulario(mensajeInicial) {
    return new Promise(function (resolve) {
      inyectarEstilos();
      var viejo = document.getElementById('staff-auth');
      if (viejo) viejo.remove();

      var cont = document.createElement('div');
      cont.id = 'staff-auth';
      cont.innerHTML =
        '<form class="sa-box" autocomplete="on">' +
        '<span class="sa-ico">🔐</span>' +
        '<h2>Acceso del personal</h2>' +
        '<p>Introduce la contraseña del bar.<br>Solo hará falta una vez en este dispositivo.</p>' +
        '<input type="text" name="username" value="personal" autocomplete="username" style="display:none" tabindex="-1" aria-hidden="true">' +
        '<input type="password" name="password" placeholder="Contraseña" autocomplete="current-password" required>' +
        '<div class="sa-err" role="alert"></div>' +
        '<button type="submit">Entrar</button>' +
        '</form>';
      document.body.appendChild(cont);

      var form = cont.querySelector('form');
      var input = cont.querySelector('input[type=password]');
      var err = cont.querySelector('.sa-err');
      var btn = cont.querySelector('button');
      if (mensajeInicial) err.textContent = mensajeInicial;
      setTimeout(function () { input.focus(); }, 50);

      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var pass = input.value;
        if (!pass) return;
        btn.disabled = true;
        err.textContent = '';
        pedirToken(pass).then(function (r) {
          if (r.status === 200 && r.data.token) {
            guardar(CLAVE_TOKEN, r.data.token);
            guardar(CLAVE_PASS, pass);
            cont.remove();
            avisar();
            resolve(true);
            return;
          }
          if (r.status === 429) err.textContent = 'Demasiados intentos. Espera unos minutos.';
          else if (r.status === 503) err.textContent = 'El acceso del personal no está configurado en el servidor.';
          else err.textContent = 'Contraseña incorrecta.';
          btn.disabled = false;
          input.select();
        }).catch(function () {
          err.textContent = 'Sin conexión. Inténtalo de nuevo.';
          btn.disabled = false;
        });
      });
    });
  }

  function asegurarSesion(mensaje) {
    if (enCurso) return enCurso;
    enCurso = loginSilencioso().then(function (ok) {
      if (ok) { avisar(); return true; }
      return mostrarFormulario(mensaje);
    }).then(function (r) { enCurso = null; return r; }, function (e) { enCurso = null; throw e; });
    return enCurso;
  }

  function authFetch(url, opciones) {
    var op = opciones || {};
    function conToken() {
      var h = Object.assign({}, op.headers || {});
      h['Authorization'] = 'Bearer ' + getToken();
      return fetch(url, Object.assign({}, op, { headers: h }));
    }
    var previo = getToken() ? Promise.resolve(true) : asegurarSesion();
    return previo.then(conToken).then(function (res) {
      if (res.status !== 401) return res;
      borrar(CLAVE_TOKEN);
      return asegurarSesion().then(conToken);
    });
  }

  function renovar() {
    var t = getToken();
    if (!t) return;
    fetch('/api/auth/refresh', { method: 'POST', headers: { 'Authorization': 'Bearer ' + t } })
      .then(function (r) {
        if (r.ok) {
          return r.json().then(function (d) {
            if (d.token) guardar(CLAVE_TOKEN, d.token);
            ultimaRenovacion = Date.now();
          });
        }
        if (r.status === 401) { borrar(CLAVE_TOKEN); asegurarSesion(); }
      }).catch(function () {});
  }

  function cerrarSesion() {
    borrar(CLAVE_TOKEN);
    borrar(CLAVE_PASS);
    location.reload();
  }

  setInterval(renovar, RENOVAR_CADA);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && Date.now() - ultimaRenovacion > 20 * 60 * 1000) renovar();
  });

  window.staffAuth = {
    authFetch: authFetch,
    getToken: getToken,
    cerrarSesion: cerrarSesion,
    alEntrar: function (cb) { callbacks.push(cb); }
  };

  if (!getToken()) asegurarSesion();
})();