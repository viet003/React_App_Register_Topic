import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux"
import * as commentService from "../services/commentService"
import Swal from "sweetalert2";
import { IoIosSend } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import User from "../assets/user.jpg"
import * as CryptoJS from "../utils/crypto";
import { MdOutlineClose } from "react-icons/md";
import { Backdrop, CircularProgress } from '@mui/material';
import { useTitle } from "react-use"


const Comments = () => {
    useTitle('Comments')
    const { id } = useParams()
    const { token } = useSelector(state => state.auth)
    const [loading, setLoading] = useState(true)
    const userid = token ? jwtDecode(token).id : ''
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const [commentData, setCommentData] = useState([])
    const [announcementInfor, setAnnouncementInfor] = useState({})
    const [value, setValue] = useState('');
    //
    const getComments = async () => {
        setLoading(true)
        const response = await commentService.apiGetAllComments({ id: atob(id) })
        if (response.status !== 200) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.data.msg ? response.data.msg : "",
                footer: '<a href="#">Why do I have this issue?</a>',
                showConfirmButton: true,
            });
        } else {
            setLoading(false)
            return response.data.data
        }
    }
    // tạo comments
    const createComment = async (content) => {
        if (content !== '') {
            const response = await commentService.apiCreateComment({ content: content.replace(urlRegex, '<a href="$1" target="_blank">$1</a>').replace(/\n/g, '<br>'), userid: userid, announcementid: atob(id) })
            if (response.status !== 200) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.data.msg ? response.data.msg : "",
                    footer: '<a href="#">Why do I have this issue?</a>',
                    showConfirmButton: true,
                });
            } else {
                setValue('')
                fetchData();
            }
        } else {
            setValue('')
        }
    }
    // xóa comments
    const deleteComment = async (id) => {
        setLoading(true)
        const response = await commentService.apiDeleteComment({ id: id })
        if (response.status !== 200) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.data.msg ? response.data.msg : "",
                footer: '<a href="#">Why do I have this issue?</a>',
                showConfirmButton: true,
            });
        } else {
            setLoading(false)
            fetchData();
        }
    }
    //
    const fetchData = async () => {
        const commentDatas = await getComments()
        // console.log(commentDatas.id)
        if (commentDatas) {
            console.log(commentDatas)
            setAnnouncementInfor({ ...commentDatas[0], content: commentDatas[0].content.replace(urlRegex, '<a href="$1" target="_blank">$1</a>').replace(/\n/g, '<br>') })
            console.log(announcementInfor)
            setCommentData(commentDatas[1]);
        }
    }
    //
    const handleChange = (event) => {
        setValue(event.target.value);
        event.target.style.height = '41px';
        event.target.style.height = (event.target.scrollHeight) + 'px';
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="w-full min-w-[700px]">
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
            <div className="mt-5 w-full max-h-[440px] overflow-y-scroll">
                <div className="border-gray-300 border">
                    <div className="w-full bg-gray-100 h-[30px]" />
                    {
                        <div>
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center">
                                    <img className="h-[50px] w-[50px] rounded-full " src={User} />
                                    <div className="ml-3">
                                        <p className="text-[13px]">{`${CryptoJS.decrypted(announcementInfor?.author?.name)}`}</p>
                                        <p className="text-[12px] text-[#4A90E2]">{'Giảng viên'}</p>
                                    </div>
                                </div>
                                <div className="">
                                    <p className="text-[11px]">Posted by <span className="text-[#4A90E2]">{`${CryptoJS.decrypted(announcementInfor?.author?.name)}`}</span> at <span className="text-[#4A90E2] mr-10">{new Date(announcementInfor?.createdAt).toLocaleString()}</span></p>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="flex flex-col gap-5 p-5 leading-4">
                        <h1 className="font-semibold text-gray-800 leading-10 text-[16px]">{announcementInfor?.title}</h1>
                        <div className="text-[14px] leading-7" dangerouslySetInnerHTML={{ __html: announcementInfor?.content }} />
                    </div>
                </div>
                {
                    commentData?.map((e) => {
                        const formattedDate = new Date(e.createdAt).toLocaleString();
                        return (
                            <div className="flex w-full mt-5 justify-end ">
                                <div className="relative flex flex-col w-[80%] border border-gray-300 p-4 rounded-xl bg-gray-100 gap-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <img className="h-[50px] w-[50px] rounded-full " src={User} />
                                            <div className="ml-3">
                                                <p className="text-[13px]">{e.commentbyuser ? CryptoJS.decrypted(e.commentbyuser.name) : `${CryptoJS.decrypted(announcementInfor.author.name)}`}</p>
                                                <p className="text-[12px] text-[#4A90E2]">{e.commentbyuser ? 'Sinh viên' : 'Giảng viên'}</p>
                                            </div>
                                        </div>
                                        <div className="">
                                            <p className="text-[11px]">Edited by <span className="text-[#4A90E2]">{e.commentbyuser ? CryptoJS.decrypted(e.commentbyuser.name) : `${CryptoJS.decrypted(announcementInfor.author.name)}`}</span> at <span className="text-[#4A90E2]">{formattedDate}</span></p>
                                        </div>
                                    </div>
                                    <div className=" min-h-[40px] flex items-center px-10 rounded-xlpy-1 bg-gray-50 rounded-xl">
                                        <div className="text-[14px]" dangerouslySetInnerHTML={{ __html: e.content }} />
                                    </div>
                                    {
                                        userid === e.userid && (
                                            <MdOutlineClose onClick={() => {
                                                deleteComment(e.id)
                                            }} className="absolute top-2 right-2 text-[20px] cursor-pointer" />
                                        )
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="flex justify-end w-full">
                <div className="h-auto flex justify-end items-center mt-5 w-4/5 border border-gray-300 rounded-xl focus:border-primary">
                    <textarea
                        value={value}
                        onChange={handleChange}
                        className="outline-none w-full h-[40px] resize-none py-2 pr-10 pl-10 rounded-xl text-[15px]" placeholder="Comment . . . . ."
                        style={{ overflowY: 'hidden' }}
                    />
                    <IoIosSend onClick={() => { createComment(value) }} className="text-[30px] mr-3 h-[30px] cursor-pointer w-[30px] rounded-full hover:text-white hover:bg-primary" />
                </div>
            </div>
        </div>
    );
}

export default Comments