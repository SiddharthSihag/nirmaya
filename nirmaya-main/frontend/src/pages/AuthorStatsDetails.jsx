import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  MessageSquare,
  ThumbsUp,
  ArrowLeft,
  Search,
  Trash2,
  Globe,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import userLogo from "../assets/user.jpg";

const AuthorStatsDetails = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [publishTarget, setPublishTarget] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [publishFilter, setPublishFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/blog/get-own-blogs",
          { withCredentials: true }
        );
        if (res.data.success) {
          setBlogs(res.data.blogs);
          setFilteredBlogs(res.data.blogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const deleteBlog = async () => {
    if (!deleteTarget) return;
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/blog/${deleteTarget}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Blog deleted successfully!");
        const updatedBlogs = blogs.filter((b) => b._id !== deleteTarget);
        setBlogs(updatedBlogs);
        setFilteredBlogs(updatedBlogs);
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog");
    }
  };

  const togglePublish = async (blogId, currentStatus) => {
    try {
      const endpoint = `http://localhost:8000/api/v1/blog/${blogId}/toggle-publish?publish=${!currentStatus}`;
      const res = await axios.patch(endpoint, {}, { withCredentials: true });

      if (res.data.success) {
        toast.success(
          !currentStatus
            ? "Blog published successfully!"
            : "Blog unpublished successfully!"
        );
        const updated = blogs.map((b) =>
          b._id === blogId ? { ...b, isPublished: !currentStatus } : b
        );
        setBlogs(updated);
        setFilteredBlogs(updated);
        setPublishTarget(null);
      }
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("Failed to change publish status");
    }
  };

  useEffect(() => {
    let filtered = blogs.filter((b) => {
      const matchesTitle = b.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || b.category === categoryFilter;
      const matchesPublish =
        publishFilter === "all" ||
        (publishFilter === "published" && b.isPublished) ||
        (publishFilter === "unpublished" && !b.isPublished);

      return matchesTitle && matchesCategory && matchesPublish;
    });

    switch (sortBy) {
      case "views":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "likes":
        filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        break;
      case "comments":
        filtered.sort(
          (a, b) => (b.commentsCount || 0) - (a.commentsCount || 0)
        );
        break;
      case "date":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredBlogs(filtered);
  }, [searchTerm, sortBy, blogs, categoryFilter, publishFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="w-10 h-10 text-gray-600 animate-spin" />
        <p className="text-gray-600 text-lg font-semibold animate-pulse">
          Fetching your blogs...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-20 md:ml-[320px] min-h-screen px-6">
      {/* Back Button */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Profile</span>
        </button>
      </div>

      {/* Header Section */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 w-full">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            📊 All Articles
          </h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 w-full flex-wrap">
            <div className="relative w-full md:w-52">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select onValueChange={setSortBy} defaultValue="date">
              <SelectTrigger className="w-full md:w-[140px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Newest</SelectItem>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="likes">Likes</SelectItem>
                <SelectItem value="comments">Comments</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Common Conditions">
                  Common Conditions
                </SelectItem>
                <SelectItem value="Mental Health">Mental Health</SelectItem>
                <SelectItem value="Skin and hair health">
                  Skin and hair health
                </SelectItem>
                <SelectItem value="Lifestyle and Nutrition">
                  Lifestyle and Nutrition
                </SelectItem>
                <SelectItem value="Substance use and addictions">
                  Substance use and addictions
                </SelectItem>
                <SelectItem value="Emergency Conditions">
                  Emergency Conditions
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={publishFilter} onValueChange={setPublishFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blogs</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="unpublished">Unpublished</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={() => {
                setSearchTerm("");
                setSortBy("date");
                setCategoryFilter("all");
                setPublishFilter("all");
                setFilteredBlogs(blogs);
              }}
              className="w-full md:w-auto px-4 py-2 bg-black text-white dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-900 dark:hover:bg-gray-600 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Blog List */}
        <div className="space-y-6">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden flex flex-col md:flex-row gap-6 p-4 border border-gray-200 dark:border-gray-700"
              >
                {/* Thumbnail */}
                <div className="md:w-1/3 w-full">
                  <img
                    src={blog.thumbnail || userLogo}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Blog Details */}
                <div className="md:w-2/3 w-full flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="text-xl font-semibold text-blue-600 hover:underline"
                    >
                      {blog.title}
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                      {blog.subtitle}
                    </p>

                    {blog.category && (
                      <div className="mt-3">
                        <Badge variant="secondary">{blog.category}</Badge>
                      </div>
                    )}
                  </div>

                                      {/* ✅ Action Buttons (Restored) */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {/* View */}
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      View
                    </Link>

                    {/* Edit */}
                    <Link
                      to={`/dashboard/write-blog/${blog._id}`}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                    >
                      Edit
                    </Link>

                    {/* Publish / Unpublish */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() => setPublishTarget(blog._id)}
                          className={`px-4 py-2 text-sm rounded-lg transition flex items-center gap-2 ${
                            blog.isPublished
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                          }`}
                        >
                          {blog.isPublished ? (
                            <>
                              <EyeOff className="h-4 w-4" /> Unpublish
                            </>
                          ) : (
                            <>
                              <Globe className="h-4 w-4" /> Publish
                            </>
                          )}
                        </button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {blog.isPublished
                              ? "Unpublish this blog?"
                              : "Publish this blog?"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {blog.isPublished
                              ? "Are you sure you want to unpublish this blog? It will no longer be visible publicly."
                              : "Are you sure you want to publish this blog? It will become visible to everyone."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              togglePublish(blog._id, blog.isPublished)
                            }
                            className={`${
                              blog.isPublished
                                ? "bg-yellow-600 hover:bg-yellow-700"
                                : "bg-purple-600 hover:bg-purple-700"
                            }`}
                          >
                            {blog.isPublished
                              ? "Yes, Unpublish"
                              : "Yes, Publish"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Delete */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() => setDeleteTarget(blog._id)}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this blog?{" "}
                            <span className="text-red-500">This cannot be undone.</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteBlog()}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Yes, Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap justify-between items-center mt-4 text-sm">
                    <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-blue-500" />{" "}
                        {blog.views || 0} Views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-pink-500" />{" "}
                        {blog.likes?.length || 0} Likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-green-500" />{" "}
                        {blog.commentsCount || 0} Comments
                      </span>
                    </div>

                    <p className="text-xs italic text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>


                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No blogs found. Try adjusting filters or search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorStatsDetails;
