const Signature = require('../models/Signature');
const { generateSignatureHtml } = require('../utils/templateService');

const companies = ['ONEPWS', 'WMSPL', 'PWSFLOOR'];

const buildQuery = ({ search, company }) => {
  const query = {};
  if (company && companies.includes(company.toUpperCase())) {
    query.company = company.toUpperCase();
  }

  if (search) {
    const regex = new RegExp(search, 'i');
    query.$or = [{ fullName: regex }, { email: regex }, { mobile: regex }];
  }

  return query;
};

const validatePayload = (payload) => {
  const required = [
    'company',
    'fullName',
    'designation',
    'companyName',
    'mobile',
    'email',
    'website',
    'logoUrl',
  ];

  const missing = required.filter((field) => !payload[field]);
  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (!companies.includes(payload.company)) {
    const error = new Error('Invalid company');
    error.statusCode = 400;
    throw error;
  }
};

const createSignature = async (req, res, next) => {
  try {
    const payload = { ...req.body, company: req.body.company?.toUpperCase() };
    validatePayload(payload);

    const htmlOutput = generateSignatureHtml(payload);
    const signature = await Signature.create({ ...payload, htmlOutput });

    res.status(201).json(signature);
  } catch (error) {
    next(error);
  }
};

const getSignatures = async (req, res, next) => {
  try {
    const { search = '', company = '', page = 1, limit = 10 } = req.query;
    const numericPage = Number(page) || 1;
    const numericLimit = Number(limit) || 10;
    const query = buildQuery({ search, company });

    const [items, total] = await Promise.all([
      Signature.find(query)
        .sort({ createdAt: -1 })
        .skip((numericPage - 1) * numericLimit)
        .limit(numericLimit),
      Signature.countDocuments(query),
    ]);

    res.status(200).json({
      data: items,
      pagination: {
        total,
        page: numericPage,
        pages: Math.ceil(total / numericLimit) || 1,
        limit: numericLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSignatureById = async (req, res, next) => {
  try {
    const signature = await Signature.findById(req.params.id);
    if (!signature) {
      return res.status(404).json({ message: 'Signature not found' });
    }
    res.status(200).json(signature);
  } catch (error) {
    next(error);
  }
};

const updateSignature = async (req, res, next) => {
  try {
    const existing = await Signature.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Signature not found' });
    }

    const payload = {
      ...existing.toObject(),
      ...req.body,
      company: req.body.company?.toUpperCase() || existing.company,
    };

    validatePayload(payload);
    const htmlOutput = generateSignatureHtml(payload);

    Object.assign(existing, { ...req.body, company: payload.company, htmlOutput });
    await existing.save();

    res.status(200).json(existing);
  } catch (error) {
    next(error);
  }
};

const getSignatureStats = async (req, res, next) => {
  try {
    const [total, aggregates, recent] = await Promise.all([
      Signature.countDocuments(),
      Signature.aggregate([
        { $group: { _id: '$company', count: { $sum: 1 } } },
        { $project: { _id: 0, company: '$_id', count: 1 } },
      ]),
      Signature.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      total,
      companyBreakdown: aggregates,
      recent,
    });
  } catch (error) {
    next(error);
  }
};

const exportSignatures = async (req, res, next) => {
  try {
    const { format = 'csv' } = req.query;
    const signatures = await Signature.find().sort({ createdAt: -1 });

    if (format === 'json') {
      return res.status(200).json(signatures);
    }

    const headers = [
      'Full Name',
      'Designation',
      'Department',
      'Company',
      'Company Name',
      'Mobile',
      'Email',
      'Website',
      'Logo URL',
      'Created At',
      'Updated At',
    ];

    const csvRows = signatures.map((sig) =>
      [
        sig.fullName,
        sig.designation,
        sig.department,
        sig.company,
        sig.companyName,
        sig.mobile,
        sig.email,
        sig.website,
        sig.logoUrl,
        sig.createdAt?.toISOString() ?? '',
        sig.updatedAt?.toISOString() ?? '',
      ]
        .map((value) => `"${(value ?? '').toString().replace(/"/g, '""')}"`)
        .join(',')
    );

    const csv = [headers.join(','), ...csvRows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="signatures.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSignature,
  getSignatures,
  getSignatureById,
  updateSignature,
  getSignatureStats,
  exportSignatures,
};
