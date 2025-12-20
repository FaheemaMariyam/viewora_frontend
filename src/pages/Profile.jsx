import { useEffect, useState } from "react";
import { getProfile } from "../api/authApi";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then((res) => setProfile(res.data));
  }, []);

  return <pre>{JSON.stringify(profile, null, 2)}</pre>;
};

export default Profile;
