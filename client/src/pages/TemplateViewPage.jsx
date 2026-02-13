import { useEffect, useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { useTemplate } from '../context/TemplateContext.jsx';
import { COMPANY_MAP, companyOptions, getCompanyDefaults } from '../constants/companyInfo.js';
import { renderTemplate } from '../utils/templateRenderer.js';
import { copyHtmlToClipboard } from '../utils/clipboard.js';

const TemplateViewPage = () => {
  const { templates, loading, error } = useTemplate();
  const [company, setCompany] = useState('ONEPWS');
  const [copyStatus, setCopyStatus] = useState(null);
  const template = templates[company];
  const previewHtml = useMemo(() => {
    if (!template) return '';
    const defaults = getCompanyDefaults(company);
    const samplePayload = {
      ...defaults,
      fullName: `${COMPANY_MAP[company].label} Sample`,
      designation: 'Sample Title',
      department: 'Sample Department',
      mobile: '+91 9000000000',
      email: 'sample@example.com',
    };
    return renderTemplate(template, samplePayload, COMPANY_MAP[company]);
  }, [template, company]);

  const handleCopyTemplate = async () => {
    if (!previewHtml) return;
    try {
      const copied = await copyHtmlToClipboard(previewHtml);
      if (!copied) {
        throw new Error('copy failed');
      }
      setCopyStatus({ type: 'success', message: 'Template copied to clipboard.' });
    } catch (error) {
      setCopyStatus({ type: 'error', message: 'Clipboard access denied.' });
    }
  };

  useEffect(() => {
    if (!copyStatus) return undefined;
    const timer = setTimeout(() => setCopyStatus(null), 3000);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  return (
    <div className="space-y-6">
      <PageHeader title="Template View" subtitle="Read Only" />
      <div className="bg-white rounded-3xl border border-black/5 shadow-card p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <label className="text-xs uppercase tracking-[0.4em] text-steel">Company</label>
          <select
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="rounded-2xl border border-black/10 px-4 py-3 bg-white text-ink focus:border-brand outline-none"
          >
            {companyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {loading && <p className="text-steel">Loading template...</p>}
        {error && <p className="text-brand">{error}</p>}
        {!loading && !error && previewHtml && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-steel">Preview</p>
                {copyStatus && (
                  <p
                    className={`text-sm mt-1 ${
                      copyStatus.type === 'success' ? 'text-ink' : 'text-brand'
                    }`}
                  >
                    {copyStatus.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="rounded-2xl border border-ink text-ink px-5 py-3 flex items-center justify-center gap-2 uppercase text-sm"
              >
                <Copy size={18} />
                Copy Template
              </button>
            </div>
            <div className="rounded-2xl border border-black/10 bg-ash p-4">
              <div
                className="bg-white p-4 rounded-xl signature-preview"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateViewPage;
