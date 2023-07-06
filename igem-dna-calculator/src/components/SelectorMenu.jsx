import { useEffect, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa6";

function Selector(props) {
  const dataset = props.dataset;
  const [isActive, setIsActive] = useState(false);

  const menuRef = useRef(null);

  const closeMenu = (e) => {
    if (menuRef.current && isActive && !menuRef.current.contains(e.target)) {
      setIsActive(false);
    }
  };

  document.addEventListener("mousedown", closeMenu);

  const setSelection = (selection) => {
    isActive && setIsActive(false);
    props.selectedOption(selection);
  };

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="flex-1">
      <div
        className="m-2 h-10 flex flex-row justify-between flex-row-reverse items-center text-black bg-gray-100 pl-4 p-2 text-base rounded-md text-left shadow-lg font-normal cursor-pointer
      "
        onClick={toggleMenu}
      >
        <FaCaretDown />
        {props.value}
      </div>
      {isActive && (
        <div
          className="m-2 text-black w-60 bg-white text-base rounded-md text-left mt-1 shadow-lg cursor-pointer absolute"
          ref={menuRef}
        >
          {dataset.map((data) => {
            let id = data.id;
            let value = data.value;
            return (
              <div
                key={id}
                className="pl-4 p-2"
                onClick={(e) => setSelection(value)}
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

export default Selector;
