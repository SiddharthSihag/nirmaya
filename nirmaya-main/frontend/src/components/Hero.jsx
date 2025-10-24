import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import heroNirmaya2 from "../assets/homepage.jpg";

const Hero = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setLoading(true);

    setTimeout(() => {
      if (!user) {
        navigate('/blogs');
      } else if (user.role === 'author') {
        navigate('/dashboard/write-blog');
      } else {
        navigate('/blogs');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);
    }, 700);
  };

  return (
    <div className="px-4 md:px-8 lg:px-0 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-6 lg:gap-12 min-h-[500px] md:min-h-[600px] my-10 md:my-0">
        
        {/* text section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-snug">
            Evidence-based articles for everyday health.
          </h1>

          <p className="text-base sm:text-lg md:text-xl opacity-80 mb-6">
            Readable, reliable health education for everyone — with clear guidance 
            on what to watch for, when to act, and how to prevent problems.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              onClick={handleGetStarted}
              disabled={loading}
              className={`bg-blue-600 text-white text-lg px-6 py-3 transition-all ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Loading...</span>
                </div>
              ) : (
                'Get Started'
              )}
            </Button>

            <Link to="/about">
              <Button
                variant="outline"
                className="border-white text-lg px-6 py-3"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* image section */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src={heroNirmaya2}
            alt="Hero section"
            className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
