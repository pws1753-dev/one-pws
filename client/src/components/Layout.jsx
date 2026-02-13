import Sidebar from './Sidebar.jsx';

const Layout = ({ children }) => (
  <div className="min-h-screen flex bg-ash">
    <Sidebar />
    <main className="flex-1 px-10 py-10 space-y-10">{children}</main>
  </div>
);

export default Layout;
