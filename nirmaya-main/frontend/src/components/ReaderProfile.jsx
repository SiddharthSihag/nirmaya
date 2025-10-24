import React, { useState } from "react";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import userLogo from "../assets/user.jpg";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"
import { Textarea } from '../components/ui/textarea'
import { useSelector,useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const ReaderProfile = () => {
  const { user } = useSelector((store) => store.auth);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch=useDispatch();

  const [input, setInput] = useState({
  firstName: "",
  lastName: "",
  dob: "",
  city: "",
  occupation: "",
  file: "",
});

// Whenever user changes in Redux, update local input state
React.useEffect(() => {
  if (user) {
    setInput({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      dob: user.dob || "",
      city: user.city || "",
      occupation: user.occupation || "",
      file: user.photoUrl || "",
    });
  }
}, [user]);


  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   Object.keys(input).forEach((key) => {
  //     if (input[key]) formData.append(key, input[key]);
  //   });

  //   try {
  //     setLoading(true);
  //     const res = await axios.put(
  //       "http://localhost:8000/api/v1/user/profile/update",
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //         withCredentials: true,
  //       }
  //     );

  //     if (res.data.success) {
  //       toast.success("Profile updated successfully!");
        
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to update profile");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const submitHandler = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  Object.keys(input).forEach((key) => {
    if (input[key]) formData.append(key, input[key]);
  });

  try {
    setLoading(true);
    const res = await axios.put(
      "http://localhost:8000/api/v1/user/profile/update",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      toast.success("Profile updated successfully!");

      // ✅ Update Redux store so profile info updates instantly
      if (res.data.user) {
        dispatch(setUser(res.data.user));
      }

      // ✅ Update local state
      setInput((prev) => ({
        ...prev,
        ...res.data.user,
      }));

      // ✅ Close dialog
      setOpen(false);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to update profile");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="pt-20 md:ml-[320px] md:h-screen">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
          {/* Profile Image */}
          <div className="flex flex-col items-center justify-center md:w-[400px]">
            <Avatar className="w-40 h-40 border-2">
              <AvatarImage src={user?.photoUrl || userLogo} />
            </Avatar>
            <h1 className="text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3">
              {user?.firstName +" "+ user?.lastName || "Reader"}
            </h1>
          </div>

          {/* Info Section */}
          <div>
            <h1 className="font-bold text-3xl mb-6 text-center md:text-start">
              Welcome {user?.firstName}!
            </h1>
            <p>
              <span className="font-semibold">Full Name:</span> {user?.firstName +" "+ user?.lastName}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-semibold">Occupation:</span> {user?.occupation||'not specified'}
            </p>
                        <p>
              <span className="font-semibold">City:</span> {user?.city || "Not specified"}
            </p>
                        <p>
              <span className="font-semibold">Dob:</span> {user?.dob
                  ? new Date(user.dob).toLocaleDateString()
                  : "Not Specified"}
            </p>




            

          </div>
          
          <div>
            {/* Edit Form */}
            
            <Dialog open={open} onOpenChange={setOpen}>
                            <Button onClick={() => setOpen(true)}>Edit Profile</Button>
                            <DialogContent className="md:w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="text-center">Edit Profile</DialogTitle>
                                    <DialogDescription className="text-center">
                                        Update your profile information below.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    {/* Name */}
                                    <div className="flex gap-2">
                                        <div>
                                            <Label>First Name</Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                value={input.firstName}
                                                onChange={changeEventHandler}
                                                placeholder="First Name"
                                                type="text"
                                                className="text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <Label>Last Name</Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={input.lastName}
                                                onChange={changeEventHandler}
                                                placeholder="Last Name"
                                                className="text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Occupation & DOB */}
                                    <div className="flex gap-2">
                                        <div className="w-1/2">
                                            <Label>Occupation</Label>
                                            <Input
                                                id="occupation"
                                                name="occupation"
                                                value={input.occupation}
                                                onChange={changeEventHandler}
                                                placeholder="Enter Occupation"
                                                className="text-gray-500"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <Label>Date of Birth</Label>
                                            <Input
                                                id="dob"
                                                name="dob"
                                                value={input.dob}
                                                onChange={changeEventHandler}
                                                type="date"
                                                className="text-gray-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                      <div className="w-1/2">
                                            <Label>City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={input.city}
                                                onChange={changeEventHandler}
                                                placeholder="Enter Your City"
                                                className="text-gray-500"
                                            />
                                        </div>
                                    </div>


                                    {/* Profile Picture */}
                                    <div>
                                        <Label>Profile Picture</Label>
                                        <Input
                                            id="file"
                                            type="file"
                                            accept="image/*"
                                            onChange={changeFileHandler}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <DialogFooter>
                                    {loading ? (
                                        <Button disabled>
                                            <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
                                        </Button>
                                    ) : (
                                        <Button onClick={submitHandler}>Save Changes</Button>
                                    )}
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        </div>
        </Card>
      </div>
    </div>
  );
};

export default ReaderProfile;
