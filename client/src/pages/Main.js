import { useState,createContext,useContext } from "react";
import { AppContext } from "../App";


import Messagebox from "../components/Messagebox";
import Chatbox from "../components/Chatbox";

import { StyledMain } from "../core-ui/pages/Main.style";

import api from "../connection";

export const MainContext = createContext(null);

const Main = () => {
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
       console.log(err);

    }
  };

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
  
    console.log(err);

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
  
    console.log(err);

 }
  };
  
  return (
  <MainContext.Provider value={{type,setType,clickedChat,setClickedChat,getChats,getGroups,getPins,setFilter,filter}}>
      <StyledMain>
                <Chatbox 
                list={list} setList={setList} filter={filter} setFilter={setFilter}
                loadingList={loadingList} setLoadingList={setLoadingList} 
                search={search} setSearch={setSearch} getChats={getChats} getGroups={getGroups} getPins={getPins}/>
                <Messagebox />
     </StyledMain>
  </MainContext.Provider>

  )
}

export default Main