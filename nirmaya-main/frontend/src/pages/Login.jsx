import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import auth from "../assets/auth.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../redux/authSlice";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/login`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        navigate("/");
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen md:pt-10 px-4 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      
      {/* ✅ Left Side Image (Same as Signup) */}
      <div className="hidden md:flex justify-center items-center flex-1">
        <img
          src={auth}
          alt="Login illustration"
          className="w-full h-full max-h-[750px] object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* ✅ Right Side Form */}
      <div className="flex justify-center items-center flex-1 w-full py-10 md:py-0">
        <Card className="w-full max-w-md md:max-w-lg lg:max-w-md shadow-xl rounded-2xl dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Login to Your Account
              </h1>
            </CardTitle>
            <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-300">
              Enter your credentials to access your account
            </p>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={input.email}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Label>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={input.password}
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
                  "Login"
                )}
              </Button>

              {/* Signup Redirect */}
              <p className="text-center text-gray-600 dark:text-gray-300">
                Don’t have an account?{" "}
                <Link to="/signup">
                  <span className="underline cursor-pointer hover:text-gray-800 dark:hover:text-gray-100">
                    Sign up
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

export default Login;
