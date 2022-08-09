import React from 'react'

const Button = ({styling,width,content,onPress}) => {
  const buttonStyle = {
      padding : "12px 24px",
      backgroundColor: styling === "primary" ? "#3C2CB4" : styling === "secondary" ? "transparent" : styling === "save" ? "#1BFF5B" : "#FF493E",
      color: styling === "secondary" ? "#3C2CB4" :  "white",
      width: width === "full" ? "100%" : "",
      flex: width === "flex-1" ? 1 : "",
      borderRadius:"6px",
      border:"1px solid #3C2CB4",
      cursor:"pointer",
      fontWeight :"",
  };

  const doNothing = () => {};
  const fn = onPress ? onPress : doNothing;

  return (
    <button style={buttonStyle} onClick={fn} >{content}</button>
  )
}

export default Button