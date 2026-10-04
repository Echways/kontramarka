(() => {
  const { label, price, targetOrigin, openInNewTab } = KP_SHORTCUT_CONFIG;

  // Kinopoisk hashes its class names, so its elements are matched by prefix.
  const KINOPOISK = {
    buttons: '[class*="styles_buttonsContainer__"]',
    button: ':scope > [class*="styles_button__"]',
    watch: '[class*="watch-online-button"], [data-test-id="Watch"]',
  };
  const SLOT = 'data-kp-shortcut';
  const TORN = 'kp-shortcut--torn';
  const PRINTING = 'kp-shortcut--printing';
  const PLAY = 'M6 3.375 21 12 6 20.625V3.375Z';

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function build(node, attrs, ...children) {
    for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
    node.append(...children);
    return node;
  }
  const html = (tag, ...rest) => build(document.createElement(tag), ...rest);
  const svg = (tag, ...rest) => build(document.createElementNS('http://www.w3.org/2000/svg', tag), ...rest);

  function whenVisible(callback) {
    if (!document.hidden) callback();
    else document.addEventListener('visibilitychange', callback, { once: true });
  }

  function createTicket(href) {
    const icon = svg(
      'svg',
      { class: 'kp-shortcut__icon', viewBox: '0 0 24 24', 'aria-hidden': 'true' },
      svg('path', { d: PLAY }),
    );
    const body = html('span', { class: 'kp-shortcut__body' }, icon, label);
    const stub = html('span', { class: 'kp-shortcut__stub' }, price);
    const ticket = html(
      'a',
      {
        class: 'kp-shortcut',
        href,
        'aria-label': `${label}, ${price}`,
        ...(openInNewTab && { target: '_blank', rel: 'noopener noreferrer' }),
      },
      body,
      stub,
    );

    // A click tears the stub off; a fresh one is printed once the tab is looked at again.
    ticket.addEventListener('click', () => {
      if (!reducedMotion.matches) ticket.classList.add(TORN);
    });
    stub.addEventListener('animationend', () => {
      if (ticket.classList.contains(TORN)) whenVisible(() => ticket.classList.replace(TORN, PRINTING));
      else ticket.classList.remove(PRINTING);
    });
    return ticket;
  }

  function createSlot(container, href) {
    const nativeSlot = container.querySelector(KINOPOISK.button);
    const attrs = nativeSlot ? { [SLOT]: '', class: nativeSlot.className } : { [SLOT]: '' };
    return html('div', attrs, createTicket(href));
  }

  function place(container, slot) {
    let anchor = container.querySelector(KINOPOISK.watch);
    while (anchor && anchor.parentElement !== container) anchor = anchor.parentElement;
    if (slot.parentElement === container && slot.previousElementSibling === anchor) return;
    container.insertBefore(slot, anchor ? anchor.nextSibling : container.firstChild);
  }

  function sync() {
    const href = buildTargetUrl(location.href, targetOrigin);
    const container =
      href && (document.querySelector(`main ${KINOPOISK.buttons}`) || document.querySelector(KINOPOISK.buttons));
    let slot = document.querySelector(`[${SLOT}]`);

    if (!container) {
      slot?.remove();
      return;
    }
    if (slot && slot.parentElement !== container) {
      slot.remove();
      slot = null;
    }
    slot ||= createSlot(container, href);
    const ticket = slot.querySelector('a');
    if (ticket.href !== href) ticket.href = href;
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
