import { useContext,useState } from "react";
import { MainContext } from "../../pages/Main";
import { ChatContext } from "../Chatbox";


import Dropdown from "../advanced/Dropdown";

import { StyledChatBoxCards } from "../../core-ui/ChatBoxCards.style"

import { chatDropdown } from "../../helpers/variables";
import { getChatTime } from "../../helpers";

const Pin = ({item}) => {
  const {clickedChat,setClickedChat,setType} = useContext(MainContext);
  const {setNotif} = useContext(ChatContext)

  //States   
  const [showDrop,setShowDrop] = useState(false);
  const isMe = Number(clickedChat) === Number(item.room_id) ? true : false;

  // Function
  const clickHandler = (e) => {
     if(e.type === "click"){
          setClickedChat(item.room_id);
          setType(item.type);
         } else {
          e.preventDefault();
          setShowDrop(prev => !prev)
         };
  };

  return (             
    <div key={item.room_id} onClick={clickHandler} onContextMenu={clickHandler}>
         <StyledChatBoxCards isMe={isMe}>
            {showDrop && <Dropdown items={[chatDropdown[1]]} roomId={item.room_id} friendId={item.user_id} setNotif={setNotif}/> }
              <img src={item.profile_image ? item.profile_image : item.image ? item.image : ""} />

              {item.isOnline === "true" ? <div className="status-dot online"></div>  : 
              item.isOnline === "false" ? <div className="status-dot"></div> : ""}

              <div className="name">{item.display_name ? item.display_name : item.group_name ? item.group_name : ""}</div>
              <div className="time">{item.last_time && getChatTime(item.last_date,item.last_time)}</div>
              {item.notif  ? <div className="notif">{item.notif}</div> : ""}
         </StyledChatBoxCards>
    </div>)
}

export default Pin