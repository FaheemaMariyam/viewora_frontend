import { useEffect, useState } from "react";
import { fetchAdminUsers, toggleUserStatus } from "../../api/authApi";
import AdminLayout from "../../components/admin/AdminLayout";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminUsers({ search });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const handleToggleStatus = async (user) => {
    try {
      const res = await toggleUserStatus(user.id);
      toast.success(`${user.username} is now ${res.data.is_active ? 'Active' : 'Blocked'}`);
      loadUsers();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    blocked: users.filter(u => !u.is_active).length
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Platform Users" value={stats.total} icon="👥" color="blue" />
          <StatCard title="Active Accounts" value={stats.active} icon="✅" color="green" />
          <StatCard title="Blocked / Restricted" value={stats.blocked} icon="🚫" color="red" />
        </div>

        {/* Filters and Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900">User Directory</h3>
            
            <div className="relative group w-full md:w-80">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors">🔍</span>
              <input 
                type="text"
                placeholder="Search by name, email or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Account Type</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4">Account Access</th>
                  <th className="px-6 py-4 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 overflow-auto max-h-screen">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
                          {u.username[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{u.username}</span>
                          <span className="text-xs text-gray-400">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        u.role === 'broker' ? 'bg-purple-50 text-purple-600' : 
                        u.role === 'seller' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5">
                         {u.is_admin_approved ? (
                           <span className="text-green-600 text-xs flex items-center">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-600 mr-2 shadow-[0_0_8px_rgba(22,163,74,0.6)]"></div>
                             Verified
                           </span>
                         ) : (
                           <span className="text-gray-400 text-xs">Pending Review</span>
                         )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-xs font-medium ${u.is_active ? 'text-green-700' : 'text-red-500'}`}>
                        {u.is_active ? (
                          <span className="flex items-center italic">
                             <span className="relative flex h-2 w-2 mr-2">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                             </span>
                            Active
                          </span>
                        ) : 'Restricted'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`text-[11px] font-bold px-4 py-1.5 rounded-lg border transition-all ${
                          u.is_active 
                          ? 'border-red-100 text-red-600 hover:bg-red-500 hover:text-white' 
                          : 'border-green-100 text-green-600 hover:bg-green-500 hover:text-white'
                        }`}
                      >
                        {u.is_active ? 'Block Access' : 'Grant Access'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && !loading && (
              <div className="p-12 text-center text-gray-400 italic">
                No users matched your current search criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600"
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}
