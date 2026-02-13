import { useEffect, useMemo, useState } from 'react';
import { Copy, Download, Loader2 } from 'lucide-react';
import { useTemplate } from '../context/TemplateContext.jsx';
import { COMPANY_MAP, companyOptions, getCompanyDefaults } from '../constants/companyInfo.js';
import { renderTemplate } from '../utils/templateRenderer.js';
import { copyHtmlToClipboard } from '../utils/clipboard.js';

const baseForm = {
  company: 'ONEPWS',
  fullName: '',
  designation: '',
  department: '',
  mobile: '',
  email: '',
  website: '',
  companyName: '',
  logoUrl: '',
};

const allowedFields = Object.keys(baseForm);
const sanitizePayload = (payload = {}) =>
  allowedFields.reduce((acc, key) => {
    if (payload[key] !== undefined) {
      acc[key] = payload[key];
    }
    return acc;
  }, {});

const SignatureWorkspace = ({ mode = 'create', initialValues = {}, onPersist }) => {
  const { templates, loading: templateLoading, error: templateError } = useTemplate();
  const [formData, setFormData] = useState(() => ({
    ...baseForm,
    ...getCompanyDefaults('ONEPWS'),
  }));
  const [previewHtml, setPreviewHtml] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length) {
      const sanitized = sanitizePayload(initialValues);
      setFormData((prev) => ({
        ...prev,
        ...sanitized,
      }));
    }
  }, [initialValues]);

  useEffect(() => {
    const activeCompany = formData.company || 'ONEPWS';
    const template = templates[activeCompany] || templates.ONEPWS;
    const companyMeta = COMPANY_MAP[activeCompany] || COMPANY_MAP.ONEPWS;
    if (template && companyMeta) {
      setPreviewHtml(renderTemplate(template, formData, companyMeta));
    }
  }, [templates, formData]);

  const handleChange = (field) => (event) => {
    const value = event?.target ? event.target.value : event;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompanyChange = (event) => {
    const updatedCompany = event.target.value;
    const defaults = getCompanyDefaults(updatedCompany);
    setFormData((prev) => ({
      ...prev,
      company: updatedCompany,
      website: defaults.website,
      companyName: defaults.companyName,
      logoUrl: defaults.logoUrl,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!onPersist) return;

    setSubmitting(true);
    setStatus(null);
    try {
      await onPersist(sanitizePayload(formData));
      setStatus({
        type: 'success',
        message: mode === 'edit' ? 'Signature updated successfully.' : 'Signature created successfully.',
      });
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to save signature.';
      setStatus({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!previewHtml) return;
    try {
      const copied = await copyHtmlToClipboard(previewHtml);
      if (!copied) {
        throw new Error('copy failed');
      }
      setStatus({ type: 'success', message: 'Template copied to clipboard.' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Clipboard access denied.' });
    }
  };

  const handleDownload = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = `${formData.fullName || 'signature'}.html`;
    link.download = filename.replace(/\s+/g, '-').toLowerCase();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const actionLabel = useMemo(() => (mode === 'edit' ? 'Update Signature' : 'Create Signature'), [mode]);

  return (
    <div className="space-y-6 overflow-hidden">
      {status && (
        <div
          className={`rounded-2xl px-6 py-4 border text-sm ${
            status.type === 'success'
              ? 'border-black/10 bg-ash text-ink'
              : 'border-brand/30 bg-brand/5 text-brand'
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 overflow-hidden">
        <div className="bg-white rounded-3xl shadow-card border border-black/5 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase text-steel">Signature Form</p>
              <h2 className="text-3xl font-semibold text-ink mt-2">{actionLabel}</h2>
            </div>
            {submitting && <Loader2 className="animate-spin text-brand" />}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col text-sm text-steel uppercase gap-2">
                Company
                <select
                  className="rounded-2xl border border-black/10 px-4 py-3 bg-white text-ink focus:border-brand outline-none"
                  value={formData.company}
                  onChange={handleCompanyChange}
                >
                  {companyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-sm text-steel uppercase gap-2">
                Full Name
                <input
                  type="text"
                  className="rounded-2xl border border-black/10 px-4 py-3 bg-white text-ink focus:border-brand outline-none"
                  value={formData.fullName}
                  onChange={handleChange('fullName')}
                  placeholder="Enter full name"
                  required
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col text-sm text-steel uppercase gap-2">
                Designation
                <input
                  type="text"
                  className="rounded-2xl border border-black/10 px-4 py-3 bg-white text-ink focus:border-brand outline-none"
                  value={formData.designation}
                  onChange={handleChange('designation')}
                  placeholder="e.g. Senior Manager"
                  required
                />
              </label>
              <label className="flex flex-col text-sm text-steel uppercase gap-2">
                Department
                <input
                  type="text"
                  className="rounded-2xl border border-black/10 px-4 py-3 bg-white text-ink focus:border-brand outline-none"
                  value={formData.department}
                  onChange={handleChange('department')}
                  placeholder="e.g. Marketing"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col text-sm text-steel uppercase gap-2">
                Mobile Number
                <input
                  type="text"
                  className="rounded-2xl border border-black/10 px-4 py-3 bg-white text-ink focus:border-brand outline-none"
                  value={formData.mobile}
                  onChange={handleChange('mobile')}
                  placeholder="+91 90000 00000"
                  required
                />
              </label>
              <label className="flex flex-col text-sm text-steel uppercase gap-2">
                Email Address
                <input
                  type="email"
                  className="rounded-2xl border border-black/10 px-4 py-3 bg-white text-ink focus:border-brand outline-none"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="name@company.com"
                  required
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col text-sm text-steel uppercase gap-2">
                Website
                <input
                  type="text"
                  className="rounded-2xl border border-black/10 px-4 py-3 bg-white text-ink focus:border-brand outline-none"
                  value={formData.website}
                  onChange={handleChange('website')}
                  placeholder="https://"
                  required
                />
              </label>
              <label className="flex flex-col text-sm text-steel uppercase gap-2">
                Company Name
                <input
                  type="text"
                  className="rounded-2xl border border-black/10 px-4 py-3 bg-white text-ink focus:border-brand outline-none"
                  value={formData.companyName}
                  onChange={handleChange('companyName')}
                  placeholder="Legal entity name"
                  required
                />
              </label>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-dashed border-black/10 px-4 py-4">
              <div>
                <p className="text-xs uppercase text-steel">Logo Preview</p>
                <p className="text-sm text-ink mt-1">
                  Default asset auto-selected per company. Update company to switch automatically.
                </p>
              </div>
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Company logo preview" className="w-32 rounded-lg border border-black/5" />
              ) : (
                <div className="text-sm text-steel">No logo detected</div>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-ink text-white py-4 text-sm uppercase flex items-center justify-center gap-2 hover:bg-brand transition-colors"
              disabled={submitting}
            >
              {submitting && <Loader2 className="animate-spin w-4 h-4" />}
              {actionLabel}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl shadow-card border border-black/5 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase text-steel">Live Preview</p>
              <h2 className="text-3xl font-semibold text-ink mt-2">Outlook + Gmail Safe</h2>
            </div>
            {templateLoading && <Loader2 className="animate-spin text-brand" />}
          </div>

          {templateError && (
            <div className="text-brand bg-brand/5 border border-brand/20 rounded-2xl p-4">
              {templateError}
            </div>
          )}

          {!templates[formData.company] && !templateLoading ? (
            <div className="text-steel bg-ash rounded-2xl p-8 text-center border border-dashed border-black/10 flex-1 flex items-center justify-center">
              Template not loaded yet.
            </div>
          ) : (
            <div className="flex-1 overflow-auto rounded-2xl border border-black/10 bg-ash p-4">
              <div
                className="bg-white p-6 rounded-xl text-sm text-ink signature-preview"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              type="button"
              className="rounded-2xl border border-ink text-ink py-3 flex items-center justify-center gap-2 uppercase"
            >
              <Copy size={18} />
              Copy Template
            </button>
            <button
              onClick={handleDownload}
              type="button"
              className="rounded-2xl bg-ink text-white py-3 flex items-center justify-center gap-2 uppercase"
            >
              <Download size={18} />
              Download .html
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureWorkspace;
