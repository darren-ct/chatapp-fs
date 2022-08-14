import { useState,useEffect,useContext,createContext,useLayoutEffect} from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { MainContext } from "../pages/Main";

import { StyledChatBox } from "../core-ui/ChatBox.style"

import Sidebar from "./Sidebar";
import Undangan from "./chat/Undangan";
import Grup from "./chat/Grup";
import Pin from "./chat/Pin";
import Blokiran from "./chat/Blokiran";
import Teman from "./chat/Teman";
import Pesan from "./chat/Pesan";
import { TailSpin } from "react-loader-spinner";
import Dropdown from "../components/advanced/Dropdown";

import searchImg from "../assets/search.svg";
import dots from "../assets/threedots.svg";

import { addDropdown,otherDropdown } from "../helpers/variables";
import api from "../connection";
import NotificationModal from "./modals/NotificationModal";


export const ChatContext = createContext(null)

const Chatbox = ({list,setList,loadingList,setLoadingList,search,setSearch,filter,setFilter,getChats,getGroups,getPins}) => {
  const navigate = useNavigate();
  const{token}=useContext(AppContext);
  const{setClickedChat} = useContext(MainContext);

  // States
          // Header
  const [profile,setProfile] = useState("");

          // Sidebar and Dropdown
  const[sidebar,setSidebar] = useState(false);
  const[sidebarContent,setSidebarContent] = useState(null);
  
  const[showAddDrop,setShowAddDrop] = useState(false);
  const[showOtherDrop,setShowOtherDrop] = useState(false);

        // Modals
  const[notif,setNotif] = useState(false);


  // useEffect
  useEffect(()=>{
    getImage();
  },[]);

  useLayoutEffect(()=>{

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
      case "pesan" :
          return  <Pesan item={item} />
      break;

      case "teman":
            return <Teman item={item} startChat={startChat} getFriends={getFriends}/>
      break; 

      case "blokiran":
             return <Blokiran item={item} getBlocked={getBlocked}/>
      break;

      case "pin":
             return <Pin item={item} />
      break; 

      case "grup":
             return <Grup item={item}/>
      break;

      case "undangan":
             return <Undangan item={item} getInvitations={getInvitations} />
      break;
        
  
      default:
              return ""
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
             navigate("/error")
        }
  }

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
  
     navigate("/error")

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
  
    navigate("/error")

 }
  };

  const getInvitations = async() => {
    try {
      setLoadingList(true);

      const res = await api.get("/invitations",{
     headers: {'Authorization':`Bearer ${token}`}
     });

     setLoadingList(false);

     const payload = res.data;
     const invitations = payload.data.invitations;

     let newInvitations = invitations.filter(invitation => invitation.group_name.toLowerCase().trim().startsWith(search) === true);

     setList(newInvitations)


 } catch (err) {
  
     navigate("/error")

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
  
    navigate("/error")

 }
  }
             // Form
  const onChange = (e) => {
    setFilter(e.target.value);
    setLoadingList(true)
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
  
  return (
    <ChatContext.Provider value={{setProfile,setFilter,setSidebarContent,setNotif,getFriends,getGroups}}>
       <StyledChatBox>
          <NotificationModal isShown={notif ? true : false} message={notif} />
    
          <Sidebar closeSidebar={toggleSidebar} sidebar={sidebar} position="left" content={sidebarContent} setContent={setSidebarContent}/>
       
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
                 {loadingList ?
                  <p className="empty-list"> <TailSpin height = "64" width = "64" radius = "9" color = '#6C5CE7' ariaLabel = 'three-dots-loading'  wrapperStyle wrapperClass /> </p>:
                    list.length === 0 ? <p className="empty-list">No results..</p> : list.map(item => renderBox(item))}
                 </div>
          </section>

       </StyledChatBox>
    </ChatContext.Provider>
  )
}

export default Chatbox