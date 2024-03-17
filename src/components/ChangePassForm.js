import React, { useState } from "react";
import user from "../assets/user.jpg"
import { BiChevronUp } from "react-icons/bi";
import { BiKey } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux"
import * as actions from "../stores/actions"
import { path } from "../utils/contants"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"
import * as CryptoJS from '../utils/crypto'

const ChangePassForm = (props) => {
    const getValue = props.getValue;
    const setChange = props.setChange;
    const { token } = useSelector(state => state.auth)
    const email = token ? jwtDecode(token).email : "No user"
    const name = jwtDecode(token).name ? jwtDecode(token).name : 'Admin'
    const conTrolMenu = () => {
        getValue();
    }

    const [toggle, setToggle] = useState(false)
    const conTroler = () => {
        setToggle((prevToggle) => !prevToggle);
    }

    const navigate = useNavigate()
    const dispatch = useDispatch()

    return (
        <div onClick={conTroler} className="flex justify-end items-center h-full w-full">
            <div className="hover:text-orange-600 flex w-[300px] justify-end items-center h-full text-primary cursor-pointer">
                <img src={user} alt="" className={`w-[41px] h-[41px] rounded-full object-cover`} />
                <p className="text-primary cursor-pointer text-[13px] mx-2">{email}</p>
                <BiChevronUp className={`${toggle ? "rotate-180 transition-all duration-100" : "transition-all"} mx-2 text-[20px] xl:text-[25px] cursor-pointer`} />
            </div>
            <div className={` ${toggle ? "block transition-all duration-100" : "hidden"} absolute top-full right-0  shadow-xl rounded-xl z-80`}>
                <div className="fixed right-0 bottom-[80px] sm:bottom-[100px] w-full">
                    <div className="flex flex-col">
                        <div className="flex items-center bg-gray-200 py-2 px-5">
                            <img src={user} alt="" className={`w-[60px] h-[60px] rounded-full object-cover`} />
                            <div>
                                <p className="text-primary cursor-pointer text-[15px] mx-2">{email}</p>
                                <p className="text-primary cursor-pointer text-[12px] mx-2">{CryptoJS.decrypted(name)}</p>
                            </div>
                        </div>
                        <div className="bg-gray-100 border-b py-2 gap-2 flex flex-col">
                            <div className="flex px-5 items-center gap-4 hover:text-orange-700 cursor-pointer" onClick={() => setChange(true)}>
                                <BiKey className="text-[20px]" />
                                <p className="text-[13px]">Thay đổi mật khẩu</p>
                            </div>
                            <div className="flex px-5 items-center gap-4 hover:text-orange-700 cursor-pointer" onClick={() => { dispatch(actions.logout()); navigate(path.LOGIN) }}>
                                <IoIosLogOut className="text-[20px]" />
                                <p className="text-[13px]">Đăng xuất</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassForm