import React from "react";

import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa6";

function PresetSelector(props) {
  const dataset = props.dataset;

  const [isActive, setIsActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState(dataset[0].value);

  const menuRef = useRef(null);

  const closeMenu = (e) => {
    if (menuRef.current && isActive && !menuRef.current.contains(e.target)) {
      setIsActive(false);
    }
  };

  document.addEventListener("mousedown", closeMenu);

  const setSelection = (value, preset) => {
    setSelectedOption(value);
    isActive && setIsActive(false);
    props.selectedPreset(preset);
  };

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="flex-1">
      <div
        className="m-2 h-10 flex justify-between flex-row-reverse items-center text-black bg-gray-100 pl-4 p-2 text-base rounded-md text-left shadow-lg font-normal cursor-pointer
      "
        onClick={toggleMenu}
      >
        <FaCaretDown />
        {selectedOption}
      </div>
      {isActive && (
        <div
          className="m-2 text-black w-60 bg-white text-base rounded-md text-left mt-1 shadow-lg cursor-pointer absolute"
          ref={menuRef}
        >
          {dataset.map((data) => {
            let value = data.value;
            let preset = data.preset;
            return (
              <div
                className="pl-4 p-2"
                onClick={(e) => setSelection(value, preset)}
              >
                {value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PresetSelector;
