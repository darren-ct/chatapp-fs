import { useState,useContext,useEffect } from "react";
import { AppContext } from "../App";
import ProfilGrupForm from "../components/ProfilGrupForm";

import success from "../assets/successful.svg";
import ErrorModal from "./modals/ErrorModal";
import {TailSpin} from "react-loader-spinner";

import api from "../connection";


const ProfilGrup = ({closeSidebar,successMsg,setSuccessMsg,id}) => {
  const {token} = useContext(AppContext);

  const[role,setRole] = useState([]);
  const[preset,setPreset] = useState("");



  // Dynamic states
  const[errMsg,setErrMsg] = useState("");
  const[profileLoader,setProfileLoader] = useState(false);
  

  // UseEffect
  useEffect(()=>{
        getGroupProfile();
  },[]);

  //function
  const getGroupProfile = async() => {
    try {
                
      setProfileLoader(true);

      const res = await api.get(`/group/${id}`,{
          headers: {'Authorization':`Bearer ${token}`}
          });

      setProfileLoader(false)

       const payload = res.data;
       
       let profile = payload.data.profile;
       const role = payload.data.role;
       
       setPreset(profile);
       setRole(role);
       
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
  { preset && <ProfilGrupForm preset={preset} setErrMsg={setErrMsg} setSuccessMsg={setSuccessMsg}  
  id={id} role={role} getGroupProfile={getGroupProfile} 
  /> }
  </>
)
}

export default ProfilGrup