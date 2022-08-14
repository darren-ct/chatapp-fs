import { useState,useContext, useEffect} from "react"
import { AppContext } from "../App";
import { ChatContext } from "./Chatbox";

import ErrorModal from "./modals/ErrorModal";
import {TailSpin} from "react-loader-spinner"
import Input from "./basic/Input";
import Button from "./basic/Button";

import { StyledUserCard } from "../core-ui/UserCard.style";

import searchIcon from "../assets/search.svg";
import editIcon from "../assets/editimage.png";
import success from "../assets/successful.svg";
import api from "../connection";

import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
    name : yup.string().min(3).required("Name is required"),
    description : yup.string().min(8).required("Description is required"),
  });

const TambahGrup = ({closeSidebar,successMsg,setSuccessMsg}) => {
    const{token} = useContext(AppContext);
    const{getGroups,setFilter,setSidebarContent} = useContext(ChatContext);
    const {register, handleSubmit,formState:{errors},reset} = useForm({
        resolver: yupResolver(schema)
      });

    // States

            // Dynamic states
    const[errMsg,setErrMsg] = useState("");
    const[uploadLoader,setUploadLoader] = useState(false);
    const[friendsLoader,setFriendsLoader] = useState(false);

    const[image,setImage] = useState(null);
    const[form,setForm] = useState({image:{value:null}});
   
    const[friends,setFriends] = useState([]);
    const[search,setSearch] = useState("");

    const terpilih = friends.reduce((total,item)=>{

         if(item.isChecked === true){
            return total + 1
         } else {
            return total
         };
    },0);
    

    // useEffect
    useEffect(()=>{
         getFriends();
    },[search])


    // Function
    const getFriends = async() => {
        try {
            setFriendsLoader(true);

            const res = await api.get("/friends",{
           headers: {'Authorization':`Bearer ${token}`}
           });

           setFriendsLoader(false)
 
           const payload = res.data;
           const friends = payload.data.friends;
           let newFriends = friends.filter(friend => friend.display_name.toLowerCase().trim().startsWith(search) === true);
           newFriends = newFriends.map(item => {
            return {...item,isChecked:false}
           })

           setFriends(newFriends);
 
       } catch (err) {
        
          console.log(err);
 
       }
    }

    const renderFriend = (friend) => {
        return (
            <StyledUserCard>
                   <div className="left-side" key={friend.friend_id}>
                       <img src={friend.profile_image}/>
                       <div className="left-text">
                             <div className="left-title">{friend.display_name}</div>
                       </div>
                   </div>
                   <div className="right-side">
                          <label className="checkbox">
                                <input type='checkbox' name={friend.friend_id} onChange={toggleCheckbox}/>
                          </label>
                   </div>
            </StyledUserCard>
        )
    }

        //  Form
    const onChange = (e) => {
    setSearch(e.target.value)
    };

    const onSelect = (e) => {
        setForm(prev => {
            return {
              ...prev,
              image : {
                value : e.target.files[0]
            }
           }});

        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const toggleCheckbox = (e) => {
          setFriends(prev => {

            const newArr = prev.map((item,index) => {
               if(item.friend_id == e.target.name){
                    return {...item,isChecked : !prev[index].isChecked}
               } else { return item}
            });

            return newArr;

          }
          );
    };

    const onSubmit = async(data) => {
        setErrMsg("")

        if(!form.image.value){
              return setErrMsg("Image can't be empty")
        };

       const friendIDS = friends.filter(friend => friend.isChecked === true).map(friend => {
        return friend.friend_id
       })
       const formData = new FormData();



       formData.append("image",form.image.value);
       formData.append("name",data.name);
       formData.append("description",data.description);

       if(friendIDS.length !== 0){
       formData.append("friends",friendIDS)
       };

       try {

        setUploadLoader(true);

        await api.post("/group", formData ,{
          headers: {'Authorization':`Bearer ${token}`}
          });

       
        setUploadLoader(false);
        setSuccessMsg("Group created!");
        getGroups();
        setFilter("grup")


       } catch (err) {

        
        const payload = err.response.data;
        const message = payload.message;

        setErrMsg(message)
  
       }

    };


      //  Pre-Submit
    const resetSidebar = () => {
      setSidebarContent(null);
      setSuccessMsg(null);
      closeSidebar();
    }

    // Dynamic states
        //  if success
    if(successMsg){
      return (
        <div className="dynamic">
               <img src={success}/>
               <span className="dynamic-message">{successMsg}</span>
               <p className="dynamic-close" onClick={()=>{resetSidebar()}}>Close Sidebar</p>
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
    }

   

  return (
    <>
        
        {errMsg && <ErrorModal isShown={true} message={errMsg} />}


        <label className="upload-img">
          <input type="file" onChange={onSelect} name="image"/>
          <img className="profile-image" src={!image ? "" : image} />
          <span>Foto Grup</span>
          <img src={editIcon} className="edit-icon" />
        </label>

     <form onSubmit={handleSubmit(onSubmit)}>
           <span className="input-ph">Nama Grup</span>
           <Input styling="outline" type="text" placeholder="Enter name" name="name" errors={errors} register={register} />
       
            <span className="input-ph">Deskripsi Grup</span>
            <Input styling="outline" type="text" placeholder="Enter description" name="description" errors={errors} register={register} />
       
            <span className="input-ph">Undang anggota <p>{terpilih} terpilih</p></span>

             <div className='search-control'>
                 <input placeholder="Cari teman mengunakan name " type="text" name="search" onChange={onChange} value={search}/>
                 <img src={searchIcon} />
             </div>

            <div className="container">
                 <div className="list">
                     {friends.length !== 0 ? friends.map(friend => renderFriend(friend)) : 
                       <p className="empty-list">{friendsLoader ?  <TailSpin height = "20" width = "20" radius = "9" color = '#6C5CE7' ariaLabel = 'three-dots-loading'  wrapperStyle wrapperClass /> : "No Results found..."}</p>
                      }
                 </div>
            </div>

          <Button styling="primary" width="full" content="Tambahkan Grup"/>
    </form>
        

    </>
  )
}

export default TambahGrup