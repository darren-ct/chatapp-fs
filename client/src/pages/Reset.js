import { useEffect, useContext, useState } from "react";
import { AppContext } from "../App";

import Button from "../components/basic/Button";
import Input from "../components/basic/Input";
import ErrorModal from "../components/modals/ErrorModal";
import NotificationModal from "../components/modals/NotificationModal";

import StyledReset from "../core-ui/pages/Reset.style";
import StyledFormBody from "../core-ui/FormBody.style";

import mainImage from "../assets/ResetPage.svg";
import leftCircles from "../assets/left-top.svg";
import rightCircles from "../assets/right-bottom.svg";
import api from "../connection";

import  {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email : yup.string().email().required("Email is required"),
});

const Reset = ({setUser}) => {
  const {setResetToken} = useContext(AppContext);
  const {register, handleSubmit,formState:{errors}} = useForm({
    resolver: yupResolver(schema)
  });

//   States & Variable
  const [digits,setDigits] = useState({
       first : "",
       second : "",
       third : "",
       fourth : ""
  })

  const [email,setEmail] = useState(null);
  const [timer,setTimer] = useState(60)
  const [err,setErr] = useState(null);
  const [notification,setNotification] = useState(null);

  const isShown = err ? true : false;
  const isNotifed = notification ? true : false;
  const isSent = email ? true : false;


  // UseEffect
useEffect(()=>{
      if(email){
        resendCode()
      }
},[email])

  // Functions
  const useEmail = async(data) => {
    setEmail(data.email)
   }

 const resendCode = async() => {
    setErr(null);
    setNotification(null);

  try {
    await api.post(`/auth/resendcode`,{email});
    setNotification("Code resent!");
    resetTimer();
  } catch(err) {
    const payload = err.response.data;
    const message = payload.message;
    setErr(message)
  };
 };

 const validateCode = async() => {
  setNotification(null);
  const code = digits.first + digits.second + digits.third + digits.fourth;
  
  try {
      const res = await api.post(`/auth/confirmemail/${code}`,{email});

      const payload = res.data;
      const user = payload.data.user;

      setResetToken(user.token);

     
  } catch(err) {
   const payload = err.response.data;
   const message = payload.message;
   setErr(message)
  }
}
      // form
  const onChange = (e) => {
        // Make sure length === 1
         if(digits[e.target.name].length === 1 && e.target.value.length > 1){
             return;
         };

         setDigits(prev => {
            return {...prev,[e.target.name]:e.target.value}
         })


  }
     //timer
  const resetTimer = () => {
       clearInterval(timerID)
       setTimer(60);

      var timerID =  setInterval(decrementTime,1000)
  }

  const decrementTime = () => {
    console.log(timer)
       if(timer < 1){
        return;
       }

       setTimer(prev => prev - 1)
  };

  const displayTimer = () => {
      if(timer === 60){
        return "01:00"
      };

      if(timer.toString().length === 2){
        return "00:" + timer
      };

      if(timer.toString().length === 1){
        return "00:0" + timer
      }


  }

  
  return (
    <>
    <NotificationModal isNotifed={isNotifed} message={notification}/>
    <ErrorModal isShown={isShown} message={err} />
    <StyledReset>
            <img id="left" src={leftCircles} alt="top-left" />
            <img id="right" src={rightCircles} alt="right-bottom" />

            <div className="landing-content">
                    <img className="landing-image" src={mainImage} alt="landing-image" />
                    
                    <StyledFormBody>
                          <div className="title">LUPA PASSWORD</div>
                          

                    {    !isSent ?
                       (   
                          <>
                          <div className="description">Isi email Anda dan kita akan kirim kode reset password disitu</div>
                          <form onSubmit={handleSubmit(useEmail)}>
                             <Input type="text" placeholder="Enter your email" name="email" register={register} errors={errors}/>
                             <Button content="Kirim kode" width="full" styling="primary"/>
                          </form>
                          </>
                           )
                          :

                       (
                        <>
                        <div className="description">Kode verifikasi telah terkirim namun hanya berlaku 1 menit</div>
                        <p className="timer">{displayTimer()}</p>
                        <div className="digits">
                           <input class="digit" type="text" value={digits.first} onChange={onChange} name="first"/>
                           <input class="digit" type="text" value={digits.second} onChange={onChange} name="second"/>
                           <input class="digit" type="text" value={digits.third} onChange={onChange} name="third"/>
                           <input class="digit" type="text" value={digits.fourth} onChange={onChange} name="fourth"/>
                        </div>
                        <Button content="Verifikasi kode" width="full" styling="primary" onPress={validateCode}/>
                        <Button content="Kirim ulang kode" width="full" styling="secondary" onPress={resendCode} />
                        </>
                       ) }


                    

                    </StyledFormBody>
            </div>
    </StyledReset>
    </>
  )
}

export default Reset