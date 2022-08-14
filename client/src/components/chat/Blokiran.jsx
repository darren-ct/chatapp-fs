import { useContext } from "react";
import { AppContext } from "../../App"
import { ChatContext } from "../Chatbox";
import { useNavigate } from "react-router-dom";

import Button from "../basic/Button"

import {StyledChatBoxCards} from "../../core-ui/ChatBoxCards.style"

import api from "../../connection"

const Blokiran = ({item,getBlocked}) => {
    const{token} = useContext(AppContext);
    const {setNotif} = useContext(ChatContext);
    const navigate = useNavigate();

  // Functions
  const unblockFriend = async() => {
    try { 
        await api.put(`/unblock/${item.friend_id}`,{},{
         headers: {'Authorization':`Bearer ${token}`}
         }) 
        getBlocked();
        setNotif("Friend unblocked");
        setTimeout(()=>{
           setNotif(null);
        },5000)
        }

      catch(err) {
        navigate("/error")
      }
  }

  return (
    
        <div key={item.friend_id}>
            <StyledChatBoxCards>
                <img src={item.profile_image ? item.profile_image : ""}/>
                <div className="name">{item.display_name}</div>
               <Button content="Unblock" styling="secondary" onPress={unblockFriend}/>
           </StyledChatBoxCards>
      </div>
       )
  
}

export default Blokiran