import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import React, { useRef, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Button } from '../components/ui/button'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setBlog } from '../redux/blogSlice'
import TiptapEditor from "../components/TiptapEditor";
import sanitizeHtml from "sanitize-html"; // ✅ added cleaner

const UpdateBlog = () => {
  const editor = useRef(null);

  const [loading, setLoading] = useState(false);
  const [publish, setPublish] = useState(false);
  const params = useParams();
  const id = params.blogId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog } = useSelector(store => store.blog);
  const selectBlog = blog.find(blog => blog._id === id);

  const [content, setContent] = useState(selectBlog?.description || "<p></p>");

  const [blogData, setBlogData] = useState({
    title: selectBlog?.title || "",
    subtitle: selectBlog?.subtitle || "",
    description: content,
    category: selectBlog?.category || "",
  });

  const [previewThumbnail, setPreviewThumbnail] = useState(selectBlog?.thumbnail);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectCategory = (value) => {
    setBlogData({ ...blogData, category: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData({ ...blogData, thumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  // ✅ Clean HTML from Word before upload
  const cleanHTML = (dirtyHTML) => {
    return sanitizeHtml(dirtyHTML, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
        "span",
        "h1",
        "h2",
        "h3",
        "table",
        "thead",
        "tbody",
        "tr",
        "td",
        "th",
      ]),
      allowedAttributes: {
        "*": ["style", "class"],
        img: ["src", "alt", "width", "height"],
      },
      allowedSchemes: ["http", "https", "data"], // allow real images
      transformTags: {
        img: (tagName, attribs) => {
          // 🚫 remove file:// images from Word
          if (attribs.src && attribs.src.startsWith("file://")) {
            return { tagName: "span", text: "" };
          }
          return { tagName, attribs };
        },
      },
    });
  };

  const updateBlogHandler = async () => {
    // ✅ Clean pasted HTML first
    const sanitizedHTML = cleanHTML(content);

    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle);
    formData.append("description", sanitizedHTML); // ✅ cleaned HTML
    formData.append("category", blogData.category);

    if (blogData.thumbnail instanceof File) {
      formData.append("file", blogData.thumbnail);
    }

    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:8000/api/v1/blog/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Blog updated successfully!");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating blog");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="pb-10 px-3 pt-20 md:ml-[320px]">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full bg-white dark:bg-gray-800 p-5 space-y-2">
          <h1 className="text-4xl font-bold">Write Article</h1>
          <p>Make changes to your Article here. Click Save changes when you're done.</p>

          <div className="pt-10">
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Enter a title"
              name="title"
              value={blogData.title}
              onChange={handleChange}
              className="dark:border-gray-300"
            />
          </div>

          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              placeholder="Enter a subtitle"
              name="subtitle"
              value={blogData.subtitle}
              onChange={handleChange}
              className="dark:border-gray-300"
            />
          </div>

          <div>
            <Label>Description</Label>
            <TiptapEditor
              initialContent={content}
              onChange={setContent}
              uploadUrl="http://localhost:8000/api/v1/blog/upload-image"
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select onValueChange={selectCategory} className="dark:border-gray-300">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Common Conditions">Common Conditions</SelectItem>
                  <SelectItem value="Mental Health">Mental Health</SelectItem>
                  <SelectItem value="Skin and hair health">Skin and hair health</SelectItem>
                  <SelectItem value="Lifestyle and Nutrition">Lifestyle and Nutrition</SelectItem>
                  <SelectItem value="Substance use and addictions">Substance use and addictions</SelectItem>
                  <SelectItem value="Substance use and addictions">Emergency Conditions</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Thumbnail</Label>
            <Input
              id="file"
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit dark:border-gray-300"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="Blog Thumbnail"
              />
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button onClick={updateBlogHandler}>
              {loading ? "Please Wait..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UpdateBlog;
