import { useEffect, useState, useContext } from "react";
import {
  getNotifications,
  markNotificationsRead,
} from "../api/notificationApi";
import { AuthContext } from "../auth/AuthContext";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const { setTotalUnread } = useContext(AuthContext);

  useEffect(() => {
    const load = async () => {
      const res = await getNotifications();
      setNotifications(res.data);

      await markNotificationsRead();
      setTotalUnread(0);
    };

    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-brand-primary">Notifications</h2>
          <p className="text-text-muted text-sm mt-1">Stay updated with your property activities</p>
        </div>
        <button 
           className="text-xs text-brand-accent font-medium hover:underline"
           onClick={() => setNotifications([])} // Optional: Clear UI
        >
          Clear All
        </button>
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-400">You're all caught up! No new notifications.</p>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`
              p-4 rounded-md border transition-all duration-200
              ${n.is_read ? "bg-white border-gray-200" : "bg-blue-50 border-blue-100 shadow-sm"}
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`font-semibold text-sm ${n.is_read ? "text-text-main" : "text-brand-primary"}`}>
                  {n.title}
                </h4>
                <p className="text-sm text-text-muted mt-1 leading-relaxed">
                  {n.body}
                </p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                {new Date(n.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
