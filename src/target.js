const TITLE_PATH = /^\/(film|series)\/(\d+)\/?$/;

function buildTargetUrl(pageUrl, targetOrigin) {
  if (!URL.canParse(pageUrl)) return null;
  const match = new URL(pageUrl).pathname.match(TITLE_PATH);
  if (!match) return null;
  const [, type, id] = match;
  return `${targetOrigin.replace(/\/+$/, '')}/${type}/${id}`;
}

if (typeof module !== 'undefined') module.exports = { buildTargetUrl };
