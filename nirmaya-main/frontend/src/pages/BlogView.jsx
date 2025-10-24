import React, { useEffect,useRef, useState } from 'react'
import {
    Breadcrumb,
    // BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../components/ui/breadcrumb"
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Bookmark, Heart, MessageSquare, Share2 } from 'lucide-react'
import CommentBox from '../components/CommentBox'
import axios from 'axios'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { setBlog } from '../redux/blogSlice'
import { toast } from 'sonner'
import { setUser } from "../redux/authSlice";
import ScrollToTopButton from '../components/ScrollToTopButton'

const BlogView = () => {
    const params = useParams()
    const blogId = params.blogId
    const { blog } = useSelector(store => store.blog)
    const { user } = useSelector(store => store.auth)
    const selectedBlog = blog.find(blog => blog._id === blogId)
    const [blogLike, setBlogLike] = useState(selectedBlog?.likes.length)
    const { comment } = useSelector(store => store.comment)
    const [liked, setLiked] = useState(selectedBlog?.likes.includes(user?._id) || false);
    const [saved, setSaved] = useState(false);
    useEffect(() => {
  if (user && user.savedArticles && selectedBlog?._id) {
    const isAlreadySaved = user.savedArticles.includes(selectedBlog._id);
    setSaved(isAlreadySaved);
  }
}, [user, selectedBlog]);

const [viewCounted, setViewCounted] = useState(false);
const bottomRef = useRef(null);
useEffect(() => {
  if (!selectedBlog) return;

  const hasViewedKey = `viewed-${selectedBlog._id}`;

  // ✅ Check if user already viewed this blog
  const alreadyViewed = localStorage.getItem(hasViewedKey);
  if (alreadyViewed) {
    setViewCounted(true);
    return;
  }

  const observer = new IntersectionObserver(
    async (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !viewCounted) {
        try {
          // ✅ Prevent multiple triggers
          localStorage.setItem(hasViewedKey, "true");
          setViewCounted(true);

          await axios.put(
            `http://localhost:8000/api/v1/blog/${selectedBlog._id}/view`,
            {},
            { withCredentials: true }
          );

          console.log("✅ View incremented for blog:", selectedBlog._id);
        } catch (error) {
          console.error("❌ Error incrementing blog view:", error);
        }
      }
    },
    { threshold: 0.8 } // Trigger when 80% of target is visible
  );

  if (bottomRef.current) observer.observe(bottomRef.current);

  return () => {
    if (bottomRef.current) observer.unobserve(bottomRef.current);
  };
}, [selectedBlog, viewCounted]);



    const dispatch = useDispatch()
    console.log(selectedBlog);

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/blog/${selectedBlog?._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
                setBlogLike(updatedLikes);
                setLiked(!liked)

                //apne blog ko update krunga
                const updatedBlogData = blog.map(p =>
                    p._id === selectedBlog._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                )
                toast.success(res.data.message);
                dispatch(setBlog(updatedBlogData))
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)

        }
    }

    const changeTimeFormat = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return formattedDate
    }


const handleSaveToggle = async () => {
  try {
    const action = saved ? "unsave" : "save";
    const res = await axios.get(
      `http://localhost:8000/api/v1/blog/${selectedBlog._id}/${action}`,
      { withCredentials: true }
    );

    if (res.data.success) {
      setSaved(!saved);

      // ✅ update user in Redux to keep store consistent
      const updatedUser = { ...user };
      if (!saved) {
        updatedUser.savedArticles = [...(user.savedArticles || []), selectedBlog._id];
      } else {
        updatedUser.savedArticles = user.savedArticles.filter(id => id !== selectedBlog._id);
      }
      dispatch(setUser(updatedUser));

      toast.success(res.data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to save blog");
  }
};


    const handleShare = (blogId) => {
        const blogUrl = `${window.location.origin}/blogs/${blogId}`;

        if (navigator.share) {
            navigator
                .share({
                    title: 'Check out this blog!',
                    text: 'Read this amazing blog post.',
                    url: blogUrl,
                })
                .then(() => console.log('Shared successfully'))
                .catch((err) => console.error('Error sharing:', err));
        } else {
            // fallback: copy to clipboard
            navigator.clipboard.writeText(blogUrl).then(() => {
                toast.success('Blog link copied to clipboard!');
            });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div className='pt-14'>
            <div className='max-w-6xl mx-auto p-10'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to={'/'}><BreadcrumbLink >Home</BreadcrumbLink></Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />


                        <BreadcrumbItem>
                            <Link to={'/blogs'}><BreadcrumbLink >Articles</BreadcrumbLink></Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {/* Blog Header */}
                <div className="my-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">{selectedBlog.title}</h1>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={selectedBlog.author.photoUrl} alt="Author" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{selectedBlog.author.firstName} {selectedBlog.author.lastName}</p>
                                <p className="text-sm text-muted-foreground">{selectedBlog.author.occupation}</p>
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">Published on {changeTimeFormat(selectedBlog.createdAt)} </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="mb-8 rounded-lg overflow-hidden">
                    <img
                        src={selectedBlog?.thumbnail}
                        alt="Next.js Development"
                        width={1000}
                        height={500}
                        className="w-full object-cover"
                    />
                    <p className="text-sm text-muted-foreground mt-2 italic">{selectedBlog.subtitle}</p>
                </div>

                {/* <p className='' dangerouslySetInnerHTML={{ __html: selectedBlog.description }} /> */}
                <div
  className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
  dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
></div>

                <div className='mt-10'>
                    {/* Tags */}
                    {/* <div className="flex flex-wrap gap-2 mb-8">
                        <Badge variant="secondary">Next.js</Badge>
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="secondary">Web Development</Badge>
                        <Badge variant="secondary">JavaScript</Badge>
                    </div> */}
                          <div className="flex justify-center my-8">
      <ScrollToTopButton />
      </div>

                    {/* Engagement */}
                    <div className="flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8">
                        <div className="flex items-center space-x-4">
                            <Button onClick={likeOrDislikeHandler} variant="ghost" size="sm" className="flex items-center gap-1">
                                {/* <Heart className="h-4 w-4"/> */}
                                {
                                    liked ? <FaHeart size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart size={'24'} className='cursor-pointer hover:text-gray-600 text-white' />
                                }

                                <span>{blogLike}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{comment.length} Comments</span>
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">

                            <Button onClick={handleSaveToggle} variant="ghost" size="sm">
                                {saved ? (
                                    <Bookmark className="h-4 w-4 text-yellow-500" />
                                ) : (
                                    <Bookmark className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
                                )}
                            </Button>
                            <Button onClick={() => handleShare(selectedBlog._id)} variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                </div>
                <div ref={bottomRef}></div>
                <CommentBox selectedBlog={selectedBlog} />
            </div>
        </div>
    )
}

export default BlogView