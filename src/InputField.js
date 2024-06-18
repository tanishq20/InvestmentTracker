// InputField.js

import React from "react";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  className,
}) => {
  return (
    <label>
      {label}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={className}
      />
    </label>
  );
};

export default InputField;
