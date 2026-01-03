
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getMyProperties,
//   toggleArchiveProperty,
//   createProperty
// } from "../../api/sellerApi";

// export default function SellerDashboard() {
//   const navigate = useNavigate();
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadMyProperties();
//   }, []);

//   const loadMyProperties = async () => {
//     try {
//       const res = await getMyProperties();
//       setProperties(res.data);
//     } catch (err) {
//       console.error("Failed to load properties", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleArchive = async (id) => {
//     try {
//       const res = await toggleArchiveProperty(id);

//       setProperties((prev) =>
//         prev.map((p) =>
//           p.id === id
//             ? {
//                 ...p,
//                 is_active: res.data.is_active,
//                 status: res.data.status,
//               }
//             : p
//         )
//       );
//     } catch {
//       alert("Failed to update property status");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-8 bg-slate-100">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">
//           Seller Dashboard
//         </h1>

//         <button
//           onClick={() => navigate("/seller/add-property")}
//           className="px-4 py-2 rounded-lg
//           bg-indigo-600 text-white
//           hover:bg-indigo-700"
//         >
//           + Add Property
//         </button>
//       </div>

//       {properties.length === 0 ? (
//         <div className="text-gray-500">
//           No properties posted yet.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {properties.map((p) => (
//             <div
//               key={p.id}
//               className={`bg-white p-5 rounded-xl shadow
//               ${!p.is_active && "opacity-70 border border-dashed"}`}
//             >
//               <h3 className="font-semibold text-lg">
//                 {p.title}
//               </h3>

//               <p className="text-sm text-gray-500 mt-1">
//                 {p.city} • {p.locality}
//               </p>

//               <p className="mt-2 font-medium">
//                 ₹ {p.price}
//               </p>

//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-xs text-gray-600 capitalize">
//                   Status: {p.status}
//                 </span>

//                 <button
//                   onClick={() => handleToggleArchive(p.id)}
//                   className={`text-sm font-medium ${
//                     p.is_active
//                       ? "text-red-600"
//                       : "text-green-600"
//                   } hover:underline`}
//                 >
//                   {p.is_active ? "Archive" : "Unarchive"}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyProperties,
  toggleArchiveProperty,
} from "../../api/sellerApi";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyProperties();
  }, []);

  const loadMyProperties = async () => {
    try {
      const res = await getMyProperties();
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to load properties", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      const res = await toggleArchiveProperty(id);

      setProperties((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                is_active: res.data.is_active,
                status: res.data.status,
              }
            : p
        )
      );
    } catch {
      alert("Failed to update property status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Seller Dashboard</h1>

        <button
          onClick={() => navigate("/seller/add-property")}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          + Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <p className="text-gray-500">No properties posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div
              key={p.id}
              className={`bg-white p-5 rounded-xl shadow ${
                !p.is_active && "opacity-60 border border-dashed"
              }`}
            >
              <h3 className="font-semibold text-lg">{p.title}</h3>

              <p className="text-sm text-gray-500 mt-1">
                {p.city} • {p.locality}
              </p>

              <p className="mt-2 font-medium">₹ {p.price}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xs capitalize text-gray-600">
                  Status: {p.status}
                </span>

                <button
                  onClick={() => handleToggleArchive(p.id)}
                  className={`text-sm font-medium ${
                    p.is_active
                      ? "text-red-600"
                      : "text-green-600"
                  } hover:underline`}
                >
                  {p.is_active ? "Archive" : "Unarchive"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
