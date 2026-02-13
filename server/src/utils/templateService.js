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

const toPoints = (value = 0) => `${(value * 0.75).toFixed(2)}pt`;

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
  const { width, height } = profile.logoDimensions;

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
    logoWidth: width,
    logoHeight: height,
    logoWidthPt: toPoints(width),
    logoHeightPt: toPoints(height),
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
