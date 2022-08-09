import {useNavigate} from "react-router-dom";
import { useState } from "react";


import api from "../connection";
import StyledLogin from "../core-ui/pages/Login.style";
import StyledFormBody from "../core-ui/FormBody.style";
import Button from "../components/basic/Button";
import Input from "../components/basic/Input";
import ErrorModal from "../components/modals/ErrorModal";

import mainImage from "../assets/AuthPage.svg";
import leftCircles from "../assets/left-top.svg";
import rightCircles from "../assets/right-bottom.svg";

import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup .object().shape({
  email : yup.string().email().required("Email is required"),
  password :  yup.string().min(8).required("Password is required")
})

const Login = ({setUser}) => {
  const navigate = useNavigate();
  const {register, handleSubmit,formState:{errors}} = useForm({
    resolver: yupResolver(schema)
  });

  const [err,setErr] = useState(null)
  const isShown = err ? true : false;

  // Functions
  const submitForm = async(data) => {
    setErr(null);

    // Post
    try {
     let res = await api.post("/auth/login", data);
 
     const payload = res.data;
     const user = payload.data.user;
     setUser(user);
   
   } catch(err){
     console.log(err)
     const payload = err.response.data;
     const message = payload.message;
     setErr(message)
 }; }
  
  return (
    <>
    <ErrorModal isShown={isShown} message={err} />
    <StyledLogin>
            <img id="left" src={leftCircles} alt="top-left" />
            <img id="right" src={rightCircles} alt="right-bottom" />

            <div className="landing-content">
                    <img className="landing-image" src={mainImage} alt="landing-image" />
                    
                    <StyledFormBody>
                          <div className="title">Login</div>
                          <div className="description">Tolong isi field-field dibawah ini</div>

                        <form onSubmit={handleSubmit(submitForm)}>
                          <Input type="text" placeholder="Enter your email" name="email" register={register} errors={errors}/>
                          <Input type="password" placeholder="Enter your password" name="password" register={register} errors={errors}/>
                          <div id="first-link" className="link" onClick={()=>{navigate("/reset")}} >Lupa password? Reset disini.</div>
                          <Button content="Login" width="full" styling="primary"/>
                          </form>

                          <div id="second-link" className="link" onClick={()=>{navigate("/signup")}}>Belum punya akun? Daftar disini.</div>
                    </StyledFormBody>
            </div>
    </StyledLogin>
    </>
  )
}

export default Login