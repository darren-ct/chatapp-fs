import { useState,useContext,useEffect } from "react";
import { AppContext } from "../App";
import ProfilTemanForm from "./ProfilTemanForm";

import success from "../assets/successful.svg";
import ErrorModal from "./modals/ErrorModal";
import {TailSpin} from "react-loader-spinner";

import api from "../connection";


const ProfilTeman = ({closeSidebar,successMsg,setSuccessMsg,id}) => {
    const{token} = useContext(AppContext);

    const[preset,setPreset] = useState("");

    // Dynamic states
    const[errMsg,setErrMsg] = useState("");
    const[profileLoader,setProfileLoader] = useState(false);

    // useEffect 
    useEffect(()=>{
          getFriendProfile()
    },[])

    // Function
    const getFriendProfile = async() => {
        try {
                
            setProfileLoader(true);

            const res = await api.get(`/profile/${id}`,{
                headers: {'Authorization':`Bearer ${token}`}
                });

            setProfileLoader(false)
     
             const payload = res.data;
             const profile = payload.data.profile;


             setPreset(profile)
             
            } catch(err) {
                const payload = err.response.data;
                const message = payload.message;

                setErrMsg(message)
            }
        };

    const resetSidebar = () => {
            setSuccessMsg("");
            closeSidebar();
        }

    //  if success
    if(successMsg){
        return (
             <div className="dynamic">
                 <img src={success}/>
                 <span className="dynamic-message">{successMsg}</span>
                 <p className="dynamic-close" onClick={resetSidebar}>Close Sidebar</p>
                 </div>
              )
     };

     // if loading
    if(profileLoader){
      return (
              <div className="dynamic">
                   <TailSpin height = "64" width = "64" radius = "9" color = '#6C5CE7' ariaLabel = 'three-dots-loading'  wrapperStyle wrapperClass />
              </div>
               )
      };

    

  return (
    <>
    <ErrorModal isShown={errMsg ? true : false} message={errMsg} />
    { preset && <ProfilTemanForm preset={preset} setErrMsg={setErrMsg} setSuccessMsg={setSuccessMsg} getFriendProfile={getFriendProfile} id={id}/> }
    </>
  )
}

export default ProfilTeman