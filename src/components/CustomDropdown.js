import React from 'react';
import PropTypes from 'prop-types';
import './CustomDropdown.css';

const CustomDropdown = ({ options, value, backgroundColor, onChange }) => {
  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    onChange(selectedValue);
  };

  return (
    <select
      className="custom-dropdown"
      style={{ backgroundColor }}
      value={value}
      onChange={handleDropdownChange}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

CustomDropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomDropdown;
