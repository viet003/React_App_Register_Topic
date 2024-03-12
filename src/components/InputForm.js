import React from "react";

const InputForm = ({ label, value, setValue, type, keyx, invalidFields, setInvalidFields }) => {
    return (
        <div className="h-30px items-center w-full text-[13px]">
            <label className="h-full min-w-[100px] text-primary ml-2 " htmlFor={type}>{label}</label>
            <input className="min-w-[250] w-full h-[30px] p-2 rounded-lg border outline-none focus:border-gray-400" id={type} name={type} type={keyx} value={value} key={type}
                onChange={(e) => setValue(prev => ({ ...prev, [type]: e.target.value }))}
                onFocus={() => setInvalidFields(invalidFields.filter(item => item.name !== type))}
            />
            {
                invalidFields.length > 0 && invalidFields.some(i => i.name === type) &&
                <small className="text-red-600 italic">{invalidFields.find(i => i.name === type)?.message}</small>
            }
        </div>
    )
}


export default InputForm