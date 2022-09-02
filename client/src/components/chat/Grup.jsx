import { useContext } from "react";
import { MainContext } from "../../pages/Main";


import { StyledChatBoxCards } from "../../core-ui/ChatBoxCards.style"; 


const Grup = ({item}) => {
  const {setType,setClickedChat} = useContext(MainContext);

  const clickHandler = () => {
    setClickedChat(item.room_id);
    setType("group");
  };
  

  return (
  <div key={item.room_id} onClick={clickHandler}>
      <StyledChatBoxCards>
          <img src={item.image} />
          <div className="name">{item.group_name}</div>
      </StyledChatBoxCards>
  </div> )
}

export default Grup