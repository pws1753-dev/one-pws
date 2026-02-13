const PageHeader = ({ title, subtitle }) => (
  <div className="space-y-2">
    <p className="text-xs uppercase text-steel">{subtitle}</p>
    <h1 className="text-4xl font-semibold text-ink">{title}</h1>
  </div>
);

export default PageHeader;
