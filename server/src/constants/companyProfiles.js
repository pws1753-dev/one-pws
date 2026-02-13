const path = require('path');

const TEMPLATE_DIR = path.join(__dirname, '..', '..', 'templates');

const COMPANY_PROFILES = Object.freeze({
  ONEPWS: {
    template: path.join(TEMPLATE_DIR, 'signature-onepws.html'),
    brandColor: '#D4292B',
    formerlyText: 'Formerly Pyrotech Workspace Solutions Pvt. Ltd.',
    logoDimensions: {
      width: '100%',
      height: '100%',
    },
  },
  WMSPL: {
    template: path.join(TEMPLATE_DIR, 'signature-wmspl.html'),
    brandColor: '#EE801A',
    formerlyText: '',
    logoDimensions: {
      width: '100%',
      height: '100',
    },
  },
  PWSFLOOR: {
    template: path.join(TEMPLATE_DIR, 'signature-pwsfloor.html'),
    brandColor: '#D4292B',
    formerlyText: '',
    logoDimensions: {
      width: '100%',
      height: '100%',
    },
  },
});

const DEFAULT_COMPANY = 'ONEPWS';

const getCompanyProfile = (company) => {
  return COMPANY_PROFILES[company] || COMPANY_PROFILES[DEFAULT_COMPANY];
};

module.exports = {
  COMPANY_PROFILES,
  DEFAULT_COMPANY,
  getCompanyProfile,
};
