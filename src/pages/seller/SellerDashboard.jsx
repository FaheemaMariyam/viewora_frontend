import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProperties, toggleArchiveProperty } from "../../api/sellerApi";
import SellerPropertyCard from "./SellerPropertycard";

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
      console.error(err);
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
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">
              Seller Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Manage and track your property listings
            </p>
          </div>

          <button
            onClick={() => navigate("/seller/add-property")}
            className="
              px-6 py-3 rounded-xl
              bg-gradient-to-r from-indigo-600 to-purple-600
              text-white font-semibold
              hover:from-indigo-700 hover:to-purple-700
              shadow-lg transition
            "
          >
            + Add Property
          </button>
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
                 <button
  onClick={async () => {
    const permission = await Notification.requestPermission();
    console.log("Permission:", permission);
  }}
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
>
  Enable Notifications
</button>
          {properties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 mb-4">
                You haven’t listed any properties yet.
              </p>
              <button
                onClick={() => navigate("/seller/add-property")}
                className="
                  px-6 py-3 rounded-lg
                  bg-indigo-600 text-white
                  hover:bg-indigo-700 transition
                "
              >
                Create Your First Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <SellerPropertyCard
                  key={property.id}
                  property={property}
                  onToggle={handleToggleArchive}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
