const fs = require('fs');
const { COMPANY_PROFILES, DEFAULT_COMPANY } = require('../constants/companyProfiles');

const templateCache = new Map();

const sanitizePhoneForHref = (value = '') =>
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
  if (typeof value === 'number') {
    return `${value}px`;
  }
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

const resolveCompany = (company = DEFAULT_COMPANY) => {
  const normalized = (company || DEFAULT_COMPANY).toUpperCase();
  return {
    normalized,
    profile: COMPANY_PROFILES[normalized] || COMPANY_PROFILES[DEFAULT_COMPANY],
  };
};

const loadTemplate = (company) => {
  const { profile, normalized } = resolveCompany(company);
  const cacheKey = profile.template;
  if (!templateCache.has(cacheKey)) {
    templateCache.set(cacheKey, fs.readFileSync(profile.template, 'utf8'));
  }
  return {
    template: templateCache.get(cacheKey),
    profile,
    company: normalized,
  };
};

const applyCommonReplacements = (template, replacements) =>
  Object.entries(replacements).reduce(
    (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, 'g'), value ?? ''),
    template
  );

const generateSignatureHtml = ({
  company = DEFAULT_COMPANY,
  companyName = '',
  fullName = '',
  designation = '',
  department = '',
  mobile = '',
  email = '',
  website = '',
  logoUrl = '',
}) => {
  const { template: baseTemplate, profile } = loadTemplate(company);
  let template = baseTemplate;

  const departmentLabel = buildDepartmentLabel(department);
  const sanitizedTel = sanitizePhoneForHref(mobile);
  const normalizedSite = normalizeWebsite(website);
  const websiteLabel = humanizeWebsite(website) || normalizedSite;
  const trimmedEmail = (email || '').trim();
  const rawWidth = profile.logoDimensions?.width;
  const rawHeight = profile.logoDimensions?.height;
  const widthCss = toCssDimension(rawWidth);
  const heightCss = toCssDimension(rawHeight);
  const widthValue = getPixelValue(rawWidth ?? widthCss);
  const heightValue = getPixelValue(rawHeight ?? heightCss);

  template = applyCommonReplacements(template, {
    companyLogo: logoUrl || '',
    fullName,
    designation,
    department: departmentLabel,
    companyName,
    mobile,
    email: trimmedEmail,
    brandColor: profile.brandColor,
    formerlyText: profile.formerlyText || '',
    logoWidth: widthCss || rawWidth || '',
    logoHeight: heightCss || rawHeight || '',
    logoWidthPt: toPoints(widthCss || rawWidth || 0),
    logoHeightPt: toPoints(heightCss || rawHeight || 0),
    logoSizeAttributes: buildSizeAttributes(widthValue, heightValue),
  });

  template = template.replace(/tel:\{\{mobile\}\}/g, `tel:${sanitizedTel}`);
  template = template.replace(/mailto:\{\{email\}\}/g, `mailto:${trimmedEmail}`);
  template = template.replace(/href="{{website}}\/"/g, `href="${normalizedSite}/"`);
  template = template.replace(/href="{{website}}"/g, `href="${normalizedSite}"`);
  template = template.replace(/{{website}}/g, websiteLabel);

  return template;
};

const getTemplateMarkup = (company = DEFAULT_COMPANY) => loadTemplate(company).template;

module.exports = {
  getTemplateMarkup,
  generateSignatureHtml,
};
