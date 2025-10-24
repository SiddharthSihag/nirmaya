import { BarChart3, Eye, MessageSquare, ThumbsUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setBlog } from '../redux/blogSlice'
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TotalProperty = () => {
  const { blog } = useSelector(store => store.blog)
  const [loading, setLoading] = useState(true);

  const [statsData, setStatsData] = useState({
    totalViews: 0,
    totalBlogs: 0,
    totalComments: 0,
    totalLikes: 0,
  });
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const fetchAuthorStats = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/v1/user/author/stats", {
      withCredentials: true,
    });
    if (res.data.success) {
      setStatsData(res.data);
    }
  } catch (error) {
    console.error("Error fetching author stats:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchAuthorStats();
  }, []);

  const stats = [
    {
      title: "Total Views",
      value: statsData.totalViews,
      icon: Eye,
      type: "views",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Total Blogs",
      value: statsData.totalBlogs,
      icon: BarChart3,
      type: "blogs",
      change: "+4%",
      trend: "up",
    },
    {
      title: "Comments",
      value: statsData.totalComments,
      icon: MessageSquare,
      type: "comments",
      change: "+18%",
      trend: "up",
    },
    {
      title: "Likes",
      value: statsData.totalLikes,
      icon: ThumbsUp,
      type: "likes",
      change: "+7%",
      trend: "up",
    },
  ];
  const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num;
};

  return (
    <div className='md:p-10 p-4'>
      <div className='flex flex-col md:flex-row justify-around gap-3 md:gap-7'>

      {loading ? (
  <div className="text-center py-10 text-gray-400">Loading stats...</div>
) : (
  stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="w-full"
          >
            <Card onClick={() =>
              navigate("/dashboard/stats-details", {
                state: { type: stat.type },
              })
            } className="dark:bg-gray-800 cursor-pointer hover:scale-[1.03] transition-transform hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stat.value)}</div>
                <p
                  className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))
)}

        

      </div>
    </div>
  )
}

export default TotalProperty