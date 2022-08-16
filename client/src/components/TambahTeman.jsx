import { useState,useEffect,useContext} from "react"
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { MainContext } from "../pages/Main";
import { ChatContext } from "./Chatbox";

import {TailSpin} from "react-loader-spinner"
import Button from "./basic/Button"

import { StyledUserCard } from "../core-ui/UserCard.style";

import searchIcon from "../assets/search.svg";
import success from "../assets/successful.svg";
import api from "../connection";


const TambahTeman = ({successMsg,setSuccessMsg,closeSidebar}) => {
    const navigate = useNavigate();
    const{token} = useContext(AppContext);
    const {filter} = useContext(MainContext)
    const{getFriends,setSidebarContent} = useContext(ChatContext);

    // States
    const[search,setSearch] = useState("")
    const[users,setUsers] = useState([])

    const[usersLoader,setUsersLoader] = useState(false) 
    const[uploadLoader,setUploadLoader] = useState(false);

    // useEffect
    useEffect(()=>{
        getUsers();
    },[search])

    // Functions
    const addFriend = async(id) => {
        try {

           setUploadLoader(true);

           await api.post("/friend", {friendId : id},
           { headers: {'Authorization':`Bearer ${token}`} }
           )
 
           setUploadLoader(false)
           setSuccessMsg("Friend Added");

           // Rerender
           if(filter === "teman"){
              getFriends();
           };
          
       } catch (err) {
        
          navigate("/error");
 
       }
    }

    const getUsers = async() => {
        try {
            setUsersLoader(true);

            const res = await api.get("/users",{
           headers: {'Authorization':`Bearer ${token}`}
           });

           setUsersLoader(false)
 
           const payload = res.data;
           const users = payload.data.users;
           const newUsers = users.filter(user => Number(user.sahabat_id) === Number(search));
 
           setUsers(newUsers);
 
       } catch (err) {
        
          navigate("/error")
 
       }
    };

    const renderUser = (user) => {
        
                return (
                    <StyledUserCard>
                           <div className="left-side">
                               <img src={user.profile_image}/>
                               <div className="left-text">
                                     <div className="left-title">{user.username}</div>
                                     <div className="left-buttons">
                                         { !user.connection ? <Button styling="secondary" content="JADIKAN TEMAN" onPress={()=>{addFriend(user.user_id)}}/> : <p>SUDAH TEMAN</p> }
                                     </div>
                               </div>
                           </div>
                    </StyledUserCard>
                )
    };

    const onChange = (e) => {
        return setSearch(e.target.value)
    };

    const resetSidebar = () => {
        closeSidebar();
        setSidebarContent(null);
        setSuccessMsg(null);
    }

    if(successMsg){
        return (
          <div className="dynamic">
                 <img src={success}/>
                 <span className="dynamic-message">{successMsg}</span>
                 <p className="dynamic-close" onClick={resetSidebar}>Close Sidebar</p>
          </div>
        )
      };
          
          // if loading
    if(uploadLoader){
        return (
          <div className="dynamic">
                <TailSpin height = "64" width = "64" radius = "9" color = '#6C5CE7' ariaLabel = 'three-dots-loading'  wrapperStyle wrapperClass />
          </div>
        )
      };

  return (
    <>
        <div className='search-control'>
             <input placeholder="Cari teman mengunakan sh-id " type="text" name="search" onChange={onChange} value={search}/>
             <img src={searchIcon} />
        </div>

        <div className="container">
              <div className="list">
                   {users.length !== 0 ? users.map(user => renderUser(user)) : 
                   <p className="empty-list">{usersLoader ?  <TailSpin height = "20" width = "20" radius = "9" color = '#6C5CE7' ariaLabel = 'three-dots-loading'  wrapperStyle wrapperClass /> : "No Results found..."}</p>}
              </div>
        </div>
    </>
  )
}

export default TambahTeman