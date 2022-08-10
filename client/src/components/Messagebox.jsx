import Tabbar from "../components/advanced/Tabbar";
import Dropdown from "./advanced/Dropdown";

import { useEffect, useState, useContext,useRef } from "react";
import { AppContext } from "../App";
import { StyledMessageBox } from "../core-ui/MessageBox.style";
import Message from "../components/advanced/Message"

import dots from "../assets/whitedots.svg";
import send from "../assets/send.svg";
import emo from "../assets/emo.svg";
import image from "../assets/images.svg";
import person from "../assets/contacts.svg";
import api from "../connection";

import {TailSpin} from "react-loader-spinner"




const Messagebox = ({clickedChat,type}) => {
  const{token} = useContext(AppContext);

  // STATES
      // Drops 
  const[otherDrop,setOtherDrop] = useState(false);
  const[messageDrop,setMessageDrop] = useState(false);

      // Tabs
  const[isShown,setIsShown] = useState(false);
  const [ listType,setListType] = useState(null)
  const [others,setOthers] = useState([]);

    // Messages
  const messagesEndRef = useRef(null);
  const [messages,setMessages ] = useState([]);
  const [msgForm,setMsgForm] = useState("")
  const [replyId,setReplyId] = useState(null)


  const [profile,setProfile] = useState(null);
  
  const [mainLoading,setMainLoading] = useState(false);
 

  // UseEffect 
  useEffect(()=>{

    if(clickedChat){
        getMessages();
    }
  },[clickedChat])

  useEffect(()=>{
    scrollToBottom()
  },[messages])

  // FUNCTIONS

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

  const onChange = (e) => {
    setMsgForm(e.target.value)
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
}

     // message related
  const getMessages = async() => {

    let isGroup = "";
    if(type === "group" ) {
      isGroup = "true"
    };

    try {
          setMainLoading(true);

          const res = await api.get(`/messages?isGroup=${isGroup}&roomId=${clickedChat}`,{
          headers: {'Authorization':`Bearer ${token}`}
           });

          setMainLoading(false);
 
          const payload = res.data.data;

          
          const NewMessages = payload.messages;
          const Profile = payload.profile[0];

          
          setProfile(Profile);
          setMessages(NewMessages);
          
       
         } catch(err) {
          console.log(err)
          }
  };


  const sendMessage = async(e) => {
         e.preventDefault();
         let isGroup = null;

         if(type === "group"){
            isGroup = "true"
         };

         try {
    
          await api.post(`/message`, {isGroup,roomId:clickedChat,message:msgForm,replying:replyId} , {
          headers: {'Authorization':`Bearer ${token}`}
           });

          getMessages();
       
         } catch(err) {
          console.log(err)
          }


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
                <img src={!profile ? "" : type === "group" && profile.image ? profile.image :  profile.profile_image ? profile.profile_image : ""} className="msg-profile" alt=""/>

                <div className="msg-info">
                     {!profile ? "" : profile.isOnline === "true" && <div className="status-dot"></div> }
                     <div className="msg-name">{!profile ? "" : type === "group" ?  profile.group_name : profile.display_name}</div>
                     <div className="msg-status">{!profile ? "" : type === "group" ? "" : profile.isOnline === "true" ? "online" : `Last online ${profile.hour}:${profile.minute} `}</div>
                </div>
                <div style={{position:"relative"}}>
                     {otherDrop && <Dropdown items={friendDropdown} /> }
                     <img src={dots} className="other-btn" onClick={toggleOtherDrop} alt=""/>
                </div>
        </header>


        <section className="msg-section">
                  <div className="messages">
                  
                      { mainLoading ? 
                       <div className="dynamic"> <TailSpin height = "64" width = "64" radius = "9" color = '#6C5CE7' ariaLabel = 'three-dots-loading'  wrapperStyle wrapperClass /> </div>    : 
                      messages ? messages.map(message => <Message key={message.message_id} message={message} getMessages={getMessages}/>) : ""}
                      <div ref={messagesEndRef}></div>
                  </div>
        </section>


        <section className="msg-others">
                  <div className="others">
                          <Tabbar list={others} type={listType} isShown={isShown} />
                  </div>
        </section>


        <form className="msg-tab" onSubmit={sendMessage} >
               <img src={emo} onClick={()=>{toggleTab("emoticon")}} alt=""/>
               <img src={image} alt=""/>
               <img src={person} onClick={()=>{toggleTab("friend")}} alt=""/>
               <div className="msg-control">
                      <input value={msgForm} onChange={onChange} type="text" placeholder="Send message"/>
                      <img src={send} onClick={sendMessage} alt=""/>
               </div>
        </form>
        </>
        )}

    </StyledMessageBox>
  )
}

export default Messagebox