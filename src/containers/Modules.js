import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Outlet, useNavigate } from "react-router-dom";
import { path } from "../utils/contants";
import * as topicService from "../services/topicService"
import Swal from "sweetalert2";
import { RiMenuFoldFill } from "react-icons/ri";
import { RiMenuUnfoldFill } from "react-icons/ri";
import * as CryptoJS from '../utils/crypto'

const Modules = () => {
    const { topicid } = useParams();
    const navigate = useNavigate();
    const [infor, setInfor] = useState()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(true)

    const getTopicInfor = async () => {
        setLoading(true);
        const response = await topicService.apiGetTopicInfor({ id: topicid });
        if (response.status !== 200 || response?.data?.err !== 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.data.msg ? response?.data?.msg : "",
                footer: '<a href="#">Why do I have this issue?</a>',
                showConfirmButton: true,
            });
            setLoading(false)
        } else {
            setLoading(false)
            setInfor(response?.data?.data)
        }
    }

    useEffect(() => {
        getTopicInfor()
    }, [])

    return (
        <div className="flex w-full min-w-[600px]">
            <div className={`flex-col gap-4 text-[#4A90E2] mt-2 mr-10 ${open ? "flex " : "hidden"} duration-200 delay-100`}>
                <div className="text-[11px] italic text-gray-500 ">Học kỳ {infor?.schoolyear}</div>
                <div className="hover:underline cursor-pointer">Home</div>
                <div onClick={(e) => { e.preventDefault(); navigate(path.ANNOUNCEMENT) }} className="hover:underline cursor-pointer">Announcements</div>
                <div onClick={(e) => { e.preventDefault(); navigate(path.PEOPLES) }} className="hover:underline cursor-pointer">Peoples</div>
            </div>
            <div className="w-full">
                <div>
                    {
                        infor && (
                            <div className="flex justify-start items-center">
                                <div className="mr-5 text-[30px] text-primary cursor-pointer" onClick={() => {setOpen(prev => !prev);}}>
                                    {
                                        open ? <RiMenuFoldFill /> : <RiMenuUnfoldFill />
                                    }
                                </div>
                                <div className="text-primary">
                                    <p className="text-[1.5rem] ">{infor.title} {infor.id}</p>
                                    <p className="text-[13px]">Giảng viên : {CryptoJS.decrypted(infor.lecturerTopic.name)} </p>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="w-full">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Modules