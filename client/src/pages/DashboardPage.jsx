import { useEffect, useState } from 'react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import StatsGrid from '../components/StatsGrid.jsx';
import RecentList from '../components/RecentList.jsx';

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, companyBreakdown: [], recent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/signatures/stats');
        setStats(data);
      } catch (err) {
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader title="Signature Intelligence" subtitle="Dashboard" />

      {error && <div className="text-brand bg-brand/5 border border-brand/20 rounded-2xl p-4">{error}</div>}

      {loading ? (
        <div className="text-steel">Loading analytics...</div>
      ) : (
        <>
          <StatsGrid total={stats.total} breakdown={stats.companyBreakdown} />
          <RecentList items={stats.recent} />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
