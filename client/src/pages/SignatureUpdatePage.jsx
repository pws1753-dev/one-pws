import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SignatureWorkspace from '../components/SignatureWorkspace.jsx';
import api from '../services/api.js';

const SignatureUpdatePage = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const { data } = await api.get(`/signatures/${id}`);
        setInitialData(data);
      } catch (err) {
        setError('Unable to load signature.');
      } finally {
        setLoading(false);
      }
    };

    fetchSignature();
  }, [id]);

  const handlePersist = async (payload) => {
    await api.put(`/signatures/${id}`, payload);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Update Signature" subtitle="Edit" />
      {loading && <div className="text-steel">Loading signature...</div>}
      {error && <div className="text-brand bg-brand/5 border border-brand/20 rounded-2xl p-4">{error}</div>}
      {!loading && !error && initialData && (
        <SignatureWorkspace mode="edit" initialValues={initialData} onPersist={handlePersist} />
      )}
    </div>
  );
};

export default SignatureUpdatePage;
