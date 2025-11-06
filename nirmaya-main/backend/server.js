import express from "express"
import dotenv from "dotenv"
import connectDB from "./database/db.js"
import userRoute from "./routes/user.route.js"
import blogRoute from "./routes/blog.routes.js"
import commentRoute from "./routes/comment.route.js"
import cookieParser from 'cookie-parser';
import cors from 'cors'
import path from "path"
import { fileURLToPath } from 'url'; // This isn't strictly needed if you use path.resolve() but is fine to keep.

dotenv.config()
const app = express()

const PORT = process.env.PORT || 3000

// --- Configuration for pathing ---
// path.resolve() gives the absolute path of the *root* of your project (i.e., 'nirmaya-main')
// This is the correct way to get the root directory in Render.
const _dirname = path.resolve()

// --- CORS Configuration ---
// We need to allow both your local frontend and your live Render URL.
const allowedOrigins = [
  "http://localhost:5173",
  "https://nirmaya.onrender.com" // Add your Render URL here
];

// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


// apis
 app.use("/api/v1/user", userRoute)
 app.use("/api/v1/blog", blogRoute)
 app.use("/api/v1/comment", commentRoute)

// --- Static File Serving ---
// This joins the root directory ('nirmaya-main') with '/frontend/dist'
// The resulting path is: /opt/render/project/src/nirmaya-main/frontend/dist
// This is the correct path *if* the frontend has been built.
 app.use(express.static(path.join(_dirname,"/frontend/dist")));

// This is the "catch-all" route. It sends any request that doesn't match an API route
// to your frontend's index.html file.
 app.get(/.*/, (_, res)=>{
   res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
 });

app.listen(PORT, ()=>{
   console.log(`Server listen at port ${PORT}`);
   connectDB()
})
