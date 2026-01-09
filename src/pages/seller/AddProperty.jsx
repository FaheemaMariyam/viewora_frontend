import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../../api/sellerApi";

export default function AddProperty() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    property_type: "house",
    price: "",
    price_negotiable: true,
    area_size: "",
    area_unit: "sqft",
    city: "",
    locality: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    parking_available: false,
    furnishing_status: "",
    facing: "",
    property_age_years: "",
    ownership_count: 1,
    reason_for_selling: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    images.forEach((img) => formData.append("images", img));

    try {
      await createProperty(formData);
      navigate("/seller");
    } catch {
      alert("Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Add New Property
          </h1>
          <p className="text-slate-400 mt-2">
            Provide accurate details to attract genuine buyers
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Property Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Title</label>
                  <input
                    name="title"
                    placeholder="Luxury 3BHK Villa"
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Property Type</label>
                  <select
                    name="property_type"
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="house">House</option>
                    <option value="flat">Flat</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="label">Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="₹ 85,00,000"
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Area Size</label>
                  <input
                    name="area_size"
                    placeholder="1800 sqft"
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">City</label>
                  <input
                    name="city"
                    placeholder="Bangalore"
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Locality</label>
                  <input
                    name="locality"
                    placeholder="Whitefield"
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label">Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Describe the property highlights, amenities, and surroundings..."
                onChange={handleChange}
                className="input resize-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="label">Full Address</label>
              <textarea
                name="address"
                rows="3"
                placeholder="Enter complete address"
                onChange={handleChange}
                className="input resize-none"
              />
            </div>

            {/* Images */}
            <div>
              <label className="label">Property Images</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-500 transition">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full cursor-pointer"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Upload high-quality images (multiple allowed)
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 flex justify-end">
              <button
                disabled={loading}
                className="
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  hover:from-indigo-700 hover:to-purple-700
                  text-white font-semibold px-8 py-3 rounded-xl
                  shadow-lg disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all
                "
              >
                {loading ? "Creating Property..." : "Create Property"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tailwind helpers */}
      <style>
        {`
          .label {
            @apply block text-sm font-medium text-slate-700 mb-1;
          }
          .input {
            @apply w-full rounded-lg border border-slate-300 px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            focus:border-indigo-500 bg-white;
          }
        `}
      </style>
    </div>
  );
}
