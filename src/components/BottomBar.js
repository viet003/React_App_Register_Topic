import React from "react";
import { IoMdCall } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import { MdMessage } from "react-icons/md";


const BottomBar = () => {
    return (
        <div className="flex items-center h-full justify-center">
            <div className="flex-col items-center justify-center  text-black h-full text-[10px] sm:w-full sm:flex xl:text-[11px] xl:flex-row xl:gap-8 hidden">
                <p className="opacity-80">Copyright © 2024. Developed by Black Team.</p>
                <a className="hover:text-orange-600 text-primary" href="">Tòa nhà 999 - Địa chỉ: Tầng 1, Toà nhà A10, Trường Đại học Phenikaa, Nguyễn Trác, Hà Đông, Hà Nội</a>
                <a className="flex h-full items-center hover:text-orange-600 text-primary" href="">
                    <IoMdCall className="text-[14px]" />
                    <p className="ml-2">19001000 (số máy không tồn tại)</p>
                </a>
            </div>
            <div className="flex justify-center items-center sm:hidden h-full text-[20px] gap-10 text-primary">
                <IoMdCall className="hover:text-orange-600 cursor-pointer z-10"/>
                <MdMessage className="hover:text-orange-600 cursor-pointer"/>
                <CiMail className="hover:text-orange-600 cursor-pointer"/>
            </div>
        </div>
    );
}


export default BottomBar