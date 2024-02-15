import React, { useState } from "react";
import { InputForm } from "../../components";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";


const User = () => {
    let type = "Sinh viên"
    const [add, setAdd] = useState(false)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(type)
    const [status, setStatus] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isStudent, setIsStudent] = useState(true)
    const listTypeAccount = ["Giảng viên/nhân viên", "Sinh viên"]
    //
    const [payload, setPayload] = useState({
        id: '',
        name: '',
        dob: '',
        major: '',
        class: '',
        department: '',
        type: 'Sinh viên'
    })
    //
    const cancle = () => {
        setPayload(prev => ({...prev,id:''}))
        setPayload(prev => ({...prev,name:''}))
        setPayload(prev => ({...prev,dob:''}))
        setPayload(prev => ({...prev,major:''}))
        setPayload(prev => ({...prev,class:''}))
        setPayload(prev => ({...prev,department:''}))
    }
    //
    const handleFunctionGetType = (value) => {
        type = value;
        if (type != "Sinh viên") {
            setIsStudent(false)
        } else {
            setIsStudent(true)
        }
        setValue(type)
        setPayload(prev => ({ ...prev, type: type }))
    }
    //
    return (
        <div className="h-full w-full">
            {add && (
                <div className="fixed inset-0 flex justify-center items-center z-50 w-full">
                    <div className="bg-gray-400 opacity-70 fixed inset-0 z-60" onClick={() => {setAdd(prev => !prev);cancle()}}></div>
                    <div className="flex justify-start gap-2 items-center  flex-col bg-white w-full h-full sm:w-[540px] xl:h-[500px] z-70 rounded-xl relative px-3">
                        <div className=" inset-0 flex justify-center items-start text-[25px] text-primary">Thông tin người dùng</div>
                        <InputForm label={'Mã số'} value={payload.id} setValue={setPayload} type={'id'} key={'text'} />
                        <InputForm label={'Họ và tên'} value={payload.name} setValue={setPayload} type={'name'} key={'text'} />
                        <InputForm label={'Ngày sinh'} value={payload.dob} setValue={setPayload} type={'dob'} key={'text'} />
                        <InputForm label={'Ngành'} value={payload.major} setValue={setPayload} type={'major'} key={'text'} />
                        {
                            isStudent && (
                                <InputForm label={'Lớp'} value={payload.class} setValue={setPayload} type={'class'} key={'text'} />
                            )
                        }
                        <InputForm label={'Khoa'} value={payload.department} setValue={setPayload} type={'department'} key={'text'} />
                        <button onClick={() => { console.log(payload); cancle();setAdd(prev => !prev) }} class=" w-full md:w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Thêm mới</button>
                    </div>
                </div>
            )}
            <div className="flex justify-between my-2 ">
                <button onClick={() => { setAdd(true); }} class=" w-full md:w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Add+</button>
                <div className="relative flex flex-col items-center py-2 w-[300px] rounded-lg" onClick={() => setOpen((prev) => !prev)}>
                    <div className="w-full relative">
                        <button className="p-4 z-0 h-[35px] flex w-full items-center justify-between text-[13px] rounded-md tracking-wider border-[1px] border-gray-300  hover:border-primary hover:text-primary transition-all duration-200">
                            {value}
                            {
                                !open ? (<AiOutlineCaretDown className="h-4" />) : (<AiOutlineCaretUp className="h-4" />)
                            }
                        </button>
                        <p className="absolute text-[10px] text-gray-400 -top-[7px] bg-gray-100 z-10 left-[10px]">Chọn vai trò</p>
                    </div>
                    {
                        open && (
                            <div className="absolute top-full w-full gap-1 z-10 text-[13px] border-gray-200 bg-white rounded-md shadow-lg flex flex-col items-start justify-start py-1">
                                {
                                    listTypeAccount.map((item, i) => {
                                        return (
                                            <div onClick={() => handleFunctionGetType(item)} key={i} className="h-[25px] hover:text-primary hover:bg-gray-100 w-full cursor-pointer px-4">
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
            <div>

            </div>
        </div>
    )
}


export default User