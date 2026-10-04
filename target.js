function buildTargetUrl(pageUrl, targetOrigin) {
  let pathname;
  try {
    pathname = new URL(pageUrl).pathname;
  } catch {
    return null;
  }
  const match = pathname.match(/^\/(film|series)\/(\d+)\/?$/);
  if (!match) return null;
  return `${targetOrigin.replace(/\/+$/, '')}/${match[1]}/${match[2]}`;
}

if (typeof module !== 'undefined') module.exports = { buildTargetUrl };
