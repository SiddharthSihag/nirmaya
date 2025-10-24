import mongoose from "mongoose";

//schema

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,

  },
  photoUrl: {
    type: String,
    default: ""
  },
  
  avatar:{
    type:String,
  },


  role: {
    type: String,
    enum: ["reader", "author"],   // ✅ allowed values
    default: "reader",            // ✅ assigned automatically at signup
  },

  // author specific
  bio: {
    type: String,
    default: ""
  },
  occupation: {
    type: String,
    default: ""
  },
  instagram: {
    type: String,
    default: ""
  },
  linkedin: {
    type: String,
    default: ""
  },
  facebook: {
    type: String,
    default: ""
  },
  twitter:{
type: String,
    default: ""
  },

  //reader specific
  dob: { type: Date },
  city: { type: String },
  savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  likedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],


}, { timestamps: true })

export const User = mongoose.model("User", userSchema)