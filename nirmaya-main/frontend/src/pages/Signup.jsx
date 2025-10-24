import React, { useState } from 'react'
import auth from "../assets/auth.jpg"
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from 'axios'
import { toast } from 'sonner'
import { setLoading, setUser } from '../redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'

const Signup = () => {

  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector(store => store.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userr, setUserr] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserr((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/user/register`, userr, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen md:pt-10 px-4 bg-gray-50 dark:bg-gray-900">
      {/* ✅ Left Side Image */}
      <div className="hidden md:flex justify-center items-center flex-1">
        <img
          src={auth}
          alt="Signup illustration"
          className="w-full h-full max-h-[750px] object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* ✅ Right Side Form */}
      <div className="flex justify-center items-center flex-1 w-full py-10 md:py-0">
        <Card className="w-full max-w-md md:max-w-lg lg:max-w-md shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Create an Account
              </h1>
            </CardTitle>
            <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-300">
              Enter your details below to sign up and get started.
            </p>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full">
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={userr.firstName}
                    onChange={handleChange}
                    className="dark:border-gray-600 dark:bg-gray-900"
                    required
                  />
                </div>

                <div className="w-full">
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={userr.lastName}
                    onChange={handleChange}
                    className="dark:border-gray-600 dark:bg-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  name="email"
                  value={userr.email}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Label>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  name="password"
                  value={userr.password}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full text-base py-2">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>

              {/* Already have an account */}
              <p className="text-center text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="underline cursor-pointer hover:text-gray-800 dark:hover:text-gray-100">
                    Sign in
                  </span>
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
