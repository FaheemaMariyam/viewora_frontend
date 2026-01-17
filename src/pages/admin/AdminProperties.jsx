import { useEffect, useState } from "react";
import { fetchAdminProperties, togglePropertyStatus } from "../../api/authApi";
import AdminLayout from "../../components/admin/AdminLayout";
import { toast } from "react-toastify";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminProperties({ search });
      setProperties(res.data);
    } catch (err) {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [search]);

  const handleToggleStatus = async (prop) => {
    try {
      await togglePropertyStatus(prop.id);
      toast.success(`Listing status updated`);
      loadProperties();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">Inventory Management</h2>
          <div className="relative group w-80">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors">🔍</span>
            <input 
              type="text"
              placeholder="Search by title, city or seller..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Seller</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 flex-shrink-0">
                          {p.cover_image ? (
                            <img src={p.cover_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">🏠</div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{p.title}</span>
                          <span className="text-[10px] text-brand-primary font-bold uppercase">{p.property_type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      @{p.seller_username}
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs text-gray-500">{p.locality}, {p.city}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                      ₹{p.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {p.is_active ? 'Live' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleToggleStatus(p)}
                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
                          p.is_active 
                          ? 'border-red-100 text-red-600 hover:bg-red-500 hover:text-white'
                          : 'border-green-100 text-green-600 hover:bg-green-500 hover:text-white'
                        }`}
                      >
                        {p.is_active ? 'Block Listing' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {properties.length === 0 && !loading && (
              <div className="p-12 text-center text-gray-400 italic">No listings found.</div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
