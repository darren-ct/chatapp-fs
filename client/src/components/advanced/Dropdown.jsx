import { StyledDropdown } from "../../core-ui/Dropdown.style"
import { useContext } from "react";
import { AppContext } from "../../App";
import api from "../../connection";

const Dropdown = ({items,toggleSidebar,setSidebarContent,roomId,friendId,messageId,type}) => {
   const{token,user,setUser} = useContext(AppContext);
  // States

  // Function
  const clickHandler = (content,isSidebar) => {

    if(isSidebar){
        
        toggleSidebar();
        setSidebarContent(content)

    } else {

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
          case "Unblokir Teman":
                unblockFriend();
            break;
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
            
        } 
      
    }

  };

  // Functions
       //messages
  const replyMessage = () => {

  };

  const deleteMessage = () => {

  };

  const unsendMessage = () => {

  };

  const forwardMessage  = () => {

  };

      // chats
  const clearChat = async() => {
        const isGroup = type === "group" ? "true" : "false";
    
        try {
          
           await api.delete(`/messages?isGroup=${isGroup}&roomId=${roomId}`,{
          headers: {'Authorization':`Bearer ${token}`}
           });
       
         } catch(err) {
          console.log(err)
          }
  };


  const pinChat = async() => {

  };

  const unpinChat = async() => {

  };

      // friend and group
    
  const leaveGroup = async() => {
        try {
          
          await api.delete(`/group/${roomId}`,{
          headers: {'Authorization':`Bearer ${token}`}
          });

         console.log("Success")
         
        } catch(err) {
         console.log(err)
         }
  };
    
  const blockFriend = async() => {
        try {
          
          await api.put(`/block/${friendId}`, {} ,{
          headers: {'Authorization':`Bearer ${token}`}
          });
    
          console.log("Success")
         
        } catch(err) {
         console.log(err)
         }
  };

  const unblockFriend = async() => {
    try {
          
      await api.put(`/unblock/${friendId}`, {} ,{
      headers: {'Authorization':`Bearer ${token}`}
      });

       console.log("Success")
     
    } catch(err) {
     console.log(err)
     }
  };
    
       
  return (
    <StyledDropdown>
        {items.map(item => <span onClick={()=>{clickHandler(item.content,item.isSidebar)}}>{item.content}</span>)}
    </StyledDropdown>
  )
}

export default Dropdown