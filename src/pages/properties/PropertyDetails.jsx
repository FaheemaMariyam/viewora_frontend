// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchPropertyDetail } from "../../api/propertyApi";
// import { createInterest } from "../../api/interestApi";

// export default function PropertyDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [interestLoading, setInterestLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 🔑 Single source of truth loader
//   const loadProperty = async () => {
//     try {
//       const res = await fetchPropertyDetail(id);
//       setProperty(res.data);
//     } catch {
//       setError("Unable to load property details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProperty();
//   }, [id]);

//   const handleInterest = async () => {
//     setInterestLoading(true);

//     try {
//       await createInterest(property.id);
//       await loadProperty(); // 🔥 re-sync from backend
//     } catch (err) {
//       alert(
//         err.response?.data?.message ||
//         "Failed to express interest"
//       );
//     } finally {
//       setInterestLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500">Loading property…</p>
//       </div>
//     );
//   }

//   if (error || !property) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-4">
//         <p className="text-gray-500">{error}</p>
//         <button
//           onClick={() => navigate("/properties")}
//           className="text-blue-600 underline"
//         >
//           Back to listings
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 px-6 py-10">
//       <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
//         <h1 className="text-xl font-semibold text-gray-800">
//           {property.title}
//         </h1>

//         <p className="text-gray-500 mt-1">
//           {property.locality}, {property.city}
//         </p>

//         <p className="text-2xl font-bold text-blue-600 mt-4">
//           ₹{Number(property.price).toLocaleString()}
//         </p>

//         <div className="flex gap-6 mt-4 text-sm text-gray-600">
//           <span>👁 {property.view_count} views</span>
//           <span>❤️ {property.interest_count} interests</span>
//           <span className="capitalize">🏠 {property.property_type}</span>
//         </div>

//         <div className="mt-6">
//           <h3 className="font-medium mb-2">Description</h3>
//           <p className="text-gray-600">{property.description}</p>
//         </div>

//         <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
//           {property.bedrooms && <div>🛏 {property.bedrooms} Bedrooms</div>}
//           {property.bathrooms && <div>🚿 {property.bathrooms} Bathrooms</div>}
//           <div>📐 {property.area_size} {property.area_unit}</div>
//         </div>

//         {/* 🔐 INTEREST BUTTON */}
//         <div className="mt-8">
//           <button
//             onClick={handleInterest}
//             disabled={property.is_interested || interestLoading}
//             className={`w-full py-3 rounded-md text-white text-sm font-medium transition
//               ${
//                 property.is_interested
//                   ? "bg-green-600 cursor-not-allowed"
//                   : interestLoading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//           >
//             {property.is_interested
//               ? "Interested"
//               : interestLoading
//               ? "Processing..."
//               : "I'm Interested"}
//           </button>

//           {property.is_interested && (
//             <p className="text-xs text-green-600 mt-2 text-center">
//               A broker will contact you shortly
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyDetail } from "../../api/propertyApi";
import { createInterest } from "../../api/interestApi";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interestLoading, setInterestLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProperty = async () => {
    try {
      const res = await fetchPropertyDetail(id);
      setProperty(res.data);
    } catch {
      setError("Unable to load property details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  const handleInterest = async () => {
    setInterestLoading(true);
    try {
      await createInterest(property.id);
      await loadProperty(); // re-sync from backend
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to express interest"
      );
    } finally {
      setInterestLoading(false);
    }
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70 text-sm">Loading property…</p>
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800">
        <p className="text-white/70">{error}</p>
        <button
          onClick={() => navigate("/properties")}
          className="text-indigo-400 hover:underline"
        >
          ← Back to listings
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-6 py-14
      bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800
      relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-indigo-600/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-slate-600/20 blur-3xl rounded-full" />

      <div className="relative max-w-xl mx-auto">

        {/* Back link */}
        <button
          onClick={() => navigate("/properties")}
          className="text-sm text-white/70 hover:text-white mb-6"
        >
          ← Back to listings
        </button>

        {/* Card */}
        <div
          className="
          bg-gradient-to-b from-white/90 to-white/80
          backdrop-blur-xl
          border border-white/20
          rounded-2xl
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          p-7
          "
        >
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900">
            {property.title}
          </h1>

          {/* Location */}
          <p className="text-gray-500 mt-1">
            {property.locality}, {property.city}
          </p>

          {/* Price */}
          <p className="text-3xl font-bold text-indigo-700 mt-4">
            ₹{Number(property.price).toLocaleString()}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap gap-6 mt-5 text-sm text-gray-600">
            <span>👁 {property.view_count} views</span>
            <span>❤️ {property.interest_count} interests</span>
            <span className="capitalize">🏠 {property.property_type}</span>
          </div>

          {/* Description */}
          <div className="mt-7">
            <h3 className="font-medium text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-4 mt-7 text-sm text-gray-700">
            {property.bedrooms && (
              <div>🛏 {property.bedrooms} Bedrooms</div>
            )}
            {property.bathrooms && (
              <div>🚿 {property.bathrooms} Bathrooms</div>
            )}
            <div>
              📐 {property.area_size} {property.area_unit}
            </div>
          </div>

          {/* Interest CTA */}
          <div className="mt-9">
            <button
              onClick={handleInterest}
              disabled={property.is_interested || interestLoading}
              className={`
                w-full py-3 rounded-lg text-sm font-semibold transition
                ${
                  property.is_interested
                    ? "bg-green-600 text-white cursor-not-allowed"
                    : interestLoading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-700 to-slate-900 text-white hover:from-indigo-800 hover:to-black shadow-md"
                }
              `}
            >
              {property.is_interested
                ? "Interested"
                : interestLoading
                ? "Processing..."
                : "I'm Interested"}
            </button>

            {property.is_interested && (
              <p className="text-xs text-green-600 mt-3 text-center">
                A broker will contact you shortly
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
