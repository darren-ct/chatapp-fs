import { StyledInput } from "../../core-ui/Input.style";

const Input = ({styling,type,placeholder,register,name,errors}) => {


  return (
    <StyledInput styling={styling}>
    <input {...register(name)} type={type} style={errors[name]?  {border:"1px solid red"} : {}} placeholder={placeholder} />
    <p>{errors[name]?.message}</p>
    </StyledInput>
  )
}

export default Input
