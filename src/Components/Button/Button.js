import React from 'react'

const Button = ({
    label = "",
    type = "button",
    className = "",
    disabled = false,
}) => {
    return (
        <button type={type} className={`text-white bg-[#3d788c] rounded-lg focus:outline-none text-sm  px-5 
    py-2.5 text-center ${className}`} disabled={disabled}>{label}</button>
    )
}

export default Button