import { useState } from "react";

import NotificationModal from "../components/modals/NotificationModal"
import ErrorModal from "../components/modals/ErrorModal"

import Messagebox from "../components/Messagebox";
import Chatbox from "../components/Chatbox";
import { StyledMain } from "../core-ui/pages/Main.style";

const Main = () => {
  const [isShown,setIsShown] = useState();
  const[clickedChat, setClickedChat] = useState(null);
  
  return (

    <StyledMain>
    <ErrorModal isShown={isShown} message={"hey bro"}/>
    <NotificationModal />

    
    <Chatbox setClickedChat={setClickedChat} clickedChat={clickedChat}/>
    <Messagebox clickedChat={clickedChat} />
    
    
    </StyledMain>
  )
}

export default Main