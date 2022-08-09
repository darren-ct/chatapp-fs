import { StyledSidebar } from "../core-ui/Sidebar.style";
import { AppContext } from "../App";
import { useState,useContext} from "react";
import backArrow from "../assets/backArrow.svg"

import TambahTeman from "./TambahTeman";
import TambahGrup from "./TambahGrup";
import ProfilSaya from "./ProfilSaya";

const Sidebar = ({closeSidebar,sidebar,position,content,contentId}) => {

 const[successMsg,setSuccessMsg] = useState("");
 const{setUser} = useContext(AppContext)


  const renderContent = (content) => {

    

    switch(content) {
      case "Profil":
          return <ProfilSaya  closeSidebar={closeSidebar} successMsg={successMsg} setSuccessMsg={setSuccessMsg} />
        break;
      case "Setelan":
             return //settings components
        break; 
      case "Teman yang ultah":
             return //birthdays components
        break;
      case "Tambah Teman":
            return <TambahTeman closeSidebar={closeSidebar} successMsg={successMsg} setSuccessMsg={setSuccessMsg}/>
        break; 
      case "Tambah Grup":
             return <TambahGrup closeSidebar={closeSidebar} successMsg={successMsg} setSuccessMsg={setSuccessMsg}/>
        break;
      case "Lihat profil kontak":
             return // friendprofile
        break;
      case "Lihat profil grup":
            return // groupprofile
        break;
      case "Keluar" :
            localStorage.removeItem("user");
            return setUser(null);
        break;
      default:
        return ""
    } 
  };


  return (
    <StyledSidebar position={position}>

    <div className={sidebar ? "sidebar" : "sidebar hide"}>
        <div className="sidebar-nav">
            <img src={backArrow} onClick={()=>{closeSidebar();setSuccessMsg("")}}/>
            <span onClick={closeSidebar}>Kembali</span>
        </div>

       <div className="sidebar-content">
        {renderContent(content)}
        </div>
    </div>
    </StyledSidebar>
  )
}

export default Sidebar