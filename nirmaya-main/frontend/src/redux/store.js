import { configureStore } from "@reduxjs/toolkit"
import authSlice from './authSlice'
import themeSlice from './themeSlice'
import blogSlice from './blogSlice'
import commentSlice from './commentSlice'

const store=configureStore({
  reducer:{
    auth:authSlice,
    theme:themeSlice,
    blog:blogSlice,
    comment:commentSlice
  }
})

export default store;