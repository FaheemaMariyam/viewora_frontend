import { useEffect, useState } from "react";
import { fetchAdminStats } from "../../api/authApi";
import AdminLayout from "../../components/admin/AdminLayout";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchAdminStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !stats) return <AdminLayout>Computing platform metrics...</AdminLayout>;

  // Prepare Chart Data
  const userData = [
    { name: "Clients", value: stats.users.client },
    { name: "Sellers", value: stats.users.seller },
    { name: "Brokers", value: stats.users.broker },
  ];

  const propertyData = [
    { name: "Houses", count: stats.properties.house },
    { name: "Plots", count: stats.properties.plot },
  ];

  const cityData = stats.city_stats.map(c => ({
    city: c.city,
    listings: c.count
  }));

  const COLORS = ["#0F172A", "#3B82F6", "#F59E0B"];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in zoom-in duration-500">
        <h2 className="text-2xl font-black text-gray-900">Platform Performance Insights</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* User Distribution */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">User Base Composition</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Distribution */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Inventory By Category</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* City Demand */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Top Geographic Listings</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="city" type="category" axisLine={false} tickLine={false} tick={{fill: '#1e293b', fontWeight: 'bold', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="listings" fill="#0F172A" radius={[0, 6, 6, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
