import React from "react";

const InputForm = ({label,value,setValue,type,key}) => {
    return (
        <div className="h-30px items-center w-full text-[13px]">
            <label className="h-full min-w-[100px] text-primary ml-2 " htmlFor={type}>{label}</label>
            <input className="min-w-[250] w-full h-[40px] p-2 rounded-lg border" id={type} name={type} type={key} value={value}
                onChange={(e) => setValue(prev => ({...prev, [type]:e.target.value}))} />
        </div>
    )
}


export default InputForm