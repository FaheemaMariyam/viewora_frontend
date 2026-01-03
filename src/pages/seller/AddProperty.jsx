import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../../api/sellerApi";

export default function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    const data = {
      title: form.title.value,
      description: form.description.value,
      price: form.price.value,
      city: form.city.value,
      locality: form.locality.value,
      property_type: form.property_type.value,
      area_size: form.area_size.value,
    };

    try {
      await createProperty(data);
      navigate("/seller");
    } catch {
      alert("Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-slate-100">
      <h1 className="text-xl font-semibold mb-6">
        Add New Property
      </h1>

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow max-w-lg space-y-4"
      >
        <input name="title" placeholder="Title" required />
        <input name="city" placeholder="City" required />
        <input name="locality" placeholder="Locality" required />
        <input name="price" type="number" placeholder="Price" required />
        <input name="area_size" type="number" placeholder="Area size" required />

        <select name="property_type">
          <option value="house">House</option>
          <option value="flat">Flat</option>
          <option value="plot">Plot</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
        />

        <button
          disabled={loading}
          className="w-full py-2 bg-indigo-600 text-white rounded"
        >
          {loading ? "Saving..." : "Create Property"}
        </button>
      </form>
    </div>
  );
}
