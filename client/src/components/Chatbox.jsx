import { useState,useEffect,useContext, createContext} from "react";
import { AppContext } from "../App";

import { StyledChatBox } from "../core-ui/ChatBox.style"
import Dropdown from "../components/advanced/Dropdown";
import Sidebar from "./Sidebar";


import {StyledChatBoxCards} from "../core-ui/ChatBoxCards.style"

import searchImg from "../assets/search.svg";
import dots from "../assets/threedots.svg";
import { TailSpin } from "react-loader-spinner";

import api from "../connection";
import Button from "./basic/Button";
import { getChatTime } from "../helpers";


export const ChatContext = createContext(null)

const Chatbox = ({setClickedChat,setType}) => {
  const{user,token}=useContext(AppContext);
  const id = user.user_id;

  // States
          // Header
  const [profile,setProfile] = useState("");

          // Filter and Search
  const [filter,setFilter] = useState("pesan")
  const [search,setSearch] = useState("");
          
          // List
  const[list,setList] = useState([]);
  const[loadingList,setLoadingList] = useState(false);

          // Sidebar and Drop
  const[sidebar,setSidebar] = useState(false);
  const[sidebarContent,setSidebarContent] = useState(null);
  const[showAddDrop,setShowAddDrop] = useState(false);
  const[showOtherDrop,setShowOtherDrop] = useState(false);


  // useEffect
  useEffect(()=>{
    getImage();
  },[]);


  useEffect(()=>{

    switch(filter){

    case "pesan":
           getChats()
    break;
    case "teman":
           getFriends()
    break; 
    case "blokiran":
           getBlocked()
    break;
    case "pin":
           getPins()
    break; 
    case "grup":
           getGroups()
    break;
    case "undangan":
           getInvitations()
    break;
      

    default:
         getChats()
    }

    
  },[filter,search])


  
  // Functions
            //  Tampilan
  const renderBox = (item) => {

    switch(filter){
           

      case "pesan" || "":

            return (
            <div key={item.room_id} onClick={()=>{setClickedChat(item.room_id);setType(item.type)}}>
            <StyledChatBoxCards>
                  <img src={item.profile_image} />
                  <div className="name">{item.display_name}</div>
                  <div className="time">{getChatTime(item.last_date,item.last_time)}</div>
                  <div className="notif">{item.notif}</div>
            </StyledChatBoxCards>
            </div>
                   )
      break;
      case "teman":
            return (
            <div key={item.friend_id} onClick={()=>{startChat(item.friend_id);setType("single")}}>
              <StyledChatBoxCards>
                  <img src={item.profile_image ? item.profile_image : ""}/>
                  <div className="name">{item.display_name}</div>
              </StyledChatBoxCards>
            </div>
            )
      break; 
      case "blokiran":
             return (
              <div key={item.friend_id}>
              <StyledChatBoxCards>
                  <img src={item.profile_image ? item.profile_image : ""}/>
                  <div className="name">{item.display_name}</div>
                  <Button content="Unblock" styling="secondary" onPress={async()=>{
                      try { 
                        await api.put(`/unblock/${item.friend_id}`,{},{
                         headers: {'Authorization':`Bearer ${token}`}
                         }) 
                        getBlocked();
                        }
                      catch(err) {
                        console.log(err)
                      }
                  }}/>
              </StyledChatBoxCards>
            </div>
             )
      break;
      case "pin":
             return (             
              <div key={item.room_id} onClick={()=>{setClickedChat(item.room_id);setType(item.type)}}>
              <StyledChatBoxCards>
  
  
              </StyledChatBoxCards>
              </div>)
      break; 
      case "grup":
             return (             
               <div key={item.room_id} onClick={()=>{setClickedChat(item.room_id);setType("group")}}>
              <StyledChatBoxCards>
                   <img src={item.image} />
                   <div className="name">{item.group_name}</div>
              </StyledChatBoxCards>
              </div>)
      break;
      case "undangan":
             return (              
             <div key={item.room_id}>
              <StyledChatBoxCards>
                  <img src={item.image} />
                  <div className="name">{item.group_name}</div>
                  <Button content="Join Group" styling="primary" onPress={async()=>{
                    try {
                        await api.put("/group/join",{roomId:item.room_id},{
                         headers: {'Authorization':`Bearer ${token}`}
                         })

                         setFilter("grup")
                    } catch(err) {
                        console.log(err)
                    }
                  }}/>
              </StyledChatBoxCards>
            </div>)
      break;
        
  
      default:
              return (              
              <div>
                <StyledChatBoxCards>
    
    
                </StyledChatBoxCards>
              </div>)
      }

  };

  const getImage = async() => {
        try {
            const res = await api.get("/myprofile?profileOnly=true",{
            headers: {'Authorization':`Bearer ${token}`}
            });

            const profileImage = res.data.data.profile.image;

            setProfile(profileImage);

        } catch(err) {
          console.log(err)
        }
  }

  const getChats = async() => {
      try {
           const res = await api.get("/chats",{
          headers: {'Authorization':`Bearer ${token}`}
          });

          const payload = res.data;
          const chats = payload.data.chats;
          let newChats = chats.filter(chat => chat.display_name.toLowerCase().trim().startsWith(search) === true);

          setList(newChats)


      } catch (err) {
       
         console.log(err);

      }
  };

  const getFriends = async() => {

    try {
      setLoadingList(true);

      const res = await api.get("/friends",{
     headers: {'Authorization':`Bearer ${token}`}
     });

     setLoadingList(false)

     const payload = res.data;
     const friends = payload.data.friends;
     let newFriends = friends.filter(friend => friend.display_name.toLowerCase().trim().startsWith(search) === true);
     

     setList(newFriends);

 } catch (err) {
  
    console.log(err);

 }
  };

  const getBlocked = async() => {
    try {
      setLoadingList(true);

      const res = await api.get("/friends?isBlock=true",{
     headers: {'Authorization':`Bearer ${token}`}
     });

     setLoadingList(false)

     const payload = res.data;
     const friends = payload.data.friends;
     let newFriends = friends.filter(friend => friend.display_name.toLowerCase().trim().startsWith(search) === true);
     

     setList(newFriends);

 } catch (err) {
  
    console.log(err);

 }
  };

  const getPins = async() => {
    try {
      const res = await api.get("/chats?isPinned=true",{
     headers: {'Authorization':`Bearer ${token}`}
     });

     const payload = res.data;
     const chats = payload.data.chats;

     let newChats = chats.filter(chat => chat.display_name.toLowerCase().trim().startsWith(search) === true);

     setList(newChats)


 } catch (err) {
  
    console.log(err);

 }
  };

  const getGroups = async() => {
    try {
      const res = await api.get("/groups",{
     headers: {'Authorization':`Bearer ${token}`}
     });

     const payload = res.data;
     const groups = payload.data.groups;
     let newGroups = groups.filter(group => group.group_name.toLowerCase().trim().startsWith(search) === true);

     setList(newGroups)


 } catch (err) {
  
    console.log(err);

 }
  };

  const getInvitations = async() => {
    try {
      const res = await api.get("/invitations",{
     headers: {'Authorization':`Bearer ${token}`}
     });

     const payload = res.data;
     const invitations = payload.data.invitations;

     let newInvitations = invitations.filter(invitation => invitation.group_name.toLowerCase().trim().startsWith(search) === true);

     setList(newInvitations)


 } catch (err) {
  
    console.log(err);

 }
  }; 
              // Start Chat
  const startChat = async(friendId) => {
    try {
      

     const res = await api.post("/chat",  {friendId:friendId} ,{
     headers: {'Authorization':`Bearer ${token}`}
     });

     const payload = res.data;
     const roomId = payload.id;
  
     setClickedChat(roomId);


 } catch (err) {
  
    console.log(err);

 }
  }

             // Form
  const onChange = (e) => {
    setFilter(e.target.value);
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
  }


        // Toggling
  const toggleAddDrop = () => {
      setShowOtherDrop(false)
      setShowAddDrop(prev => !prev)
  };

  const toggleOtherDrop = () => {
      setShowAddDrop(false)
      setShowOtherDrop(prev => !prev)
  };

  const toggleSidebar = () => {
    setSidebar(prev => !prev)
  }

const addDropdown = ["Tambah Teman", "Tambah Grup"];
const otherDropdown = ["Teman yang ultah","Profil","Setelan","Keluar"];


  return (
    <ChatContext.Provider value={{setProfile,setFilter,getFriends,getGroups}}>
    <StyledChatBox>
          <Sidebar closeSidebar={toggleSidebar} sidebar={sidebar} position="left" content={sidebarContent}/>
       
          <header>
                <img src={profile} className="chat-profile" onClick={()=>{toggleSidebar();setSidebarContent("Profil")}}/>
                <button className="add-btn" onClick={toggleAddDrop}>
                +
                {showAddDrop && <Dropdown items={addDropdown} toggleSidebar={toggleSidebar} setSidebarContent={setSidebarContent} />}
                </button>

                <div style={{position:"relative"}}>
                   {showOtherDrop && <Dropdown items={otherDropdown} toggleSidebar={toggleSidebar} setSidebarContent={setSidebarContent} /> }
                   <img src={dots} className="other-btn" onClick={toggleOtherDrop}/>
                </div>
                
          </header>


          <section className="sort-section">
                 <div className="search-control">
                    <input type="text" placeholder="Search" value={search} onChange={onSearch}/>
                    <img src={searchImg}/>
                 </div>
                 <select className="filter-control" value={filter} onChange={onChange}>
                     <option value="pesan">Pesan saya</option>
                     <option value="teman">Teman saya</option>
                     <option value="blokiran">Blokiran saya</option>
                     <option value="pin">Yang saya pin</option>
                     <option value="grup">Grup saya</option>
                     <option value="undangan">Undangan saya</option>
                 </select>
          </section>

          <section className="chats-section">
                 <div className="chats">
                 {loadingList  && list.length === 0 ?
                  <p className="empty-list"> <TailSpin height = "64" width = "64" radius = "9" color = '#6C5CE7' ariaLabel = 'three-dots-loading'  wrapperStyle wrapperClass /> </p>:
                    list.length === 0 ? <p className="empty-list">No results..</p> : list.map(item => renderBox(item))}
                 </div>
          </section>

    </StyledChatBox>
    </ChatContext.Provider>
  )
}

export default Chatbox