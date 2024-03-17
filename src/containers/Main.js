import React, { useState } from "react";
import { BiChevronLeft } from "react-icons/bi"
import { SidebarData, UserProfile, Header, BottomBar, ChangePassForm } from "../components";
import { Outlet } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";
import { useSelector } from "react-redux"
import { Backdrop, CircularProgress } from '@mui/material';
import { path } from "../utils/contants"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { InputForm } from "../components";
import { apiChangePass } from "../services/authService";
import Swal from "sweetalert2";
import notLoggin from '../assets/notLogin.svg'

const Home = () => {
    let text = "";
    const [toggle, settoggle] = useState(false);
    const [content, setContent] = useState("Home")
    const [openMenu, setOpenMenu] = useState(false)
    const [change, setChange] = useState(false)
    const [loading, setLoading] = useState(false)
    const { isLoggedIn } = useSelector(state => state.auth)
    const { token } = useSelector(state => state.auth)
    const [invalidFields, setInvalidFields] = useState([])
    const type = token ? jwtDecode(token).type : ""
    const email = token ? jwtDecode(token).email : ''
    //const name = token? jwtDecode(token).name : 'Admin'
    const navigate = useNavigate()
    //
    const getContent = (input) => {
        text = input;
        setContent(text)
    }
    //
    const changeValue = () => {
        setOpenMenu((prev) => prev = !prev);
    }
    //
    const [payload, setPayload] = useState({
        email: email,
        password: '',
        newpassword: '',
        type: type
    })
    //
    const cancle = () => {
        setPayload(prev => ({ ...prev, password: '' }))
        setPayload(prev => ({ ...prev, newpassword: '' }))
    }
    //
    const validate = (payload) => {
        let invalids = 0; // đếm số lỗi
        let fields = Object.entries(payload)
        fields.forEach((item) => {
            if (item[1] === '') {
                setInvalidFields(prev => [...prev, {
                    name: item[0],
                    message: 'Thông tin không được bỏ trống.'
                }])
                invalids++
            }
        })
        fields.forEach((item) => {
            switch (item[0]) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(item[1])) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Địa chỉ email không hợp lệ.'
                        }]);
                        invalids++;
                    }
                    break;
                case 'password':
                    if (item[1].length < 6) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Mật khẩu tối thiểu 6 ký tự.'
                        }]);
                        invalids++;
                    }
                    break;
                case 'newpassword':
                    if (item[1].length < 6) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Mật khẩu tối thiểu 6 ký tự.'
                        }]);
                        invalids++;
                    }
                    break;
                default:
                    break
            }
        })
        // console.log(fields)
        return invalids;
    }
    //
    const handleSubmit = async () => {
        let inval = validate(payload);
        if (inval === 0) {
            setLoading(true)
            const response = await apiChangePass(payload)
            if (response?.status === 200 && response?.data?.err === 0) {
                setLoading(false)
                const result = await Swal.fire({
                    title: "Succeeded!",
                    text: response.data.msg ? response.data.msg : "",
                    icon: "success",
                    showConfirmButton: true,
                });
                if (result.isConfirmed || result.isDismissed) {
                    cancle();
                    setChange(false)
                }
            } else {
                setLoading(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.data.msg ? response.data.msg : "",
                    footer: '<a href="#">Why do I have this issue?</a>',
                    showConfirmButton: true,
                });
            }
        }
    }
    return (
        <div className="w-full h-screen">
            {loading && (
                <div>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loading}
                        onClick={() => navigate(path.LOGIN)} // Đặt hàm navigate vào trong một hàm gọi lại
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
            )}

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
                <div className="fixed inset-0 flex justify-center items-center z-50 w-full">
                    <div className="relative"
                        onKeyDown={(e) => {
                            // console.log(e.key)
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSubmit()
                            }
                        }}>
                        <div className="bg-gray-400 opacity-70 fixed inset-0 z-90" onClick={() => { setChange(prev => !prev); cancle(); setInvalidFields([]) }}></div>
                        <div className="flex justify-start gap-2 items-center  flex-col bg-white w-full sm:w-[400px]  z-70 rounded-xl relative px-3">
                            <div className="inset-0 flex justify-center items-start text-[25px] text-primary">Đổi mật khẩu</div>
                            <InputForm label={'Email'} value={payload.email} setValue={setPayload} type={'email'} keyx={'email'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                            <InputForm label={'Mật khẩu'} value={payload.password} setValue={setPayload} type={'password'} keyx={'password'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                            <InputForm label={'Mật khẩu mới'} value={payload.newpassword} setValue={setPayload} type={'newpassword'} keyx={'password'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                            <button onClick={(e) => { e.preventDefault(); handleSubmit() }} class=" w-full md:w-[100px] my-4 bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Submit</button>
                        </div>
                        <MdOutlineClose className="absolute top-2 right-2 text-[25px] cursor-pointer" onClick={() => { setChange(prev => !prev); cancle(); setInvalidFields([]) }} />
                    </div>
                </div>
            )}

            {
                isLoggedIn && (
                    <div className="flex object-cover h-full">
                        <div className={`${toggle ? "w-[4.8rem]" : ""} sidebar fixed z-10 hidden lg:block`}>
                            <UserProfile toggle={toggle} />
                            <SidebarData toggle={toggle} getContent={getContent} type={type} />
                            <div className="absolute top-[7rem] flex items-center justify-center -right-5 w-10 h-10 bg-gray-300 rounded-full cursor-pointer hover:bg-white transition-all duration-300" onClick={() => { settoggle(!toggle) }}>
                                <BiChevronLeft className={`${toggle ? "rotate-180" : ""} text-3xl transition-all duration-100`} />
                            </div>
                        </div>
                        <div className={`${openMenu ? "left-0" : "-left-full"}  bg-primary h-[100%] w-[13rem] p-2 border transition-all duration-300 fixed z-50 -left-full top-0`}>
                            <UserProfile />
                            <SidebarData getContent={getContent} type={type} />
                            <div className="absolute top-[7rem] flex items-center justify-center -right-5 w-10 h-10 bg-gray-100 rounded-full cursor-pointer hover:bg-white transition-all duration-300" onClick={changeValue}>
                                <MdOutlineClose className={`${openMenu ? "rotate-180" : ""} text-3xl transition-all duration-100 text-primary`} />
                            </div>
                        </div>
                        <div className={`${toggle ? "w-[4.8rem]" : ""} sidebar bg-white z-0 hidden lg:block`}>

                        </div>
                        <div className={`w-full lg:w-[calc(100%-13rem)] ${toggle ? "transition-all duration-300  lg:w-[calc(100%-76.8px)] " : "transition-all lg:w-[calc(100%-13rem)] duration-300"}`}>
                            <div className={`fixed top-0 right-0 h-[50px] 2xl:rounded-r-xl bg-gray-100 w-full lg:w-[calc(100%-13rem)] z-40 ${toggle ? "transition-all duration-300 lg:w-[calc(100%-76.8px)]" : "transition-all duration-300 lg:lg:w-[calc(100%-13rem)]"}`}>
                                <Header content={content} getValue={changeValue} setChange={setChange} />
                            </div>
                            <div className="h-[50px] w-full z-50"></div>
                            <div className="w-full py-4 px-6 z-0 bg-gray-50">
                                <Outlet />
                            </div>
                            <div className={`fixed md:hidden right-0 h-[50px] 2xl:rounded-r-xl w-full lg:w-[calc(100%-13rem)] bottom-[30px] xl:bottom-[35px] sm:bottom-[50px] bg-gray-100 z-40 ${toggle ? "transition-all duration-300  lg:w-[calc(100%-76.8px)] " : "transition-all lg:w-[calc(100%-13rem)] duration-300 "}`}>
                                <ChangePassForm content={content} getValue={changeValue} setChange={setChange} />
                            </div>
                            <div className="h-[80px] sm:h-[100px] md:h-[50px] w-full"></div>
                            <div className={`fixed right-0 h-[30px] xl:h-[35px] sm:h-[50px] 2xl:rounded-r-xl w-full lg:w-[calc(100%-13rem)] bottom-0 bg-gray-100 z-40 ${toggle ? "transition-all duration-300  lg:w-[calc(100%-76.8px)] " : "transition-all lg:w-[calc(100%-13rem)] duration-300 "}`}>
                                <BottomBar />
                            </div>
                        </div>
                    </div>
                )
            }
            {
                !isLoggedIn && (
                    <div className="min-h-screen w-full flex flex-col items-center justify-center">
                        <div className="w-[500px]">
                            <img className="h-[500px] w-[500px]" src={notLoggin} />
                        </div>
                        <p className="text-[25px]">Token Required</p>
                        <p className="text-[18px]">Please adjust your security preferences before continuing . . .</p>
                    </div>
                )
            }

        </div>
    )
}


export default Home