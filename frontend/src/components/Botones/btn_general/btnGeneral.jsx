import PropTypes from "prop-types";
import React from "react";
import { useReducer } from "react";
import "./btnGeneral.css";

export const BtnGeneral = ({ 
  property1 = "variant-2", 
  className = "", 
  text = "Texto", 
  onClick,
  color = "morado", // Nuevo prop para el color
  disabled = false
}) => {
  const [state, dispatch] = useReducer(reducer, {
    property1: property1,
  });

  return (
    <button
      className={`btn-general ${state.property1} color-${color} ${className}`}
      onMouseEnter={() => {
        dispatch("mouse_enter");
      }}
      onMouseLeave={() => {
        dispatch("mouse_leave");
      }}
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      <div className="text-wrapper">{text}</div>
    </button>
  );
};

function reducer(state, action) {
  if (state.property1 === "variant-2") {
    switch (action) {
      case "mouse_enter":
        return { property1: "default" };
      default:
        return state;
    }
  }

  if (state.property1 === "default") {
    switch (action) {
      case "mouse_leave":
        return { property1: "variant-2" };
      default:
        return state;
    }
  }

  return state;
}

BtnGeneral.propTypes = {
  property1: PropTypes.oneOf(["variant-2", "default"]),
  className: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.oneOf(["morado", "rosa", "amarillo", "morado-claro"]),
  disabled: PropTypes.bool,
};
