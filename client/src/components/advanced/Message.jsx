import { AppContext } from "../../App"
import { useContext,useState } from "react"
import api from "../../connection";

import { StyledMessage } from "../../core-ui/Message.style";
import triangle from "../../assets/message-triangle.svg";

import Dropdown from "./Dropdown";
import {dropDown} from "../../helpers/variables"

import sent from "../../assets/sent.svg";
import read from "../../assets/read.svg";

const Message = ({message,type}) => {


 const {user,token} = useContext(AppContext);
 const id = user.user_id;
 const isMe = id == message.sender_id ? true : false;

//  State
const[showDrop,isShowDrop] = useState(false);



  return (
    <StyledMessage isMe={isMe}>

        {!isMe && <img src={message.profile_image ? message.profile_image : ""} className="message-profile"/>}
        
         <div className="message-part">
               <div className="message-body" onClick={()=>{isShowDrop(prev => !prev)}}>
                    {type === "single" ? "" : isMe ? "" : message.display_name ? <span className="message-name">{message.display_name}</span> : 
                    message.username ? <span className="message-name">{message.username}</span> : ""}

                     {!isMe ? <img src={triangle} className="triangle"/>: <div className="triangle"></div>}
                     <span className="message-content">{message.body}</span>
                     <span className="message-time">{message.time.slice(0,5)}</span>

                     {showDrop && <Dropdown command={true} id={message.message_id} items={dropDown}/>}
               </div>
               <div className="message-info">
                    { isMe && <img src={message.isRead === "true" ? read : sent} className="check-icon"/>}
               </div>
        </div>
    </StyledMessage>
  )
}

export default Message