import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { COMPANY_KEYS } from '../constants/companyInfo.js';

const TemplateContext = createContext({
  templates: {},
  loading: false,
  error: '',
});

export const TemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const responses = await Promise.all(
          COMPANY_KEYS.map(async (company) => {
            const { data } = await api.get('/template', { params: { company } });
            return [company, data.template || ''];
          })
        );
        setTemplates(Object.fromEntries(responses));
      } catch (err) {
        console.error(err);
        setError('Unable to load templates.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <TemplateContext.Provider value={{ templates, loading, error }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => useContext(TemplateContext);
