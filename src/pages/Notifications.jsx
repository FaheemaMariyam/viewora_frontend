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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-6">Notifications</h2>

      {notifications.length === 0 && (
        <p className="text-gray-500">No notifications</p>
      )}

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-4 mb-3 rounded-lg border ${
            n.is_read ? "bg-white" : "bg-indigo-50"
          }`}
        >
          <h4 className="font-medium">{n.title}</h4>
          <p className="text-sm text-gray-600">{n.body}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(n.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
