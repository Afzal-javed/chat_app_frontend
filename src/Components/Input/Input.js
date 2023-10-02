import React from 'react'

const Input = ({
    label = "",
    name = "",
    type = "text",
    className = "",
    inputClassName = "",
    isRequired = false,
    placeholder = "",
    value = "",
    onChange = () => { },
}) => {
    return (
        <div className={`w-1/2 ${className}`}>
            <label for={name} className='flex flex-col text-sm font-medium text-gray-900 items-start justify-start'>{label}</label>
            <input type={type} id={name} className={`bg-gray text-sm  text-gray-800 rounded-lg
            outline-none block w-full p-2.5 ${inputClassName}`} placeholder={placeholder} required={isRequired}
                value={value} onChange={onChange} />
        </div>
    )
}

export default Input