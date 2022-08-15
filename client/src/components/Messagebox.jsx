import { useEffect, useState, useContext,useRef,createContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../App";
import { MainContext } from "../pages/Main";

import NotificationModal from "./modals/NotificationModal";
import Tabbar from "../components/advanced/Tabbar";
import Dropdown from "./advanced/Dropdown";
import Sidebar from "./Sidebar";
import Message from "../components/advanced/Message"
import {TailSpin} from "react-loader-spinner"

import { StyledMessageBox } from "../core-ui/MessageBox.style";

import dots from "../assets/whitedots.svg";
import send from "../assets/send.svg";
import emo from "../assets/emo.svg";
import image from "../assets/images.svg";
import person from "../assets/contacts.svg";
import api from "../connection";

import {friendDropdown,groupDropdown} from "../helpers/variables"

export const MessageContext = createContext(null);

const Messagebox = () => {
  const{token} = useContext(AppContext);
  const {filter,clickedChat,type,getChats,getGroupChats,getPins,getGroupPins} = useContext(MainContext);
  const navigate = useNavigate();

  // STATES
      // Drops 
  const[otherDrop,setOtherDrop] = useState(false);

      // Sidebar
  const[sidebar,setSidebar] = useState(false);
  const[sidebarContent,setSidebarContent] = useState(null);
 
      // Tabs
  const[isShown,setIsShown] = useState(false);
  const [ listType,setListType] = useState(null)
  const [others,setOthers] = useState([]);

    // Messages
  const [profile,setProfile] = useState(null);

  const messagesEndRef = useRef(null);
  const [messages,setMessages ] = useState([]);
  const [msgForm,setMsgForm] = useState("")
  const [replyId,setReplyId] = useState(null)

  const [mainLoading,setMainLoading] = useState(false);

    // Modals
  const[notif,setNotif] = useState("");

  // UseEffect 
  useEffect(()=>{

    if(clickedChat){
        getMessages();
    };

    setOtherDrop(false);
    setSidebar(false);
    setSidebarContent(null);

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
   setOtherDrop(prev => !prev);
  };

  const toggleSidebar = () => {
    setSidebar(prev => !prev)
    
  }

  const onChange = (e) => {
    setMsgForm(e.target.value)
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
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
           
          navigate("/error")

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

          //  Rerender
          getMessages();
          
          if(isGroup && filter === "pesan grup"){
              getGroupChats()
          } else if (isGroup && filter === "Pesan grup terpin"){
              getGroupPins()
          } else if (!isGroup && filter === "pesan") {
              getChats()
          } else if (!isGroup && filter === "pin") {
              getPins()
          };

          setMsgForm("");
          
       
         } catch(err) {
          
          navigate("/error")
          }


  };

  return (
  <MessageContext.Provider value={{setProfile,getMessages,setSidebarContent}}>
      <StyledMessageBox>
        <NotificationModal isShown={notif ? true : false} message={notif}/> 
        <Sidebar closeSidebar={toggleSidebar} sidebar={sidebar} position="right" content={sidebarContent} setContent={setSidebarContent} />

         {!clickedChat? 
         <p className="empty-message">Please click one of your chats.</p> : 
         (
         <>
           <header>
                <img  onClick={()=>{setSidebar(true); 
                if(type === "single") {setSidebarContent("Lihat profil kontak")}
                else{setSidebarContent("Lihat profil grup")}}}  
                src={!profile ? "" : type === "group" && profile.image ?
                 profile.image :  profile.profile_image ? profile.profile_image : ""} 
                 className="msg-profile" alt=""/>

                <div className="msg-info">
                     {!profile ? "" : profile.isOnline === "true" && <div className="status-dot"></div> }
                     <div className="msg-name">{!profile ? "" : type === "group" ?  profile.group_name : profile.display_name}</div>
                     <div className="msg-status">{!profile ? "" : type === "group" ? "" : profile.isOnline === "true" ? "online" : `Last online `}</div>
                </div>
                <div style={{position:"relative"}}>
                     {!otherDrop ? "" : type === "single" ? 
                     <Dropdown items={friendDropdown}  id={clickedChat} toggleSidebar={toggleSidebar} setSidebarContent={setSidebarContent} setNotif={setNotif} getMessages={getMessages} /> 
                     : <Dropdown items={groupDropdown} id={clickedChat} toggleSidebar={toggleSidebar} setSidebarContent={setSidebarContent} setNotif={setNotif} getMessages={getMessages}/> }
                     <img src={dots} className="other-btn" onClick={toggleOtherDrop} alt=""/>
                </div>
           </header>


           <section className="msg-section">
                  <div className="messages">
                  
                      { mainLoading ? 
                       <div className="dynamic"> <TailSpin height = "64" width = "64" radius = "9" color = '#6C5CE7' ariaLabel = 'three-dots-loading'  wrapperStyle wrapperClass /> </div>    : 
                      messages ? messages.map(message => <div key={message.message_id}> <Message key={message.message_id} message={message} type={type} setNotif={setNotif}/> </div>) : ""}
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
  </MessageContext.Provider>
  )
}

export default Messagebox