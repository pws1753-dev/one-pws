import SignatureWorkspace from '../components/SignatureWorkspace.jsx';
import PageHeader from '../components/PageHeader.jsx';
import api from '../services/api.js';

const CreateSignaturePage = () => {
  const handlePersist = async (payload) => {
    await api.post('/signatures', payload);
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Create Signature" subtitle="Generator" />
      <SignatureWorkspace onPersist={handlePersist} mode="create" />
    </div>
  );
};

export default CreateSignaturePage;
