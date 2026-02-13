import { Link } from 'react-router-dom';

const RecentList = ({ items = [] }) => (
  <div className="bg-white rounded-3xl border border-black/5 shadow-card p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-xs uppercase text-steel">Recently Created</p>
        <p className="text-xl font-semibold text-ink mt-1">Latest activity</p>
      </div>
    </div>
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item._id} className="flex items-center justify-between border-b border-black/5 pb-3 last:border-none last:pb-0">
          <div>
            <p className="text-base font-semibold text-ink">{item.fullName}</p>
            <p className="text-sm text-steel">
              {item.designation} • {item.company}
            </p>
          </div>
          <Link
            to={`/signatures/${item._id}/edit`}
            className="text-xs uppercase text-brand border border-brand/30 rounded-full px-4 py-1"
          >
            Edit
          </Link>
        </li>
      ))}
      {!items.length && <p className="text-sm text-steel">No signatures found.</p>}
    </ul>
  </div>
);

export default RecentList;
