import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { useSelector } from "react-redux"
import { jwtDecode } from "jwt-decode";
import { InputForm } from "../components";
import * as announcementService from "../services/announcementService"
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import user from "../assets/user.jpg"
import { useNavigate } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Backdrop, CircularProgress } from '@mui/material';
import { useTitle } from "react-use"

const Announcements = () => {
    useTitle('Announcements')
    const navigate = useNavigate()
    const { topicid } = useParams();
    const [search, setSearch] = useState('')
    const [anData, setAnData] = useState([])
    const [isAdd, setIsAdd] = useState(false)
    const [loading, setLoading] = useState(false)
    const [change, setChange] = useState(false)
    const [payload, setPayload] = useState({
        title: '',
        content: ''
    })
    const [invalidFields, setInvalidFields] = useState([])
    const { token } = useSelector(state => state.auth)
    const type = token ? jwtDecode(token).type : '';
    const userid = token ? jwtDecode(token).id : '';
    const cancle = () => {
        setInvalidFields([])
        setPayload(prev => ({ ...prev, title: '' }))
        setPayload(prev => ({ ...prev, content: '' }))
    }

    const validate = () => {
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
        return invalids;
    }
    //
    const handleSubmit = async () => {
        // console.log({...payload, content : payload.content.replace(/\n/g, '<br>')})
        const inval = validate()
        if (inval === 0) {
            setLoading(true);
            const response = await announcementService.apiCreateAnnouncement({ ...payload, topicid: topicid, userid: userid })
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
                setIsAdd(false)
                cancle();
                fetchData()
            }
        }
    }
    //
    const editAnnouncement = async () => {
        // console.log({...payload, content : payload.content.replace(/\n/g, '<br>')})
        const inval = validate()
        if (inval === 0) {
            setLoading(true);
            const response = await announcementService.apiEditAnnouncement({ ...payload })
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
                setChange(false)
                cancle();
                fetchData()
            }
        }
    }
    //
    const deleteAnnouncement = async (id) => {
        const response = await announcementService.apiDeleteAnnouncement({ id: id })
        if (response.status !== 200 || response.data.err !== 0) {
            setLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.data.msg ? response.data.msg : "",
                footer: '<a href="#">Why do I have this issue?</a>',
                showConfirmButton: true,
            })
        } else {
            fetchData()
        }
    }
    // lấy thông báo
    const getAllAnnouncement = async () => {
        setLoading(true);
        const response = await announcementService.apiGetAllAnnouncements({ topicid })
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
            setLoading(false)
            // console.log(response?.data?.data)
            return response?.data?.data
        }

    }
    //
    const fetchData = async () => {
        const AnData = await getAllAnnouncement();
        if (AnData !== null) {
            setAnData(AnData);
        }
    };
    //
    useEffect(() => {
        fetchData();
    }, [])
    //
    // const convertToHtml = (text) => {
    //     // Sử dụng DOMParser để chuyển đổi text thành HTML
    //     const parser = new DOMParser();
    //     const htmlDoc = parser.parseFromString(text, 'text/html');
    //     const htmlString = htmlDoc.documentElement.textContent;

    //     return htmlString;
    // };
    //
    const pageSize = 3;

    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

    const totalPages = Math.ceil(anData?.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="mt-8 w-full ">
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
            {isAdd && (
                <div className="fixed inset-0 flex justify-center items-center z-50 w-full">
                    <div className="relative" onKeyDown={(e) => {
                        // console.log(e.key)
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSubmit()
                        }
                    }}>
                        <div className="bg-gray-400 opacity-70 fixed inset-0 z-60" onClick={(e) => { setIsAdd(prev => !prev); cancle(); setInvalidFields([]) }}></div>
                        <div className="flex justify-start gap-5 items-center  flex-col bg-white w-[400px]  sm:w-[600px]  z-70 rounded-xl relative p-3">
                            <div className=" inset-0 flex justify-center items-start text-[25px] text-primary">Tạo thông báo</div>
                            <InputForm label={'Tiêu đề'} value={payload.title} setValue={setPayload} type={'title'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                            <div className="w-full">
                                <label htmlFor="" className="text-[12px] ml-2">Nội dung</label>
                                <textarea color="blue-gray" placeholder="Nội dung" className="p-2 h-[300px] rounded-xl focus:border-gray-400 w-full outline-none border text-[13px]" value={payload.content} onChange={(e) => setPayload(prev => ({ ...prev, content: e.target.value }))} />
                                {
                                    invalidFields.length > 0 && invalidFields.some(i => i.name === 'content') &&
                                    <small className="text-red-600 italic">{invalidFields.find(i => i.name === 'content')?.message}</small>
                                }
                            </div>
                            <button onClick={(e) => { e.preventDefault(); handleSubmit(); }} class=" my-2 w-full md:w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Thêm mới</button>
                        </div>
                        <MdOutlineClose className="absolute top-2 right-2 text-[25px] cursor-pointer" onClick={() => { setIsAdd(prev => !prev); cancle(); setInvalidFields([]) }} />
                    </div>
                </div>
            )}
            {change && (
                <div className="fixed inset-0 flex justify-center items-center z-50 w-full">
                    <div className="relative" onKeyDown={(e) => {
                        // console.log(e.key)
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            editAnnouncement()
                        }
                    }}>
                        <div className="bg-gray-400 opacity-70 fixed inset-0 z-60" onClick={(e) => { setChange(prev => !prev); cancle(); setInvalidFields([]) }}></div>
                        <div className="flex justify-start gap-5 items-center  flex-col bg-white w-full  sm:w-[600px]  z-70 rounded-xl relative p-3">
                            <div className=" inset-0 flex justify-center items-start text-[25px] text-primary">Thông báo</div>
                            <InputForm label={'Tiêu đề'} value={payload.title} setValue={setPayload} type={'title'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                            <div className="w-full">
                                <label htmlFor="" className="text-[12px] ml-2">Nội dung</label>
                                <textarea color="blue-gray" placeholder="Nội dung" className="p-2 h-[300px] rounded-xl focus:border-gray-400 w-full outline-none border text-[13px]" value={payload.content} onChange={(e) => setPayload(prev => ({ ...prev, content: e.target.value }))} />
                                {
                                    invalidFields.length > 0 && invalidFields.some(i => i.name === 'content') &&
                                    <small className="text-red-600 italic">{invalidFields.find(i => i.name === 'content')?.message}</small>
                                }
                            </div>
                            <button onClick={(e) => { e.preventDefault(); editAnnouncement() }} class=" my-2 w-full md:w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Cập nhật</button>
                        </div>
                        <MdOutlineClose className="absolute top-2 right-2 text-[25px] cursor-pointer" onClick={() => { setChange(prev => !prev); cancle(); setInvalidFields([]) }} />
                    </div>
                </div>
            )}
            <div className="flex justify-between">
                <div class="justify-end z-0 px-4 h-[35px] rounded-md tracking-wider border-[1px] max-w-[50%] min-w-[50%] border-gray-300 hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer flex items-center">
                    <input type="text" class="m-auto w-full outline-none text-[13px]" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <GoSearch className="" />
                </div>
                {
                    token && type === "Giảng viên/nhân viên" && (
                        <button onClick={(e) => { e.preventDefault(); setIsAdd(true) }} className="h-[35px] text-[13px] w-[30%] border-[1px] rounded-md bg-gray-100 hover:bg-primary hover:text-white duration-100">Tạo thông báo</button>
                    )
                }
            </div>
            <div className="mt-4 w-[97%] flex flex-col gap-10 min-w-[600px]">
                {
                    anData?.filter((item) => {
                        return item.title.toLowerCase().includes(search.toLowerCase());
                    })
                        .slice((currentPage - 1) * pageSize, currentPage * pageSize).map((element, index) => {
                            // console.log(element.lecturerTopic.name)
                            const formattedDate = new Date(element.createdAt).toLocaleString();
                            return (
                                <div key={index} className="w-full relative">
                                    <hr />
                                    <div className="grid grid-cols-[10%,55%,20%,10%] items-center gap-10 w-full mt-3">
                                        <div className="flex items-center justify-center">
                                            <img src={user} className="h-[50px] w-[50px]" />
                                        </div>
                                        <div onClick={() => { navigate(`${btoa(element.id.toString())}`) }} className="flex flex-col overflow-auto gap-2 cursor-pointer">
                                            <p className="font-semibold text-[15px] hover:underline">{element.title}</p>
                                            <p className="text-[15px] truncate">{element.content}</p>
                                        </div>
                                        <div className="text-[13px] ">
                                            <p className="font-semibold">Ngày tạo</p>
                                            <p>{formattedDate}</p>
                                        </div>
                                        {
                                            type === 'Giảng viên/nhân viên' && (
                                                <div className="flex flex-col justify-between h-full">
                                                    <MdOutlineClose onClick={() => { deleteAnnouncement(element.id) }} className="text-[20px] cursor-pointer hover:text-orange-600" />
                                                    <FaEdit onClick={() => { setChange(prev => !prev); setPayload(prev => ({ ...prev, title: element.title, content: element.content, id: element.id })) }} className="text-[20px] cursor-pointer  hover:text-orange-600" />
                                                </div>
                                            )
                                        }
                                    </div>
                                    {/* {
                                        type === 'Giảng viên/nhân viên' && (
                                            <div onClick={() => { deleteAnnouncement(element.id) }} className="absolute top-2 right-10 cursor-pointer">
                                                <MdOutlineClose className="text-[20px]" />
                                            </div>
                                        )
                                    }
                                    {
                                        type === 'Giảng viên/nhân viên' && (
                                            <div onClick={() => { setChange(prev => !prev); setPayload(prev => ({ ...prev, title: element.title, content: element.content, id: element.id })) }} className="absolute bottom-2 right-10 cursor-pointer">
                                                <FaEdit className="text-[20px]" />
                                            </div>
                                        )
                                    } */}
                                </div>
                            );

                        })
                }

            </div>
            {
                anData?.length > pageSize && (
                    <div className="flex justify-center mt-10 gap-2 text-gray-500 items-center ">
                        {currentPage !== 1 && (
                            <button className="h-[20px] w-[20px] rounded-full hover:text-orange-500 bg-gray-100 text-[13px]" onClick={() => handlePageChange(currentPage - 1)}>{'<'}</button>
                        )}
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button className="h-[30px] w-[30px] rounded-full hover:text-orange-500 bg-gray-100" key={i} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                        ))}
                        {currentPage !== totalPages && (
                            <button className="h-[20px] w-[20px] rounded-full hover:text-orange-500 bg-gray-100 text-[13px]" onClick={() => handlePageChange(currentPage + 1)}>{'>'}</button>
                        )}
                    </div>
                )
            }
        </div>
    )
}

export default Announcements