import { FaArrowUp } from "react-icons/fa";

const MoveToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scroll effect
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="bg-[#013c44] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#02515c] transition-all flex items-center gap-2"
    >
      <FaArrowUp size={18} />
      <span>Back to Top</span>
    </button>
  );
};

export default MoveToTopButton;
