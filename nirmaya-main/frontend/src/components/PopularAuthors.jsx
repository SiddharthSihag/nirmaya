import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import userLogo from "../assets/user.jpg";

const PopularAuthors = () => {
  const [allAuthors, setAllAuthors] = useState([]);
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3); // responsive

  const navigate = useNavigate();

  // Fetch all authors
  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/all-users");
      if (res.data.success) {
        const authors = res.data.users.filter((u) => u.role === "author");
        setAllAuthors(authors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // ✅ Make visibleCount responsive and keep slider math consistent
  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);       // <sm
      else if (w < 768) setVisibleCount(2);  // sm
      else setVisibleCount(3);               // md+
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  // ✅ Clamp index when visibleCount or data changes
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, allAuthors.length - visibleCount)));
  }, [visibleCount, allAuthors.length]);

  // Slider controls
  const next = () => {
    if (index + visibleCount < allAuthors.length) {
      setIndex((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  // Navigate
  const goToAuthor = (user) => {
    const id = `${user.firstName}-${user.lastName}`.toLowerCase().replace(/\s+/g, "-");
    navigate(`/about#${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto my-16 px-4">
      {/* Title */}
      <div className="flex flex-col space-y-4 items-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Meet Our Collaborators</h1>
        <hr className="w-24 text-center border-2 border-red-500 rounded-full" />
        <p className="text-gray-600 dark:text-gray-400 max-w-xl">
          Behind every article stands a doctor’s voice - sharing cases, insights and insights  that bring wellness into everyday life.
Meet our collaborators, a group of passionate medical professionals, ready to inspire, guide, and connect with you.
        </p>
      </div>

      {/* Slider */}
      <div className="flex items-center justify-center gap-4 my-10">
        {/* Left Arrow */}
        {index > 0 && (
          <button
            onClick={prev}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Viewport */}
        <div className="relative w-full overflow-hidden">
          {/* Rail */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * (100 / visibleCount)}%)` }}
          >
            {allAuthors.map((user, idx) => (
              <div
                key={idx}
                onClick={() => goToAuthor(user)}
                className="flex flex-col items-center flex-shrink-0 px-4 cursor-pointer group"
                // ✅ Each card width matches the math: 100 / visibleCount %
                style={{ flex: `0 0 ${100 / visibleCount}%` }}
              >
                {/* Circular Profile (responsive sizes, stays perfectly round) */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110">
                  <img
                    src={user?.photoUrl || userLogo}
                    alt={user?.firstName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Author Info */}
                <div className="mt-4 text-center">
                  <h2 className="font-bold text-lg text-gray-800 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {user?.occupation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        {index + visibleCount < allAuthors.length && (
          <button
            onClick={next}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PopularAuthors;
