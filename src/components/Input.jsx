import React, { useState } from "react";

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

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        className={className}
        autoComplete={autoComplete}
        value={inputValue}
        onChange={handleChange}
      />
      <label
        htmlFor={id}
        className="text-[20px] text-gray-300 dark:text-white-200 absolute left-0 -top-4 cursor-text peer-focus:text-xs peer-focus:-top-4 peer-focus:text-gray-300 transition-all"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
