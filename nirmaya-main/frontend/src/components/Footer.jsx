
import React from "react";
import { useNavigate } from "react-router-dom";
import footerLogo from "../assets/footerlogo.jpg";
import { FaFacebook, FaInstagram, FaLink, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  // ✅ Smooth scroll and navigate
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
  <div className="max-w-7xl mx-auto px-6 flex flex-wrap lg:flex-nowrap justify-between gap-10">
    {/* ─────────────── Info Section ─────────────── */}
    <div className="w-full lg:w-[35%] flex flex-col space-y-2">
      <div className="flex items-center gap-3">
        <img src={footerLogo} alt="Niramaya Care" className="w-16 h-16" />
        <h2 className="text-2xl font-bold text-white">Nirmaya Care</h2>
      </div>
      <p className="text-sm leading-relaxed">
        Helping you live healthier, confidently informed.
      </p>

      <div className="space-y-1 text-sm">
        <p>Hisar, Haryana</p>
        <p>
          Email:{" "}
          <a
            href="mailto:nirmayacare01@gmail.com"
            className="hover:text-blue-400"
          >
            dr.raghav@nirmayacare.com

          </a>
        </p>
        <p>Phone: +91 91086 30772</p>
      </div>
    </div>

    {/* ─────────────── Quick Links ─────────────── */}
    <div className="w-full lg:w-[15%] flex flex-col space-y-2 mt-5">
      <h3 className="text-xl font-semibold text-white">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li
          onClick={() => handleNavigation("/")}
          className="cursor-pointer hover:text-blue-400 transition"
        >
          Home
        </li>
        <li
          onClick={() => handleNavigation("/blogs")}
          className="cursor-pointer hover:text-blue-400 transition"
        >
          Articles
        </li>
        <li
          onClick={() => handleNavigation("/about")}
          className="cursor-pointer hover:text-blue-400 transition"
        >
          About Us
        </li>
        <li
          onClick={() => handleNavigation("/faqs")}
          className="cursor-pointer hover:text-blue-400 transition"
        >
          FAQs
        </li>
      </ul>
    </div>

    {/* ─────────────── Social Media ─────────────── */}
    <div className="w-full lg:w-[15%] flex flex-col space-y-2 mt-5">
      <h3 className="text-xl font-semibold text-white">Follow Us</h3>
      <p className="text-sm">
        Stay connected with us.
      </p>
      <div className="flex space-x-5 text-xl mt-2">
        <a
          href="https://www.instagram.com/niramaya.care/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.facebook.com/yourProfile"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition"
        >
          <FaFacebook />
        </a>
        <a
          href="https://x.com/Niramaya__Care"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-sky-400 transition"
        >
          <FaTwitter />
        </a>
        <a
          href="https://www.linkedin.com/in/niramaya-care-770205384/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition"
        >
          <FaLinkedin />
        </a>
      </div>
    </div>

    {/* ─────────────── Newsletter ─────────────── */}
  <div className="w-full lg:w-[35%] flex flex-col space-y-2 mt-5">
  <h3 className="text-xl font-semibold text-white">Join Our Team</h3>
  <p className="text-sm text-gray-300">
    Together, let’s build a healthier, better-informed community.
  </p>

  <button
    onClick={() => window.open("https://forms.gle/UHPBhCMmhjgaXEEFA", "_blank")}
    className="w-fit bg-red-600 hover:bg-[#01545b] transition-colors text-white font-semibold text-sm px-8 py-2 rounded-lg shadow-md"
  >
    Apply Now
  </button>
</div>

  </div>



  {/* ─────────────── Footer Bottom ─────────────── */}
  <div className="mt-10 border-t border-gray-700 pt-5 text-center text-sm text-gray-400">
   <p > The textual content on this website is written and edited by humans, with no AI involvement.</p>

    <p className="mt-5">
      Made in Haryana ❤️ | &copy; {new Date().getFullYear()}{" "}
      <span className="text-white font-semibold">Nirmaya Care</span>. All
      rights reserved.
    </p>
  </div>
</footer>

  );
};

export default Footer;
