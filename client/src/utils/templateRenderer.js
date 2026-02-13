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

const toPoints = (value = 0) => `${(value * 0.75).toFixed(2)}pt`;

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
  const { width, height } = logoDimensions;

  let html = template;
  html = html.replace(/{{companyLogo}}/g, logoUrl || '');
  html = html.replace(/{{logoWidth}}/g, width);
  html = html.replace(/{{logoHeight}}/g, height);
  html = html.replace(/{{logoWidthPt}}/g, toPoints(width));
  html = html.replace(/{{logoHeightPt}}/g, toPoints(height));
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
