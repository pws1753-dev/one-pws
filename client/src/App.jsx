import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CreateSignaturePage from './pages/CreateSignaturePage.jsx';
import AllSignaturesPage from './pages/AllSignaturesPage.jsx';
import EditSignaturePage from './pages/EditSignaturePage.jsx';
import SignatureUpdatePage from './pages/SignatureUpdatePage.jsx';
import TemplateViewPage from './pages/TemplateViewPage.jsx';
import ExportPage from './pages/ExportPage.jsx';

const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/create" element={<CreateSignaturePage />} />
        <Route path="/signatures" element={<AllSignaturesPage />} />
        <Route path="/edit" element={<EditSignaturePage />} />
        <Route path="/signatures/:id/edit" element={<SignatureUpdatePage />} />
        <Route path="/template" element={<TemplateViewPage />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;
