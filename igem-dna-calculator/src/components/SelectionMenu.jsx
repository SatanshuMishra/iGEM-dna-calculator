import React from "react";

import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa6";

function SelectionMenu(props) {
	// DATASET FOR FROM WHICH SELECTION OPTIONS ARE GENERATED
	const dataset = props.dataset;
	// TYPE OF SECLECTION MENU
	const type = props.type;
	// DETERMINES IF THE SELECTION MENU IS OPEN
	const [isOpen, setIsOpen] = useState(false);

	// RESPONSIBLE FOR CHECKING AND CLOSING THE SELECTION MENU WHEN CLICKING OUTSIDE THE MENU
	// TODO: FIX THE LOOP ON CLICKING THE SELECTION TAB

	const menuRef = useRef(null);
	const closeMenu = e => {
		if (menuRef.current && isOpen && !menuRef.current.contains(e.target)) {
			setIsOpen(false);
		}
	};
	document.addEventListener("mousedown", closeMenu);

	// UPDATES SELECTION & CLOSES THE SELECTION MENU IF OPEN
	const setSelection = idx => {
		isOpen && setIsOpen(false);
		props.selectedOption(idx);
	};

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	// (data, idx) => {
	//   return (
	//     <div key={idx} className="pl-4 p-2" onClick={setSelection(idx)}>
	//       {data.value}
	//     </div>
	//   );
	// }

	return (
		//md:max-w-[80%]
		<div className="w-full">
			<div
				className="my-2 h-auto flex justify-between flex-row-reverse items-center text-black bg-gray-100 pl-4 p-2 text-base rounded-md text-left font-normal cursor-pointer
      "
				onClick={toggleMenu}>
				<FaCaretDown />
				{props.value}
			</div>
			{isOpen && (
				<div
					className="m-2 text-black w-60 bg-white text-base rounded-md text-left mt-1 shadow-lg cursor-pointer absolute"
					ref={menuRef}>
					{dataset.map((data, idx) => {
						let key = data.id;
						let value = data.value;
						return (
							<div
								key={key}
								className="pl-4 p-2"
								onClick={() => {
									setSelection(idx);
								}}>
								{value}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default SelectionMenu;
