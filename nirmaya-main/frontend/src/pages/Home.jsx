import Hero from '../components/Hero'
import React from 'react'
import RecentBlog from '../components/RecentBlog'
import PopularAuthors from '../components/PopularAuthors'
import ScrollToTopButton from '../components/ScrollToTopButton' // 👈 import

const Home = () => {
  return (
    <div className='pt-20'>
      <Hero />
      <PopularAuthors />
      <RecentBlog />

      <div className="flex justify-center my-8">
      <ScrollToTopButton />
      </div>
      </div>
    
  )
}

export default Home
