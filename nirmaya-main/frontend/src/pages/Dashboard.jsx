import Sidebar from '../components/Sidebar'
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {

    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    return (
        <div className=' flex'>
            <Sidebar user={user} />

            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <Outlet /> {/* This renders profile, liked, comments, etc. */}
                    </motion.div>
                </AnimatePresence>
            </div>
            
        </div>
    )
}

export default Dashboard