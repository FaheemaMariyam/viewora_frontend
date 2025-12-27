// export default function PropertyCard({ property, onView }) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm p-5 border">
//       <h2 className="font-semibold text-gray-800">
//         {property.title}
//       </h2>

//       <p className="text-sm text-gray-500 mt-1">
//         {property.locality}, {property.city}
//       </p>

//       <p className="text-blue-600 font-bold mt-2">
//         ₹{Number(property.price).toLocaleString()}
//       </p>

//       <div className="flex gap-4 text-xs text-gray-500 mt-3">
//         <span>👁 {property.view_count}</span>
//         <span>❤️ {property.interest_count}</span>
//         <span className="capitalize">🏠 {property.property_type}</span>
//       </div>

//       <button
//         onClick={onView}
//         className="mt-4 w-full py-2 rounded-md bg-slate-900 text-white text-sm hover:bg-slate-800"
//       >
//         View Details
//       </button>

//       {property.is_interested && (
//         <p className="mt-2 text-xs text-green-600 text-center">
//           Interested
//         </p>
//       )}
//     </div>
//   );
// }
export default function PropertyCard({ property, onView }) {
  return (
    <div
      className="
      bg-gradient-to-b from-white/90 to-white/80
      backdrop-blur-xl
      border border-white/30
      rounded-2xl
      shadow-[0_12px_35px_rgba(0,0,0,0.15)]
      hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]
      transition
      p-5
      flex flex-col
      "
    >
      {/* Title */}
      <h2 className="font-semibold text-gray-900 text-lg truncate">
        {property.title}
      </h2>

      {/* Location */}
      <p className="text-sm text-gray-500 mt-1">
        {property.locality}, {property.city}
      </p>

      {/* Price */}
      <p className="text-2xl font-bold text-indigo-700 mt-3">
        ₹{Number(property.price).toLocaleString()}
      </p>

      {/* Stats */}
      <div className="flex justify-between text-xs text-gray-500 mt-4">
        <span className="flex items-center gap-1">
          👁 <span>{property.view_count}</span>
        </span>

        <span className="flex items-center gap-1">
          ❤️ <span>{property.interest_count}</span>
        </span>

        <span className="flex items-center gap-1 capitalize">
          🏠 <span>{property.property_type}</span>
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={onView}
        className="
        mt-5 w-full py-2.5 rounded-lg
        bg-gradient-to-r from-indigo-700 to-slate-900
        text-white text-sm font-semibold
        hover:from-indigo-800 hover:to-black
        transition shadow-md
        "
      >
        View Details
      </button>

      {/* Interested badge */}
      {property.is_interested && (
        <div className="mt-3 text-center">
          <span
            className="
            inline-block px-3 py-1 rounded-full
            bg-green-50 text-green-700
            text-xs font-medium
            border border-green-200
            "
          >
            ✓ Interested
          </span>
        </div>
      )}
    </div>
  );
}
