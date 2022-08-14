import { useState,useContext} from "react";
import { MainContext } from "../pages/Main";

import TambahTeman from "./TambahTeman";
import TambahGrup from "./TambahGrup";
import ProfilSaya from "./ProfilSaya";
import ProfilTeman from "./ProfilTeman";
import ProfilGrup from "./ProfilGrup";

import { StyledSidebar } from "../core-ui/Sidebar.style";

import backArrow from "../assets/backArrow.svg"

const Sidebar = ({closeSidebar,sidebar,position,content,setContent}) => {

 const{clickedChat} = useContext(MainContext);
 const[successMsg,setSuccessMsg] = useState("");


//  Functions
  const renderContent = (content) => {
    switch(content) {
      // LEFT
      case "Profil":
          return <ProfilSaya  closeSidebar={closeSidebar} successMsg={successMsg} setSuccessMsg={setSuccessMsg} />
        break;
      case "Tambah Teman":
            return <TambahTeman closeSidebar={closeSidebar} successMsg={successMsg} setSuccessMsg={setSuccessMsg}/>
        break; 
      case "Tambah Grup":
             return <TambahGrup closeSidebar={closeSidebar} successMsg={successMsg} setSuccessMsg={setSuccessMsg}/>
        break;
      // RIGHT
          // Chat
      case "Lihat profil kontak":
             return <ProfilTeman closeSidebar={closeSidebar} successMsg={successMsg} setSuccessMsg={setSuccessMsg} id={clickedChat}/>
      break;

          //Group
      case "Lihat profil grup":
            return <ProfilGrup closeSidebar={closeSidebar} successMsg={successMsg} setSuccessMsg={setSuccessMsg} id={clickedChat}/>
      break;

      //BOTH
      case "Ganti layar belakang":
            
      break;

      case null:
           return <div>empty</div>
      break;
      
      default:
        return 
    } 
  };

  return (
    <StyledSidebar position={position}>

    <div className={sidebar ? "sidebar" : "sidebar hide"}>
        <div className="sidebar-nav">
            <img src={backArrow} onClick={()=>{closeSidebar();setContent(null);setSuccessMsg(null)}}/>
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