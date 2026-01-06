
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { updateProperty } from "../../api/sellerApi";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------------- FETCH PROPERTY ---------------- */
  useEffect(() => {
    axiosInstance
      .get(`/api/properties/seller/property/${id}/`)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load property");
        navigate("/seller");
      });
  }, [id, navigate]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNewImages = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();

    const ALLOWED_FIELDS = [
      "title",
      "description",
      "property_type",
      "price",
      "price_negotiable",
      "area_size",
      "area_unit",
      "property_age_years",
      "construction_year",
      "last_renovated_year",
      "ownership_count",
      "reason_for_selling",
      "city",
      "locality",
      "address",
      "latitude",
      "longitude",
      "bedrooms",
      "bathrooms",
      "parking_available",
      "furnishing_status",
      "facing",
      "status",
      "is_active",
    ];

    ALLOWED_FIELDS.forEach((key) => {
      const value = form[key];
      if (value === "" || value === null || value === undefined) return;
      formData.append(key, value);
    });

    // append new images
    newImages.forEach((img) => {
      formData.append("images", img);
    });

    try {
      await updateProperty(id, formData);
      navigate(`/seller/properties/${id}`);
    } catch (err) {
      console.error(err.response?.data);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">

          {/* HEADER */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-semibold text-slate-800">
              Edit Property
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Update property details and images
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ---------- IMAGES ---------- */}
            <Section title="Property Images">
              {form.images?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {form.images.map((img) => (
                    <div
                      key={img.id}
                      className="relative rounded-xl overflow-hidden border"
                    >
                      <img
                        src={img.image}
                        alt="property"
                        className="h-32 w-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
                        Existing
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 mb-4">
                  No images uploaded yet
                </p>
              )}

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImages}
                className="text-sm"
              />

              {newImages.length > 0 && (
                <p className="text-xs text-slate-500 mt-2">
                  {newImages.length} new image(s) selected
                </p>
              )}
            </Section>

            {/* ---------- BASIC INFO ---------- */}
            <Section title="Basic Information">
              <Grid>
                <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
                <Select name="property_type" value={form.property_type} onChange={handleChange}>
                  <option value="house">House</option>
                  <option value="flat">Flat</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </Select>
                <Textarea span name="description" value={form.description} onChange={handleChange} placeholder="Description" />
              </Grid>
            </Section>

            {/* ---------- PRICE & AREA ---------- */}
            <Section title="Pricing & Area">
              <Grid>
                <Input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" />
                <Checkbox name="price_negotiable" checked={form.price_negotiable} onChange={handleChange} label="Price Negotiable" />
                <Input name="area_size" value={form.area_size || ""} onChange={handleChange} placeholder="Area Size" />
                <Select name="area_unit" value={form.area_unit} onChange={handleChange}>
                  <option value="sqft">Sqft</option>
                  <option value="cent">Cent</option>
                </Select>
              </Grid>
            </Section>

            {/* ---------- LOCATION ---------- */}
            <Section title="Location">
              <Grid>
                <Input name="city" value={form.city} onChange={handleChange} placeholder="City" />
                <Input name="locality" value={form.locality} onChange={handleChange} placeholder="Locality" />
                <Textarea span name="address" value={form.address} onChange={handleChange} placeholder="Address" />
                <Input name="latitude" value={form.latitude || ""} onChange={handleChange} placeholder="Latitude" />
                <Input name="longitude" value={form.longitude || ""} onChange={handleChange} placeholder="Longitude" />
              </Grid>
            </Section>

            {/* ---------- FEATURES ---------- */}
            <Section title="Features & Status">
              <Grid>
                <Input name="bedrooms" value={form.bedrooms || ""} onChange={handleChange} placeholder="Bedrooms" />
                <Input name="bathrooms" value={form.bathrooms || ""} onChange={handleChange} placeholder="Bathrooms" />
                <Checkbox name="parking_available" checked={form.parking_available} onChange={handleChange} label="Parking Available" />
                <Input name="furnishing_status" value={form.furnishing_status || ""} onChange={handleChange} placeholder="Furnishing Status" />
                <Input name="facing" value={form.facing || ""} onChange={handleChange} placeholder="Facing" />
                <Select name="status" value={form.status} onChange={handleChange}>
                  <option value="published">Published</option>
                  <option value="sold">Sold</option>
                  <option value="archived">Archived</option>
                </Select>
              </Grid>
            </Section>

            {/* ---------- ACTION ---------- */}
            <div className="p-6 border-t bg-slate-50 flex justify-end">
              <button
                disabled={saving}
                className="
                  px-8 py-3 rounded-xl
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  text-white font-semibold
                  hover:from-indigo-700 hover:to-purple-700
                  shadow-lg transition
                "
              >
                {saving ? "Updating..." : "Update Property"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function Section({ title, children }) {
  return (
    <div className="p-6 border-b last:border-b-0">
      <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
    />
  );
}

function Textarea({ span, ...props }) {
  return (
    <textarea
      {...props}
      rows="3"
      className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${
        span ? "md:col-span-2" : ""
      }`}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
    />
  );
}

function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}
