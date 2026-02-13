import PageHeader from '../components/PageHeader.jsx';
import api from '../services/api.js';

const ExportPage = () => {
  const handleExport = async (format) => {
    const response = await api.get('/signatures/export', {
      params: { format },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = format === 'json' ? 'signatures.json' : 'signatures.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Export Records" subtitle="Download" />
      <div className="bg-white rounded-3xl border border-black/5 shadow-card p-6 space-y-4">
        <p className="text-sm text-steel">Generate offline backups for compliance or sharing.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleExport('csv')}
            className="rounded-2xl bg-ink text-white py-4 text-sm uppercase"
          >
            Download CSV
          </button>
          <button
            type="button"
            onClick={() => handleExport('json')}
            className="rounded-2xl border border-ink text-ink py-4 text-sm uppercase"
          >
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
