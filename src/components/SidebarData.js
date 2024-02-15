import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { IoIosLogOut } from "react-icons/io";
import { FaUserGraduate } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdFindInPage } from "react-icons/md";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { path } from "../utils/contants"
import { useDispatch } from "react-redux"
import * as actions from "../stores/actions"
import { FaUserCheck } from "react-icons/fa";
import { MdTopic } from "react-icons/md";




const SidebarData = (props) => {
    const navigate = useNavigate()
    const getContent = props.getContent;
    const type = props.type;
    const toggle = props.toggle;
    const handleFunction = (input) => {
        getContent(input);
    }
    const dispatch = useDispatch()
    return (
        <div className={`${toggle ? "" : ""} flex flex-col justify-between h-[90%]`}>
            {/*<div className="">
                <div onClick={useCallback(() => { navigate(path.HOME); handleFunction("Home") })} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData`}>
                    <div className="mr-8 text-[1.7rem] "><RxDashboard /></div>
                    <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Trang chủ</div>
                </div>
                <div onClick={useCallback(() => { navigate(path.PROFILE); handleFunction("Thông tin cá nhân") })} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData`}>
                    <div className="mr-8 text-[1.7rem] "><ImProfile /></div>
                    <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Thông tin</div>
                </div>
                <div onClick={useCallback(() => { navigate(path.COURSE); handleFunction("Đăng ký trực tuyến") })} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData `}>
                    <div className="mr-8 text-[1.7rem] "><FaUserGraduate /></div>
                    <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Đăng ký</div>
                </div>
                <div onClick={useCallback(() => { navigate(path.LOOKUP); handleFunction("Tra cứu kết quả") })} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData `}>
                    <div className="mr-8 text-[1.7rem] "><MdFindInPage /></div>
                    <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Tra cứu</div>
                </div>
                <div onClick={useCallback(() => { navigate(path.ACCOUNT); handleFunction("Tài khoản") })} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData `}>
                    <div className="mr-8 text-[1.7rem] "><RiAccountPinBoxFill /></div>
                    <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Tài khoản</div>
                </div>
            </div>*/}
            {
                type === "Quản trị viên" && (
                    <div>
                        <div onClick={() => { navigate(path.HOME); handleFunction("Home") }} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData`}>
                            <div className="mr-8 text-[1.7rem] "><RxDashboard /></div>
                            <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Trang chủ</div>
                        </div>
                        <div onClick={() => { navigate(path.ACCOUNT); handleFunction("Tài khoản") }} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData `}>
                            <div className="mr-8 text-[1.7rem] "><RiAccountPinBoxFill /></div>
                            <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Tài khoản</div>
                        </div>
                        <div onClick={() => { navigate(path.USER); handleFunction("Người dùng") }} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData `}>
                            <div className="mr-8 text-[1.7rem] "><FaUserCheck /></div>
                            <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Người dùng</div>
                        </div>
                    </div>
                )
            }
            {
                type === "Giảng viên/nhân viên" && (
                    <div>
                        <div onClick={() => { navigate(path.HOME); handleFunction("Home") }} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData`}>
                            <div className="mr-8 text-[1.7rem] "><RxDashboard /></div>
                            <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Trang chủ</div>
                        </div>
                        <div onClick={() => { navigate(path.PROFILE); handleFunction("Thông tin cá nhân") }} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData`}>
                            <div className="mr-8 text-[1.7rem] "><ImProfile /></div>
                            <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Thông tin</div>
                        </div>
                        <div onClick={() => { navigate(path.TOPIC); handleFunction("Đề tài") }} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData `}>
                            <div className="mr-8 text-[1.7rem] "><MdTopic /></div>
                            <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Đề tài</div>
                        </div>
                    </div>
                )
            }
            {
                type === "Sinh viên" && (
                    <div>
                        <div onClick={() => { navigate(path.HOME); handleFunction("Home") }} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData`}>
                            <div className="mr-8 text-[1.7rem] "><RxDashboard /></div>
                            <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Trang chủ</div>
                        </div>
                        <div onClick={() => { navigate(path.PROFILE); handleFunction("Thông tin cá nhân") }} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData`}>
                            <div className="mr-8 text-[1.7rem] "><ImProfile /></div>
                            <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Thông tin</div>
                        </div>
                        <div onClick={() => { navigate(path.COURSE); handleFunction("Đăng ký trực tuyến") }} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData `}>
                            <div className="mr-8 text-[1.7rem] "><FaUserGraduate /></div>
                            <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Đăng ký</div>
                        </div>
                        <div onClick={() => { navigate(path.LOOKUP); handleFunction("Tra cứu kết quả") }} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData `}>
                            <div className="mr-8 text-[1.7rem] "><MdFindInPage /></div>
                            <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Tra cứu</div>
                        </div>
                    </div>
                )
            }
            <div>
                <div onClick={useCallback(() => { dispatch(actions.logout()); navigate(path.LOGIN) })} className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData`}>
                    <div className="mr-8 text-[1.7rem] "><IoIosLogOut /></div>
                    <div className={`${toggle ? "opacity-0 delay-100" : "transition-opacity delay-100"} text-[14px] whitespace-pre`}>Đăng xuất</div>
                </div>
            </div>
        </div>
    );
}

export default SidebarData