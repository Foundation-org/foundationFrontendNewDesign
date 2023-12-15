import React, { useState } from "react";
import { useEffect } from "react";

const Input = ({
  type,
  id,
  label,
  className,
  autoComplete,
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  useEffect(() => {
    setInputValue(value); 
  }, [value]);
     console.log(inputValue);
  return (
    
    <div className="relative">
      <input
        type={type}
        id={id}
        className={className}
        autoComplete={autoComplete}
        value={inputValue}
        onChange={handleChange}
        name={type}
      />
      <label
        htmlFor={id}
        className="short:text-[14px] absolute -top-6 left-0 cursor-text text-[10.2px] leading-none text-gray-300 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-gray-300 dark:text-white-200 tablet:text-[18px] md:text-[20px]"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
