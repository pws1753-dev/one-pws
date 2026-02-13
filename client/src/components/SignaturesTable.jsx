import { Link } from 'react-router-dom';
import { Copy } from 'lucide-react';

const SignaturesTable = ({ items = [], onCopy }) => (
  <div className="bg-white rounded-3xl border border-black/5 shadow-card overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-ash text-xs uppercase text-steel">
        <tr>
          <th className="px-6 py-4">Name</th>
          <th className="px-6 py-4">Designation</th>
          <th className="px-6 py-4">Company</th>
          <th className="px-6 py-4">Email</th>
          <th className="px-6 py-4">Created</th>
          <th className="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id} className="border-t border-black/5 text-sm text-ink">
            <td className="px-6 py-4 font-semibold">{item.fullName}</td>
            <td className="px-6 py-4">{item.designation}</td>
            <td className="px-6 py-4">{item.company}</td>
            <td className="px-6 py-4">{item.email}</td>
            <td className="px-6 py-4">
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                : '—'}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onCopy?.(item)}
                  className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase flex items-center gap-1"
                >
                  <Copy size={14} />
                  Copy
                </button>
                <Link
                  to={`/signatures/${item._id}/edit`}
                  className="rounded-full bg-ink text-white px-4 py-1 text-xs uppercase"
                >
                  Edit
                </Link>
              </div>
            </td>
          </tr>
        ))}
        {!items.length && (
          <tr>
            <td className="px-6 py-8 text-steel" colSpan={6}>
              No signatures found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default SignaturesTable;
