import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import { MainContext} from "../../pages/Main"

import { StyledDropdown } from "../../core-ui/Dropdown.style"
import api from "../../connection";

const Dropdown = ({items,toggleSidebar,setSidebarContent,
                  roomId,friendId,messageId,
                  getFriends,getMessages,setNotif}) => {

   const navigate = useNavigate();
   const{token,setUser} = useContext(AppContext);
   const{type,setClickedChat,clickedChat,getChats,getPins,setFilter,filter} = useContext(MainContext);

  // Function
  const clickHandler = (content,isSidebar,e) => {

    if(isSidebar){
        
        toggleSidebar();
        setSidebarContent(content)

    } else {
        e.stopPropagation();
        
        switch(content) {
          // message
          case "Unsend Message":
                unsendMessage();
            break;
          case "Delete for Me":
                deleteMessage();
            break;
          case "Forward Message":
                forwardMessage();
            break;

          case "Reply Message":
                replyMessage();
            break;
            // chats
          case "Keluar Grup":
                leaveGroup();
            break;

          case "Bersihkan Chat" :
                clearChat();
            break;

          case "Pin Chat":
               pinChat();
            break;

          case "Unpin Chat":
               unpinChat();
            break;

            // others
          case "Blokir Teman" :
                blockFriend();
          break; 

          case "Keluar Grup":
                leaveGroup();
          break;

          case "Keluar" :
            localStorage.removeItem("user");
            return setUser(null);
          break;

          default:
            return ""
            
        } 
      
    }

  };
       //messages
  const replyMessage = async() => {

  };
  
  const deleteMessage = async() => {
    try {
          
      await api.delete(`/message?messageId=${messageId}&isGroup=${type === "group" ? "true" : "false"}`,{
      headers: {'Authorization':`Bearer ${token}`}
      });

      setNotif("Message deleted");
      setTimeout(()=>{ setNotif(null)},3000);
      getMessages();
      
  
    } catch(err) {
        navigate("/error");
     }
  };

  const unsendMessage = async() => {
    try {
          
      await api.delete(`/unsend?messageId=${messageId}&isGroup=${type === "group" ? "true" : "false"}`,{
     headers: {'Authorization':`Bearer ${token}`}
      });

     getMessages();

     setNotif("Message unsent");
     setTimeout(()=>{ setNotif(null)},3000);
  
    } catch(err) {
      navigate("/error");
    }
  };

  const forwardMessage  = async() => {

  };
      // chats
  const clearChat = async() => {
        const isGroup = type === "group" ? "true" : "false";
    
        try {
          
           await api.delete(`/messages?isGroup=${isGroup}&roomId=${clickedChat}`,{
          headers: {'Authorization':`Bearer ${token}`}
           });

           getMessages();
           getChats();
           setFilter("pesan");

           setNotif("Messages cleared");
           setTimeout(()=>{ setNotif(null)},3000);
       
         } catch(err) {
           
           navigate("/error");
          }
  };

  const pinChat = async() => {
        const isGroup = friendId ? "false" : "true";

        try {
          await api.put(`/chat/pin/${roomId}`,{isGroup},{
          headers: {'Authorization':`Bearer ${token}`}
          });

          getChats();
          setNotif("Chat pinned");
          setTimeout(()=>{ setNotif(null)},3000);
      
        } catch(err) {
          navigate("/error");
         }
  };

  const unpinChat = async() => {
       const isGroup = friendId ? "false" : "true";

       try {
          
        await api.put(`/chat/unpin/${roomId}`,{ isGroup },{
        headers: {'Authorization':`Bearer ${token}`}
        });

        if(filter === "pesan"){
          getChats()
        } else {
          getPins()
        };

        setNotif("Chat unpinned");
        setTimeout(()=>{ setNotif(null)},3000);
    
      } catch(err) {
      
        navigate("/error");

       }

  };

      // friend and group
  const leaveGroup = async() => {
        try {
          
          await api.delete(`/group/${clickedChat}`,{
          headers: {'Authorization':`Bearer ${token}`}
          });

          setClickedChat(null);
          getChats();
          setFilter("pesan");

          setNotif("Group Left");
          setTimeout(()=>{ setNotif(null)},3000);
         
        } catch(err) {
        
          navigate("/error");

         }
  };
    
  const blockFriend = async() => {
        try {
          
          if(friendId){
              await api.put(`/block?friendId=${friendId}`, {} ,{
              headers: {'Authorization':`Bearer ${token}`}
              }); 

              getFriends()

          } else {

          await api.put(`/block?roomId=${clickedChat}`, {} ,{
          headers: {'Authorization':`Bearer ${token}`}
          }); 
        
          setFilter("pesan");
          getChats();
          setClickedChat(null);
        };

        setNotif("Friend blocked");
        setTimeout(()=>{ setNotif(null)},3000);

        } catch(err) {
          navigate("/error");
         }
  };

  return (
    <StyledDropdown>
        {items.map(item => <span onClick={(e)=>{clickHandler(item.content,item.isSidebar,e)}}>{item.content}</span>)}
    </StyledDropdown>
  )
}

export default Dropdown