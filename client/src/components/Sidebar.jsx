import { NavLink } from 'react-router-dom';
import onePWSLogo from '../assets/onepws-white.png';
import {
  LayoutDashboard,
  PenSquare,
  ListChecks,
  Edit3,
  FileText,
  Download,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Create Signature', to: '/create', icon: PenSquare },
  { label: 'All Signatures', to: '/signatures', icon: ListChecks },
  { label: 'Edit Signature', to: '/edit', icon: Edit3 },
  { label: 'Template View', to: '/template', icon: FileText },
  { label: 'Export', to: '/export', icon: Download },
];

const Sidebar = () => (
  <aside className="bg-ink text-white w-64 min-h-screen px-6 py-10 flex flex-col">
    <div className="mb-12">
      <img src={onePWSLogo} alt="One PWS Logo" className="h-auto w-full" />
    </div>
    <nav className="flex-1 space-y-2">
      {navItems.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={label}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm uppercase transition ${
              isActive ? 'bg-white text-ink' : 'text-white hover:bg-white/5'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
    <div className="text-xs text-white uppercase mt-6">
      Internal Tool • White + Black
    </div>
  </aside>
);

export default Sidebar;
