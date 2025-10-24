
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setBlog } from "../redux/blogSlice";
import BlogCard from "../components/BlogCard";
import ScrollToTopButton from "../components/ScrollToTopButton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";

const Blog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { blog: blogs } = useSelector((store) => store.blog);

  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch All Blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/blog/get-published-blogs", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlogs();
  }, [dispatch]);

  // ✅ Handle Query Params (for Author redirect)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");

    if (searchQuery) {
      setSearchTerm(searchQuery);
    } else {
      setSearchTerm("");
    }
  }, [location.search]);

  // ✅ Filter, Sort, and Search
  useEffect(() => {
    if (!blogs) return;

    let updated = [...blogs];

    // ✅ Filter by category
    if (categoryFilter !== "all") {
      updated = updated.filter((b) => b.category === categoryFilter);
    }

    // ✅ Search by title, subtitle, or author name
    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      updated = updated.filter(
        (b) =>
          b.title.toLowerCase().includes(lower) ||
          b.subtitle.toLowerCase().includes(lower) ||
          `${b.author.firstName} ${b.author.lastName}`.toLowerCase().includes(lower)
      );
    }

    // ✅ Sort
    switch (sortBy) {
      case "views":
        updated.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "likes":
        updated.sort(
          (a, b) =>
            (Array.isArray(b.likes) ? b.likes.length : 0) -
            (Array.isArray(a.likes) ? a.likes.length : 0)
        );
        break;
      case "comments":
        updated.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
        break;
      default:
        updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredBlogs(updated);
  }, [blogs, sortBy, categoryFilter, searchTerm]);

  // ✅ Reset everything
  const handleReset = () => {
    setSortBy("date");
    setCategoryFilter("all");
    setSearchTerm("");
    navigate("/blogs"); // clear URL params
  };

  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center py-10 px-4 gap-4 flex-wrap">
  
  {/* Left Side - Title */}
  <h1 className="text-3xl md:text-4xl font-bold text-left w-full md:w-auto">
    Our Articles
  </h1>

  {/* Right Side - Controls */}
  <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">

    {/* Search Bar */}
    <input
      type="text"
      placeholder="Search by title, subtitle, or author name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full md:w-[260px] px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
    />

    {/* Sort Dropdown */}
    <Select onValueChange={setSortBy} value={sortBy}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date">Newest</SelectItem>
        <SelectItem value="views">Views</SelectItem>
        <SelectItem value="likes">Likes</SelectItem>
        <SelectItem value="comments">Comments</SelectItem>
      </SelectContent>
    </Select>

    {/* Category Dropdown */}
    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        <SelectItem value="Common Conditions">Common Conditions</SelectItem>
        <SelectItem value="Mental Health">Mental Health</SelectItem>
        <SelectItem value="Skin and hair health">Skin and hair health</SelectItem>
        <SelectItem value="Lifestyle and Nutrition">Lifestyle and Nutrition</SelectItem>
        <SelectItem value="Substance use and addictions">Substance use and addictions</SelectItem>
        <SelectItem value="Substance use and addictions">Emergency Conditions</SelectItem>
      </SelectContent>
    </Select>

    {/* Reset Button */}
    <button
      onClick={handleReset}
      className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-900 transition"
    >
      Reset
    </button>
  </div>
    <hr className="w-full border-2 border-[#013c44] rounded-full" />

</div>


      {/* ✅ Blog Grid */}
      <div className="max-w-7xl mx-auto grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 py-10 px-4 md:px-0">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((b, i) => <BlogCard key={i} blog={b} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">No articles found.</p>
        )}
      </div>

      {/* Scroll to top */}
      <div className="flex justify-center my-8">
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default Blog;
