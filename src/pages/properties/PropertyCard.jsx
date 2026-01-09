
export default function PropertyCard({ property, onView }) {
  const imageUrl = property.cover_image;

  return (
    <div
      className="
        group relative rounded-2xl overflow-hidden
        bg-white/95 backdrop-blur-xl
        border border-slate-200
        shadow-sm hover:shadow-2xl hover:-translate-y-1
        transition-all duration-300
        flex flex-col
      "
    >
      {/* IMAGE */}
      {imageUrl && (
        <div className="relative h-52 overflow-hidden">
          <img
            src={imageUrl}
            alt={property.title}
            className="
              h-full w-full object-cover
              group-hover:scale-105 transition-transform duration-500
            "
          />

          <span className="absolute top-3 left-3 px-3 py-1 text-xs rounded-full bg-slate-900/80 text-white">
            {property.property_type}
          </span>
        </div>
      )}

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-grow space-y-2">
        <h3 className="text-lg font-semibold text-slate-800 truncate">
          {property.title}
        </h3>

        <p className="text-sm text-slate-500">
          {property.locality}, {property.city}
        </p>

        <p className="text-xl font-bold text-indigo-700">
          ₹ {Number(property.price).toLocaleString()}
        </p>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2">
          {property.bedrooms != null && <span>🛏 {property.bedrooms}</span>}
          {property.bathrooms != null && <span>🛁 {property.bathrooms}</span>}
          <span>
            📐 {property.area_size} {property.area_unit}
          </span>
        </div>

        <div className="flex justify-between text-xs text-slate-500 mt-3">
          <span>👁 {property.view_count}</span>
          <span>❤️ {property.interest_count}</span>
        </div>

        <button
          onClick={onView}
          className="
            mt-auto pt-4
            w-full py-2.5 rounded-lg
            bg-gradient-to-r from-indigo-700 to-slate-900
            text-white text-sm font-semibold
            hover:from-indigo-800 hover:to-black
            transition shadow-md
          "
        >
          View Details
        </button>

        {/* INTERESTED BADGE */}
        {property.is_interested && (
          <div className="mt-3 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border">
              ✓ Interested
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
