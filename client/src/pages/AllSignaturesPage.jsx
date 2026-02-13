import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import SearchFilterBar from '../components/SearchFilterBar.jsx';
import SignaturesTable from '../components/SignaturesTable.jsx';
import api from '../services/api.js';

const AllSignaturesPage = () => {
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('');
  const [page, setPage] = useState(1);
  const [signatures, setSignatures] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchSignatures = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/signatures', {
          params: { search, company, page },
          signal: controller.signal,
        });
        setSignatures(data.data);
        setPagination(data.pagination);
      } catch (err) {
        if (err.code !== 'ERR_CANCELED') {
          setError('Unable to load signatures.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSignatures();

    return () => controller.abort();
  }, [search, company, page]);

  const handleCopy = async (signature) => {
    if (!signature?.htmlOutput) return;
    try {
      await navigator.clipboard.writeText(signature.htmlOutput);
    } catch (error) {
      // no-op for now
    }
  };

  const changePage = (direction) => {
    if (direction === 'next' && page < pagination.pages) {
      setPage((prev) => prev + 1);
    }
    if (direction === 'prev' && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="All Signatures" subtitle="Repository" />
      <SearchFilterBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        company={company}
        onCompanyChange={(value) => {
          setCompany(value);
          setPage(1);
        }}
      />
      {error && <div className="text-brand bg-brand/5 border border-brand/20 rounded-2xl p-4">{error}</div>}
      {loading ? (
        <div className="text-steel">Loading records...</div>
      ) : (
        <SignaturesTable items={signatures} onCopy={handleCopy} />
      )}
      <div className="flex items-center justify-between text-sm text-steel">
        <span>
          Page {pagination.page} of {pagination.pages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changePage('prev')}
            disabled={page <= 1}
            className="px-4 py-2 rounded-full border border-black/10 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => changePage('next')}
            disabled={page >= pagination.pages}
            className="px-4 py-2 rounded-full border border-black/10 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllSignaturesPage;
