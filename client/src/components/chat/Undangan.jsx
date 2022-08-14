import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../App";
import { ChatContext } from "../Chatbox";

import Button from "../basic/Button";

import { StyledChatBoxCards } from "../../core-ui/ChatBoxCards.style";

import api from "../../connection";

const Undangan = ({item,getInvitations}) => {
  const navigate = useNavigate();
  const{token} = useContext(AppContext);
  const {setNotif} = useContext(ChatContext)

  // Functions
  const joinGroup = async() => {
    try {
       await api.put("/group/join",{roomId:item.room_id},{
       headers: {'Authorization':`Bearer ${token}`}
       })

       getInvitations();
       setNotif("Group joined");
       setTimeout(()=>{
           setNotif(null);
       },5000)
       
        } catch(err) {
           navigate("/error")
        }
  }

  return (              
    <div key={item.room_id}>
       <StyledChatBoxCards>
            <img src={item.image} />
            <div className="name">{item.group_name}</div>
            <Button content="Join Group" styling="primary" onPress={joinGroup}/>
     </StyledChatBoxCards>
   </div>)
}

export default Undangan