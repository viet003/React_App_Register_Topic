import React, { useState } from "react";
import { useSelector } from "react-redux"
import { Backdrop, CircularProgress } from '@mui/material';
import { InputForm } from "../components";

const Home = () => {
    const { type } = useSelector(state => state.auth)
    const [loading, setLoading] = useState(false)
    const [add, setAdd] = useState(false)

    const [payload, setPayload] = useState({
        title: '',
        description: '',
        link: '',
        userid : ''
    })

    const cancle = () => {
        setPayload(prev => ({...prev,title:''}))
        setPayload(prev => ({...prev,description:''}))
        setPayload(prev => ({...prev,link:''}))
    }

    const handleSubmit = () => {

    }

    return (
        <div className="h-full w-full ">
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
            {add && (
                <div className="fixed inset-0 flex justify-center items-center z-50 w-full">
                <div className="bg-gray-400 opacity-70 fixed inset-0 z-60" onClick={() => { setAdd(prev => !prev); cancle() }}></div>
                <div className="flex justify-start gap-2 items-center  flex-col bg-white w-full h-full sm:w-[540px] xl:h-[500px] z-70 rounded-xl relative px-3">
                    <div className=" inset-0 flex justify-center items-start text-[25px] text-primary">Thông báo</div>
                    <InputForm label={'Tiêu đề'} value={payload.title} setValue={setPayload} type={'title'} key={'text'} />
                    <InputForm label={'Mô tả'} value={payload.description} setValue={setPayload} type={'description'} key={'text'} />
                    <InputForm label={'Đường dẫn'} value={payload.dob} setValue={setPayload} type={'link'} key={'text'} />
                    <InputForm label={'Người tạo'} value={payload.userid} setValue={setPayload} type={'userid'} key={'text'} />
                    <button onClick={() => { console.log(payload);cancle();setAdd(prev =>!prev) }} class=" w-full mt-16 md:w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Thêm mới</button>
                </div>
            </div>
            )}

            {
                type === "Quản trị viên" && (
                    <div>
                        <button onClick={() => {setAdd(true);}} class=" my-2 w-full md:w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Add+</button>
                    </div>
                )
            }
            <div className="w-full h-full">

            </div>
        </div>
    );
}


export default Home