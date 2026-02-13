import { companyOptions } from '../constants/companyInfo.js';

const SearchFilterBar = ({ search, onSearchChange, company, onCompanyChange }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-4">
    <input
      type="text"
      placeholder="Search by name or email"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink focus:border-brand outline-none"
    />
    <select
      value={company}
      onChange={(e) => onCompanyChange(e.target.value)}
      className="w-full md:w-60 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink focus:border-brand outline-none"
    >
      <option value="">All Companies</option>
      {companyOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SearchFilterBar;
