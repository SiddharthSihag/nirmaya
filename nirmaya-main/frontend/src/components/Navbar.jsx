
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import Logo from "../assets/logo.png"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '../redux/authSlice'
import userLogo from "../assets/user.jpg"
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import {
  ChartColumnBig,
  Cloud,
  CreditCard,

  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Search,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { FaEdit, FaMoon, FaRegEdit, FaSun } from 'react-icons/fa'
import { toggleTheme } from '../redux/themeSlice'
import { LiaCommentSolid } from 'react-icons/lia'
import ResponsiveMenu from './ResponsiveMenu'
import nirmayaLogo from "../assets/nirmayalogo.jpg"

const Navbar = () => {
  const { user } = useSelector(store => store.auth)
  const { theme } = useSelector(store => store.theme)
  const [searchTerm, setSearchTerm] = useState("");
  const [openNav, setOpenNav] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const user = false;

  const logoutHandler = async (e) => {

    try {
      const res = await axios.get(`http://localhost:8000/api/v1/user/logout`, { withCredentials: true });
      if (res.data.success) {
        navigate("/")
        dispatch(setUser(null))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)

    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('')
    }
  };

  const toggleNav = () => {
    setOpenNav(!openNav)
  }
  return (
    <div className='py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-[#4ba09f] z-50'>
      <div className='max-w-7xl mx-auto flex justify-between items-center px-0 md:px-0'>
        {/* logo section */}
        <div className='flex gap-7 items-center'>
          <Link to={'/'}>
            <div className='flex gap-2 items-center justify-start'>
<img
  src={nirmayaLogo}
  alt="Niramaya Care"
  className="
    h-16              
    w-auto
    object-contain 
    dark:invert
  "
/>



            </div>
          </Link>
          <div className='relative hidden md:block'>
            <Input type="text"
              placeholder="Try “acne,” “alopecia,” “vitiligo”..."
              className="border border-gray-700 dark:bg-gray-900 bg-gray-300 w-[300px] hidden md:block"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className='absolute right-0 top-0' onClick={handleSearch}><Search /></Button>
          </div>
        </div>
        {/* nav section */}
        <nav className='flex md:gap-7 gap-4 items-center'>


          <ul className='hidden md:flex gap-7 items-center text-xl font-semibold'>
            <NavLink
              to="/"
              className="cursor-pointer px-3 py-1 rounded-md hover:bg-black hover:text-white transition-colors duration-200"
            >
              <li>Home</li>
            </NavLink>

            <NavLink
              to="/blogs"
              className="cursor-pointer px-3 py-1 rounded-md hover:bg-black hover:text-white transition-colors duration-200"
            >
              <li>Articles</li>
            </NavLink>

            <NavLink
              to="/about"
              className="cursor-pointer px-3 py-1 rounded-md hover:bg-black hover:text-white transition-colors duration-200"
            >
              <li>About</li>
            </NavLink>
          </ul>

          <div className='flex'>
            {/* <Button onClick={() => dispatch(toggleTheme())} className="">
              {
                theme === 'light' ? <FaMoon /> : <FaSun />
              }

            </Button> */}
            {
              user ? <div className="ml-7 flex gap-3 items-center">
                {/* <Link to={'/profile'}> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user.photoUrl || userLogo} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-56 bg-white text-black border border-black shadow-lg"
                  >
                    <DropdownMenuLabel className="font-semibold text-black">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-black" />

                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => navigate('/dashboard/profile')}
                        className="hover:bg-gray-100 text-black"
                      >
                        <User className="mr-2" />
                        <span>My Profile</span>
                      </DropdownMenuItem>

                      {user.role === "author" ? (
                        <>
                          {/* Author-only options */}
                          <DropdownMenuItem
                            onClick={() => navigate('/dashboard/stats-details')}
                            className="hover:bg-gray-100 text-black"
                          >
                            <ChartColumnBig className="mr-2" />
                            <span>My Articles</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => navigate('/dashboard/comments')}
                            className="hover:bg-gray-100 text-black"
                          >
                            <LiaCommentSolid className="mr-2" />
                            <span>Comments</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => navigate('/dashboard/write-blog')}
                            className="hover:bg-gray-100 text-black"
                          >
                            <FaRegEdit className="mr-2" />
                            <span>Write Article</span>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          {/* Reader-only options */}
                          <DropdownMenuItem
                            onClick={() => navigate('/dashboard/liked')}
                            className="hover:bg-gray-100 text-black"
                          >
                            <LiaCommentSolid className="mr-2" />
                            <span>Liked</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate('/dashboard/my-comments')}
                            className="hover:bg-gray-100 text-black"
                          >
                            <LiaCommentSolid className="mr-2" />
                            <span>My Comments</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => navigate('/dashboard/saved')}
                            className="hover:bg-gray-100 text-black"
                          >
                            <FaRegEdit className="mr-2" />
                            <span>Saved </span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-black" />

                    <DropdownMenuItem
                      onClick={logoutHandler}
                      className="hover:bg-gray-100 text-black"
                    >
                      <LogOut className="mr-2" />
                      <span>Log out</span>

                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* </Link> */}
                <Button className="hidden md:block" onClick={logoutHandler}>Logout</Button>
              </div> : <div className='ml-7 md:flex gap-2 '>
                <Link to={'/login'}><Button>Login</Button></Link>
                <Link className='hidden md:block' to={'/signup'}><Button>Signup</Button></Link>
              </div>
            }
          </div>
          {
            openNav ? <HiMenuAlt3 onClick={toggleNav} className='w-7 h-7 md:hidden' /> : <HiMenuAlt1 onClick={toggleNav} className='w-7 h-7 md:hidden' />
          }

        </nav>
        <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} logoutHandler={logoutHandler} />
      </div>
    </div>
  )
}

export default Navbar