export default function PropertyFilters({
  filters,
  setFilters,
  onApply,
}) {
  return (
    <div
      className="
      grid grid-cols-2 md:grid-cols-6 gap-3 mb-8
      bg-white/10 backdrop-blur-xl
      border border-white/15
      rounded-xl p-4
      "
    >
      {/* Search */}
      <input
        placeholder="Search location or title"
        className="
        col-span-2 px-3 py-2 rounded-md text-sm
        bg-white/80 border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-indigo-600
        "
        value={filters.search}
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />

      {/* City */}
      <input
        placeholder="City"
        className="
        px-3 py-2 rounded-md text-sm
        bg-white/80 border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-indigo-600
        "
        value={filters.city}
        onChange={(e) =>
          setFilters({ ...filters, city: e.target.value })
        }
      />

      {/* Property Type */}
      <select
        className="
        px-3 py-2 rounded-md text-sm
        bg-white/80 border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-indigo-600
        "
        value={filters.property_type}
        onChange={(e) =>
          setFilters({
            ...filters,
            property_type: e.target.value,
          })
        }
      >
        <option value="">All Types</option>
        <option value="plot">Plot</option>
        <option value="house">House</option>
        <option value="flat">Flat</option>
        <option value="commercial">Commercial</option>
      </select>

      {/* Price */}
      <input
        type="number"
        placeholder="Min ₹"
        className="
        px-3 py-2 rounded-md text-sm
        bg-white/80 border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-indigo-600
        "
        value={filters.min_price}
        onChange={(e) =>
          setFilters({
            ...filters,
            min_price: e.target.value,
          })
        }
      />

      <input
        type="number"
        placeholder="Max ₹"
        className="
        px-3 py-2 rounded-md text-sm
        bg-white/80 border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-indigo-600
        "
        value={filters.max_price}
        onChange={(e) =>
          setFilters({
            ...filters,
            max_price: e.target.value,
          })
        }
      />

      {/* Apply */}
      <button
        onClick={onApply}
        className="
        col-span-2 md:col-span-1
        bg-gradient-to-r from-indigo-700 to-indigo-900
        text-white rounded-md text-sm font-semibold
        hover:from-indigo-600 hover:to-indigo-800
        transition shadow-md
        "
      >
        Apply
      </button>
    </div>
  );
}
