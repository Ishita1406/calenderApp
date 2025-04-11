import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import '../styles/Password.css'

const Password = ({ value, onChange, placeholder }) => {

    const [isShowPassword, setIsShowPassword] = useState(false);

    const toggleShowPassword = () =>{
        setIsShowPassword(!isShowPassword);
    }

  return (
    <div class="password-wrapper">
    <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        class="password-input"
    />

    {isShowPassword ? (
        <FaRegEye 
            size={22}
            class="eye-icon show"
            onClick={() => toggleShowPassword()}
        />
    ) : (
        <FaRegEyeSlash 
            size={22}
            class="eye-icon hide"
            onClick={() => toggleShowPassword()}
        />
    )}
</div>

  )
}

export default Password