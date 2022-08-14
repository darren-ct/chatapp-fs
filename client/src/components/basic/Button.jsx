const Button = ({styling,width,content,onPress}) => {
  const buttonStyle = {
      width: width === "full" ? "100%" : "",
      flex: width === "flex-1" ? 1 : "",

      padding : "12px 24px",
      
      backgroundColor: styling === "primary" ? "#3C2CB4" : styling === "secondary" ? "transparent" : styling === "save" ? "#1BFF5B" : "#FF493E",
      color: styling === "secondary" ? "#3C2CB4" :  "white",

      borderRadius:"6px",
      border:"1px solid #3C2CB4",

      cursor:"pointer",
  };

  const doNothing = () => {};
  const fn = onPress ? onPress : doNothing;

  return (
    <button style={buttonStyle} onClick={fn} >{content}</button>
  )
}

export default Button