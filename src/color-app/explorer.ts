import { relativeLuminance } from './utils/color';

type Presets = Record<string, Array<{ name: string }>>;

function setHeader(bg: string, fg: string) {
  document.documentElement.style.setProperty('--colors-header-bg', bg);
  document.documentElement.style.setProperty('--colors-header-fg', fg);
}

function resetHeader() {
  setHeader('#1E66F5', '#F7F6F2');
}

function headerFgFor(bg: string): string {
  const lum = relativeLuminance(bg);
  return lum > 0.55 ? '#111111' : '#F7F6F2';
}

function storageKey(group: string) {
  return `colors:favorites:${group}`;
}

function loadFavorites(group: string): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey(group));
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.map(String));
  } catch {
    return new Set();
  }
}

function saveFavorites(group: string, set: Set<string>) {
  localStorage.setItem(storageKey(group), JSON.stringify([...set]));
}

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function applySwatchSize(step: number) {
  const map = [130, 150, 170, 190, 220];
  const px = map[Math.max(0, Math.min(map.length - 1, step))];
  for (const grid of document.querySelectorAll<HTMLElement>('[data-grid]')) {
    grid.style.setProperty('--swatch-size', `${px}px`);
  }
}

function parsePresets(): Presets {
  const el = document.getElementById('colors-presets');
  if (!el) return {};
  try {
    return JSON.parse(el.textContent ?? '{}');
  } catch {
    return {};
  }
}

function setFilter(on: boolean) {
  const root = document.querySelector<HTMLElement>('.colors-app');
  if (!root) return;
  root.dataset.filter = on ? 'on' : 'off';
}

function setup() {
  const page = document.querySelector<HTMLElement>('[data-explorer]');
  if (!page) return;

  const group = page.dataset.group ?? 'UNKNOWN';
  const favorites = loadFavorites(group);

  const swatches = [...document.querySelectorAll<HTMLElement>('[data-swatch]')];
  for (const s of swatches) {
    const name = s.dataset.name;
    if (name && favorites.has(name)) s.classList.add('is-favorite');
  }

  const size = document.getElementById('colors-size') as HTMLInputElement | null;
  if (size) {
    applySwatchSize(Number(size.value));
    size.addEventListener('input', () => applySwatchSize(Number(size.value)));
  }

  const standard = document.getElementById('colors-standard') as HTMLSelectElement | null;
  if (standard) {
    standard.addEventListener('change', () => {
      window.location.href = `/colors/explorer/${standard.value}`;
    });
  }

  const presets = parsePresets();

  const filterBtn = document.querySelector<HTMLButtonElement>('[data-filter-btn]');
  const presetBtn = document.querySelector<HTMLButtonElement>('[data-preset-btn]');
  const clearBtn = document.querySelector<HTMLButtonElement>('[data-clear-btn]');

  let filterOn = false;

  const updateFilterBtn = () => {
    if (!filterBtn) return;
    if (filterOn) {
      filterBtn.innerHTML = '<strong>un</strong>filter';
    } else {
      filterBtn.textContent = 'filter';
    }
  };

  filterBtn?.addEventListener('click', () => {
    filterOn = !filterOn;
    setFilter(filterOn);
    updateFilterBtn();
  });

  presetBtn?.addEventListener('click', () => {
    favorites.clear();
    const list = presets[group] ?? [];
    for (const item of list) favorites.add(String(item.name));
    for (const s of swatches) {
      const n = s.dataset.name;
      if (n && favorites.has(n)) s.classList.add('is-favorite');
      else s.classList.remove('is-favorite');
    }
    saveFavorites(group, favorites);
  });

  clearBtn?.addEventListener('click', () => {
    favorites.clear();
    saveFavorites(group, favorites);
    for (const s of swatches) s.classList.remove('is-favorite');
    filterOn = false;
    setFilter(false);
    updateFilterBtn();
    resetHeader();
  });

  updateFilterBtn();

  for (const swatch of swatches) {
    const star = swatch.querySelector<HTMLButtonElement>('[data-star]');
    star?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const name = swatch.dataset.name;
      if (!name) return;
      if (favorites.has(name)) {
        favorites.delete(name);
        swatch.classList.remove('is-favorite');
      } else {
        favorites.add(name);
        swatch.classList.add('is-favorite');
      }
      saveFavorites(group, favorites);
    });

    swatch.addEventListener('click', async () => {
      const hex = swatch.dataset.hex;
      if (!hex) return;
      const ok = await copy(hex);
      if (!ok) return;

      setHeader(hex, headerFgFor(hex));

      swatch.classList.add('is-copied');
      window.setTimeout(() => {
        swatch.classList.remove('is-copied');
      }, 900);
    });
  }
}

resetHeader();
setup();
