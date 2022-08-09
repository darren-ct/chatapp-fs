import Tabbar from "../components/advanced/Tabbar";
import Dropdown from "./advanced/Dropdown";

import { useState } from "react";
import { StyledMessageBox } from "../core-ui/MessageBox.style";

import dots from "../assets/whitedots.svg";
import send from "../assets/send.svg";
import emo from "../assets/emo.svg";
import image from "../assets/images.svg";
import person from "../assets/contacts.svg";
import api from "../connection";




const Messagebox = ({clickedChat}) => {
  const[otherDrop,setOtherDrop] = useState(false);
  const[messageDrop,setMessageDrop] = useState(false);

  const[isShown,setIsShown] = useState(false);
  const [others,setOthers] = useState([]);
  const [ listType,setListType] = useState(null)

  // functions
      // others
  const fetchEmoticons = async() => {
     //fetch and setOthers
  };

  const fetchFriends = async() => {
    //  fetch and setOthers
  };

  const toggleTab = (type) => {
    setIsShown(prev => !prev);

    if(type === "emoticon"){
      fetchEmoticons();
      setListType(type);
    } else {
      fetchFriends();
      setListType(type)
    }
  };

  const toggleOtherDrop = () => {
   setMessageDrop(false);
   setOtherDrop(prev => !prev);
  };



     // message related
  const sendMessage = async() => {

  };

  const deleteMessage = async() => {

  };

  const unsendMessage = async() => {

  };

  const replyMessage = async() => {

  };

  const forwardMessage = async() => {

  };


  // Array
  const groupDropdown = ["Bersihkan Chat", "Lihat profil grup","Ganti layar belakang","Keluar grup"];
const friendDropdown = ["Bersihkan Chat","Hapus Chat","Ganti layar belakang","Blokir orang","Lihat profil kontak"];
const messageDropdown = ["Unsend Message", "Delete for me","Forward Message","Reply Message"];


 
  return (
    <StyledMessageBox>

    {!clickedChat? 
    <p className="empty-message">Please click one of your chats.</p> : 
    (
      <>
      <header>
                <img src="" className="msg-profile"/>

                <div className="msg-info">
                     <div className="status-dot"></div>
                     <div className="msg-name">Chris</div>
                     <div className="msg-status">online</div>
                </div>
                <div style={{position:"relative"}}>
                     {otherDrop && <Dropdown items={friendDropdown} /> }
                     <img src={dots} className="other-btn" onClick={toggleOtherDrop}/>
                </div>
        </header>


        <section className="msg-section">
                  <div className="messages">
                      
                  </div>
        </section>


        <section className="msg-others">
                  <div className="others">
                          <Tabbar list={others} type={listType} isShown={isShown} />
                  </div>
        </section>


        <section className="msg-tab">
               <img src={emo} onClick={()=>{toggleTab("emoticon")}} />
               <img src={image}/>
               <img src={person} onClick={()=>{toggleTab("friend")}}/>
               <div className="msg-control">
                      <input />
                      <img src={send} />
               </div>
        </section>
        </>
        )}

    </StyledMessageBox>
  )
}

export default Messagebox