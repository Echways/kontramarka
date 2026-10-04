(() => {
  const { LABEL, TARGET_ORIGIN, OPEN_IN_NEW_TAB } = KP_SHORTCUT_CONFIG;

  const MARK = 'data-kp-shortcut';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const CONTAINER = '[class*="styles_buttonsContainer__"]';
  const SLOT = ':scope > [class*="styles_button__"]';
  const WATCH = '[class*="watch-online-button"], [data-test-id="Watch"]';

  function createIcon() {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'kp-shortcut__icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M6 3.375 21 12 6 20.625V3.375Z');
    svg.append(path);
    return svg;
  }

  function createSlot(container, href) {
    const link = document.createElement('a');
    link.href = href;
    link.className = 'kp-shortcut';
    if (OPEN_IN_NEW_TAB) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    link.append(createIcon(), LABEL);

    const slot = document.createElement('div');
    const nativeSlot = container.querySelector(SLOT);
    if (nativeSlot) slot.className = nativeSlot.className;
    slot.setAttribute(MARK, '');
    slot.append(link);
    return slot;
  }

  function place(container, slot) {
    let anchor = container.querySelector(WATCH);
    while (anchor && anchor.parentElement !== container) anchor = anchor.parentElement;
    if (slot.parentElement === container && slot.previousElementSibling === anchor) return;
    container.insertBefore(slot, anchor ? anchor.nextSibling : container.firstChild);
  }

  function sync() {
    const href = buildTargetUrl(location.href, TARGET_ORIGIN);
    const container =
      href && (document.querySelector(`main ${CONTAINER}`) || document.querySelector(CONTAINER));
    let slot = document.querySelector(`[${MARK}]`);

    if (!container) {
      slot?.remove();
      return;
    }
    if (slot && slot.parentElement !== container) {
      slot.remove();
      slot = null;
    }
    slot ||= createSlot(container, href);
    const link = slot.querySelector('a');
    if (link.href !== href) link.href = href;
    place(container, slot);
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
