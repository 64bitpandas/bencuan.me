const header = document.querySelector<HTMLElement>('#colors-header');

function setHeader(bg: string, fg: string) {
  document.documentElement.style.setProperty('--colors-header-bg', bg);
  document.documentElement.style.setProperty('--colors-header-fg', fg);
}

function resetHeader() {
  setHeader('#1E66F5', '#F7F6F2');
}

function setupIntersectionObserver() {
  const sections = [...document.querySelectorAll<HTMLElement>('[data-palette]')];
  if (!sections.length) return;

  const io = new IntersectionObserver(
    entries => {
      const best = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

      if (!best) return;
      const el = best.target as HTMLElement;
      const bg = el.dataset.highlight;
      const fg = el.dataset.headerFg;
      if (bg && fg) setHeader(bg, fg);
    },
    {
      root: null,
      threshold: [0.25, 0.45, 0.6],
    },
  );

  sections.forEach(s => io.observe(s));

  const last = sections[sections.length - 1];
  if (last) {
    const spacer = document.createElement('div');
    spacer.style.height = '1px';
    last.appendChild(spacer);
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
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

function setupCopyButtons() {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('button.copy-btn[data-copy]')];
  for (const btn of buttons) {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      const text = btn.dataset.copy;
      if (!text) return;

      const ok = await copyToClipboard(text);
      if (!ok) return;

      btn.dataset.state = 'copied';
      window.setTimeout(() => {
        delete btn.dataset.state;
      }, 900);
    });
  }
}

if (header) {
  resetHeader();
  setupIntersectionObserver();
  setupCopyButtons();
}
