
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchPropertyDetail, createInterest } from "../../api/propertyApi";
// import ChatBox from "../../components/ChatBox";
// import { useAuth } from "../../auth/AuthContext";

// export default function PropertyDetails() {
//   const { id } = useParams();
//   const { user } = useAuth();

//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [interestLoading, setInterestLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch property details
//   useEffect(() => {
//     setLoading(true);
//     fetchPropertyDetail(id)
//       .then((res) => {
//         setProperty(res.data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setError("Failed to load property");
//         setLoading(false);
//       });
//   }, [id]);

//   // Create interest
//   const handleInterest = async () => {
//     try {
//       setInterestLoading(true);
//       await createInterest(id);

//       // re-fetch property to get interest_id
//       const res = await fetchPropertyDetail(id);
//       setProperty(res.data);
//     } catch (err) {
//       alert(
//         err?.response?.data?.message ||
//         "Unable to create interest"
//       );
//     } finally {
//       setInterestLoading(false);
//     }
//   };

//   if (loading) {
//     return <p className="p-4">Loading property...</p>;
//   }

//   if (error) {
//     return <p className="p-4 text-red-600">{error}</p>;
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-4">
//       {/* ---------------- Property Info ---------------- */}
//       <h1 className="text-2xl font-bold mb-2">
//         {property.title}
//       </h1>

//       <p className="text-gray-600 mb-1">
//         {property.locality}, {property.city}
//       </p>

//       <p className="text-xl font-semibold text-blue-600 mb-4">
//         ₹{Number(property.price).toLocaleString()}
//       </p>

//       <p className="mb-4">{property.description}</p>

//       {/* ---------------- Interest Action ---------------- */}
//       {user && user.role === "client" && (
//         <div className="mb-6">
//           {!property.is_interested ? (
//             <button
//               onClick={handleInterest}
//               disabled={interestLoading}
//               className="bg-green-600 text-white px-4 py-2 rounded"
//             >
//               {interestLoading ? "Processing..." : "I'm Interested"}
//             </button>
//           ) : (
//             <span className="text-green-700 font-medium">
//               ✅ Interest Submitted
//             </span>
//           )}
//         </div>
//       )}

//       {/* ---------------- Live Chat ---------------- */}
//       {property.is_interested &&
//         property.active_interest_id &&
//         user && (
//           <ChatBox
//             interestId={property.active_interest_id}
//             currentUser={user.username}
//           />
//         )}
//     </div>
//   );
// }
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchPropertyDetail, createInterest } from "../../api/propertyApi";
import ChatBox from "../../components/ChatBox";
import { AuthContext } from "../../auth/AuthContext";

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interestLoading, setInterestLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch property details
  useEffect(() => {
    setLoading(true);
    fetchPropertyDetail(id)
      .then((res) => {
        setProperty(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load property");
        setLoading(false);
      });
  }, [id]);

  // Create interest
  const handleInterest = async () => {
    try {
      setInterestLoading(true);
      await createInterest(id);

      // re-fetch property to get interest_id
      const res = await fetchPropertyDetail(id);
      setProperty(res.data);
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        "Unable to create interest"
      );
    } finally {
      setInterestLoading(false);
    }
  };

  if (loading) {
    return <p className="p-4">Loading property...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* ---------------- Property Info ---------------- */}
      <h1 className="text-2xl font-bold mb-2">
        {property.title}
      </h1>

      <p className="text-gray-600 mb-1">
        {property.locality}, {property.city}
      </p>

      <p className="text-xl font-semibold text-blue-600 mb-4">
        ₹{Number(property.price).toLocaleString()}
      </p>

      <p className="mb-4">{property.description}</p>

      {/* ---------------- Interest Action ---------------- */}
      {user && user.role === "client" && (
        <div className="mb-6">
          {!property.is_interested ? (
            <button
              onClick={handleInterest}
              disabled={interestLoading}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {interestLoading ? "Processing..." : "I'm Interested"}
            </button>
          ) : (
            <span className="text-green-700 font-medium">
              ✅ Interest Submitted
            </span>
          )}
        </div>
      )}

      {/* ---------------- Live Chat ---------------- */}
      {property.is_interested &&
        property.active_interest_id &&
        user && (
          <ChatBox
            interestId={property.active_interest_id}
          />
        )}
    </div>
  );
}
