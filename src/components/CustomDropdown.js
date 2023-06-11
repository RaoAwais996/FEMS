import React, { useState } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ options, value, onChange, backgroundColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`custom-dropdown ${isOpen ? 'open' : ''}`}>
      <div className="selected-option" onClick={handleToggle} style={{ backgroundColor }}>
        {value}
      </div>
      <div className="options" style={{ backgroundColor }}>
        {options.map((option) => (
          <div
            key={option}
            className={`option ${value === option ? 'selected' : ''}`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomDropdown;
