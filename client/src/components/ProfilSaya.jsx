import { useState,useContext, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { ChatContext } from "./Chatbox";

import ErrorModal from "./modals/ErrorModal";
import {TailSpin} from "react-loader-spinner"
import ProfilSayaForm from "./ProfilSayaForm";

import success from "../assets/successful.svg";
import api from "../connection";

const ProfilSaya = ({closeSidebar,successMsg,setSuccessMsg}) => {
            const navigate = useNavigate();
            const{token} = useContext(AppContext);
            const{setSidebarContent} = useContext(ChatContext);
 
            // States
            const [preset,setPreset] = useState("");

            // Dynamic states
            const[errMsg,setErrMsg] = useState("");
            const[profileLoader,setProfileLoader] = useState(false);
            
            // useEffect
            useEffect(()=>{
                 getMyProfile();
            },[])
            
            // Function
            const getMyProfile = async() => {

                try {
                
                 setProfileLoader(true);

                 const res = await api.get("/myprofile",{
                    headers: {'Authorization':`Bearer ${token}`}
                    });

                 setProfileLoader(false)
         
                 const payload = res.data;
                 const profile = payload.data.profile;
                 setPreset(profile)
                 
                } catch(err) {
                 navigate("/error")
                }
            };

            const resetSidebar = () => {
                setSidebarContent(null);
                setSuccessMsg(null);
                closeSidebar();
            };

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
                { preset && <ProfilSayaForm preset={preset} setErrMsg={setErrMsg} setSuccessMsg={setSuccessMsg} getMyProfile={getMyProfile}/> }
            </>
         )
}

export default ProfilSaya