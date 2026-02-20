const sanitizePhone = (value = '') =>
  value
    .trim()
    .replace(/[\s()-]/g, '')
    .replace(/(?!^)\+/g, '');

const normalizeWebsite = (value = '') => {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const humanizeWebsite = (value = '') => value.replace(/^https?:\/\//i, '');

const buildDepartmentLabel = (value = '') => (value ? ` | ${value.trim()}` : '');

const toPoints = (value = 0) => {
  const numericValue =
    typeof value === 'string' ? parseFloat(value) || 0 : Number.isFinite(value) ? value : 0;
  return `${(numericValue * 0.75).toFixed(2)}pt`;
};

const toCssDimension = (value) => {
  if (typeof value === 'number') return `${value}px`;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return '';
    return /^\d+(\.\d+)?$/i.test(trimmed) ? `${trimmed}px` : trimmed;
  }
  return '';
};

const getPixelValue = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const match = value.trim().match(/^(\d+(\.\d+)?)(px)?$/i);
    if (match) {
      return parseFloat(match[1]);
    }
  }
  return null;
};

const buildSizeAttributes = (widthValue, heightValue) => {
  const attrs = [];
  if (Number.isFinite(widthValue) && widthValue > 0) {
    attrs.push(`width="${Math.round(widthValue)}"`);
  }
  if (Number.isFinite(heightValue) && heightValue > 0) {
    attrs.push(`height="${Math.round(heightValue)}"`);
  }
  return attrs.length ? ` ${attrs.join(' ')}` : '';
};

export const renderTemplate = (template = '', payload = {}, companyMeta = {}) => {
  if (!template) return '';

  const {
    logoUrl = '',
    fullName = '',
    designation = '',
    department = '',
    companyName = '',
    mobile = '',
    email = '',
    website = '',
  } = payload;

  const {
    brandColor = '#D4292B',
    tagline = '',
    logoDimensions = { width: 320, height: 92 },
  } = companyMeta || {};

  const departmentLabel = buildDepartmentLabel(department);
  const telValue = sanitizePhone(mobile);
  const normalizedSite = normalizeWebsite(website);
  const websiteLabel = humanizeWebsite(website) || normalizedSite;
  const trimmedEmail = (email || '').trim();
  const rawWidth = logoDimensions?.width;
  const rawHeight = logoDimensions?.height;
  const widthCss = toCssDimension(rawWidth);
  const heightCss = toCssDimension(rawHeight);
  const widthValue = getPixelValue(rawWidth ?? widthCss);
  const heightValue = getPixelValue(rawHeight ?? heightCss);

  let html = template;
  html = html.replace(/{{companyLogo}}/g, logoUrl || '');
  html = html.replace(/{{logoWidth}}/g, widthCss || rawWidth || '');
  html = html.replace(/{{logoHeight}}/g, heightCss || rawHeight || '');
  html = html.replace(/{{logoWidthPt}}/g, toPoints(widthCss || rawWidth || 0));
  html = html.replace(/{{logoHeightPt}}/g, toPoints(heightCss || rawHeight || 0));
  html = html.replace(/{{logoSizeAttributes}}/g, buildSizeAttributes(widthValue, heightValue));
  html = html.replace(/{{formerlyText}}/g, tagline || '');
  html = html.replace(/{{fullName}}/g, fullName);
  html = html.replace(/{{designation}}/g, designation);
  html = html.replace(/{{department}}/g, departmentLabel);
  html = html.replace(/{{companyName}}/g, companyName);
  html = html.replace(/{{brandColor}}/g, brandColor);
  html = html.replace(/tel:\{\{mobile\}\}/g, `tel:${telValue}`);
  html = html.replace(/mailto:\{\{email\}\}/g, `mailto:${trimmedEmail}`);
  html = html.replace(/href="{{website}}\/"/g, `href="${normalizedSite}/"`);
  html = html.replace(/href="{{website}}"/g, `href="${normalizedSite}"`);
  html = html.replace(/{{mobile}}/g, mobile);
  html = html.replace(/{{email}}/g, trimmedEmail);
  html = html.replace(/{{website}}/g, websiteLabel);

  return html;
};
