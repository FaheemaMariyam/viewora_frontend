// import { useEffect, useState } from "react";
// import { fetchProperties } from "../../api/propertyApi";
// import PropertyCard from "./PropertyCard";
// import { useNavigate } from "react-router-dom";

// export default function PropertyList() {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetchProperties();
//         setProperties(res.data.results || res.data);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   if (loading) {
//     return (
//       <div
//         className="min-h-screen flex items-center justify-center
//         bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800"
//       >
//         <p className="text-white/70">Loading properties…</p>
//       </div>
//     );
//   }

//   if (properties.length === 0) {
//     return (
//       <div
//         className="min-h-screen flex items-center justify-center
//         bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800"
//       >
//         <p className="text-white/70">No properties available</p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen px-8 py-12
//       bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800
//       relative overflow-hidden"
//     >
//       {/* Ambient glow */}
//       <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-indigo-600/20 blur-3xl rounded-full" />
//       <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-slate-600/20 blur-3xl rounded-full" />

//       <div className="relative max-w-7xl mx-auto">
//         <h1 className="text-2xl font-semibold text-white mb-8">
//           Available Properties
//         </h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {properties.map((property) => (
//             <PropertyCard
//               key={property.id}
//               property={property}
// //               onView={() =>
// //   navigate(`/properties/${property.id}`, {
// //     state: { property }
// //   })
  
// // }
// onView={() => navigate(`/properties/${property.id}`)}


//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { fetchProperties } from "../../api/propertyApi";
import PropertyCard from "./PropertyCard";
import { useNavigate } from "react-router-dom";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProperties();
        setProperties(res.data.results || res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ---------- Loading State ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70 text-sm">Loading properties…</p>
        </div>
      </div>
    );
  }

  /* ---------- Empty State ---------- */
  if (properties.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800">
        <p className="text-white/70 text-sm">
          No properties available at the moment
        </p>
      </div>
    );
  }

  return (
    <div
      className="
      min-h-screen
      px-6 sm:px-8 py-14
      bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800
      relative overflow-hidden
      "
    >
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-indigo-600/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-slate-600/20 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white">
            Available Properties
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Explore verified properties across locations
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={() => navigate(`/properties/${property.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
