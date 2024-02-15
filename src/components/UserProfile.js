import React from "react";
import logo from "../assets/admin.jpg"
import { BiUser } from "react-icons/bi";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const UserProfile = ({ toggle }) => {

    const { token } = useSelector(state => state.auth)
    const id = token ? jwtDecode(token).id : "No user"
    return (
        <div className={`flex items-center gap-5 ${toggle ? "bg-none transition-all " : "bg-white rounded-xl p-2"}`}>
            <div className="min-w-[3.5rem] h-[3rem] flex items-center justify-around">
                <img src={logo} alt="" className={`w-[3rem] h-full rounded-full object-cover ${toggle ? "text-white transition-all" : "text-black"}`} />
            </div>
            <div className={toggle ? "opacity-0 transition-opacity text-white" : "opacity-100 delay-200 duration-200"}>
                <h3 className="text-xl">Admin</h3>
                <span className="text-[0.75rem] opacity-60">
                    {id}
                </span>
            </div>
        </div>
    );
}

export default UserProfile