import React, { useState, useEffect } from "react";
import { InputForm } from "../../components";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import * as userService from '../../services/userService'
import Swal from "sweetalert2";
import { Backdrop, CircularProgress } from '@mui/material';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars'
import { ColumnDirective, ColumnsDirective, Edit, Filter, GridComponent, Inject, Page, Toolbar } from '@syncfusion/ej2-react-grids'
import UserDialog from "../../components/UserDialog";
import * as CryptoJS from "../../utils/crypto";
import { GoSearch } from "react-icons/go";
import { MdOutlineClose } from "react-icons/md";

const User = () => {
    let type = "Sinh viên"
    let grid;
    const moment = require('moment');
    const [add, setAdd] = useState(false)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(type)
    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [isStudent, setIsStudent] = useState(true)
    const [invalidFields, setInvalidFields] = useState([])
    //
    const listTypeAccount = ["Giảng viên/nhân viên", "Sinh viên"]
    //
    const [payload, setPayload] = useState({
        id: '',
        name: '',
        dob: '',
        major: '',
        clas: '',
        department: '',
        type: 'Sinh viên'
    })
    //
    const cancle = () => {
        setPayload(prev => ({ ...prev, id: '' }))
        setPayload(prev => ({ ...prev, name: '' }))
        setPayload(prev => ({ ...prev, dob: '' }))
        setPayload(prev => ({ ...prev, major: '' }))
        setPayload(prev => ({ ...prev, clas: '' }))
        setPayload(prev => ({ ...prev, department: '' }))
    }
    //
    const handleFunctionGetType = (value) => {
        type = value;
        if (type !== "Sinh viên") {
            setIsStudent(false)
        } else {
            setIsStudent(true)
        }
        setPayload(prev => ({ ...prev, type: type }))
    }
    //
    const validate = (payload) => {
        let invalids = 0; // đếm số lỗi
        let fields = Object.entries(payload)
        fields.forEach((item) => {
            if (item[1] === '' && item[0] !== 'clas') {
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
                    if (item[1].length < 8) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Id gồm 8 ký tự.'
                        }]);
                        invalids++;
                    }
                case 'clas':
                    if (item[1] === '' && value === 'Sinh viên') {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Thông tin không được bỏ trống.'
                        }])
                        invalids++
                    }
                    break;
                default:
                    break
            }
        })
        // console.log(fields)
        return invalids;
    }
    // get
    const getAllUser = async (data) => {
        setLoading(true)
        //console.log(value)
        const response = await userService.apiGetUser({ type: data ? data : type })
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
            //fetchData()
            setLoading(false);
            return {
                count: response.data.data.length,
                result: response.data.data,
            }
        }
    }
    // create
    const handleSubmit = async () => {
        let inval = validate(payload);
        if (inval === 0) {
            setLoading(true)
            // console.log(new Date(payload.dob).toDateString())
            const response = await userService.apiCreateUser({
                ...payload,
                id: value === 'Sinh viên' ? 'SV' + payload.id : 'GV' + payload.id,
                name: CryptoJS.encrypted(payload.name),
                dob: CryptoJS.encrypted(moment(new Date(payload.dob)).format('DD/MM/YYYY').toString()),
                major: CryptoJS.encrypted(payload.major),
                clas: CryptoJS.encrypted(payload.clas),
                department: CryptoJS.encrypted(payload.department),
            })
            if (response.status !== 200 || response?.data?.err !== 0) {
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
            }
            fetchData(value)
            cancle();
            setAdd(prev => !prev)
            // console.log({
            //     ...payload,
            //     name: CryptoJS.encrypted(payload.name),
            //     dob: CryptoJS.encrypted(new Date(payload.dob).toISOString()),
            //     major: CryptoJS.encrypted(payload.major),
            //     clas: CryptoJS.encrypted(payload.clas),
            //     department: CryptoJS.encrypted(payload.department),
            // })
        }
    }
    // update 
    const updateUser = async (data) => {
        const response = await userService.apiUpdateUser(data)
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
        }
        // fetchData(value)
        cancle();
    }
    // delete
    const deleteUser = async (data) => {
        setLoading(true)
        const response = await userService.apiDeleteUser(data);
        if (response?.status != 200 || response?.data?.err != 0) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.data.msg ? response.data.msg : "",
                footer: '<a href="#">Why do I have this issue?</a>',
                showConfirmButton: true,
            });
        } else {
            setLoading(false)
        }
        // fetchData(value);
    }
    //
    useEffect(() => {
        if (grid) {
            grid.dataSource = userData;
        }
    }, [userData, grid]);
    //
    const Dialogtemplate = (props) => {
        return (<UserDialog {...props} />)
    }
    //
    const fetchData = async (data) => {
        const userData1 = await getAllUser(data);
        setUserData(userData1);
        setSearch('') // Cập nhật dữ liệu mới vào state userData
    };
    //
    const dataSourceChanged = async (state) => {
        if (state.action === "edit") {
            // console.log(state)
            let inval = validate(state.data);
            if (inval === 0) {
                // Xử lý khi dữ liệu hợp lệ
                // await updateUser({
                //     ...state.data,
                //     type: value,
                //     name: CryptoJS.encrypted(state.data.name),
                //     dob: CryptoJS.encrypted(moment(new Date(state.data.dob)).format('DD/MM/YYYY').toString()),
                //     major: CryptoJS.encrypted(state.data.major),
                //     department: CryptoJS.encrypted(state.data.department),
                //     clas: CryptoJS.encrypted(state.data.class)
                // });
                console.log(state.data.isActive)
                // fetchData(value)
            } else {
                // Hiển thị thông báo lỗi cho người dùng
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: 'Kiểm tra lại các trường thông tin!',
                    footer: '<a href="#">Why do I have this issue?</a>',
                    showConfirmButton: true,
                });
                if (grid) {
                    grid.dataSource = userData
                }
            }
            // Kết thúc chỉnh sửa
            state.endEdit();
        } else if (state.requestType === "delete") {
            await deleteUser({ id: state.data[0].id, type: value });
            state.endEdit();
        }
    };
    //
    const dataStateChange = (state) => {
        // console.log(state)
        if (state.action.requestType === "delete") {
            setTimeout(() => {
                fetchData(value)
            })
        }
        if (state.action.action === 'edit') {
            setTimeout(() => {
                fetchData(value)
            })
        }
        // if(state.action.requestType === 'filtering' || state.action.action === 'filter') {
        //     if(grid) {
        //         grid.dataSource = state
        //     }
        // }
    };
    // tìm kiếm
    const searchByWord = (value) => {
        const newdata = userData.result.filter((e) => e?.id?.toUpperCase().includes(value.toUpperCase()))
        if (grid) {
            if (value !== '') {
                grid.dataSource = { result: newdata, count: newdata.length }
            } else {
                grid.dataSource = userData
            }
        }
    }
    //
    useEffect(() => {
        fetchData();
    }, []);
    //
    return (
        <div className="h-full w-full bg-gray-50">
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
                    <div className="relative">
                        <div className="bg-gray-400 opacity-70 fixed inset-0 z-60" onClick={() => { setAdd(prev => !prev); cancle(); setInvalidFields([]) }}></div>
                        <div className="flex justify-start gap-2 items-center  flex-col bg-white w-full  sm:w-[400px]  z-70 rounded-xl relative p-3">
                            <div className=" inset-0 flex justify-center items-start text-[25px] text-primary">Thông tin người dùng</div>
                            <InputForm label={'Mã số'} value={payload.id} setValue={setPayload} type={'id'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                            <InputForm label={'Họ và tên'} value={payload.name} setValue={setPayload} type={'name'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                            {/* <InputForm label={'Ngày sinh'} value={payload.dob} setValue={setPayload} type={'dob'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} /> */}
                            <DatePickerComponent placeholder="Ngày sinh" value={payload.dob} onChange={(e) => setPayload(prev => ({ ...prev, dob: e.target.value }))} format="dd/MM/yyyy" onFocus={() => setInvalidFields(invalidFields.filter(item => item.name !== 'dob'))} />
                            {
                                invalidFields.length > 0 && invalidFields.some(i => i.name === 'dob') &&
                                <small className="text-red-600 italic flex justify-start w-full text-[10px]">{invalidFields.find(i => i.name === 'dob')?.message}</small>
                            }
                            <InputForm label={'Ngành'} value={payload.major} setValue={setPayload} type={'major'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                            {
                                isStudent && (
                                    <InputForm label={'Lớp'} value={payload.clas} setValue={setPayload} type={'clas'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                )
                            }
                            <InputForm label={'Khoa'} value={payload.department} setValue={setPayload} type={'department'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                            <button onClick={(e) => { handleSubmit(); e.preventDefault(); }} class=" w-full md:w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Thêm mới</button>
                        </div>
                        <MdOutlineClose className="absolute top-2 right-2 text-[25px] cursor-pointer" onClick={() => { setAdd(prev => !prev); cancle(); setInvalidFields([]) }} />
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-1 justify-between my-2 md:flex-row md:gap-0 w-full">
                <div className="flex items-center justify-between md:justify-start">
                    <button onClick={() => { setAdd(true); }} class="w-[100px] md:w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Add+</button>
                    <div class="ml-10 z-0 px-4 h-[35px] rounded-md tracking-wider border-[1px] w-[200px] border-gray-300 hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer flex items-center">
                        <input type="text" class="m-auto w-full outline-none text-[13px]" value={search} placeholder="Tìm kiếm theo ID..."
                            onChange={(e) => {
                                setSearch(e.target.value)
                                searchByWord(e.target.value)
                            }}
                        />
                        <GoSearch />
                    </div>
                </div>
                <div className="relative flex flex-col items-center py-2 w-full sm:w-[300px] rounded-lg" onClick={() => setOpen((prev) => !prev)}>
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
                                            <div onClick={(e) => { e.preventDefault(); handleFunctionGetType(item); setValue(item); fetchData(item); }} key={i} className="h-[25px] hover:text-primary hover:bg-gray-100 w-full cursor-pointer px-4">
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
            <div className="min-w-[1000px]">
                <GridComponent
                    dataSource={userData}
                    ref={(g) => (grid = g)}
                    dataSourceChanged={dataSourceChanged}
                    allowPaging={true}
                    pageSettings={{ pageSize: 10 }}
                    editSettings={{ allowDeleting: true, allowEditing: true, mode: 'Dialog', template: Dialogtemplate }}
                    toolbar={['Edit', 'Delete', 'Update', 'Cancel']}
                    selectionSettings={{ checkboxMode: 'ResetOnRowClick', enableToggle: false }}
                    dataStateChange={dataStateChange}
                >
                    <ColumnsDirective>
                        <ColumnDirective type='checkbox' width='50px' />
                        <ColumnDirective field="id" headerText="ID" textAlign="Left" width='130px' />
                        <ColumnDirective field="name" headerText="Họ và tên" textAlign="Left"
                            template={(props) => {
                                return CryptoJS.decrypted(props.name)
                            }} />
                        <ColumnDirective field="dob" headerText="Ngày sinh" textAlign="Left" format={'dd/MM/yyyy'} type="date"
                            template={(props) => {
                                return CryptoJS.decrypted(props.dob)
                            }}
                        />
                        <ColumnDirective field="major" headerText="Ngành" textAlign="Left"
                            template={(props) => {
                                return CryptoJS.decrypted(props.major)
                            }}
                        />
                        {
                            isStudent && (
                                <ColumnDirective field="class" headerText="Lớp" textAlign="Left"
                                    template={(props) => {
                                        return CryptoJS.decrypted(props.class)
                                    }}
                                />
                            )
                        }
                        <ColumnDirective field="department" headerText="Khoa" textAlign="Left"
                            template={(props) => {
                                return CryptoJS.decrypted(props.department)
                            }}
                        />
                        <ColumnDirective field="isActive" headerText="Trạng thái" textAlign="Left" type="boolean"
                            template={(props) => {
                                return props.isActive ? 'Hoạt động' : 'Dừng hoạt động';
                            }}
                        />
                        <ColumnDirective field="createdAt" headerText="Ngày tạo" textAlign="Left" format={'dd/MM/yyyy'} type="date" />
                        <ColumnDirective field="updatedAt" headerText="Ngày cập nhật" textAlign="Left" type="date" format={'dd/MM/yyyy'} />
                    </ColumnsDirective>
                    <Inject services={[Page, Toolbar, Edit]} />
                </GridComponent>
            </div>
        </div>
    )
}


export default User