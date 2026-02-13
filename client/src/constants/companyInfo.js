import { LOGO_DATA } from './logoData.js';

export const COMPANY_MAP = {
  ONEPWS: {
    label: 'ONEPWS',
    website: 'https://www.onepws.com',
    companyName: 'ONEPWS Pvt Ltd',
    brandColor: '#D4292B',
    tagline: 'Formerly Pyrotech Workspace Solutions Pvt. Ltd.',
    logoDataUri: LOGO_DATA.ONEPWS,
    logoDimensions: { width: '100%', height: '100%' },
  },

  WMSPL: {
    label: 'WMSPL',
    website: 'https://wmspl.co.in',
    companyName: 'WORKSPACE METAL SOLUTIONS PVT.LTD',
    brandColor: '#EE801A',
    tagline: '',
    logoDataUri: LOGO_DATA.WMSPL,
    logoDimensions: { width: '100%', height: '100%' },
  },

  PWSFLOOR: {
    label: 'PWS FLOOR',
    website: 'https://pwsfloor.com',
    companyName: 'PWS FLOOR LIMITED LIABILITY PARTNERSHIP ',
    brandColor: '#D4292B',
    tagline: '',
    logoDataUri: LOGO_DATA.PWSFLOOR,
    logoDimensions: { width: '100%', height: '100%' },
  },
};

export const COMPANY_KEYS = Object.keys(COMPANY_MAP);

export const companyOptions = COMPANY_KEYS.map((key) => ({
  value: key,
  label: COMPANY_MAP[key].label,
}));

export const getCompanyDefaults = (companyKey = 'ONEPWS') => {
  const entry = COMPANY_MAP[companyKey] || COMPANY_MAP.ONEPWS;

  return {
    company: companyKey in COMPANY_MAP ? companyKey : 'ONEPWS',
    website: entry.website,
    companyName: entry.companyName,
    logoUrl: entry.logoDataUri,
    logoDimensions: entry.logoDimensions,
    brandColor: entry.brandColor,
  };
};
