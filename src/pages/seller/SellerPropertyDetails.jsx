
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function SellerPropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/api/properties/seller/property/${id}/`)
      .then((res) => {
        setProperty(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!property) return <p className="p-6 text-red-600">Property not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* SINGLE LUXURY CARD */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">

          {/* Images */}
          <div className="p-6 border-b">
            {property.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt=""
                    className="h-44 w-full object-cover rounded-xl shadow-sm"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No images uploaded</p>
            )}
          </div>

          {/* Header */}
          <div className="p-6 border-b flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold text-slate-800">
                {property.title}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {property.address}
              </p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-indigo-700">
                ₹ {Number(property.price).toLocaleString()}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {property.price_negotiable ? "Negotiable" : "Fixed Price"}
              </p>
              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
                Status: {property.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <LuxurySection title="Description">
            <p className="text-slate-700 leading-relaxed">
              {property.description}
            </p>
          </LuxurySection>

          {/* Core Details */}
          <LuxurySection title="Core Details">
            <LuxuryGrid>
              <LuxuryItem label="Property Type" value={property.property_type} />
              <LuxuryItem label="Area" value={`${property.area_size} ${property.area_unit}`} />
              <LuxuryItem label="Facing" value={property.facing || "-"} />
              <LuxuryItem label="Parking" value={property.parking_available ? "Yes" : "No"} />
              <LuxuryItem label="Furnishing" value={property.furnishing_status || "-"} />
              <LuxuryItem label="Active" value={property.is_active ? "Yes" : "No"} />
            </LuxuryGrid>
          </LuxurySection>

          {/* Property Meta */}
          <LuxurySection title="Property Meta">
            <LuxuryGrid>
              <LuxuryItem label="Bedrooms" value={property.bedrooms || "-"} />
              <LuxuryItem label="Bathrooms" value={property.bathrooms || "-"} />
              <LuxuryItem label="Property Age" value={property.property_age_years || "-"} />
              <LuxuryItem label="Ownership Count" value={property.ownership_count} />
              <LuxuryItem label="Reason for Selling" value={property.reason_for_selling || "-"} />
            </LuxuryGrid>
          </LuxurySection>

          {/* Location & Extra */}
          <LuxurySection title="Location & Additional Info">
            <LuxuryGrid>
              <LuxuryItem label="Latitude" value={property.latitude || "-"} />
              <LuxuryItem label="Longitude" value={property.longitude || "-"} />
              <LuxuryItem label="Construction Year" value={property.construction_year || "-"} />
              <LuxuryItem label="Last Renovated" value={property.last_renovated_year || "-"} />
            </LuxuryGrid>
          </LuxurySection>

          {/* Action */}
          <div className="p-6 border-t flex justify-end bg-slate-50">
            <button
              onClick={() => navigate(`/seller/edit-property/${property.id}`)}
              className="
                px-8 py-3 rounded-xl
                bg-gradient-to-r from-indigo-600 to-purple-600
                text-white font-semibold
                hover:from-indigo-700 hover:to-purple-700
                shadow-lg transition-all
              "
            >
              Edit Property
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------- Luxury UI Helpers ---------- */

function LuxurySection({ title, children }) {
  return (
    <div className="p-6 border-b last:border-b-0">
      <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function LuxuryGrid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {children}
    </div>
  );
}

function LuxuryItem({ label, value }) {
  return (
    <div className="rounded-lg border bg-white px-4 py-3 flex justify-between shadow-sm">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}
