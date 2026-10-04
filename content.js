(() => {
  const { LABEL, TARGET_ORIGIN, OPEN_IN_NEW_TAB } = KP_SHORTCUT_CONFIG;

  const MARK = 'data-kp-shortcut';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const CONTAINER = 'main [class*="styles_buttonsContainer__"]';
  const SLOT = ':scope > [class*="styles_button__"]';
  const BUTTON = 'button[class*="style_button__"]';

  const dropClass = (className, part) =>
    className.split(/\s+/).filter((name) => !name.includes(part)).join(' ');

  function createIcon(className) {
    const icon = document.createElement('span');
    icon.className = className;
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M7 4v16l13-8z');
    svg.append(path);
    icon.append(svg);
    return icon;
  }

  function createSlot(container, href) {
    const nativeSlot = container.querySelector(SLOT);
    const nativeButton =
      container.querySelector(`${SLOT} ${BUTTON}:not([class*="onlyIcon"])`) ||
      container.querySelector(`${SLOT} ${BUTTON}`);
    if (!nativeSlot || !nativeButton) return null;

    const link = document.createElement('a');
    link.href = href;
    link.className = dropClass(nativeButton.className, 'onlyIcon');
    if (OPEN_IN_NEW_TAB) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }

    const nativeIcon = container.querySelector(`${SLOT} [class*="style_iconLeft__"]`);
    if (nativeIcon) {
      link.append(createIcon(nativeIcon.className));
    } else {
      link.className = dropClass(link.className, 'withIconLeft');
    }
    link.append(LABEL);

    const slot = document.createElement('div');
    slot.className = nativeSlot.className;
    slot.setAttribute(MARK, '');
    slot.append(link);
    return slot;
  }

  function sync() {
    const href = buildTargetUrl(location.href, TARGET_ORIGIN);
    const container = href && document.querySelector(CONTAINER);
    const existing = document.querySelector(`[${MARK}]`);

    if (!container) {
      existing?.remove();
      return;
    }
    if (existing?.parentElement === container) {
      const link = existing.querySelector('a');
      if (link.href !== href) link.href = href;
      return;
    }
    existing?.remove();
    const slot = createSlot(container, href);
    if (slot) container.append(slot);
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      sync();
    });
  }

  sync();
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
