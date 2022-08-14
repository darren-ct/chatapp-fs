import { useContext,useState } from "react"
import { AppContext } from "../../App"
import { MessageContext } from "../Messagebox";

import Dropdown from "./Dropdown";

import { StyledMessage } from "../../core-ui/Message.style";

import {dropDown} from "../../helpers/variables"
import sent from "../../assets/sent.svg";
import read from "../../assets/read.svg";
import triangle from "../../assets/message-triangle.svg";


const Message = ({message,type,setNotif}) => {

 const {user} = useContext(AppContext);
 const {getMessages} = useContext(MessageContext);

 //found out user
 const id = user.user_id;
 const isMe = Number(id) === Number(message.sender_id) ? true : false;
 const isBot = message.sender_id === 16 ? true : false;
 const isBot2 = message.sender_id === 17 ? true : false;

//  State
const[showDrop,isShowDrop] = useState(false);

// Bot or not?
  // time bot
  if(isBot){
    return ( <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:"12px",marginBottom:"12px"}}>
               <div style={{textAlign:"center",padding:"8px",borderRadius:"8px",color:"black",backgroundColor:"rgba(217,217,217,.5)"}}> {message.body} </div>
            </div> )
  };

  // other bot
  if(isBot2){
    return ( <div style={{display:"flex",alignItems:"center",justifyContent:"center" ,marginTop:"12px",marginBottom:"12px"}}>
                 <div style={{textAlign:"center",padding:"8px",borderRadius:"8px",color:"grey",backgroundColor:"rgba(217,217,217,.5)"}}> {message.body} </div>
            </div> )
  };

return ( <StyledMessage isMe={isMe}>

             {!isMe && <img src={message.profile_image ? message.profile_image : ""} className="message-profile"/>}
        
              <div className="message-part">

                 <div className="message-body" onClick={()=>{isShowDrop(prev => !prev)}}>
                    {type === "single" ? "" : isMe ? "" : message.display_name ? <span className="message-name">{message.display_name}</span> : 
                    message.username ? <span className="message-name">{message.username}</span> : ""}

                     {!isMe ? <img src={triangle} className="triangle"/>: <div className="triangle"></div>}
                     <span className="message-content">{message.body}</span>
                     <span className="message-time">{message.time.slice(0,5)}</span>

                     {showDrop && <Dropdown command={true} messageId={message.message_id} items={isMe ? dropDown : [dropDown[1],dropDown[2],dropDown[3]]} getMessages={getMessages} setNotif={setNotif}/>}
                  </div>

                  <div className="message-info">
                    { isMe && <img src={message.isRead === "true" ? read : sent} className="check-icon"/>}
                  </div>
              </div>
        </StyledMessage> )
  
}

export default Message