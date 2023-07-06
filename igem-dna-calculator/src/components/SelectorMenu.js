import { useRef, useState } from "react";

function Selector(props) {
  const dataset = props.dataset;
  const [isActive, setIsActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  const menuRef = useRef(null);

  const closeMenu = (e) => {
    if (menuRef.current && isActive && !menuRef.current.contains(e.target)) {
      setIsActive(false);
    }
  };

  document.addEventListener("mousedown", closeMenu);

  const setSelection = (selection) => {
    setSelectedOption(selection);
    toggleMenu();
    props.selectedValue(selection);
  };

  return (
    <div className="flex-1">
      <div
        className="m-2 h-10 text-black bg-gray-100 pl-4 p-2 text-base rounded-md text-left shadow-lg font-semibold cursor-pointer
      "
        onClick={toggleMenu}
      >
        {selectedOption}
      </div>
      {isActive && (
        <div
          className="m-2 text-black w-60 bg-white text-base rounded-md text-left mt-1 shadow-lg cursor-pointer absolute"
          ref={menuRef}
        >
          {dataset.map((data) => {
            let value = data.value;
            return (
              <div className="pl-4 p-2" onClick={(e) => setSelection(value)}>
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
