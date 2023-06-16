import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ options, value, onChange, backgroundColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setSelected(option);
    setIsOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const getTextColor = (option) => {
    if (option === 'Day off' || option === 'Work day') {
      return 'black';
    } else {
      return 'white';
    }
  };

  const getDropdownBackgroundColor = (option) => {
    if (option === 'Day off' || option === 'Work day') {
      return 'lightgray';
    } else {
      return backgroundColor;
    }
  };

  return (
    <div className={`custom-dropdown ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
      <div
        className="selected-option"
        onClick={handleToggle}
        style={{ backgroundColor, color: getTextColor(selected) }}
      >
        {selected}
      </div>
      {isOpen && (
        <div
          className="options"
          style={{ backgroundColor: getDropdownBackgroundColor(selected) }}
        >
          {options.map((option) => (
            <div
              key={option}
              className={`option ${selected === option ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
              style={{ color: getTextColor(option) }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
