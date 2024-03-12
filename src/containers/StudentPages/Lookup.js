import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import { Backdrop, CircularProgress } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import Notification from "../../components/Notification"
import { IoMdNotifications } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import * as groupService from "../../services/groupService"
import { useTitle } from "react-use"
import { useNavigate } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";


const Lookup = () => {
    useTitle('Tra cứu')
    const navigate = useNavigate()
    let listShoolYear = ['2023-2024', '2024-2025', '2025-2026']
    const [loading, setLoading] = useState(false)
    const [topicData, setTopicData] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(listShoolYear[0])
    const { token } = useSelector(state => state.auth)
    const userid = token ? jwtDecode(token).id : ""
    // const type = token ? jwtDecode(token).type : ""
    const listColorsBg = ['bg-bgr1', 'bg-bgr2', 'bg-bgr3']
    const listColorsText = ['text-bgr1', 'text-bgr2', 'text-bgr3']
    const [search, setSearch] = useState('')
    //
    const getTopic = async () => {
        if (token) {
            const response = await groupService.apiGetGroup({ studentid: userid, schoolyear: value });
            setLoading(true);
            if (response.status !== 200 || response.data.err !== 0) {
                setLoading(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.data.msg ? response.data.msg : "",
                    footer: '<a href="#">Why do I have this issue?</a>',
                    showConfirmButton: true,
                });
            } else {
                setLoading(false);
                return response.data.data
            }
        }
    }
    //
    const denyTopic = async (id) => {
        Swal.fire({
            title: "Bạn có muốn hủy đăng ký không?",
            text: "Nếu muốn, hãy nhấn có!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Vâng, tôi có!",
            cancelButtonText: "Đóng"
        }).then((result) => {
            if (result.isConfirmed) {
                new Promise((resolve, reject) => {
                    const response = groupService.apiRemoveFromGroup({ studentid: userid, topicid: id })
                    resolve(response)
                }).then((response) => {
                    if (response.status !== 200 || response.data.err !== 0) {
                        setLoading(false)
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: response?.data?.msg ? response?.data?.msg : "",
                            footer: '<a href="#">Why do I have this issue?</a>',
                            showConfirmButton: true,
                        });
                    } else {
                        Swal.fire({
                            title: "Thành công!",
                            text: "Vui lòng quay lại trang đăng ký để tiếp tục đăng ký.",
                            icon: "success"
                        });
                        fetchData()
                    }
                })              
            }
        });
    }
    //
    const fetchData = async () => {
        const topicData = await getTopic();
        if (topicData !== null) {
            setTopicData(topicData);
            //console.log(postData) // Thiết lập postData chỉ khi có dữ liệu hợp lệ
        }
    };
    useEffect(() => {
        fetchData();
    }, [value]);

    const pageSize = 6;

    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

    const totalPages = Math.ceil(topicData?.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <div className="h-full flex justify-between">
            <div className="w-full xl:w-4/6 ">
                {
                    loading && (
                        <div>
                            <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={loading}
                            >
                                <CircularProgress color="inherit" />
                            </Backdrop>
                        </div>
                    )
                }
                <div className="flex justify-between items-center">
                    <div class="z-0 px-4 h-[35px] rounded-md tracking-wider border-[1px] w-[200px] border-gray-300 hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer flex items-center">
                        <input type="text" class="m-auto w-full outline-none text-[13px]" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <GoSearch className="" />
                    </div>
                    <div className="relative flex flex-col items-center py-2 w-[130px]xl:w-[300px] rounded-lg" onClick={() => setOpen((prev) => !prev)}>
                        <div className="w-full relative">
                            <button className="p-4 z-0 h-[35px] flex w-full items-center justify-between text-[13px] rounded-md tracking-wider border-[1px] border-gray-300  hover:border-primary hover:text-primary transition-all duration-200">
                                {value}
                                {
                                    !open ? (<AiOutlineCaretDown className="h-4" />) : (<AiOutlineCaretUp className="h-4" />)
                                }
                            </button>
                            <p className="absolute text-[10px] text-gray-400 -top-[7px] bg-gray-100 z-10 left-[10px]">Chọn năm học</p>
                        </div>
                        {
                            open && (
                                <div className="absolute top-full w-full gap-1 z-10 text-[13px] border-gray-200 bg-white rounded-md shadow-lg flex flex-col items-start justify-start py-1">
                                    {
                                        listShoolYear.map((item, i) => {
                                            return (
                                                <div onClick={() => { setValue(item) }} key={i} className="h-[25px] hover:text-primary hover:bg-gray-100 w-full cursor-pointer px-4">
                                                    <p>{item}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="w-full z-10 pt-10">
                    {
                        topicData?.length === 0 && (
                            <div className="flex w-full justify-center items-center m-auto">
                                <p className="opacity-70 text-primary">Không tìm thấy thông tin lớp học. Vui lòng thực hiện đăng ký!</p>
                            </div>
                        )
                    }
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 ">
                        {topicData?.filter((item) => {
                            return item.topics.description.toLowerCase().includes(search.toLowerCase());
                        }).
                            slice((currentPage - 1) * pageSize, currentPage * pageSize).map((element, index) => {
                                let colorIndex = index % listColorsBg.length;
                                // console.log(element.lecturerTopic.name)
                                return (
                                    <div className="relative" key={index} onClick={(e) => { if (element.isadded) { e.preventDefault(); navigate(`${element.topicid}`) } }}>
                                        <div className={`relative rounded-lg flex flex-col gap-2 shadow-lg cursor-pointer ${listColorsBg[colorIndex]}`}>
                                            <div className="relative">
                                                <div className="flex justify-between items-center text-white m-3 hover:text-orange-400">
                                                    <p className="">{element.name}</p>
                                                    <IoMdNotifications className="text-[25px] hover:text-orange-400" />
                                                </div>
                                                <div className="h-[100px]"></div>
                                                <div className={`bg-white flex flex-col p-3  ${listColorsText[colorIndex]}`}>
                                                    <p className="text-[12px] text-ellipsis">Mô tả: {element.topics.description}</p>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[11px]">Trạng thái : {element.isadded ? 'Đã chấp nhận' : 'Đang xét duyệt'}</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        {
                                            !element?.isadded && (
                                                <button onClick={(e) => { e.preventDefault(); denyTopic(element?.topicid) }} className={`absolute right-1 bottom-1 rounded-2xl text-white text-[13px] px-3 py-[3px] hover:text-orange-300 ${listColorsBg[colorIndex]}`}>Hủy</button>
                                            )
                                        }
                                    </div>
                                );

                            })}
                    </div>
                </div>
                <div className="flex justify-center mt-4 gap-2 text-gray-500 items-center">
                    {topicData && currentPage > 1 && (
                        <button className="h-[20px] w-[20px] rounded-full hover:text-orange-500 bg-gray-100 text-[13px]" onClick={() => handlePageChange(currentPage - 1)}>{'<'}</button>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button className="h-[30px] w-[30px] rounded-full hover:text-orange-500 bg-gray-100" key={i} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                    ))}
                    {topicData && currentPage < totalPages && (
                        <button className="h-[20px] w-[20px] rounded-full hover:text-orange-500 bg-gray-100 text-[13px]" onClick={() => handlePageChange(currentPage + 1)}>{'>'}</button>
                    )}
                </div>
            </div>
            <div className="w-[270px] hidden xl:block h-full z-0 sticky top-[66px]">
                <Notification />
            </div>
        </div>
    );
}


export default Lookup