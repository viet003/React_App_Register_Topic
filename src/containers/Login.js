import React, { useCallback, useState, useEffect } from "react";
//import goPage, { Gopage } from "./Gopage";
import { path } from "../utils/contants"
import { useNavigate } from "react-router-dom";
import { MdOutlineContactSupport } from "react-icons/md";
import student from "../assets/student.png"
import score from "../assets/score.png"
import homework from "../assets/homework.png"
import eke from "../assets/eke.png"
import book from "../assets/book.png"
import note from "../assets/note.png"
import bag from "../assets/bag.png"
import { useDispatch, useSelector } from "react-redux"
import { Backdrop, CircularProgress } from '@mui/material';
import * as actions from "../stores/actions"
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import Swal from "sweetalert2";
import { useTitle } from 'react-use';



const Login = function () {
  useTitle('Login');
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector(state => state.auth)

  const goPage = useCallback(() => {
    navigate(path.FORGOTPASS);
  }, [])

  let type = "Sinh viên"
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(type)
  const [status, setStatus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [invalidFields, setInvalidFields] = useState([])
  const handleFunctionGetType = (value) => {
    type = value;
    setValue(type)
    setPayload(prev => ({ ...prev, type: type }))
  }
  const listTypeAccount = ["Quản trị viên", "Giảng viên/nhân viên", "Sinh viên"]

  const [payload, setPayload] = useState({
    email: '',
    password: '',
    type: 'Sinh viên'
  })

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
        default:
          break
      }
    })
    // console.log(fields)
    return invalids;
  }

  const handleSubmit = async () => {
    let valid = validate(payload)
    if (valid === 0) {
      setLoading(true)
      const response = await dispatch(actions.login(payload))
      if (response?.status === 200 && response?.data?.err === 0) {
        setLoading(false)
        const result = await Swal.fire({
          title: "Succeeded!",
          text: response.data.msg ? response.data.msg : "",
          icon: "success",
          showConfirmButton: true,
        });
        if (result.isDismissed || result.isConfirmed) {
          setStatus(true)
        }
      } else {
        setLoading(false)
        const result = Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response?.data.msg ? response?.data.msg : "Lỗi không thể đăng nhập!",
          footer: '<a href="#">Why do I have this issue?</a>',
          showConfirmButton: true,
        });
        if (result.isDismissed || result.isConfirmed) {
          setStatus(true)
        }
      }
    }
  }

  useEffect(() => {
    if (isLoggedIn && status) {
      navigate(`${path.MAIN}/home`)
    }
  }, [status, isLoggedIn])


  return (
    <div className="flex items-center" onKeyDown={(e) => {
      // console.log(e.key)
      if (e.key === 'Enter') {
        e.preventDefault();
        setLoading();
        handleSubmit()
      }
    }}>
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
      <div class="bg-cover bg-center h-screen w-full flex">
        <div className="md:block hidden w-2/3 min-h-screen object-cover relative bg-primary">
          <img src={score} alt="" className="sm:h-[200px] sm:w-[200px] absolute top-0 left-0 w-[100px] h-[100]px" />
          <img src={student} alt="" className="h-screen absolute right-0" />
          <span className="absolute left-2 bottom-2 text-gray-400 text-[11px] flex flex-col items-center justify-center">
            <p> Copyright © 2024.</p>
            <p>Developed by Black Team.</p>
          </span>
        </div>
        <section class="bg-gray-50 min-h-screen w-full flex items-center justify-center">
          <div class="bg-gray-100 flex rounded-2xl shadow-lg xl:max-w-3xl w-full mx-20 p-5 items-center">
            <div class="xl:w-2/3 px-8 w-full xl:px-16">
              <h2 class="font-bold text-2xl text-[#002D74]">Đăng nhập</h2>
              <p class="text-xs mt-4 text-[#002D74]">Welcome to our project! Let's login</p>
              <div className="relative flex flex-col items-center w-full rounded-lg mt-8" onClick={() => setOpen((prev) => !prev)}>
                <div className="w-full relative">
                  <button className="p-4 z-0 h-[35px] flex w-full items-center justify-between text-[13px] rounded-md tracking-wider border-[1px] border-gray-300  hover:border-primary hover:text-primary transition-all duration-200">
                    {value}
                    {
                      !open ? (<AiOutlineCaretDown className="h-4" />) : (<AiOutlineCaretUp className="h-4" />)
                    }
                  </button>
                  <p className="absolute text-[10px] text-gray-400 -top-[7px] bg-gray-100 z-10 left-[10px]">Chọn vai trò của bạn</p>
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
              <form action="" class="flex flex-col gap-4">
                <div className="flex flex-col">
                  <input class="p-2 mt-4 rounded-lg border" type="email" name="email" value={payload.email} placeholder="Email" onChange={(e) => setPayload(prev => ({ ...prev, email: e.target.value }))} onFocus={() => setInvalidFields(invalidFields.filter(i => i.name !== 'email'))} />
                  {
                    invalidFields.length > 0 && invalidFields.some(i => i.name === 'email') &&
                    <small className="text-red-600 italic">{invalidFields.find(i => i.name === 'email')?.message}</small>
                  }
                </div>
                <div class="relative">
                  <input class="p-2 rounded-lg border w-full" type="password" name="password" value={payload.password} placeholder="Mật khẩu" onChange={(e) => setPayload(prev => ({ ...prev, password: e.target.value }))} onFocus={() => setInvalidFields(invalidFields.filter(i => i.name !== 'password'))} />
                  {
                    invalidFields.length > 0 && invalidFields.some(i => i.name === 'password') &&
                    <small className="text-red-600 italic">{invalidFields.find(i => i.name === 'password')?.message}</small>
                  }
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                </div>
              </form>

              <div className="w-full flex items-center justify-center mt-3">
                <button onClick={(e) => { e.preventDefault(); setLoading(); handleSubmit() }} class="w-full bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300">Đăng nhập</button>
              </div>

              <div class="mt-6 grid grid-cols-3 items-center text-gray-400">
                <hr class="border-gray-400" />
                <p class="text-center text-sm">OR</p>
                <hr class="border-gray-400" />
              </div>

              <button class="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]">
                <svg class="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Login with Google
              </button>

              <div class="mt-5 text-xs border-b border-[#002D74] py-4 text-[#002D74] flex items-center">
                <a href="#" className="flex items-center">
                  <p>Trợ giúp</p>
                  <MdOutlineContactSupport className="ml-2" />
                </a>
              </div>

              <div class="mt-3 text-xs flex justify-between items-center text-[#002D74]">
                <p>Quên mật khẩu?</p>
                <button class="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300" onClick={goPage}>Lấy lại</button>
              </div>
            </div>

            <div class="xl:block hidden xl:w-1/2 w-0 relative">
              <img class="rounded-2xl" src={homework} />
              <img src={eke} className="absolute w-[200px] h-[200px] top-0 left-2" />
              <img src={book} className="absolute w-[200px] h-[200px] top-[20%] -right-4" />
              <img src={note} className="absolute w-[200px] h-[200px] top-1/2 left-2" />
              <img src={bag} className="absolute w-[100px] h-[100px] bottom-3 right-2" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


export default Login