import React, { useEffect } from "react";

function InputComponent(props) {
  useEffect(() => {
    if (props.value === "")
      document.querySelector(
        `#${props.multiline ? "name" : "text"}-field`
      ).value = "";
  }, [props.value]);

  const updateValue = (value) => {
    props.inputHandler(value);
  };

  const onChangeDescriptionHandler = () => {
    const field = document.querySelector("#text-field");
    updateValue(field.value);
    field.style.height = "auto";
    let scrollHeight = field.scrollHeight;
    field.style.height =
      Math.floor(scrollHeight / 24) > 20 ? `480px` : `${scrollHeight}px`;
  };

  return (
    <div className="flex flex-col justify-between items-start">
      <h1 className="flex-none pr-6 font-semibold">{props.label}</h1>
      {!props.multiline ? (
        <input
          id="name-field"
          type="text"
          className="my-4 h-auto w-full resize-none pl-4 p-2 text-base rounded-md text-left cursor-text leading-6 shadow-lg text-black bg-gray-100"
          placeholder={props.placeholder}
          onInput={(e) => {
            updateValue(e.target.value);
          }}
        />
      ) : (
        <textarea
          id="text-field"
          type="text"
          className="my-4 h-auto w-full resize-none pl-4 p-2 text-base rounded-md text-left cursor-text leading-6 shadow-lg text-black bg-gray-100"
          rows={1}
          placeholder={props.placeholder}
          onInput={onChangeDescriptionHandler}
        />
      )}
    </div>
  );
}

export default InputComponent;
