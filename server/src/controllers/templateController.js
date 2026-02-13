const { getTemplateMarkup } = require('../utils/templateService');

const getTemplate = (req, res) => {
  const company = (req.query.company || 'ONEPWS').toUpperCase();
  const template = getTemplateMarkup(company);
  res.status(200).json({
    template,
    company,
    placeholders: [
      'companyLogo',
      'fullName',
      'designation',
      'department',
      'companyName',
      'mobile',
      'email',
      'website',
      'brandColor',
      'formerlyText',
      'logoWidth',
      'logoHeight',
    ],
  });
};

module.exports = {
  getTemplate,
};
