import { useContext } from "react";
import { MainContext } from "../../pages/Main";
import { AppContext } from "../../App";

import { StyledChatBoxCards } from "../../core-ui/ChatBoxCards.style"; 


const Grup = ({item}) => {

  const {socket} = useContext(AppContext)
  const {setType,setClickedChat} = useContext(MainContext);

  const clickHandler = () => {
    setClickedChat(item.room_id);
    setType("group");
    socket.emit("join_chat",{room_id:item.room_id});
  }
  

  return (
  <div key={item.room_id} onClick={clickHandler}>
      <StyledChatBoxCards>
          <img src={item.image} />
          <div className="name">{item.group_name}</div>
      </StyledChatBoxCards>
  </div> )
}

export default Grup