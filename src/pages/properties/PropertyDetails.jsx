import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchPropertyDetail, createInterest } from "../../api/propertyApi";
import ChatBox from "../../components/ChatBox";
import { AuthContext } from "../../auth/AuthContext";

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interestLoading, setInterestLoading] = useState(false);

  useEffect(() => {
    fetchPropertyDetail(id).then((res) => {
      setProperty(res.data);
      if (res.data.images?.length) {
        setActiveImage(res.data.images[0].image);
      }
      setLoading(false);
    });
  }, [id]);

  const handleInterest = async () => {
    setInterestLoading(true);
    await createInterest(id);
    const res = await fetchPropertyDetail(id);
    setProperty(res.data);
    setInterestLoading(false);
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!property) return <p className="p-6 text-red-600">Property not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white/95 rounded-2xl shadow-2xl overflow-hidden">
        {/* IMAGE GALLERY */}
        <div className="p-6 border-b">
          {activeImage && (
            <img
              src={activeImage}
              alt={property.title}
              className="w-full h-[420px] object-cover rounded-xl mb-4"
            />
          )}

          <div className="flex gap-3 overflow-x-auto">
            {property.images?.map((img) => (
              <img
                key={img.id}
                src={img.image}
                onClick={() => setActiveImage(img.image)}
                className={`h-20 w-28 object-cover rounded-lg cursor-pointer border-2 ${
                  activeImage === img.image
                    ? "border-indigo-600"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* HEADER */}
        <Section>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">{property.title}</h1>
              <p className="text-slate-500 mt-1">{property.address}</p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-indigo-700">
                ₹ {Number(property.price).toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">
                {property.price_negotiable ? "Negotiable" : "Fixed Price"}
              </p>
              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-slate-100">
                {property.status}
              </span>
            </div>
          </div>
        </Section>

        {/* DESCRIPTION */}
        <Section title="Description">{property.description}</Section>

        {/* DETAILS GRID */}
        <Section title="Property Details">
          <Grid>
            <Item label="Property Type" value={property.property_type} />
            <Item
              label="Area"
              value={`${property.area_size} ${property.area_unit}`}
            />
            <Item label="Bedrooms" value={property.bedrooms ?? "-"} />
            <Item label="Bathrooms" value={property.bathrooms ?? "-"} />
            <Item
              label="Parking"
              value={property.parking_available ? "Yes" : "No"}
            />
            <Item
              label="Furnishing"
              value={property.furnishing_status ?? "-"}
            />
            <Item label="Facing" value={property.facing ?? "-"} />
            <Item
              label="Property Age"
              value={property.property_age_years ?? "-"}
            />
            <Item label="Ownership Count" value={property.ownership_count} />
            <Item
              label="Construction Year"
              value={property.construction_year ?? "-"}
            />
            <Item
              label="Last Renovated"
              value={property.last_renovated_year ?? "-"}
            />
            <Item
              label="Reason for Selling"
              value={property.reason_for_selling ?? "-"}
            />
          </Grid>
        </Section>

        {/* LOCATION */}
        <Section title="Location">
          <Grid>
            <Item label="City" value={property.city} />
            <Item label="Locality" value={property.locality} />
            <Item label="Latitude" value={property.latitude ?? "-"} />
            <Item label="Longitude" value={property.longitude ?? "-"} />
          </Grid>
        </Section>

        {/* INTEREST */}
        {user?.role === "client" && (
          <Section title="Interest">
            {!property.is_interested ? (
              <button
                onClick={handleInterest}
                disabled={interestLoading}
                className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
              >
                {interestLoading ? "Processing..." : "I'm Interested"}
              </button>
            ) : (
              <span className="inline-block px-4 py-2 rounded-full bg-green-50 text-green-700 font-medium border">
                ✓ Interest Submitted
              </span>
            )}
          </Section>
        )}

        {/* LIVE CHAT */}
        {property.is_interested && property.active_interest_id && user && (
          <Section title="Live Chat">
            <ChatBox interestId={property.active_interest_id} />
          </Section>
        )}
      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function Section({ title, children }) {
  return (
    <div className="p-6 border-b last:border-b-0">
      {title && (
        <h2 className="text-xs font-semibold uppercase text-slate-500 mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
  );
}

function Item({ label, value }) {
  return (
    <div className="rounded-lg border bg-white px-4 py-3 flex justify-between shadow-sm">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
