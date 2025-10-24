import { Avatar, AvatarImage } from '../components/ui/avatar'
import { Card } from '../components/ui/card'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from "../assets/user.jpg"
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { Label } from '../components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { setUser } from '../redux/authSlice'
import TotalProperty from '../components/TotalProperty'

const AuthorProfile = () => {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(store => store.auth)

    const [input, setInput] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        occupation: user?.occupation || "",
        dob: user?.dob || "",
        bio: user?.bio || "",
        facebook: user?.facebook || "",
        linkedin: user?.linkedin || "",
        twitter: user?.twitter || "",
        instagram: user?.instagram || "",
        file: user?.photoUrl || null,
    });

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

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("firstName", input.firstName);
        formData.append("lastName", input.lastName);
        formData.append("bio", input.bio);
        formData.append("occupation", input.occupation);
        formData.append("dob", input.dob);
        formData.append("facebook", input.facebook);
        formData.append("linkedin", input.linkedin);
        formData.append("instagram", input.instagram);
        formData.append("twitter", input.twitter);
        if (input?.file) formData.append("file", input.file);

        try {
            setLoading(true);
            const res = await axios.put(
                `http://localhost:8000/api/v1/user/profile/update`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                setOpen(false);
                toast.success(res.data.message);
                dispatch(setUser(res.data.user));
            }
        } catch (error) {
            console.log(error);
            toast.error("Profile update failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialClick = (url, platform) => {
        if (url && url.trim() !== "") {
            window.open(url, "_blank", "noopener,noreferrer");
        } else {
            toast.info(`${platform} link does not exist.`);
        }
    };

    return (
        <div className="pt-20 md:ml-[320px] min-h-screen overflow-y-auto pb-16">
            <div className="max-w-6xl mx-auto mt-8 px-4 md:px-0">
                <Card className="flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center justify-center md:w-[400px]">
                        <Avatar className="w-40 h-40 border-2 mb-10">
                            <AvatarImage src={user?.photoUrl || userLogo} />
                        </Avatar>

                        <div className="flex gap-4 items-center">
                            <FaInstagram
                                onClick={() => handleSocialClick(user?.instagram, "Instagram")}
                                className="text-pink-500 hover:text-pink-600 transition cursor-pointer w-6 h-6"
                            />
                            <FaFacebook
                                onClick={() => handleSocialClick(user?.facebook, "Facebook")}
                                className="w-6 h-6 text-gray-600 hover:text-gray-800 transition cursor-pointer"
                            />
                            <FaTwitter
                                onClick={() => handleSocialClick(user?.twitter, "Twitter")}
                                className="w-6 h-6 text-sky-500 hover:text-sky-700 transition cursor-pointer"
                            />
                            <FaLinkedin
                                onClick={() => handleSocialClick(user?.linkedin, "LinkedIn")}
                                className="w-6 h-6 text-blue-600 hover:text-blue-800 transition cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1">
                        <h1 className="font-bold text-center md:text-start text-4xl mb-7">
                            Welcome {user?.firstName}!
                        </h1>
                        <p><span className="font-semibold">Full Name: </span>{user?.firstName} {user?.lastName}</p>
                        <p><span className="font-semibold">Email: </span>{user?.email}</p>
                        <p><span className="font-semibold">Dob: </span>{user?.dob || "Not specified"}</p>
                        <p><span className="font-semibold">Occupation: </span>{user?.occupation || "Not specified"}</p>

                        <div className="flex flex-col gap-2 items-start justify-start my-5">
                            <Label>About Me</Label>
                            <p className="border dark:border-gray-600 p-6 rounded-lg">
                                {user?.bio || "Please write something about yourself..."}
                            </p>
                        </div>

                        {/* Edit Dialog */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <Button onClick={() => setOpen(true)}>Edit Profile</Button>

                            <DialogContent
                                className="w-[90vw] max-w-md sm:w-[400px] md:w-[425px] max-h-[90vh] overflow-y-auto p-6 rounded-lg"
                            >
                                <DialogHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10 pb-2 border-b">
                                    <DialogTitle className="text-center text-lg sm:text-xl">
                                        Edit Profile
                                    </DialogTitle>
                                    <DialogDescription className="text-center text-sm sm:text-base text-gray-500">
                                        Update your profile information below.
                                    </DialogDescription>
                                </DialogHeader>

                                {/* Scrollable Content */}
                                <div className="grid gap-4 py-4">
                                    {/* Name */}
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="w-full sm:w-1/2">
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
                                        <div className="w-full sm:w-1/2">
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
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="w-full sm:w-1/2">
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
                                        <div className="w-full sm:w-1/2">
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

                                    {/* Social Links */}
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="w-full sm:w-1/2">
                                            <Label>Facebook</Label>
                                            <Input id="facebook"
                                                name="facebook"
                                                value={input.facebook}
                                                onChange={changeEventHandler}
                                                placeholder="Enter Facebook URL"
                                                className="text-gray-500"
                                            />
                                        </div>
                                        <div className="w-full sm:w-1/2">
                                            <Label>Instagram</Label>
                                            <Input id="instagram"
                                                name="instagram"
                                                value={input.instagram}
                                                onChange={changeEventHandler}
                                                placeholder="Enter Instagram URL"
                                                className="text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="w-full sm:w-1/2">
                                            <Label>LinkedIn</Label>
                                            <Input id="linkedin"
                                                name="linkedin"
                                                value={input.linkedin}
                                                onChange={changeEventHandler}
                                                placeholder="Enter LinkedIn URL"
                                                className="text-gray-500"
                                            />
                                        </div>
                                        <div className="w-full sm:w-1/2">
                                            <Label>Twitter</Label>
                                            <Input id="twitter"
                                                name="twitter"
                                                value={input.twitter}
                                                onChange={changeEventHandler}
                                                placeholder="Enter Twitter URL"
                                                className="text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <Label>Description</Label>
                                        <Textarea
                                            id="bio"
                                            value={input.bio}
                                            onChange={changeEventHandler}
                                            name="bio"
                                            placeholder="Enter a description"
                                            className="text-gray-500"
                                        />
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

                                {/* Sticky Footer */}
                                <DialogFooter className="sticky bottom-0 bg-white dark:bg-gray-800 pt-4 border-t">
                                    {loading ? (
                                        <Button disabled className="w-full sm:w-auto">
                                            <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
                                        </Button>
                                    ) : (
                                        <Button onClick={submitHandler} className="w-full sm:w-auto">
                                            Save Changes
                                        </Button>
                                    )}
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </Card>
            </div>

            {/* Footer Section */}
            <div className="mt-10">
                <TotalProperty />
            </div>
        </div>
    );
};

export default AuthorProfile;
