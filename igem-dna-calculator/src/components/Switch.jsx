import React from "react";
import { useState } from "react";

function Switch(props) {
  return (
    <label className="switch relative inline-block w-[60px] h-[34px]">
      <input
        type="checkbox"
        className="opacity-0 w-0 h-0"
        onClick={() => props.setToggle(!props.toggle)}
      />
      <span
        className={`slider absolute cursor-pointer top-0 left-0 right-0 bottom-0  before:absolute before:content-[''] before:h-[26px] before:w-[26px] before:left-[4px] before:bottom-[4px] transition duration-200 ease-in-out  before:transition before:duration-150 before:ease-in-out rounded-3xl before:rounded-3xl ${
          props.toggle
            ? `before:translate-x-[26px] bg-green-200 before:bg-green-500`
            : "before:bg-red-500 bg-red-200"
        } `}
      />
    </label>
  );
}

export default Switch;
