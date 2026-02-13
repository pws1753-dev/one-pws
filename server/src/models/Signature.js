const { Schema, model } = require('mongoose');

const companies = ['ONEPWS', 'WMSPL', 'PWSFLOOR'];

const SignatureSchema = new Schema(
  {
    company: {
      type: String,
      enum: companies,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    website: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    htmlOutput: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Signature', SignatureSchema);
