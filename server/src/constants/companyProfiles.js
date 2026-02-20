const path = require('path');

const TEMPLATE_DIR = path.join(__dirname, '..', '..', 'templates');

const COMPANY_PROFILES = Object.freeze({
  ONEPWS: {
    template: path.join(TEMPLATE_DIR, 'signature-onepws.html'),
    brandColor: '#D4292B',
    formerlyText: 'Formerly Pyrotech Workspace Solutions Pvt. Ltd.',
    logoDimensions: {
      width: '180px',
      height: '52px',
    },
  },

  WMSPL: {
    template: path.join(TEMPLATE_DIR, 'signature-wmspl.html'),
    brandColor: '#EE801A',
    formerlyText: '',
    logoDimensions: {
      width: '180px',     // changed from 100%
      height: '52px',     // fixed missing px unit
    },
  },

  PWSFLOOR: {
    template: path.join(TEMPLATE_DIR, 'signature-pwsfloor.html'),
    brandColor: '#D4292B',
    formerlyText: '',
    logoDimensions: {
      width: '180px',     // changed from 100%
      height: '52px',
    },
  },
});

const DEFAULT_COMPANY = 'ONEPWS';

const getCompanyProfile = (company) => {
  if (!company || !COMPANY_PROFILES[company]) {
    return COMPANY_PROFILES[DEFAULT_COMPANY];
  }
  return COMPANY_PROFILES[company];
};

module.exports = {
  COMPANY_PROFILES,
  DEFAULT_COMPANY,
  getCompanyProfile,
};
