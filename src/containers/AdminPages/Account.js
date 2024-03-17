import React, { useState, useEffect } from "react";
import InputForm from "../../components/InputForm";
import * as authService from "../../services/authService";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { Backdrop, CircularProgress } from '@mui/material';
import { ColumnDirective, ColumnsDirective, Edit, Filter, GridComponent, Inject, Page, Toolbar } from '@syncfusion/ej2-react-grids'
import Swal from "sweetalert2";
import AccountDialog from '../../components/AccountDialog'
import * as CryptoJS from "../../utils/crypto";
import { GoSearch } from "react-icons/go";
import { MdOutlineClose } from "react-icons/md";


const Account = () => {
    let grid;
    let type = "Sinh viên"
    const [add, setAdd] = useState(false)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(type)
    //const [status, setStatus] = useState(false)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [accountData, setAccountData] = useState([])
    const [invalidFields, setInvalidFields] = useState([])

    const listTypeAccount = ["Giảng viên/nhân viên", "Sinh viên", "Quản trị viên"]
    //
    const handleFunctionGetType = (value) => {
        type = value;
        setValue(type)
        setPayload(prev => ({ ...prev, type: type }))
    }
    //
    const cancle = () => {
        setPayload(prev => ({ ...prev, id: '' }))
        setPayload(prev => ({ ...prev, email: '' }))
        setPayload(prev => ({ ...prev, password: '' }))
        setPayload(prev => ({ ...prev, userid: '' }))
    }
    //
    const [payload, setPayload] = useState({
        id: '',
        email: '',
        password: '',
        userid: '',
        type: type
    })
    //
    const validate = (payload) => {
        let invalids = 0; // đếm số lỗi
        let fields = Object.entries(payload)
        fields.forEach((item) => {
            if (item[1] === '' && item[0] !== 'id' && item[0] !== 'userid') {
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
                    if (item[1] === '' && value === 'Quản trị viên') {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Thông tin không được bỏ trống!'
                        }]);
                        invalids++;
                    }
                    if (isNaN(item[1]) && value === 'Quản trị viên') {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Id chỉ bao gồm kí tự số.'
                        }]);
                        invalids++;
                    }
                    if (item[1].length !== 8 && value === 'Quản trị viên') {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Id bao gồm 8 ký tự.'
                        }]);
                        invalids++;
                    }
                    break;
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(item[1])) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Địa chỉ email không hợp lệ.'
                        }]);
                        invalids++;
                    }
                    break;
                case 'password':
                    if (item[1].length < 6) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Mật khẩu tối thiểu 6 ký tự.'
                        }]);
                        invalids++;
                    }
                    break;
                case 'userid':
                    if (item[1] === '' && value !== 'Quản trị viên') {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Thông tin không được bỏ trống!'
                        }]);
                        invalids++;
                    }
                    if (isNaN(item[1]) && value !== 'Quản trị viên') {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Userid chỉ bao gồm ký tự số.'
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
    // get
    const getAccount = async (data) => {
        setLoading(true)
        //console.log(value)
        const response = await authService.apiGetAccount({ type: data ? data : type })
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
                result: response.data.data,
                count: response.data.data.length
            }
        }
    }
    //
    const updateAccount = async (data) => {
        const response = await authService.apiChangePass(data);
        setLoading(true)
        if (response.state !== 200 || response?.data?.err !== 0) {
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
            fetchData(value)
        }
    }
    //
    const deleteAccount = async (data) => {
        setLoading(true);
        const response = await authService.apiDeleteAccount(data);
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
            fetchData(value)
        }
    }
    //
    const handleSubmit = async () => {
        let inval = validate(payload);
        if (inval === 0) {
            setLoading(true)
            const response = await authService.apiRegister({
                ...payload, userid: value === 'Sinh viên' ? 'SV' + payload.userid : 'GV' + payload.userid
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
            //setRefreshGrid(prev => !prev)
            cancle();
            setAdd(prev => !prev)
        } else {
            setLoading(false)
        }
    }
    //
    useEffect(() => {
        if (grid) {
            grid.dataSource = accountData;
        }
    }, [accountData, grid]);
    //
    const fetchData = async (data) => {
        const ac = await getAccount(data);
        setAccountData(ac); // Cập nhật dữ liệu mới vào state userData
        //setRefreshGrid(prev => !prev); // Kích hoạt việc refresh grid
        //console.log(ac[0]["studentAccount.name"])
    };
    //
    const dataSourceChanged = async (state) => {
        if (state.action === "edit") {
            let inval = validate(state.data);
            if (inval === 0) {
                // const response = await authService.apiChangePass()
            } else {
                // Hiển thị tất cả các lỗi
                invalidFields.forEach((field) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: field.message,
                        footer: '<a href="#">Why do I have this issue?</a>',
                        showConfirmButton: true,
                    });
                });
            }
            // Kết thúc chỉnh sửa
            state.endEdit();
            // Đặt lại danh sách lỗi
            setInvalidFields([]);
        } else if (state.requestType === "delete") {
            deleteAccount({ email: state.data[0].email, type: value });
            state.endEdit();
        }
    };
    //
    const Dialogtemplate = (props) => {
        return (<AccountDialog {...props} />)
    }
    //
    const dataStateChange = (state) => {
        fetchData(value)
    }
    //
    const searchByWord = (value) => {
        const newdata = accountData.result.filter((e) => e?.email?.toUpperCase().includes(value.toUpperCase()))
        if (grid) {
            if (value !== '') {
                grid.dataSource = { result: newdata, count: newdata.length }
            } else {
                grid.dataSource = accountData
            }
        }
    }
    //
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <div className="w-full h-full bg-gray-50">
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
                    <div className="relative" onKeyDown={(e) => {
                        // console.log(e.key)
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSubmit()
                        }}}>
                        <div className="bg-gray-400 opacity-70 fixed inset-0 z-60" onClick={(e) => { setAdd(prev => !prev); cancle(); setInvalidFields([]) }}></div>
                        <div className="flex justify-start gap-5 items-center  flex-col bg-white w-full  sm:w-[400px]  z-70 rounded-xl relative p-3">
                            <div className=" inset-0 flex justify-center items-start text-[25px] text-primary">Thông tin tài khoản</div>
                            {
                                value === "Quản trị viên" && (
                                    <InputForm label={'ID'} value={payload.id} setValue={setPayload} type={'id'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                )
                            }
                            <InputForm label={'Email'} value={payload.email} setValue={setPayload} type={'email'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                            <InputForm label={'Mật khẩu'} value={payload.password} setValue={setPayload} type={'password'} keyx={'password'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                            {
                                value !== "Quản trị viên" && (
                                    <InputForm label={'User ID'} value={payload.userid} setValue={setPayload} type={'userid'} keyx={'text'} invalidFields={invalidFields} setInvalidFields={setInvalidFields} />
                                )
                            }
                            <button onClick={(e) => { e.preventDefault();handleSubmit(); }} class=" my-4 w-full md:w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Thêm mới</button>
                        </div>
                        <MdOutlineClose className="absolute top-2 right-2 text-[25px] cursor-pointer" onClick={() => { setAdd(prev => !prev); cancle(); setInvalidFields([]) }} />
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-1 justify-between my-2 md:flex-row md:gap-0">
                <div className="flex items-center justify-between md:justify-start">
                    <button onClick={() => { setAdd(true); }} class="w-[100px] bg-[#002D74] rounded-xl text-white py-2 hover:text-orange-400 duration-100 h-[40px]">Add+</button>
                    <div class="ml-10 z-0 px-4 h-[35px] rounded-md tracking-wider border-[1px] w-[200px] border-gray-300 hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer flex items-center">
                        <input type="text" class="m-auto w-full outline-none text-[13px]" placeholder="Tìm kiếm theo email..." value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
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
                                            <div onClick={(e) => { e.preventDefault(); handleFunctionGetType(item); fetchData(item) }} key={i} className="h-[25px] hover:text-primary hover:bg-gray-100 w-full cursor-pointer px-4">
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
                    dataSource={accountData}
                    ref={(g) => (grid = g)}
                    dataSourceChanged={dataSourceChanged}
                    dataStateChange={dataStateChange}
                    allowPaging={true}
                    pageSettings={{ pageSize: 10 }}
                    allowFiltering={true}
                    editSettings={{ allowDeleting: true, allowEditing: true, mode: 'Dialog', template: Dialogtemplate }}
                    toolbar={['Edit', 'Delete', 'Update', 'Cancel']}
                    selectionSettings={{ checkboxMode: 'ResetOnRowClick', enableToggle: false }}
                >
                    <ColumnsDirective>
                        <ColumnDirective type='checkbox' width='50px' />
                        <ColumnDirective field="id" headerText="ID" textAlign="Left" width='100px' />
                        <ColumnDirective field="email" headerText="Email" textAlign="Left" />
                        <ColumnDirective field="password" headerText="Mật khẩu" textAlign="Left" />
                        {
                            value !== 'Quản trị viên' && (
                                <ColumnDirective field="userid" headerText="UserID" textAlign="Left" />
                            )
                        }
                        {
                            value !== 'Quản trị viên' && (
                                <ColumnDirective field='studentAccount.name' headerText="Tên người dùng" textAlign="Left"
                                    template={(props) => {
                                        return value === 'Sinh viên' ? CryptoJS.decrypted(props['studentAccount.name']) : CryptoJS.decrypted(props['lecturerAccount.name']);
                                    }}
                                />
                            )
                        }
                        {
                            value === 'Quản trị viên' && (
                                <ColumnDirective field="isactive" headerText="Trạng thái" textAlign="Left"
                                    template={(props) => {
                                        return props.isactive == 1 ? 'Hoạt động' : 'Dừng hoạt động';
                                    }}
                                />
                            )
                        }
                        <ColumnDirective field="createdAt" headerText="Ngày tạo" textAlign="Left" format={'dd/MM/yyyy'} type="date" />
                        <ColumnDirective field="updatedAt" headerText="Ngày cập nhật" textAlign="Left" type="date" format={'dd/MM/yyyy'} />
                    </ColumnsDirective>
                    <Inject services={[Page, Edit, Toolbar]} />
                </GridComponent>
            </div>
        </div>
    );
}


export default Account