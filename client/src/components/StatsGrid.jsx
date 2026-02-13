const StatsGrid = ({ total = 0, breakdown = [] }) => {
  const tiles = [
    {
      label: 'Total Signatures',
      value: total,
    },
    ...breakdown.map((item) => ({
      label: item.company,
      value: item.count,
    })),
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="bg-white rounded-3xl border border-black/5 shadow-card px-6 py-6"
        >
          <p className="text-xs uppercase text-steel">{tile.label}</p>
          <p className="text-3xl font-semibold text-ink mt-3">{tile.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
