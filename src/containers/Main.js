import React, { useState } from "react";
import { BiChevronLeft } from "react-icons/bi"
import { SidebarData, UserProfile, Header, BottomBar } from "../components";
import { Outlet } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux"
import { Backdrop, CircularProgress, typographyClasses } from '@mui/material';
import { path } from "../utils/contants"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Home = () => {
    let text = "";
    const [toggle, settoggle] = useState(false);
    const [content, setContent] = useState("Home")
    const [openMenu, setOpenMenu] = useState(false)
    const [change, setChange] = useState(false)
    const { isLoggedIn } = useSelector(state => state.auth)
    const { token } = useSelector(state => state.auth) 
    const type = token ? jwtDecode(token).type : ""
    const navigate = useNavigate()

    const getContent = (input) => {
        text = input;
        setContent(text)
    }

    const changeValue = () => {
        setOpenMenu((prev) => prev = !prev);
    }

    return (
        <div className="w-full h-screen">
            {(
                <div>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={!isLoggedIn}
                        onClick={() => navigate(path.LOGIN)} // Đặt hàm navigate vào trong một hàm gọi lại
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
            )}
            
            {change && (
                <div className="fixed inset-0 flex justify-center items-center z-120">
                    <div className="bg-gray-400 opacity-70 fixed inset-0 z-10" onClick={() => { setChange(prev => !prev)}}></div>
                    <div className="bg-white w-full h-full sm:w-[540px] xl:h-[500px] z-20 rounded-xl relative">
                        <div className="absolute inset-0 flex justify-center items-start">hello</div>
                    </div>
                </div>
            )}

            <div className="flex object-cover h-full">
                <div className={`${toggle ? "w-[4.8rem]" : ""} sidebar fixed z-10 hidden lg:block`}>
                    <UserProfile toggle={toggle} />
                    <SidebarData toggle={toggle} getContent={getContent} type={type} />
                    <div className="absolute top-[7rem] flex items-center justify-center -right-5 w-10 h-10 bg-gray-300 rounded-full cursor-pointer hover:bg-white transition-all duration-200" onClick={() => { settoggle(!toggle) }}>
                        <BiChevronLeft className={`${toggle ? "rotate-180" : ""} text-3xl transition-all duration-100`} />
                    </div>
                </div>
                <div className={`${openMenu ? "left-0" : "-left-full"}  bg-primary h-[100%] w-[13rem] rounded-r-xl p-2 border transition-all duration-300 fixed z-10 -left-full top-0`}>
                    <UserProfile />
                    <SidebarData getContent={getContent} type={type}/>
                    <div className="absolute top-[7rem] flex items-center justify-center -right-5 w-10 h-10 bg-gray-300 rounded-full cursor-pointer hover:bg-white transition-all duration-200" onClick={changeValue}>
                        <IoClose className={`${openMenu ? "rotate-180" : ""} text-3xl transition-all duration-100`} />
                    </div>
                </div>
                <div className={`${toggle ? "w-[4.8rem]" : ""} sidebar bg-white z-0 hidden lg:block`}>

                </div>
                <div className={`w-full lg:w-[calc(100%-13rem)] ${toggle ? "transition-all duration-200  lg:w-[calc(100%-76.8px)] delay-100" : "transition-all lg:w-[calc(100%-13rem)] duration-300 delay-100"}`}>
                    <div className={`fixed h-[50px] rounded-r-xl bg-gray-100 w-full lg:w-[calc(100%-13rem)] ${toggle ? "transition-all duration-200 delay-100 lg:w-[calc(100%-76.8px)]" : "transition-all duration-300 delay-100 lg:lg:w-[calc(100%-13rem)]"}`}>
                        <Header content={content} getValue={changeValue} setChange={setChange} />
                    </div>
                    <div className="h-[50px] w-full">

                    </div>
                    <div className="w-full px-3">
                        <Outlet />
                    </div>
                    <div className={`fixed h-[30px] xl:h-[35px] sm:h-[50px] rounded-r-xl w-full lg:w-[calc(100%-13rem)] bottom-0 bg-gray-100 ${toggle ? "transition-all duration-200  lg:w-[calc(100%-76.8px)] delay-100" : "transition-all lg:w-[calc(100%-13rem)] duration-300 delay-100"}`}>
                        <BottomBar />
                    </div>
                </div>
            </div>

        </div>
    )
}


export default Home