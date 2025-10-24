import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import aboutImg from "../assets/3.jpg";
import ScrollToTopButton from "../components/ScrollToTopButton";
import userLogo from "../assets/user.jpg";
import { toast } from "sonner";
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";

const About = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);

  // ✅ Fetch authors dynamically
  const fetchAuthors = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/all-users");
      if (res.data.success) {
        const filteredAuthors = res.data.users.filter((u) => u.role === "author");
        setAuthors(filteredAuthors);
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  // ✅ Scroll to section if hash present
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location, authors]);

  const handleSocialClick = (url, platform) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      toast.info(`${platform} link does not exist.`);
    }
  };

  return (
    <div className="min-h-screen pt-28 px-4 md:px-6 lg:px-0 mb-10">
  <div className="max-w-6xl mx-auto">
  {/* Header Section */}
  <div className="text-center">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
      About Nirmaya Care
    </h1>
    <p className="text-base sm:text-lg">
      "Nurturing minds, inspiring change, and shaping a healthier tomorrow."
    </p>
  </div>

  {/* Image + Text Section */}
  <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    {/* ✅ Image */}
    <div className="flex justify-center items-center">
      <img
        src={aboutImg}
        alt="Blog Illustration"
        className="w-full h-[90%] object-cover rounded-2xl shadow-md my-auto"
      />
    </div>

    {/* ✅ Text */}
    <div className="flex flex-col justify-center space-y-4 text-base sm:text-lg">
      <p>
        Nirmaya Care is a trusted public health library empowering communities
        through reliable, evidence-based information. We bring clarity to
        complex health topics by translating research and national data into
        practical, easy-to-understand insights.
      </p>

      <p>
        Our mission is to promote prevention, early awareness, and wellness,
        helping individuals make informed decisions for healthier lives. Rooted
        in Indian biostatistics and national health datasets, our work reflects
        the realities of a population that represents one-sixth of the world.
      </p>

      <p>
        Nirmaya Care believes that informed communities are healthier. Through
        accessible articles and expert perspectives, we bridge the gap between
        medical science and public understanding.
      </p>
      <p>
We strive to make credible health knowledge accessible to all, fostering a culture of awareness, empathy, and collective well-being.
 Together, we’re building a future where knowledge inspires action and every individual feels empowered to take charge of their health.
      </p>

      
    </div>
  </div>

  {/* Footer Quote */}
  <div className="mt-14 text-center">
    <blockquote className="text-xl sm:text-2xl italic text-gray-500">
      "Bringing wellness to the heart of every community we touch"
    </blockquote>
  </div>
</div>



      <hr className="border-t-2 border-black my-10" />

      {/* Collaborators Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8">
            Meet Our Team:
          </h2>
        </div>

        {authors.length > 0 ? (
          authors.map((person, index) => {
            const personId = `${person.firstName}-${person.lastName}`
              .toLowerCase()
              .replace(/\s+/g, "-");

            return (
              <div key={index} id={personId} className="mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
                  {/* Profile Image */}
                  <div className="flex justify-center">
                    <img
                      src={person.photoUrl || userLogo}
                      alt={person.firstName}
                      className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 object-cover rounded-full shadow-md"
                    />
                  </div>

                  {/* Info */}
                  <div className="px-2 sm:px-4">
                    <h1 className="text-xl sm:text-2xl font-bold">
                      {person.firstName} {person.lastName}
                    </h1>
                    {person.occupation && (
                      <h2 className="mb-2 text-base sm:text-lg font-semibold">
                        {person.occupation}
                      </h2>
                    )}
                    <p className="text-base sm:text-lg mb-4">
                      {person.bio ||
                        "This author hasn’t written a bio yet. Stay tuned!"}
                    </p>
                    {person.quote && (
                      <blockquote className="text-lg sm:text-xl italic text-gray-500">
                        {person.quote}
                      </blockquote>
                    )}
                  </div>
                </div>

                {/* ✅ Social + Button Row */}
                {/* ✅ Social + Button Row */}
                <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4 mt-6 md:mt-4 md:ml-2 lg:ml-50">
                  {/* Social Icons */}
                  <div className="flex gap-4 md:gap-5 order-1 md:order-none">
                    <FaInstagram
                      size={22}
                      onClick={() =>
                        handleSocialClick(person.instagram, "Instagram")
                      }
                      className="text-pink-500 hover:text-pink-600 transition cursor-pointer"
                    />
                    <FaFacebook
                      size={22}
                      onClick={() =>
                        handleSocialClick(person.website, "Facebook")
                      }
                      className="text-gray-600 hover:text-gray-800 transition cursor-pointer"
                    />
                    <FaTwitter
                      size={22}
                      onClick={() =>
                        handleSocialClick(person.twitter, "Twitter")
                      }
                      className="text-sky-500 hover:text-sky-700 transition cursor-pointer"
                    />
                    <FaLinkedin
                      size={22}
                      onClick={() =>
                        handleSocialClick(person.linkedin, "LinkedIn")
                      }
                      className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                    />
                  </div>

                  {/* Articles Button */}
                  <button
                    onClick={() => {
                      navigate(
                        `/blogs?search=${encodeURIComponent(
                          person.firstName + " " + person.lastName
                        )}`
                      );
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-5 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-900 transition w-full sm:w-auto md:ml-6 lg:ml-60"
                  >
                    See all articles by {person.firstName}
                  </button>
                </div>


                {/* Separator */}
                {index !== authors.length - 1 && (
                  <hr className="w-full mt-10 border-t-2 border-gray-300" />
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No collaborators found.
          </p>
        )}
      </div>

      {/* Scroll to top */}
      <div className="flex justify-center my-10">
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default About;
