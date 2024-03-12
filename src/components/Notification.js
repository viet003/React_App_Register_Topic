import React, { useState, useEffect } from "react";
import { apiGetAllAnnouncements } from "../services/announcementService";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { TfiAnnouncement } from "react-icons/tfi";
import { path } from "../utils/contants";


const Notification = () => {
    const navigate = useNavigate()
    const [time, setTime] = useState(new Date());
    const [anData, setAnData] = useState([])
    const [infoClass, setInforClass] = useState()
    const { token } = useSelector(state => state.auth)
    const userid = token ? jwtDecode(token).id : ''
    const type = token ? jwtDecode(token).type : ''
    // const [del, setDel] = useState('')
    //
    const getAllAnnouncementByUser = async () => {
        if (userid && type) {
            const response = await apiGetAllAnnouncements({ userid: userid, type: type })
            if (response?.status !== 200 || response?.data?.err !== 0) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response?.data?.msg ? response.data.msg : "",
                    footer: '<a href="#">Why do I have this issue?</a>',
                    showConfirmButton: true,
                });
            } else {
                // console.log(response?.data?.data)
                return response?.data?.data
            }
        } else {
            return []
        }
    }
    //
    const fetchData = async () => {
        const anData1 = await getAllAnnouncementByUser();
        if (anData1?.length !== 0) {
            if (type === 'Sinh viên') {
                setInforClass({ ...anData1[0], topicid: anData1[0]?.topics?.id, topics: '' })
                // console.log({ ...anData1[0], topicid: anData1[0]?.topics?.id, topics: '' })
                setAnData(anData1[0].topics.announcements)
                // console.log(anData1[0].topics.announcements)
            } else {
                setAnData(anData1)
            }
        }
    }
    //
    useEffect(() => {
        fetchData();
    }, [])
    //
    useEffect(() => {
        const timerID = setInterval(() => {
            setTime(new Date());
        }, 1000);

        // Clear the timer when the component unmounts
        return () => clearInterval(timerID);
    }, []);


    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const currentDate = `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;

    const pageSize = 5;

    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

    const totalPages = Math.ceil(anData?.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    return (
        <div className="h-full w-full hidden xl:flex flex-col rounded-xl">
            <h1 className="text-primary text-[50px] flex items-start justify-center">{`${hours}:${minutes}:${seconds}`}</h1>
            <h2 className="text-primary text-[20px] flex items-center justify-center">{currentDate}</h2>
            <div className="mt-4">
                <p className="text-primary text-[1rem]">To Do</p>
                <hr className="border-gray-400 mt-1" />
                {
                    type != 'Quản trị viên' && (
                        <div className="w-full mt-4">
                            {
                                anData?.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((element, index) => {
                                    // console.log(element.lecturerTopic.name)
                                    const formattedDate = new Date(element.createdAt).toLocaleString();
                                    return (
                                        <div>
                                            {
                                                infoClass?.isadded && type === 'Sinh viên' && (
                                                    <div key={index} onClick={(e) => {
                                                        if (infoClass.isadded) {
                                                            e.preventDefault();
                                                            navigate(`/main/${path.LOOKUP}/${infoClass?.topicid}/announcements/${btoa(element.id)}`)
                                                        };
                                                    }} className="w-full grid grid-cols-[90%]">
                                                        <di className="flex items-center gap-4 mb-5">
                                                            <div>
                                                                <TfiAnnouncement />
                                                            </div>
                                                            <div className="flex flex-col text-[13px] overflow-auto ">
                                                                <p className="truncate text-[#4A90E2] text-[15px] cursor-pointer hover:underline-offset-4 hover:underline">{element.title}</p>
                                                                <p className="text-[16px] font-normal">{infoClass.name}</p>
                                                                <p>{formattedDate}</p>
                                                            </div>
                                                        </di>
                                                    </div>
                                                )
                                            }
                                            {
                                                type !== 'Sinh viên' && (
                                                    <div key={index} onClick={(e) => {
                                                        e.preventDefault();
                                                        navigate(`/main/${path.TOPIC}/${element.announcements.id}/announcements/${btoa(element.id)}`);
                                                    }} className="w-full grid grid-cols-[90%] cursor-pointer">
                                                        <di className="flex items-center gap-4 mb-5">
                                                            <div>
                                                                <TfiAnnouncement />
                                                            </div>
                                                            <div className="flex flex-col text-[13px] overflow-auto ">
                                                                <p className="truncate text-[#4A90E2] text-[15px] cursor-pointer hover:underline-offset-4 hover:underline">{element.title}</p>
                                                                <p className="text-[16px] font-normal">{element.announcements.title + ' ' + element.announcements.id}</p>
                                                                <p>{formattedDate}</p>
                                                            </div>
                                                        </di>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    );

                                })
                            }

                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Notification;
