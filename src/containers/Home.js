import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import { Backdrop, CircularProgress } from '@mui/material';
import { InputForm } from "../components";
import { jwtDecode } from "jwt-decode";
import * as postService from '../services/postService'
import Swal from "sweetalert2";
import { MdOutlineClose } from "react-icons/md";
import Notification from "../components/Notification";
import SlickComponent from "../components/SlickComponent"
import { useTitle } from "react-use"
import notificaton from "../assets/notification.png"

const Home = () => {
    useTitle('Home')
    //const { type } = useSelector(state => state.auth)
    const { token } = useSelector(state => state.auth)
    const id = token ? jwtDecode(token).id : ""
    const [loading, setLoading] = useState(true)
    const [postData, setPostData] = useState([]);
    const [add, setAdd] = useState(false)
    const [invalidFields, setInvalidFields] = useState([])
    //
    const listColorsBg = ['bg-bgr1', 'bg-bgr2', 'bg-bgr3']

    //
    const type = token ? jwtDecode(token).type : ''
    //
    const [payload, setPayload] = useState({
        title: '',
        description: '',
        link: '',
        userid: id
    })
    //
    const cancle = () => {
        setPayload(prev => ({ ...prev, title: '' }))
        setPayload(prev => ({ ...prev, description: '' }))
        setPayload(prev => ({ ...prev, link: '' }))
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
        // console.log(fields)
        return invalids;
    }
    //
    const handleSubmit = async () => {
        let inval = validate(payload);
        if (inval === 0) {
            setLoading(true)
            const response = await postService.apiCreatePost(payload);
            if (response.status !== 200) {
                setLoading(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.data.msg ? response.data.msg : "",
                    footer: '<a href="#">Why do I have this issue?</a>',
                    showConfirmButton: true,
                });
            } else {
                fetchData()
                setAdd(prev => !prev)
                cancle();
            }
            //console.log(payload);
        }
    }
    // lấy post
    const getPost = async () => {
        if (token) {
            const response = await postService.apiGetPost();
            if (response.status !== 200) {
                setLoading(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.data.msg ? response.data.msg : "",
                    footer: '<a href="#">Why do I have this issue?</a>',
                    showConfirmButton: true,
                });
            } else {
                return response.data.data
            }
        }
    }
    // xóa post
    const deletePost = async (id) => {
        setLoading(true);
        const response = await postService.apiDeletePost({ id: id });
        if (response.status !== 200) {
            setLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.data.msg ? response.data.msg : "",
                footer: '<a href="#">Why do I have this issue?</a>',
                showConfirmButton: true,
            });
        } else {
            fetchData()
        }
    }
    //
    const fetchData = async () => {
        const postData = await getPost();
        if (postData !== null) {
            setPostData(postData);
            setLoading(false);
            //console.log(postData) // Thiết lập postData chỉ khi có dữ liệu hợp lệ
        }
    };
    //
    useEffect(() => {
        fetchData();
    }, []);
    // phân trang

    const pageSize = 3;

    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

    const totalPages = Math.ceil(postData?.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    return (
        <div className="w-full flex px-1 justify-between bg-gray-50">
            <div className="w-full xl:w-4/6 ">
                {loading && (
                    <div>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading}
                            onClick={() => { }} // Đặt hàm navigate vào trong một hàm gọi lại
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    </div>
                )}
                {add && (
                    <div className="fixed inset-0 flex justify-center items-center z-50 w-full">
                        <div className="relative">
                            <div className="bg-gray-400 opacity-70 fixed inset-0 z-60" onClick={() => { setAdd(prev => !prev); cancle(); setInvalidFields([]) }}></div>
                            <div className="flex justify-start gap-2 items-center  flex-col bg-white w-full  sm:w-[400px]  z-70 rounded-xl relative p-3">
                                <div className=" inset-0 flex justify-center items-start text-[25px] text-primary">Thông báo</div>
                                <InputForm label={'Tiêu đề'} value={payload.title} setValue={setPayload} type={'title'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                <InputForm label={'Mô tả'} value={payload.description} setValue={setPayload} type={'description'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                <InputForm label={'Đường dẫn'} value={payload.link} setValue={setPayload} type={'link'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                <InputForm label={'Người tạo'} value={payload.userid} setValue={setPayload} type={'userid'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                <button onClick={(e) => { e.preventDefault(); handleSubmit(); }} class=" w-full my-4 md:w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Thêm mới</button>
                            </div>
                            <MdOutlineClose className="absolute top-2 right-2 text-[25px] cursor-pointer" onClick={() => { setAdd(prev => !prev); cancle(); setInvalidFields([]) }} />
                        </div>
                    </div>
                )}
                {
                    type === "Quản trị viên" && (
                        <div>
                            <button onClick={() => { setAdd(true); }} class=" my-2 w-full md:w-[100px] bg-gray-100 border border-gray-300 rounded-xl py-2 hover:bg-primary hover:text-white duration-100 h-[40px]">Add+</button>
                        </div>
                    )
                }
                <div className="flex flex-col gap-2 items-center h-full">
                    <div className="w-full mb-5">
                        <SlickComponent />
                    </div>
                    <div className="w-full z-10">
                        <hr className="border-gray-200 mx-[30%]" />
                        <div className="border-l-4 rounded-sm border-orange-500 my-4">
                            <p className="ml-4 text-primary">Tin tức</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 ">
                            {postData?.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((element, index) => {
                                let colorIndex = index % listColorsBg.length;
                                // console.log(listColors[colorIndex])
                                return (
                                    <div key={index}>
                                        <div className={`relative rounded-lg flex flex-col gap-2 shadow-lg`}>
                                            <a href={element.link} target="_blank" className="no-underline">
                                                <div className="rounded-t-xl overflow-hidden">
                                                    <img src={notificaton} className="object-cover "></img>
                                                    <div className="flex hover:text-orange-600 flex-col p-2 text-primary opacity-90 text-ellipsis whitespace-nowrap text-[12px]">
                                                        <p className="">Tiêu đề : {element.title}</p>
                                                        <p className="text-[10px]"> Mô tả : {element.description}</p>
                                                    </div>
                                                </div>
                                            </a>
                                            {type === 'Quản trị viên' && (
                                                <div className="absolute -top-[1.2rem] flex items-center justify-center -right-4 w-10 h-10">
                                                    <MdOutlineClose className={`cursor-pointer text-[25px] text-white rounded-full ${listColorsBg[colorIndex]} hover:text-orange-400`}
                                                        onClick={() => { deletePost(element.id) }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );

                            })}
                        </div>
                    </div>
                </div>
                {
                    totalPages > 1 && (
                        <div className="flex justify-center mt-2 gap-2 text-gray-500 items-center">
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
            <div className="w-[270px] h-full z-0 sticky top-[66px]">
                <Notification />
            </div>
        </div>
    );
}


export default Home