import React, { useEffect, useState } from "react";
import { useTitle } from "react-use"
import * as userService from "../services/userService"
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { Backdrop, CircularProgress } from '@mui/material';
import User from "../assets/user.jpg"
import * as CryptoJS from "../utils/crypto"
import { FiCamera } from "react-icons/fi";

const Profile = () => {
    useTitle('Thông tin cá nhân')
    const { token } = useSelector(state => state.auth)
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)
    const id = token ? jwtDecode(token).id : ''
    const type = token ? jwtDecode(token).type : ''
    //
    const getUser = async () => {
        setLoading(true);
        if (id && type) {
            const response = await userService.apiGetUser({ id: id, type: type })
            setLoading(true);
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
    const fetchData = async () => {
        const user = await getUser();
        if (user) {
            setUser(user)
            // console.log(user.lecturerAccount.email)
        }
    }
    //
    useEffect(() => {
        fetchData()
    }, [])
    //
    return (
        <div className="w-full xl:border rounded-lg h-[500px] p-10 bg-gray-50">
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
            <div className="w-full h-[280px] flex xl:border-b-[3px] py-7 xl:border-b-orange-500 flex-col xl:flex-row items-center gap-10">
                <div className="h-[300px] lg:h-full w-[250px] border border-gray-300 rounded-xl relative">
                    <img src={User} className="rounded-xl" />
                    <div className="h-[50px] w-[50px] rounded-full bg-primary bottom-3 right-3 cursor-pointer text-gray-300 hover:text-orange-500 absolute flex justify-center items-center">
                        <FiCamera className="text-[25px]" />
                    </div>
                </div>
                <div className="ml-5 w-full">
                    <h1 className="font-bold pb-2 text-[19px] text-primary xl:border-b-[3px] w-full border-orange-500">THÔNG TIN CƠ BẢN</h1>
                    <div className="grid xl:grid-cols-4 py-3 sm:grid-cols-2 grid-cols-1 md:gap-2 mb-24 md:mb-0">
                        <div className="flex flex-col gap-0 md:gap-5 min-w-[200px]">
                            <div className="flex items-center md:items-start gap-3 md:flex-col md:gap-1">
                                <h1 className="font-semibold">{type === 'Sinh viên' ? 'Mã SV:' : 'Mã GV'}</h1>
                                <p className="text-[14px]">{user.id}</p>
                            </div>
                            <div className="flex items-center md:items-start gap-3 md:flex-col md:gap-1">
                                <h1 className="font-semibold">Họ và tên:</h1>
                                <p className="text-[14px]">{CryptoJS.decrypted(user.name)}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-0 md:gap-5">
                            <div className="flex items-center md:items-start gap-3 md:flex-col md:gap-1">
                                <h1 className="font-semibold">Ngày sinh:</h1>
                                <p className="text-[14px]">{CryptoJS.decrypted(user.dob)}</p>
                            </div>
                            <div className="flex items-center md:items-start gap-3 md:flex-col md:gap-1">
                                <h1 className="font-semibold">Email:</h1>
                                <p className="text-[14px]">{type === 'Sinh viên' ? user.studentAccount?.email : user.lecturerAccount?.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-0 md:gap-5">
                            <div className="flex items-center md:items-start gap-3 md:flex-col md:gap-1">
                                <h1 className="font-semibold">Lớp:</h1>
                                <p className="text-[14px]">{user.class ? CryptoJS.decrypted(user.class) : 'Không có dữ liệu'}</p>
                            </div>
                            <div className="flex items-center md:items-start gap-3 md:flex-col md:gap-1">
                                <h1 className="font-semibold text-nowrap">Chuyên ngành:</h1>
                                <p className="text-[14px] truncate">{CryptoJS.decrypted(user.major)}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-0 md:gap-5">
                            <div className="flex items-center md:items-start gap-3 md:flex-col md:gap-1">
                                <h1 className="font-semibold text-nowrap">Khoa quản lý:</h1>
                                <p className="text-[14px] truncate">{CryptoJS.decrypted(user.department)}</p>
                            </div>
                            <div className="flex items-center md:items-start gap-3 md:flex-col md:gap-1">
                                <h1 className="font-semibold">Trạng thái:</h1>
                                <p className="text-[14px]">{user.isActive ? 'Đang hoạt động' : 'Dừng họat động'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Profile