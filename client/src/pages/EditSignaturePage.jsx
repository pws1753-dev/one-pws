import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import api from '../services/api.js';

const EditSignaturePage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return undefined;
    }

    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/signatures', { params: { search: query } });
        setResults(data.data);
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Signature" subtitle="Search" />
      <div className="bg-white rounded-3xl border border-black/5 shadow-card p-6 space-y-6">
        <div className="flex items-center gap-4 border border-black/10 rounded-2xl px-4 py-3">
          <Search className="text-steel" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or phone"
            className="flex-1 text-sm text-ink outline-none"
          />
        </div>
        {loading && <div className="text-steel">Searching...</div>}
        <div className="space-y-3">
          {results.map((item) => (
            <div key={item._id} className="flex items-center justify-between border border-black/5 rounded-2xl px-4 py-3">
              <div>
                <p className="text-base font-semibold text-ink">{item.fullName}</p>
                <p className="text-sm text-steel">
                  {item.designation} • {item.company}
                </p>
              </div>
              <Link
                to={`/signatures/${item._id}/edit`}
                className="rounded-full bg-ink text-white px-4 py-2 text-xs uppercase"
              >
                Edit
              </Link>
            </div>
          ))}
          {!results.length && !loading && <p className="text-steel text-sm">No results yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default EditSignaturePage;
