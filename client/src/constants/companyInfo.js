import { LOGO_DATA } from './logoData.js';

export const DEFAULT_COMPANY = 'ONEPWS';

export const COMPANY_MAP = Object.freeze({
  ONEPWS: {
    label: 'ONEPWS',
    website: 'https://www.onepws.com',
    companyName: 'ONEPWS Pvt Ltd',
    brandColor: '#D4292B',
    tagline: 'Formerly Pyrotech Workspace Solutions Pvt. Ltd.',
    logoDataUri: LOGO_DATA?.ONEPWS || '',
    logoDimensions: { width: '180px', height: '52px' },
  },

  WMSPL: {
    label: 'WMSPL',
    website: 'https://wmspl.co.in',
    companyName: 'Workspace Metal Solutions Pvt. Ltd.',
    brandColor: '#EE801A',
    tagline: '',
    logoDataUri: LOGO_DATA?.WMSPL || '',
    logoDimensions: { width: '180px', height: '52px' }, // fixed from 100%
  },

  PWSFLOOR: {
    label: 'PWS FLOOR',
    website: 'https://pwsfloor.com',
    companyName: 'PWS Floor Limited Liability Partnership',
    brandColor: '#D4292B',
    tagline: '',
    logoDataUri: LOGO_DATA?.PWSFLOOR || '',
    logoDimensions: { width: '180px', height: '52px' }, // fixed from 100%
  },
});

export const COMPANY_KEYS = Object.keys(COMPANY_MAP);

export const companyOptions = COMPANY_KEYS.map((key) => ({
  value: key,
  label: COMPANY_MAP[key].label,
}));

export const getCompanyDefaults = (companyKey = DEFAULT_COMPANY) => {
  const safeKey = COMPANY_MAP[companyKey] ? companyKey : DEFAULT_COMPANY;
  const entry = COMPANY_MAP[safeKey];

  return {
    company: safeKey,
    website: entry.website,
    companyName: entry.companyName,
    logoUrl: entry.logoDataUri,
    logoDimensions: entry.logoDimensions,
    brandColor: entry.brandColor,
  };
};
