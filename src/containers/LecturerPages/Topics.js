import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import { Backdrop, CircularProgress } from '@mui/material';
import { InputForm } from "../../components";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import * as topicService from '../../services/topicService'
import Notification from "../../components/Notification"
import { IoMdNotifications } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { GoSearch } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useTitle } from "react-use"
import { FaEdit } from "react-icons/fa";
import * as CryptoJS from '../../utils/crypto'


const Topic = () => {
    useTitle('Topics')
    let listShoolYear = ['2023-2024', '2024-2025', '2025-2026']
    const [loading, setLoading] = useState(true)
    const [topicData, setTopicData] = useState([]);
    const [del, setDel] = useState(false);
    const [change, setChange] = useState(false)
    const [add, setAdd] = useState(false)
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false)
    const [value, setValue] = useState(listShoolYear[0])
    const [invalidFields, setInvalidFields] = useState([])
    const { token } = useSelector(state => state.auth)
    const userid = token ? jwtDecode(token).id : ""
    const type = token ? jwtDecode(token).type : ""
    const listColorsBg = ['bg-bgr1', 'bg-bgr2', 'bg-bgr3']
    const listColorsText = ['text-bgr1', 'text-bgr2', 'text-bgr3']
    const [search, setSearch] = useState('')
    const navigate = useNavigate();
    const [payload, setPayload] = useState({
        id: '',
        title: '',
        description: '',
        quantity: '',
        schoolyear: value,
        userid: userid
    })
    //
    const cancle = () => {
        setPayload(prev => ({ ...prev, id: '' }))
        setPayload(prev => ({ ...prev, title: '' }))
        setPayload(prev => ({ ...prev, description: '' }))
        setPayload(prev => ({ ...prev, quantity: '' }))
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
                case 'id':
                    if (item[1] === '') {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Thông tin không được bỏ trống!'
                        }]);
                        invalids++;
                    }
                    if (item[1].length !== 8) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Id bao gồm 8 ký tự.'
                        }]);
                        invalids++;
                    }
                    break;
                case 'userid':
                    // if (isNaN(item[1])) {
                    //     setInvalidFields(prev => [...prev, {
                    //         name: item[0],
                    //         message: 'Userid chỉ bao gồm ký tự số.'
                    //     }]);
                    //     invalids++;
                    // }
                    if (item[1].length !== 10) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Userid bao gồm 8 ký tự.'
                        }]);
                        invalids++;
                    }
                    break;
                case 'quantity':
                    if(isNaN(item[1])) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'số lượng chỉ bao gồm ký tự số'
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
    const getTopic = async () => {
        if (type !== '' && userid !== '') {
            const response = await topicService.apiGetTopic({ userid: userid, schoolyear: value, type: type });
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
                setLoading(false);
                return response.data.data
            }
        }
    }
    //
    //
    const fetchData = async () => {
        const topicData = await getTopic();
        if (topicData !== null) {
            setTopicData(topicData);
            //console.log(postData) // Thiết lập postData chỉ khi có dữ liệu hợp lệ
        }
    };
    //
    // useEffect(() => {
    //     fetchData();
    // }, []);
    useEffect(() => {
        fetchData();
    }, [value]);
    // tạo topic
    const handleSubmit = async () => {
        let inval = validate(payload);
        if (inval === 0) {
            setLoading(true);
            const response = await topicService.apiCreateTopic(payload);
            if (response?.status !== 200 || response?.data?.err === 2) {
                setLoading(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.data.msg ? response.data.msg : "",
                    footer: '<a href="#">Why do I have this issue?</a>',
                    showConfirmButton: true,
                });
                // console.log(response.data.err)
            } else {
                setLoading(false);
                cancle();
                setInvalidFields([])
                setAdd(prev => !prev)
                fetchData()
            }
        }
    }
    // edit
    const editTopic = async () => {
        let inval = validate(payload);
        if (inval === 0) {
            setLoading(true);
            const response = await topicService.apiEditTopic(payload);
            if (response?.status !== 200 || !response?.data?.err === '2') {
                setLoading(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.data.msg ? response.data.msg : "",
                    footer: '<a href="#">Why do I have this issue?</a>',
                    showConfirmButton: true,
                });
                // console.log(response.data.err)
            } else {
                setLoading(false);
                setChange(prev => !prev);
                cancle();
                setInvalidFields([])
                fetchData()
            }
        }
    }
    // xoas
    const deleteTopic = async (id) => {
        setLoading(true);
        const response = await topicService.apiDeleteTopic({ id: id });
        if (response?.status !== 200 || !response?.data?.err === '2') {
            setLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.data.msg ? response.data.msg : "",
                footer: '<a href="#">Why do I have this issue?</a>',
                showConfirmButton: true,
            });
            // console.log(response.data.err)
        } else {
            setLoading(false);
            fetchData()
        }
    }
    //
    const pageSize = 6;

    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

    const totalPages = Math.ceil(topicData?.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="h-full flex justify-between bg-gray-50">
            <div className="xl:w-4/6 w-full">
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
                {
                    add && (
                        <div className="fixed inset-0 flex justify-center items-center z-50 w-full">
                            <div className="relative">
                                <div className="bg-gray-400 opacity-70 fixed inset-0 z-60" onClick={() => { setAdd(prev => !prev); cancle(); setInvalidFields([]) }}></div>
                                <div className="flex justify-start gap-2 items-center  flex-col bg-white w-full  sm:w-[400px]  z-70 rounded-xl relative p-3">
                                    <div className=" inset-0 flex justify-center items-start text-[25px] text-primary">Thông tin đề tài</div>
                                    <InputForm label={'ID đề tài'} value={payload.id} setValue={setPayload} type={'id'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                    <InputForm label={'Tiêu đề'} value={payload.title} setValue={setPayload} type={'title'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                    <InputForm label={'Mô tả'} value={payload.description} setValue={setPayload} type={'description'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                    <InputForm label={'Số lượng'} value={payload.quantity} setValue={setPayload} type={'quantity'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                    <InputForm label={'Năm học'} value={payload.schoolyear} setValue={setPayload} type={'shoolyear'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                    <InputForm label={'Người tạo'} value={payload.userid} setValue={setPayload} type={'userid'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                    <button onClick={(e) => { e.preventDefault(); handleSubmit(); }} class=" w-full my-4 md:w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Thêm mới</button>
                                </div>
                                <IoClose className="absolute top-2 right-2 text-[25px] cursor-pointer" onClick={() => { setAdd(prev => !prev); cancle(); setInvalidFields([]) }} />
                            </div>
                        </div>
                    )
                }
                {
                    change && (
                        <div className="fixed inset-0 flex justify-center items-center z-50 w-full">
                            <div className="relative">
                                <div className="bg-gray-400 opacity-70 fixed inset-0 z-60" onClick={() => { setChange(prev => !prev); cancle(); setInvalidFields([]) }}></div>
                                <div className="flex justify-start gap-2 items-center  flex-col bg-white w-full  sm:w-[400px]  z-70 rounded-xl relative p-3">
                                    <div className=" inset-0 flex justify-center items-start text-[25px] text-primary">Thông tin đề tài</div>
                                    <InputForm label={'ID đề tài'} value={payload.id} setValue={setPayload} type={'id'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                    <InputForm label={'Tiêu đề'} value={payload.title} setValue={setPayload} type={'title'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                    <InputForm label={'Mô tả'} value={payload.description} setValue={setPayload} type={'description'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                    <InputForm label={'Số lượng'} value={payload.quantity} setValue={setPayload} type={'quantity'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                    <InputForm label={'Năm học'} value={payload.schoolyear} setValue={setPayload} type={'shoolyear'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                    <InputForm label={'Người tạo'} value={payload.userid} setValue={setPayload} type={'userid'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                    <button onClick={(e) => { e.preventDefault(); editTopic(); }} class=" w-full my-4 md:w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Cập nhật</button>
                                </div>
                                <IoClose className="absolute top-2 right-2 text-[25px] cursor-pointer" onClick={() => { setChange(prev => !prev); cancle(); setInvalidFields([]) }} />
                            </div>
                        </div>
                    )
                }
                <div className="flex justify-between items-center">
                    <div className="flex justify-around items-center">
                        <div class="z-0 px-4 h-[35px] rounded-md tracking-wider border-[1px] w-[200px] border-gray-300 hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer flex items-center">
                            <input type="text" class="m-auto w-full outline-none text-[13px]" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            <GoSearch />
                        </div>
                        <button onClick={() => { setAdd(true); }} class="ml-5  w-[100px] bg-gray-100 border-gray-200 border rounded-xl text-primary py-[6px] hover:text-white hover:bg-primary duration-100 ">Add+</button>
                        <button onClick={() => { setEdit(prev => !prev); }} class=" ml-5  w-[100px] bg-gray-100 border-gray-200 border rounded-xl text-primary py-[6px] hover:text-white hover:bg-primary duration-100">Edit</button>
                        <button onClick={() => { setDel(prev => !prev); }} class=" ml-5  w-[100px] bg-gray-100 border-gray-200 border rounded-xl text-primary py-[6px] hover:text-white hover:bg-primary duration-100">Delete</button>
                    </div>
                    <div className="relative flex flex-col items-center py-2 w-[130px] min-w-[130px] 2xl:w-[200px] rounded-lg" onClick={() => setOpen((prev) => !prev)}>
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
                                                <div onClick={() => { setValue(item); setPayload(prev => ({ ...prev, schoolyear: item })) }} key={i} className="h-[25px] hover:text-primary hover:bg-gray-100 w-full cursor-pointer px-4">
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
                <div className="w-full z-10  pt-10">
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
                        {topicData?.filter((item) => {
                            return item.description.toLowerCase().includes(search.toLowerCase());
                        }).slice((currentPage - 1) * pageSize, currentPage * pageSize).map((element, index) => {
                            let colorIndex = index % listColorsBg.length;
                            // console.log(element.lecturerTopic.name)
                            return (
                                <div key={index}>
                                    <div className={`relative rounded-lg flex flex-col gap-2 shadow-lg cursor-pointer ${listColorsBg[colorIndex]}`}>
                                        <div onClick={() => {
                                            navigate(`${element.id}`)
                                        }}>
                                            <div className="flex justify-between items-center text-white m-3 hover:text-orange-400">
                                                <p className="">{element.title}</p>
                                                <IoMdNotifications className="text-[25px] hover:text-orange-400" />
                                            </div>
                                            <div className="h-[80px]"></div>
                                            <div className={`bg-white flex flex-col p-3 hover:text-orange-600 ${listColorsText[colorIndex]}`}>
                                                <p className="text-[12px] text-ellipsis">Mô tả: {element.description}</p>
                                                <p className="text-[11px] text-ellipsis">Giảng viên: {CryptoJS.decrypted(element.lecturerTopic.name)}</p>
                                            </div>
                                        </div>
                                        {
                                            del && (
                                                <div className="absolute -top-[1.2rem] flex items-center justify-center -right-4 w-10 h-10">
                                                    <IoClose className={`cursor-pointer text-[25px] text-white rounded-full ${listColorsBg[colorIndex]} hover:text-orange-400`}
                                                        onClick={() => {deleteTopic(element.id)}} />
                                                </div>
                                            )
                                        }
                                        {
                                            edit && (
                                                <div className={`absolute bottom-[5rem] flex items-center justify-center left-[90%] w-10 h-10 rounded-full ${listColorsBg[colorIndex]}`}>
                                                    <FaEdit className={`cursor-pointer text-white text-[20px] hover:text-orange-400`}
                                                        onClick={() => {
                                                            setChange(prev => !prev)
                                                            setPayload((prev) => ({
                                                                ...prev,
                                                                id: element.id,
                                                                title: element.title,
                                                                description: element.description,
                                                                quantity: element.quantity,
                                                            }))
                                                        }} />
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            );

                        })}
                    </div>
                </div>
                {
                    topicData?.length > pageSize && (
                        <div className="flex justify-center mt-4 gap-2 text-gray-500 items-center">
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
            <div className="w-[270px] h-full z-0 sticky top-[66px] hidden xl:block">
                <Notification />
            </div>
        </div>
    )
}

export default Topic