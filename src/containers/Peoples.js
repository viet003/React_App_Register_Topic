import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import { Backdrop, CircularProgress } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import * as groupService from "../services/groupService"
import { ColumnDirective, ColumnsDirective, Edit, Filter, GridComponent, Inject, Page, Toolbar } from '@syncfusion/ej2-react-grids'
import * as CryptoJS from '../utils/crypto'
import { GoSearch } from "react-icons/go";

const Peoples = () => {
    let grid;
    const { topicid } = useParams();
    const [loading, setLoading] = useState(false)
    const [studentData, setStudentData] = useState([])
    const { token } = useSelector(state => state.auth)
    const [del, setDel] = useState(false)
    const type = token ? jwtDecode(token).type : ''
    //
    const getStudent = async (payload) => {
        setLoading(true);
        const response = await groupService.apiStudentGroup(payload);
        if (response.status !== 200 || response?.data?.err !== 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.data.msg ? response.data.msg : "",
                footer: '<a href="#">Why do I have this issue?</a>',
                showConfirmButton: true,
            });
            setLoading(false)
        } else {
            return response.data.data
        }
    }
    //
    const fetchData = async () => {
        const studentData = await getStudent({ topicid });
        if (studentData) {
            setStudentData(studentData);
            setLoading(false);
            //console.log(postData) // Thiết lập postData chỉ khi có dữ liệu hợp lệ
        }
    };
    // chấp nhận sinh viên
    const acceptStudent = async (props) => {
        // console.log(props)
        setLoading(true);
        const response = await groupService.apiAcceptToGroup({ studentid: props.studentid, topicid: props.topicid })
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
            fetchData()
        }
    }
    // từ chối
    const denyStudent = async (props) => {
        // console.log(props)
        // setLoading(true);
        // const response = await groupService.apiRemoveFromGroup({ studentid: props.studentid, topicid: props.topicid })
        // if (response.status !== 200 || response.data.err !== 0) {
        //     setLoading(false)
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: response.data.msg ? response.data.msg : "",
        //         footer: '<a href="#">Why do I have this issue?</a>',
        //         showConfirmButton: true,
        //     });
        // } else {
        //     fetchData()
        // }
        Swal.fire({
            title: "Bạn có chắc chắn không?",
            text: "Nếu muốn, hãy nhấn có!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có",
            cancelButtonText: "Đóng"
        }).then((result) => {
            if (result.isConfirmed) {
                new Promise((resolve, reject) => {
                    const response = groupService.apiRemoveFromGroup({ studentid: props.studentid, topicid: props.topicid })
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
                            text: "Thông tin sinh viên đã được xóa khỏi cơ sở dữ liệu.",
                            icon: "success"
                        });
                        fetchData()
                    }
                })
            }
        });
    }
    // tìm kiếm
    const searchByWord = (value) => {
        const newdata = studentData.filter((e) => e.studentid.includes(value));
        if (grid) {
            if (value !== '') {
                grid.dataSource = newdata
            } else {
                grid.dataSource = studentData
            }
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    //
    return (
        <div className="w-full h-full flex">
            <div className="w-full relative">
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
                    <div className={`flex justify-start items-center lg:absolute -top-10 right-0 mt-4`}>
                        <div class="z-0 px-4 h-[35px] rounded-md tracking-wider border-[1px] w-[200px] border-gray-300 hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer flex items-center">
                            <input type="text" class="m-auto w-full outline-none text-[13px]" placeholder="Tìm kiếm theo ID..." onChange={async (e) => {
                                searchByWord(e.target.value)
                            }} />
                            <GoSearch />
                        </div>
                        {
                            type !== "Sinh viên" && (
                                <button onClick={() => { setDel(prev => !prev); }} class="ml-5  w-[100px] bg-gray-100 border-gray-200 border rounded-xl text-primary py-[6px] hover:text-white hover:bg-primary duration-100 ">Xóa</button>
                            )
                        }
                    </div>
                }
                <div className="mt-8">
                    <GridComponent
                        dataSource={studentData}
                        ref={(g) => (grid = g)}
                        allowPaging={true}
                        pageSettings={{ pageSize: 10 }}
                        selectionSettings={{ checkboxMode: 'ResetOnRowClick', enableToggle: false }}
                    >
                        <ColumnsDirective>
                            <ColumnDirective field="studentid" headerText="Mã sinh viên" textAlign="Left" width='130px' />
                            <ColumnDirective field="students.name" headerText="Họ và tên" textAlign="Left"
                                template={(props) => {
                                    return CryptoJS.decrypted(props.students.name)
                                }} />
                            <ColumnDirective field="name" headerText="Nhóm" textAlign="Left" />
                            <ColumnDirective field="isadded" headerText="Trạng thái" textAlign="Left"
                                template={(props) => {
                                    return props.isadded ? 'Đã duyệt' : 'Chờ xét duyệt';
                                }}
                            />
                            {
                                token && type === 'Giảng viên/nhân viên' && (
                                    <ColumnDirective headerText="Actions" textAlign="Center" width='150px' template={(props) => (
                                        !props.isadded ? (
                                            <div className="flex gap-2 text-gray-200">
                                                <button onClick={() => acceptStudent(props)} className="bg-primary rounded-xl px-2 py-1 hover:text-orange-300">Accept</button>
                                                <button onClick={() => denyStudent(props)} className="bg-primary rounded-xl px-2 py-1 hover:text-orange-300">Deny</button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                {
                                                    del === false ?
                                                        <p className="bg-gray-200 rounded-xl px-2 py-1 opacity-80">No Action</p> :
                                                        <button onClick={() => { denyStudent(props) }} className="bg-primary rounded-xl px-2 py-1 text-white">Delete</button>
                                                }
                                            </div>
                                        )
                                    )} />
                                )
                            }


                        </ColumnsDirective>
                        <Inject services={[Page, Edit, Toolbar]} />
                    </GridComponent>
                </div>
            </div>
        </div>
    )
}


export default Peoples;