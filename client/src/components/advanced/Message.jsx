import { AppContext } from "../../App"
import { useContext } from "react"
import api from "../../connection";

import { StyledMessage } from "../../core-ui/Message.style";
import triangle from "../../assets/message-triangle.svg";

import like from "../../assets/like.svg";
import liked from "../../assets/red-heart.svg";

import sent from "../../assets/sent.svg";
import read from "../../assets/read.svg";

const Message = ({message,getMessages}) => {


 const {user,token} = useContext(AppContext);
 const id = user.user_id;
 const isMe = id == message.sender_id ? true : false;



  return (
    <StyledMessage isMe={isMe}>
        {!isMe && <img src={message.profile_image ? message.profile_image : ""} className="message-profile"/>}
        
         <div className="message-part">
               <div className="message-body" onDoubleClick={async()=>{
                 try {
                    await api.put(`/message/like/${message.message_id}`,{},{
                    headers: {'Authorization':`Bearer ${token}`}
                     });

                     getMessages()

                 } catch(err) {
                    console.log(err);
                 }
               }}>
                     {!isMe ? <img src={triangle} className="triangle"/>: <div className="triangle"></div>}
                     <span className="message-content">{message.body}</span>
                     <span className="message-time">{message.time.slice(0,5)}</span>
               </div>
               <div className="message-info">
                    { isMe && <img src={message.isRead === "true" ? read : sent} className="check-icon"/>}
                    <span className="like-msg">
                      Double click message to like it
                    </span>
                    <img src={message.isLiked === "true" ? liked : like} className="like-icon" style={{width:"12px"}}/>
               </div>
        </div>
    </StyledMessage>
  )
}

export default Message