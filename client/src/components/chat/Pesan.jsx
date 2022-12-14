import { useContext,useState } from "react";
import { MainContext } from "../../pages/Main";
import { ChatContext } from "../Chatbox";

import Dropdown from "../advanced/Dropdown";

import {StyledChatBoxCards} from "../../core-ui/ChatBoxCards.style";

import { chatDropdown } from "../../helpers/variables";
import { getChatTime } from "../../helpers";
import pin from "../../assets/pin.svg";


const Pesan = ({item}) => {
  
  
  const {clickedChat,setClickedChat,setType} = useContext(MainContext);
  const {setNotif} = useContext(ChatContext);

  // State
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
                 { showDrop && <Dropdown items={item.isPinned === "false" ? [chatDropdown[0]] : [chatDropdown[1]]} 
                 roomId={item.room_id} friendId={item.user_id} setNotif={setNotif}/> }

                 {item.isPinned === "true" && <img src={pin} className="pin"/>}

                  <img src={item.profile_image ? item.profile_image : item.image ? item.image : ""} />

                 {item.isOnline === "true" ? <div className="status-dot online"></div> : item.isOnline === "false" ? <div className="status-dot"></div> : ""}
                  <div className="name">{item.display_name ? item.display_name : item.group_name}</div>

                  {item.last_date && <div className="time">{getChatTime(item.last_date,item.last_time)}</div> }

                 {item.notif !== 0 && <div className="notif">{item.notif}</div> }
            </StyledChatBoxCards>
    </div>
  )
}

export default Pesan