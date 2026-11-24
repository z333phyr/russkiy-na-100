// Меню, появление блоков, слоган по словам, подсветка пункта меню, запись через мессенджеры, модалки.
(() => {
  const body = document.body;
  const burger = document.querySelector('.burger');
  const panel = document.querySelector('.mpanel');
  const setMenu = open => {
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    panel.setAttribute('aria-hidden', !open);
    body.style.overflow = open ? 'hidden' : '';
    panel.querySelectorAll('a').forEach((a, i) => a.style.transitionDelay = open ? Math.min(i * 60, 400) + 'ms' : '0ms');
  };
  burger.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // появление секций (один раз)
  const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), { threshold: 0.12 });
  document.querySelectorAll('.rv').forEach(el => rv.observe(el));

  // слоган: слова загораются по очереди
  const tl = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    [...e.target.children].forEach((s, i) => setTimeout(() => s.classList.add('on'), 110 * i));
    tl.unobserve(e.target);
  }), { threshold: 0.6 });
  document.querySelectorAll('[data-tl]').forEach(p => tl.observe(p));

  // активный пункт меню
  const links = [...document.querySelectorAll('.hdr nav a')];
  const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const nav = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => nav.observe(s));

  // плавное раскрытие/скрытие блока по высоте (FAQ, QR WeChat)
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const slide = (el, open, done) => {
    if (calm.matches || !el.animate) { done && done(); return; }
    const cs = getComputedStyle(el);
    const full = { height: el.offsetHeight + 'px', paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, opacity: 1 };
    const zero = { height: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0 };
    el.style.overflow = 'hidden';
    const a = el.animate(open ? [zero, full] : [full, zero], { duration: 380, easing: 'cubic-bezier(0.22,1,0.36,1)' });
    a.onfinish = a.oncancel = () => { el.style.overflow = ''; done && done(); };
  };

  // запись через мессенджеры: собираем текст сообщения, копируем и открываем чат
  const copyText = text => {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => true, () => false);
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch {}
    ta.remove(); return Promise.resolve(ok);
  };
  let msgSeq = 0;
  const initMsg = root => {
    const { tg, vk, wechat } = root.dataset;
    const group = 'goal' + (msgSeq++ ? msgSeq : '');
    const radios = [...root.querySelectorAll('.goals input')];
    radios.forEach(r => r.name = group); // у копии в модалке своя группа радиокнопок
    const nameIn = root.querySelector('input[name=name]');
    const preview = root.querySelector('[data-preview]');
    const note = root.querySelector('.note');
    const tgLink = root.querySelector('[data-m=tg]');
    const wcBtn = root.querySelector('[data-m=wc]');
    const wcBox = root.querySelector('.wcbox');
    const boxId = 'wcbox' + msgSeq;
    wcBox.id = boxId; wcBtn.setAttribute('aria-controls', boxId);
    wcBox.hidden = true;
    const wcidEl = root.querySelector('[data-wcid]');
    if (wcidEl) wcidEl.textContent = wechat;

    const text = () => {
      const goal = radios.find(r => r.checked)?.value;
      const name = nameIn.value.trim();
      return 'Здравствуйте! ' + (name ? `Меня зовут ${name}. ` : '') +
        'Хочу записаться на пробное занятие' + (goal ? `: ${goal}.` : '.');
    };
    const say = t => { note.textContent = t; };
    const update = () => {
      const t = text();
      if (preview.textContent !== t && preview.animate && !calm.matches)
        preview.animate([{ opacity: .35, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'ease-out' });
      preview.textContent = t;
      tgLink.href = `https://t.me/${tg}?text=${encodeURIComponent(t)}`;
      say('');
    };
    radios.forEach(r => r.addEventListener('change', update));
    nameIn.addEventListener('input', update);
    update();

    // ссылки открываются сами (target=_blank), параллельно кладём текст в буфер
    tgLink.addEventListener('click', () => copyText(text()).then(ok =>
      say(ok ? 'Открываю Telegram. Текст уже в чате, а на всякий случай он и скопирован.' : 'Открываю Telegram, текст подставится в чат.')));
    root.querySelector('[data-m=vk]').addEventListener('click', () => copyText(text()).then(ok =>
      say(ok ? 'Текст скопирован. Вставьте его в чат ВКонтакте и отправьте.' : 'Откроется чат ВКонтакте. Напишите в нём, какая цель подготовки.')));
    root.querySelector('[data-m=max]').addEventListener('click', () => copyText(text()).then(ok =>
      say(ok ? 'Текст скопирован. Вставьте его в чат MAX и отправьте.' : 'Откроется MAX. Напишите в нём, какая цель подготовки.')));
    wcBtn.addEventListener('click', () => {
      const open = wcBox.hidden;
      wcBtn.setAttribute('aria-expanded', open); say('');
      if (open) { wcBox.hidden = false; slide(wcBox, true); }
      else slide(wcBox, false, () => { wcBox.hidden = true; });
    });
    root.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', () => {
      const isId = b.dataset.copy === 'id' && wechat && wechat !== 'WECHAT_ID';
      copyText(isId ? wechat : text()).then(ok => say(ok
        ? (isId ? 'ID скопирован. В WeChat: «Добавить контакт» → вставьте ID.' : 'Сообщение скопировано. Вставьте его в чат WeChat.')
        : 'Не удалось скопировать. Выделите текст вручную.'));
    }));
  };
  const msgTpl = document.querySelector('[data-msg]');
  if (msgTpl) initMsg(msgTpl);

  // модалка документов (оферта, политика)
  const dmodal = document.getElementById('dmodal');
  const dcard = document.getElementById('dcard');
  if (dmodal && dcard) {
    const closeM = () => { dmodal.classList.remove('open'); dmodal.setAttribute('aria-hidden', 'true'); body.style.overflow = ''; };
    document.querySelectorAll('a[data-doc]').forEach(a => a.addEventListener('click', async e => {
      e.preventDefault();
      try {
        const res = await fetch(a.dataset.doc); const html = await res.text();
        const tpl = document.createElement('div'); tpl.innerHTML = html;
        const inner = tpl.querySelector('.doc .card');
        if (inner) {
          dcard.classList.remove('rec');
          dcard.innerHTML = '<button class="x" type="button" aria-label="Закрыть">×</button>' + inner.innerHTML;
          dmodal.classList.add('open'); dmodal.setAttribute('aria-hidden', 'false');
          body.style.overflow = 'hidden'; dcard.scrollTop = 0;
          dcard.querySelector('.x').addEventListener('click', closeM);
        } else location.href = a.dataset.doc;
      } catch { location.href = a.dataset.doc; }
    }));
    dmodal.addEventListener('click', e => { if (e.target === dmodal) closeM(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && dmodal.classList.contains('open')) closeM(); });

    // запись через шапку: та же подложка, внутри копия блока записи
    const recOpeners = document.querySelectorAll('.hdr .bar>.btn, .mpanel .btn.full');
    recOpeners.forEach(b => b.addEventListener('click', e => {
      if (!msgTpl) return;
      e.preventDefault();
      const copy = msgTpl.cloneNode(true);
      dcard.innerHTML = '<button class="x" type="button" aria-label="Закрыть">×</button>';
      dcard.classList.add('rec');
      dcard.appendChild(copy);
      initMsg(copy);
      dcard.querySelector('.x').addEventListener('click', closeM);
      dmodal.classList.add('open'); dmodal.setAttribute('aria-hidden', 'false');
      body.style.overflow = 'hidden'; dcard.scrollTop = 0;
      setTimeout(() => copy.querySelector('.goals input:checked')?.focus(), 50);
    }));
  }


  // FAQ: ответ раскрывается плавно; значок поворачивается сразу
  document.querySelectorAll('.faq details').forEach(d => {
    const sum = d.querySelector('summary'), ans = d.querySelector('summary ~ *');
    if (!sum || !ans) return;
    sum.addEventListener('click', e => {
      if (calm.matches || !ans.animate) return;
      e.preventDefault();
      if (d.dataset.busy) return;
      d.dataset.busy = 1;
      if (!d.open) { d.open = true; slide(ans, true, () => delete d.dataset.busy); }
      else { d.classList.add('closing'); slide(ans, false, () => { d.open = false; d.classList.remove('closing'); delete d.dataset.busy; }); }
    });
  });
})();
