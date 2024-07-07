import React from "react";
import SelectionMenu from "./SelectionMenu";

function SelectionComponent(props) {
	return (
		<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
			<h1 className="flex-none pr-6 font-semibold">{props.label}</h1>
			<SelectionMenu
				type={props.type}
				dataset={props.dataset}
				value={props.value}
				selectedOption={props.selectedOption}
			/>
		</div>
	);
}

export default SelectionComponent;
