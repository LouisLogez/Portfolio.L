/* =========================================================================
   Portfolio v3 - effets et interactions (JavaScript natif, sans librairie)
   1. Barre de progression, en-tête, bouton retour en haut, menu mobile
   2. Chemin façon terminal en haut des pages
   3. Apparition des blocs au défilement (IntersectionObserver)
   4. Halo sous la souris, inclinaison 3D, boutons magnétiques
   5. Accueil : texte tapé, compteurs, réseau animé (canvas), terminal
   ========================================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (html) { n.innerHTML = html; }
    return n;
  }
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  /* ---------- 1. Barre de progression, en-tête, retour en haut ---------- */

  var header = $('.site-header');
  var progress = el('div', 'scroll-progress');
  var toTop = el('button', 'to-top',
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>');
  toTop.type = 'button';
  toTop.setAttribute('aria-label', 'Revenir en haut de la page');
  document.body.appendChild(progress);
  document.body.appendChild(toTop);
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  var ticking = false;
  function onScroll() {
    if (ticking) { return; }
    ticking = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var y = window.scrollY;
      progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
      if (header) { header.classList.toggle('is-scrolled', y > 10); }
      toTop.classList.toggle('is-on', y > 600);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  var burger = $('.nav-burger');
  if (burger && header) {
    burger.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) { burger.click(); burger.focus(); }
    });
  }

  /* ---------- 2. Chemin façon terminal (toutes les pages sauf l'accueil) ---------- */

  var PATHS = {
    apropos: ['~/a-propos', 'cat profil.md'],
    stages: ['~/parcours', 'ls -l stages/'],
    projets: ['~/realisations', 'ls projets/'],
    competences: ['~/competences', 'tree -L 1'],
    patrimoine: ['~/competences/bloc1', 'cat support.md'],
    infrastructure: ['~/competences/bloc2', 'cat reseau.md'],
    cybersecurite: ['~/competences/bloc3', 'cat securite.md'],
    veille: ['~/veille', 'tail -f actus.log'],
    contact: ['~/contact', 'ping louis']
  };
  var main = $('#contenu');
  if (main && PATHS[page]) {
    var bar = el('p', 'page-path',
      '<span class="usr">louis@sisr</span>:<span class="dir">' + PATHS[page][0] + '</span>$ ' +
      '<span class="cmd"></span><span class="caret"></span>');
    bar.setAttribute('aria-hidden', 'true');
    main.insertBefore(bar, main.firstChild);
    typeInto($('.cmd', bar), PATHS[page][1], 55, 300);
  }

  function typeInto(node, text, speed, delay) {
    if (reduced) { node.textContent = text; return; }
    var i = 0;
    setTimeout(function step() {
      node.textContent = text.slice(0, ++i);
      if (i < text.length) { setTimeout(step, speed + Math.random() * 40); }
    }, delay || 0);
  }

  /* ---------- 3. Apparition au défilement ---------- */

  var CARDS = '.project-card, .competency-card, .news-card, .formation-card, .experience-item, ' +
              '.fiche-bloc, .contact-link, .axe, .tile, .stat, .context-box, .methodology, figure.capture';

  var revealTargets = $$('main > section, .home-heading, ' + CARDS);
  revealTargets.forEach(function (node) {
    node.classList.add('reveal');
    // Décalage en cascade entre éléments frères
    var siblings = node.parentElement ? $$(':scope > .reveal', node.parentElement) : [];
    var idx = siblings.indexOf(node);
    if (idx > 0) { node.style.setProperty('--delay', Math.min(idx, 6) * 0.08 + 's'); }
  });

  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealTargets.forEach(function (n) { io.observe(n); });
  } else {
    revealTargets.forEach(function (n) { n.classList.add('is-visible'); });
  }

  /* ---------- 4. Halo, inclinaison 3D, boutons magnétiques ---------- */

  $$(CARDS).forEach(function (card) {
    card.classList.add('spot');
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  if (finePointer && !reduced) {
    $$('.competency-card, .tile, .stat').forEach(function (card) {
      card.classList.add('tilt');
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
        card.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    $$('.btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + x * 0.18 + 'px,' + y * 0.3 + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });

    // Halo lumineux qui suit le curseur
    var glow = el('div', 'cursor-glow');
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    var gx = 0, gy = 0, tx = 0, ty = 0, glowRunning = false;
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add('is-on');
      if (!glowRunning) { glowRunning = true; requestAnimationFrame(followGlow); }
    }, { passive: true });
    document.addEventListener('pointerleave', function () { glow.classList.remove('is-on'); });
    function followGlow() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = 'translate(' + gx + 'px,' + gy + 'px)';
      if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) { requestAnimationFrame(followGlow); }
      else { glowRunning = false; }
    }
  }

  /* ---------- 5. Accueil ---------- */

  // 5a. Texte tapé qui alterne plusieurs rôles
  var typed = $('.typed');
  if (typed) {
    var words = JSON.parse(typed.getAttribute('data-words'));
    if (reduced) {
      typed.textContent = words[0];
    } else {
      var w = 0, c = 0, deleting = false;
      (function loop() {
        var word = words[w];
        c += deleting ? -1 : 1;
        typed.textContent = word.slice(0, c);
        var wait = deleting ? 30 : 65;
        if (!deleting && c === word.length) { deleting = true; wait = 1800; }
        else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; wait = 350; }
        setTimeout(loop, wait);
      })();
    }
  }

  // 5b. Compteurs animés
  var counters = $$('[data-count]');
  if (counters.length) {
    var runCounter = function (node) {
      var target = parseFloat(node.getAttribute('data-count'));
      var suffix = node.getAttribute('data-suffix') || '';
      if (reduced) { node.textContent = target + suffix; return; }
      var start = performance.now(), dur = 1600;
      (function frame(now) {
        var t = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 4);
        node.textContent = Math.round(target * eased) + suffix;
        if (t < 1) { requestAnimationFrame(frame); }
      })(start);
    };
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (n) { cio.observe(n); });
    } else {
      counters.forEach(runCounter);
    }
  }

  // 5c. Réseau animé : des nœuds reliés s'échangent des paquets
  var canvas = $('#net-canvas');
  if (canvas && canvas.getContext) { network(canvas); }

  function network(cv) {
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, nodes = [], packets = [], colors = {};
    var mouse = { x: -9999, y: -9999 };
    var LINK = 150;
    var visible = true;

    function readColors() {
      colors.accent = cssVar('--accent');
      colors.accent2 = cssVar('--accent-2');
      colors.line = document.documentElement.getAttribute('data-theme') === 'dark'
        ? '255,255,255' : '90,50,20';
    }

    function resize() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(70, Math.max(24, (W * H) / 16000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() < 0.15 ? 3.6 : 1.8 // quelques « routeurs » plus gros
        });
      }
      packets = [];
    }

    function spawnPacket(a, b) {
      if (packets.length > 40) { return; }
      packets.push({ a: a, b: b, t: 0, speed: 0.008 + Math.random() * 0.012,
                     color: Math.random() < 0.5 ? colors.accent : colors.accent2 });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i, j, n, m, dx, dy, d;

      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) { n.vx *= -1; }
        if (n.y < 0 || n.y > H) { n.vy *= -1; }
        // Le curseur attire légèrement les nœuds proches
        dx = mouse.x - n.x; dy = mouse.y - n.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) { n.x += dx * 0.004; n.y += dy * 0.004; }
      }

      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          n = nodes[i]; m = nodes[j];
          dx = n.x - m.x; dy = n.y - m.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = 'rgba(' + colors.line + ',' + (0.16 * (1 - d / LINK)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
            if (Math.random() < 0.0009) { spawnPacket(n, m); }
          }
        }
        // Liaisons vers le curseur
        n = nodes[i];
        dx = mouse.x - n.x; dy = mouse.y - n.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) {
          ctx.strokeStyle = colors.accent;
          ctx.globalAlpha = 0.5 * (1 - d / 180);
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        ctx.fillStyle = n.r > 3 ? colors.accent : 'rgba(' + colors.line + ',0.45)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }

      // Paquets qui circulent sur les liaisons
      for (i = packets.length - 1; i >= 0; i--) {
        var p = packets[i];
        p.t += p.speed;
        if (p.t >= 1) { packets.splice(i, 1); continue; }
        var px = p.a.x + (p.b.x - p.a.x) * p.t;
        var py = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.shadowColor = p.color; ctx.shadowBlur = 12;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(px, py, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (visible && !reduced) { requestAnimationFrame(draw); }
    }

    readColors();
    resize();
    window.addEventListener('resize', function () { resize(); if (reduced) { draw(); } });
    cv.parentElement.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    cv.parentElement.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
    new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Met l'animation en pause quand le héros n'est plus à l'écran
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        var was = visible;
        visible = e[0].isIntersecting;
        if (visible && !was && !reduced) { requestAnimationFrame(draw); }
      }).observe(cv);
    }
    draw();
  }

  // 5d. Terminal interactif
  var term = $('#term');
  if (term) { terminal(term); }

  function terminal(root) {
    var out = $('.term-output', root);
    var input = $('.term-input', root);
    var history = [], hIdx = 0;

    var PAGES = {
      'a-propos': 'apropos.html', parcours: 'stages.html', realisations: 'projets.html',
      competences: 'competences.html', bloc1: 'patrimoine.html', bloc2: 'infrastructure.html',
      bloc3: 'cybersecurite.html', veille: 'veille.html', contact: 'contact.html'
    };

    var CMDS = {
      help: function () {
        return '<span class="dim">Commandes disponibles :</span>\n' +
          '  <span class="p">whoami</span>      qui suis-je ?\n' +
          '  <span class="p">ls</span>          lister les pages du portfolio\n' +
          '  <span class="p">cd</span> &lt;page&gt;   ouvrir une page (ex : cd realisations)\n' +
          '  <span class="p">skills</span>      mes outils et technologies\n' +
          '  <span class="p">neofetch</span>    fiche système… de moi\n' +
          '  <span class="p">cv</span>          télécharger mon CV\n' +
          '  <span class="p">theme</span>       basculer clair / sombre\n' +
          '  <span class="p">clear</span>       nettoyer le terminal';
      },
      whoami: function () {
        return 'Louis LOGEZ — étudiant en <span class="p">BTS SIO option SISR</span>\n' +
          'Apprenti DevOps à la Société Générale Nouvelle-Calédonie (DSIOP)\n' +
          'Objectif : expert cybersécurité dans la Marine nationale.';
      },
      ls: function () {
        return Object.keys(PAGES).map(function (k) {
          return '<a href="' + PAGES[k] + '">' + k + '/</a>';
        }).join('   ');
      },
      skills: function () {
        return '<span class="d">[réseau]</span>      VLAN, SSH, Proxmox\n' +
          '<span class="d">[sécurité]</span>    Wazuh (HIDS), conformité NIST, Active Directory\n' +
          '<span class="d">[supervision]</span> Grafana, Prometheus, Zabbix\n' +
          '<span class="d">[devops]</span>      Docker, Kubernetes, Git, PowerShell, Python';
      },
      neofetch: function () {
        return '<span class="p">   _     _      </span>  <span class="p">louis</span>@<span class="p">sisr</span>\n' +
          '<span class="p">  | |   | |     </span>  ----------\n' +
          '<span class="p">  | |   | |     </span>  <span class="d">OS</span>       : BTS SIO 2e année\n' +
          '<span class="p">  | |___| |___  </span>  <span class="d">Option</span>   : SISR\n' +
          '<span class="p">  |_____|_____| </span>  <span class="d">Uptime</span>   : alternance depuis déc. 2025\n' +
          '                   <span class="d">Location</span> : Dumbéa, Nouvelle-Calédonie\n' +
          '                   <span class="d">Hobbies</span>  : basket, CTF, voyages, musique';
      },
      cv: function () {
        window.open('assets/docs/cv-logez-louis.pdf', '_blank', 'noopener');
        return '<span class="ok">✓</span> Ouverture de cv-logez-louis.pdf…';
      },
      theme: function () {
        var btn = $('.theme-toggle');
        if (btn) { btn.click(); }
        return '<span class="ok">✓</span> Thème basculé.';
      },
      sudo: function () {
        return '<span class="d">louis n\'est pas dans le fichier sudoers.</span> Cet incident sera signalé… à Wazuh 😉';
      },
      clear: function () { out.innerHTML = ''; return null; }
    };

    function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    function prompt(cmd) {
      return '<span class="p">louis@sisr</span>:<span class="d">~</span>$ ' + esc(cmd);
    }

    function print(html) {
      if (html === null) { return; }
      var line = el('div', '', html);
      out.appendChild(line);
      out.parentElement.scrollTop = out.parentElement.scrollHeight;
    }

    function run(raw) {
      var cmd = raw.trim();
      print(prompt(cmd));
      if (!cmd) { return; }
      var parts = cmd.split(/\s+/);
      var name = parts[0].toLowerCase();
      if (name === 'cd') {
        var target = (parts[1] || '').replace(/\/$/, '').toLowerCase();
        if (PAGES[target]) {
          print('<span class="ok">✓</span> Connexion à ' + target + '…');
          setTimeout(function () { location.href = PAGES[target]; }, 450);
        } else {
          print('<span class="d">cd: ' + esc(target || '?') + ': dossier introuvable</span> — tape <span class="p">ls</span>');
        }
        return;
      }
      if (CMDS[name]) { print(CMDS[name]()); }
      else { print('<span class="d">' + esc(name) + ': commande introuvable</span> — tape <span class="p">help</span>'); }
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (input.value.trim()) { history.push(input.value); }
        hIdx = history.length;
        run(input.value);
        input.value = '';
      } else if (e.key === 'ArrowUp' && hIdx > 0) {
        input.value = history[--hIdx]; e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        hIdx = Math.min(hIdx + 1, history.length);
        input.value = history[hIdx] || '';
      } else if (e.key === 'Tab') {
        e.preventDefault();
        var v = input.value.toLowerCase();
        var pool = /^cd\s/.test(v) ? Object.keys(PAGES).map(function (k) { return 'cd ' + k; }) : Object.keys(CMDS).concat('cd');
        var hit = pool.filter(function (k) { return k.indexOf(v) === 0; });
        if (hit.length === 1) { input.value = hit[0]; }
      }
    });
    $('.term-body', root).addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') { input.focus({ preventScroll: true }); }
    });

    // Démo automatique quand le terminal apparaît à l'écran
    var demo = ['whoami', 'ls'];
    var started = false;
    function autoplay() {
      if (started) { return; }
      started = true;
      if (reduced) { demo.forEach(run); return; }
      var k = 0;
      (function next() {
        if (k >= demo.length) { return; }
        var cmd = demo[k++], i = 0;
        (function typeChar() {
          input.value = cmd.slice(0, ++i);
          if (i < cmd.length) { setTimeout(typeChar, 90); }
          else { setTimeout(function () { input.value = ''; run(cmd); setTimeout(next, 700); }, 350); }
        })();
      })();
    }
    if ('IntersectionObserver' in window) {
      var tio = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { autoplay(); tio.disconnect(); }
      }, { threshold: 0.4 });
      tio.observe(root);
    } else {
      autoplay();
    }
  }
})();
