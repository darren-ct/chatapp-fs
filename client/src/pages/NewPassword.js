import StyledNewPassword from "../core-ui/pages/NewPassword.style"


import {useContext, useState } from "react";
import { AppContext } from "../App";
import api from "../connection";

import StyledFormBody from "../core-ui/FormBody.style";
import Button from "../components/basic/Button";
import Input from "../components/basic/Input";

import ErrorModal from "../components/modals/ErrorModal";

import leftCircles from "../assets/left-top.svg";
import rightCircles from "../assets/right-bottom.svg";

import  {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";


const schema = yup.object().shape({
  password :  yup.string().min(8).required("Password is required"),
  reenter : yup.string().oneOf([yup.ref("password"),"Password reentered not the same"])

});

const NewPassword = () => {
  const {resetToken,setResetToken} = useContext(AppContext);
  const {register, handleSubmit,formState:{errors}} = useForm({
    resolver: yupResolver(schema)
  });

//   States & Variable
  const [err,setErr] = useState(null);
 

  const isShown = err ? true : false;
  



  // Functions
  const sendNewPassword = async(data) => {

        setErr(null);
        const password = data.password;

        try {
            await api.post(`/auth/resetpassword`,{password},{
            headers: {'Authorization':`Bearer ${resetToken}`}
            });

            setResetToken(null);
        } catch (err) {

          const payload = err.response.data;
          const message = payload.message;
          setErr(message)
        }
  }
  
     
  return (
    <>
    <ErrorModal isShown={isShown} message={err} />
    <StyledNewPassword>
            <img id="left" src={leftCircles} alt="top-left" />
            <img id="right" src={rightCircles} alt="right-bottom" />

            <div className="landing-content">
                    <StyledFormBody>
                          <div className="title">SEND NEW PASSWORD</div>
                          <div className="description">Reenter new password for your account</div>
                        
                        <form onSubmit={handleSubmit(sendNewPassword)}>
                          <Input type="text" placeholder="Enter your new password" name="password" register={register} errors={errors}/>
                          <Input type="text" placeholder="Reenter password" name="reenter" register={register} errors={errors}/>
                          <Button content="Reset Password" width="full" styling="primary"/>
                        </form>

                    </StyledFormBody>
            </div>
    </StyledNewPassword>
    </>
  )
}

export default NewPassword