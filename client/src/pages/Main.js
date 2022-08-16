import { useState,createContext,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

import Messagebox from "../components/Messagebox";
import Chatbox from "../components/Chatbox";

import { StyledMain } from "../core-ui/pages/Main.style";

import api from "../connection";

export const MainContext = createContext(null);

const Main = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const[clickedChat, setClickedChat] = useState(null); //room id
  const[type,setType] = useState(null) // group or single

  const[list,setList] = useState([]);
  const [loadingList,setLoadingList] = useState(false);

  // Filter and Search
  const [filter,setFilter] = useState("pesan")
  const [search,setSearch] = useState("");

  // FUNCTION
  const getChats = async() => {
    try { 
      setLoadingList(true);

      const res = await api.get("/chats",{
      headers: {'Authorization':`Bearer ${token}`}
      });

      setLoadingList(false);

      const payload = res.data;
      const chats = payload.data.chats;
      let newChats = chats.filter(chat => chat.display_name.toLowerCase().trim().startsWith(search) === true);

      setList(newChats)
    } catch (err) {
      console.log(err)
       navigate("/error")
    }
  };

  const getGroupChats = async() => {

    try { 
      setLoadingList(true);

      const res = await api.get("/chats?isGroup=true",{
      headers: {'Authorization':`Bearer ${token}`}
      });

      setLoadingList(false);

      const payload = res.data;
      const chats = payload.data.groupChats;
      let newChats = chats.filter(chat => chat.group_name.toLowerCase().trim().startsWith(search) === true);

      setList(newChats)
    } catch (err) {
      console.log(err)
       navigate("/error")
      
    };


  }

  const getGroups = async() => {
    try {
      setLoadingList(true);

      const res = await api.get("/groups",{
     headers: {'Authorization':`Bearer ${token}`}
     });

     setLoadingList(false);

     const payload = res.data;
     const groups = payload.data.groups;
     let newGroups = groups.filter(group => group.group_name.toLowerCase().trim().startsWith(search) === true);

     setList(newGroups)


 } catch (err) {
  
     console.log(err)
     navigate("/error")
 }
  };

  const getPins = async() => {
    try {

      setLoadingList(true);

      const res = await api.get("/chats?isPinned=true",{
     headers: {'Authorization':`Bearer ${token}`}
     });


     setLoadingList(false);

     const payload = res.data;
     const chats = payload.data.chats;

     let newChats = chats.filter(chat => chat.display_name.toLowerCase().trim().startsWith(search) === true);

     setList(newChats)

    } catch (err) {
  
      console.log(err)
     navigate("/error")

     }
  };

  const getGroupPins = async() => {
    try {

      setLoadingList(true);

      const res = await api.get("/chats?isPinned=true&isGroup=true",{
     headers: {'Authorization':`Bearer ${token}`}
     });


     setLoadingList(false);

     const payload = res.data;
     const chats = payload.data.groupChats;

     let newChats = chats.filter(chat => chat.group_name.toLowerCase().trim().startsWith(search) === true);

     setList(newChats)


 } catch (err) {
  
     console.log(err)
     navigate("/error")

 }
  };

  const getBlocked = async() => {
    try {
      setLoadingList(true);

      const res = await api.get("/friends?isBlock=true",{
     headers: {'Authorization':`Bearer ${token}`}
     });

     setLoadingList(false)

     const payload = res.data;
     const friends = payload.data.friends;
     let newFriends = friends.filter(friend => friend.display_name.toLowerCase().trim().startsWith(search) === true);
     

     setList(newFriends);

 } catch (err) {
  
    console.log(err)
    navigate("/error")

 }
  };
  
  const getFriends = async() => {

    try {
      setLoadingList(true);

      const res = await api.get("/friends",{
     headers: {'Authorization':`Bearer ${token}`}
     });

     setLoadingList(false)

     const payload = res.data;
     const friends = payload.data.friends;
     let newFriends = friends.filter(friend => friend.display_name.toLowerCase().trim().startsWith(search) === true);
     

     setList(newFriends);

 } catch (err) {
  
     console.log(err)
     navigate("/error")

 }
  };
  
  return (
  <MainContext.Provider value={{type,setType,clickedChat,setClickedChat,setFilter,filter,getChats,getGroupChats,getGroups,getPins,getGroupPins,getBlocked,getFriends}}>
      <StyledMain>
                <Chatbox list={list} setList={setList} loadingList={loadingList} setLoadingList={setLoadingList} search={search} setSearch={setSearch} />
                <Messagebox />
     </StyledMain>
  </MainContext.Provider>

  )
}

export default Main