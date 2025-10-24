import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthorProfile from "../components/AuthorProfile";
import ReaderProfile from "../components/ReaderProfile";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    fetchUserProfile();
  }, []);

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  // ✅ Role-based UI
  return user.role === "author" ? (
    <AuthorProfile user={user} />
  ) : (
    <ReaderProfile user={user} />
  );
};

export default Profile;
