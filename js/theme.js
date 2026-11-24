// Палитры оформления: кнопка в углу, выбор запоминается в браузере посетителя.
// Подключать в <head> без defer: атрибут ставится до отрисовки, чтобы не мигали старые цвета.
(() => {
  const PALS = [
    { id: 'classic', name: 'Классика', p: '#1B3A8C', a: '#E8B23A', b: '#F1F4FB' },
    { id: 'coral', name: 'Шоколад и коралл', p: '#3B2621', a: '#E07A57', b: '#EFE7DC' },
    { id: 'bordo', name: 'Бордо и золото', p: '#5A1A28', a: '#E2B142', b: '#F1E9E1' },
    { id: 'sage', name: 'Шалфей и терракота', p: '#233F35', a: '#EA9A78', b: '#E9ECE4' },
    { id: 'mocha', name: 'Мокко и карамель', p: '#4A382E', a: '#D9A066', b: '#F0E5D6' },
    { id: 'terra', name: 'Терракота и мёд', p: '#B04E2C', a: '#F4C150', b: '#FBE8DA' },
    { id: 'cinnamon', name: 'Корица и персик', p: '#9A5528', a: '#FFB386', b: '#F9E9DA' },
    { id: 'berry', name: 'Малина и абрикос', p: '#A8384F', a: '#FFB665', b: '#FBE7E7' },
    { id: 'olive', name: 'Оливка и шафран', p: '#5E6824', a: '#F5B53A', b: '#EEF0DA' },
    { id: 'brick', name: 'Кирпич и горчица', p: '#A2442B', a: '#EDBE3A', b: 'color-mix(in srgb,#A2442B 11%,#FFF9F4)' },
    { id: 'plum', name: 'Слива и персик', p: '#7D3C64', a: '#FFB38A', b: 'color-mix(in srgb,#7D3C64 11%,#FFF9F4)' },
    { id: 'vanilla', name: 'Карамель и ваниль', p: '#8C5A22', a: '#F5D480', b: 'color-mix(in srgb,#8C5A22 11%,#FFF9F4)' },
    { id: 'coffee', name: 'Кофе с молоком', p: '#6F4E37', a: '#EBC197', b: 'color-mix(in srgb,#6F4E37 11%,#FFF9F4)' },
    { id: 'cherry', name: 'Вишня и сливки', p: '#B23A3A', a: '#F7C873', b: 'color-mix(in srgb,#B23A3A 11%,#FFF9F4)' },
    { id: 'copper', name: 'Медь и шампань', p: '#9C4F2A', a: '#EED29B', b: 'color-mix(in srgb,#9C4F2A 11%,#FFF9F4)' },
    { id: 'garnet', name: 'Гранат и мандарин', p: '#A3324A', a: '#FFA45C', b: 'color-mix(in srgb,#A3324A 11%,#FFF9F4)' },
    { id: 'cocoa', name: 'Какао и роза', p: '#6B3F3A', a: '#F2A9A0', b: 'color-mix(in srgb,#6B3F3A 11%,#FFF9F4)' },
    { id: 'lavender', name: 'Лаванда', p: '#5B4E8C', a: '#CDBDF2', b: '#EEE8FB' },
    { id: 'mint', name: 'Мята', p: '#2F6B5E', a: '#ADE3D2', b: '#E1F3EC' },
    { id: 'powder', name: 'Пудра', p: '#8A4A5C', a: '#F5C9D2', b: '#FBE8EC' },
    { id: 'sky', name: 'Небо', p: '#3A6390', a: '#BCD9F3', b: '#E3EFFA' },
    { id: 'peach', name: 'Персиковый', p: '#99563F', a: '#FFD5C2', b: '#FDEBE2' },
    { id: 'pistachio', name: 'Фисташка', p: '#4F6B4A', a: '#D2E6BF', b: '#E9F2DF' },
    { id: 'lilac', name: 'Сирень и пудра', p: '#6E4F7E', a: '#F3CFE0', b: '#F4E6EF' },
    { id: 'emerald', name: 'Изумруд и золото', p: '#0F5B4A', a: '#E2B44A', b: 'color-mix(in srgb,#0F5B4A 11%,#FFF9F4)' },
    { id: 'indigo', name: 'Индиго и янтарь', p: '#2B2F7A', a: '#F2B544', b: 'color-mix(in srgb,#2B2F7A 11%,#FFF9F4)' },
    { id: 'graphite', name: 'Графит и золото', p: '#2E3440', a: '#E6B54A', b: 'color-mix(in srgb,#2E3440 11%,#FFF9F4)' },
    { id: 'petrol', name: 'Петроль и медь', p: '#134E5E', a: '#E39B5B', b: 'color-mix(in srgb,#134E5E 11%,#FFF9F4)' },
    { id: 'night', name: 'Ночь и шампань', p: '#1C2A48', a: '#E9CF9E', b: 'color-mix(in srgb,#1C2A48 11%,#FFF9F4)' },
    { id: 'sea', name: 'Морская волна', p: '#2C6670', a: '#A9DDE3', b: '#E0F1F3' },
    { id: 'rosemary', name: 'Розмарин', p: '#4E6460', a: '#C9DCD3', b: '#E5EEEA' },
    { id: 'sakura', name: 'Сакура', p: '#8C4A68', a: '#F7CDE0', b: '#FBE6EF' },
    { id: 'lemon', name: 'Лимонный сорбет', p: '#6B5E2E', a: '#F5E6A3', b: '#F6F0D6' },
    { id: 'blueberry', name: 'Голубика', p: '#44508C', a: '#C5CCF2', b: '#E6E9FB' },
  ];
  const KEY = 'pal';
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  const apply = id => {
    const pal = PALS.find(x => x.id === id) || PALS[0];
    if (pal.id === 'classic') root.removeAttribute('data-pal'); else root.setAttribute('data-pal', pal.id);
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.content = pal.p;
    return pal.id;
  };
  let cur = apply(saved);

  // Свои цвета: перекрывают выбранную палитру (!important), хранятся отдельно
  const FIELDS = [['p', 'Основной'], ['a', 'Акцент'], ['hl', 'Выделения'], ['bg', 'Фон'], ['sf', 'Подложки'], ['tx', 'Текст']];
  const CKEY = 'palCustom';
  let custom = null;
  try { custom = JSON.parse(localStorage.getItem(CKEY)); } catch (e) {}
  const own = document.createElement('style');
  document.head.appendChild(own);
  const lum = hex => {
    const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(x => x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  };
  const applyOwn = c => {
    if (!c) { own.textContent = ''; return; }
    const onA = lum(c.a) > .4 ? `color-mix(in srgb,${c.p} 45%,#000)` : '#fff';
    const ag = c.grad ? `linear-gradient(135deg,color-mix(in srgb,${c.a} 45%,#fff) 0%,${c.a} 32%,color-mix(in srgb,${c.a} 82%,#000) 64%,color-mix(in srgb,${c.a} 62%,#fff) 100%)` : c.a;
    own.textContent = `body.v03{--p:${c.p}!important;--a:${c.a}!important;--hl:${c.hl}!important;--mk:color-mix(in srgb,${c.hl} 55%,transparent)!important;` +
      `--bg:${c.bg}!important;--sf:${c.sf}!important;--tx:${c.tx}!important;--tx2:color-mix(in srgb,${c.tx} 82%,${c.bg})!important;--on-a:${onA}!important;--ag:${ag}!important}`;
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.content = c.p;
  };
  applyOwn(custom);

  document.addEventListener('DOMContentLoaded', () => {
    apply(cur); applyOwn(custom); // повтор: <meta theme-color> появляется в разметке позже скрипта
    const wrap = document.createElement('div');
    wrap.className = 'palx';
    wrap.innerHTML =
      '<button type="button" class="palx-btn" aria-expanded="false" aria-controls="palx-list" aria-label="Цвета сайта">' +
      '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 0 0 0 18c1.1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/></svg></button>' +
      '<div class="palx-list" id="palx-list" role="group" aria-label="Палитра" hidden>' +
      PALS.map(x => `<button type="button" data-pal-id="${x.id}" aria-pressed="${x.id === cur}"><i style="--sp:${x.p};--sa:${x.a};--sb:${x.b}"></i>${x.name}</button>`).join('') +
      '<div class="palx-own"><b>Свои цвета</b><div class="palx-fields">' +
      FIELDS.map(([k, l]) => `<label><input type="color" data-k="${k}"><span>${l}</span></label>`).join('') +
      '</div><label class="palx-chk"><input type="checkbox" data-grad checked><span>Градиент на кнопках</span></label>' +
      '<button type="button" class="palx-reset" data-reset>Сбросить свои цвета</button></div>' +
      '</div>';
    document.body.appendChild(wrap);
    const btn = wrap.querySelector('.palx-btn'), list = wrap.querySelector('.palx-list');
    // текущие цвета страницы → #rrggbb (палитры бывают заданы через color-mix)
    const probe = document.createElement('i');
    probe.hidden = true; document.body.appendChild(probe);
    const hexOf = k => {
      probe.style.color = `var(--${k})`;
      const m = getComputedStyle(probe).color.match(/[\d.]+/g).map(Number);
      const rgb = getComputedStyle(probe).color.startsWith('color(') ? m.slice(0, 3).map(x => x * 255) : m.slice(0, 3);
      return '#' + rgb.map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
    };
    const inputs = [...list.querySelectorAll('[data-k]')], grad = list.querySelector('[data-grad]');
    const fill = () => {
      const c = custom || Object.fromEntries(FIELDS.map(([k]) => [k, hexOf(k)]));
      inputs.forEach(i => { i.value = c[i.dataset.k] || hexOf(i.dataset.k); });
      grad.checked = custom ? !!custom.grad : true;
    };
    const saveOwn = () => {
      applyOwn(custom);
      try { custom ? localStorage.setItem(CKEY, JSON.stringify(custom)) : localStorage.removeItem(CKEY); } catch (err) {}
    };
    list.addEventListener('input', e => {
      if (!e.target.matches('[data-k],[data-grad]')) return;
      custom = Object.fromEntries(inputs.map(i => [i.dataset.k, i.value]));
      custom.grad = grad.checked;
      saveOwn();
    });
    list.querySelector('[data-reset]').addEventListener('click', () => { custom = null; saveOwn(); fill(); });
    const setOpen = open => { list.hidden = !open; btn.setAttribute('aria-expanded', open); if (open) fill(); };
    btn.addEventListener('click', () => setOpen(list.hidden));
    list.addEventListener('click', e => {
      const b = e.target.closest('[data-pal-id]');
      if (!b) return;
      cur = apply(b.dataset.palId);
      custom = null; saveOwn(); fill();
      try { localStorage.setItem(KEY, cur); } catch (err) {}
      list.querySelectorAll('[data-pal-id]').forEach(x => x.setAttribute('aria-pressed', x.dataset.palId === cur));
    });
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !list.hidden) { setOpen(false); btn.focus(); } });
  });
})();
