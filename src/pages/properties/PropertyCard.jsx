
export default function PropertyCard({ property, onView }) {
  const imageUrl = property.cover_image;

  return (
    <div
      className="
        group relative rounded-lg overflow-hidden
        bg-white
        border border-gray-200
        shadow-sm hover:shadow-lg hover:-translate-y-1
        transition-all duration-300
        flex flex-col
      "
    >
      {/* IMAGE */}
      {imageUrl && (
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={property.title}
            className="
              h-full w-full object-cover
              group-hover:scale-105 transition-transform duration-500
            "
          />

          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-md bg-white/90 text-brand-primary shadow-sm uppercase tracking-wide">
            {property.property_type}
          </span>
        </div>
      )}

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-grow space-y-2">
        <h3 className="text-lg font-bold text-brand-primary truncate">
          {property.title}
        </h3>

        <p className="text-sm text-text-muted flex items-center">
          <span className="mr-1">📍</span> {property.locality}, {property.city}
        </p>

        <p className="text-xl font-bold text-brand-accent">
          ₹ {Number(property.price).toLocaleString()}
        </p>

        <div className="flex flex-wrap gap-3 text-xs text-text-muted mt-2 border-t border-gray-100 pt-3">
          {property.bedrooms != null && <span className="flex items-center">🛏 {property.bedrooms} Beds</span>}
          {property.bathrooms != null && <span className="flex items-center">🛁 {property.bathrooms} Baths</span>}
          <span className="flex items-center">
            📐 {property.area_size} {property.area_unit}
          </span>
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{property.view_count} views</span>
          <span>{property.interest_count} interested</span>
        </div>

        <button
          onClick={onView}
          className="
            mt-auto pt-3
            w-full py-2.5 rounded-md
            bg-white border border-brand-primary text-brand-primary
            text-sm font-semibold
            hover:bg-brand-primary hover:text-white
            transition shadow-sm
          "
        >
          View Details
        </button>

        {/* INTERESTED BADGE */}
        {property.is_interested && (
          <div className="mt-3 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
              ✓ Interest Submitted
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
