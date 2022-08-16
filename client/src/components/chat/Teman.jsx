import { useContext,useState } from "react";
import { MainContext } from "../../pages/Main"; 
import { ChatContext } from "../Chatbox";

import Dropdown from "../advanced/Dropdown";

import {StyledChatBoxCards} from "../../core-ui/ChatBoxCards.style"

import { friendsDropdown } from "../../helpers/variables";


const Teman = ({item,startChat,getFriends}) => {
    const {setType} = useContext(MainContext);
    const {setNotif} = useContext(ChatContext);

     const [showDrop,setShowDrop] = useState(false);

    // Function
    const clickHandler = (e) => {
      if(e.type === "click"){
        startChat(item.friend_id);
        setType("single")
      } else {
        e.preventDefault();
        setShowDrop(prev => !prev)
      }
     
    }


    return (
        <div key={item.friend_id} onClick={clickHandler} onContextMenu={clickHandler}>
          
          <StyledChatBoxCards>
             { showDrop && <Dropdown items={friendsDropdown} friendId={item.friend_id} getFriends={getFriends} setNotif={setNotif}/>}
              <img src={item.profile_image ? item.profile_image : ""}/>
              <div className="name">{item.display_name}</div>
          </StyledChatBoxCards>
        </div>
        )
}

export default Teman