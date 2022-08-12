import {useState,useContext, useEffect} from "react";
import { AppContext } from "../App";

import searchIcon from "../assets/search.svg";
import editIcon from "../assets/editimage.png";
import success from "../assets/successful.svg";

import Input from "./basic/Input";
import Button from "./basic/Button";
import {TailSpin} from "react-loader-spinner"
import { StyledUserCard } from "../core-ui/UserCard.style";

import api from "../connection";


import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name : yup.string().min(3).required("Name is required"),
  description : yup.string().min(3).required("Description is required")
});



const ProfilGrupForm = ({preset,setErrMsg,setSuccessMsg,role,getGroupProfile,id}) => {
  const {token,user} = useContext(AppContext);

  const {register, handleSubmit,formState:{errors}} = useForm({
    resolver: yupResolver(schema),
    defaultValues: preset
   });

  // States
  const[friends,setFriends] = useState([]);
  const[members,setMembers] = useState([]);

  const[friendsLoader,setFriendsLoader] = useState(false);
  const[membersLoader,setMembersLoader] = useState(false);

  const[search1,setSearch1] = useState("")
  const[search2,setSearch2] = useState("");
  

   const[image,setImage] = useState(preset.image);
   const[form,setForm] = useState({image:{value:null}});

   const[uploadLoader,setUploadLoader] = useState(false);

   

   const terpilih = friends.reduce((total,item)=>{

    if(item.isChecked === true){
       return total + 1
    } else {
       return total
    };
},0);

  // useEffect
  
  useEffect(()=>{
        getGroupMembers();
  },[search1])

  useEffect(()=>{
        getFriends();
  },[search2])

  // Functions
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

  const onChange2 = (e) => {
  setSearch2(e.target.value)
  };

  const onChange1 = (e) => {
    setSearch1(e.target.value)
  }

  const toggleCheckbox = (e) => {
    setFriends(prev => {

    const newArr = prev.map((item,index) => {
       if(item.id == e.target.name){
            return {...item,isChecked : !prev[index].isChecked}
       } else { return item}
    });

    return newArr;

  }
  );
};

  // CRUD


  const getFriends = async() => {

    try {
                
      setFriendsLoader(true);

       const res = await api.get(`/nonmembers/${id}`,{
          headers: {'Authorization':`Bearer ${token}`}
          });

       setFriendsLoader(false)

       const payload = res.data;
       const nonMembers = payload.data.nonMembers;
       let newNonMembers = nonMembers.filter(friend => {
           if(friend.display_name){
               return friend.display_name.toLowerCase().trim().startsWith(search2) === true
           } else {
              return friend.username.toLowerCase().trim().startsWith(search2) === true
           }
       });
       newNonMembers = newNonMembers.map(item => {
        return {...item,isChecked:false}
       })

       setFriends(newNonMembers);

      } catch(err) {
        console.log(err)
          const payload = err.response.data;
          const message = payload.message;

          setErrMsg(message)
      }
  };

  const getGroupMembers = async() => {
    try {
                
      setMembersLoader(true);

       const res = await api.get(`/members/${id}`,{
          headers: {'Authorization':`Bearer ${token}`}
          });

       setMembersLoader(false)

       const payload = res.data;
       const members = payload.data.members;
       let newMembers = members.filter(member => {
        if(member.display_name){
            return member.display_name.toLowerCase().trim().startsWith(search1) === true
        } else {
           return member.username.toLowerCase().trim().startsWith(search1) === true
        }
       });

       setMembers(newMembers);

      } catch(err) {
          console.log(err)
          const payload = err.response.data;
          const message = payload.message;

          setErrMsg(message)
      }
  };

  const onSubmit = async(data) => {
    setErrMsg("");

  
    const formData = new FormData();

    if(form.image.value){
      formData.append("image",form.image.value)
    };

    formData.append("name",data.name);
    formData.append("description",data.description);

    try {

      setUploadLoader(true);

        await api.put(`/group/${id}`, formData ,{
          headers: {'Authorization':`Bearer ${token}`}
          });

      setUploadLoader(false);
      setSuccessMsg("Group profile changed!");

    } catch(err) {
     console.log(err)
    }

    
  };

  const kickMember = async(friendId) => {

    try {
         await api.delete(`/member?room=${id}&id=${friendId}`,{
          headers: {'Authorization':`Bearer ${token}`}
         });

         setSuccessMsg("Member kicked");
         

    } catch(err) {
      console.log(err)
    }
  };

  const inviteFriend = async() => {
    const inviteIds = friends.filter(friend => friend.isChecked == true).map(friend => {return friend.id});

    if(inviteIds.length === 0){
      return;
    }

    try {

      await api.post(`/invitation`,{
        roomId : id,
        friendIds : inviteIds
      },{
       headers: {'Authorization':`Bearer ${token}`}
      });

      setSuccessMsg("Friend Invited");
      

 } catch(err) {
   console.log(err)
 }
  }

  // Render
  const renderButton = (memberRole,memberId) => {

    if(role === "Owner" && user.user_id != memberId){
      return <Button styling="primary" content="Kick" onPress={()=>{kickMember(memberId)}}/> 
    };

    if(role === "Admin" && memberRole !== "Owner" && user.user_id != memberId ){
      return <Button styling="primary" content="Kick" onPress={()=>{kickMember(memberId)}}/> 
    }
  };

  const renderMembers = (member) => {

       return (
        <div key={member.id}>
        <StyledUserCard>
              <div className="left-side">
                     <img src={member.profile_image} />
                     <div className="left-title">
                           {member.display_name ? member.display_name : member.username}
                     </div>
              </div>
              <div className="right-side">
                
                  {renderButton(member.roles,member.id)}
                  
              </div>
        </StyledUserCard>
        </div>
       )
  };

  const renderFriends = (friend) => {
    return (
      <div key={friend.id}>
         <StyledUserCard>
                   <div className="left-side" >
                       <img src={friend.profile_image}/>
                       <div className="left-text">
                             <div className="left-title">{friend.display_name ? friend.display_name : friend.username}</div>
                       </div>
                   </div>
                   <div className="right-side">
                          <label className="checkbox">
                                <input type='checkbox' name={friend.id} onChange={toggleCheckbox}/>
                          </label>
                   </div>
         </StyledUserCard>
      </div>
     )
  };

  // LOADER
  if(uploadLoader){
    return (
        <div className="dynamic">
             <TailSpin height = "64" width = "64" radius = "9" color = '#6C5CE7' ariaLabel = 'three-dots-loading'  wrapperStyle wrapperClass />
        </div>
         )
}

return (
<>

<form onSubmit={handleSubmit(onSubmit)}>

    <label className="upload-img" style={{cursor:"default",width:"100%"}}>
         <input type="file" onChange={onSelect} name="image"/>
         <img className="profile-image" src={!image ? "" : image} />
        <span>Foto Profil</span>  
    </label>

    <span className="input-ph">Nama Grup</span>
    <Input styling="outline" type="text" placeholder="Isi nama" name="name" errors={errors} register={register} />

    <span className="input-ph">Deskripsi Grup</span>
    <Input styling="outline" type="text" placeholder="Isi deskripsi" name="description" errors={errors} register={register} />

    <Button styling="primary" width="full" content="Edit Profil"/>
    
</form>


    <span className="input-ph" style={{marginTop:"70px"}}>Anggota</span>
  
    <div className='search-control'>
             <input placeholder="Cari anggota mengunakan nama " type="text" name="search" onChange={onChange1} value={search1}/>
             <img src={searchIcon} />
    </div>

    <div className="container">
            <div className="list">
                 {members.length !== 0 ? members.map(member => renderMembers(member)) : 
                    <p className="empty-list">{membersLoader ?  <TailSpin height = "20" width = "20" radius = "9" color = '#6C5CE7' ariaLabel = 'three-dots-loading'  wrapperStyle wrapperClass /> : "No Results found..."}</p>
                 }
            </div>
    </div>


  { role !== "Member" &&

    <>

    <span className="input-ph" style={{marginTop:"70px"}}>Undang anggota <p>{terpilih} terpilih</p></span>

    <div className='search-control'>
             <input placeholder="Cari teman mengunakan nama " type="text" name="search" onChange={onChange2} value={search2}/>
             <img src={searchIcon} />
    </div>

    <div className="container">
            <div className="list">
                 {friends.length !== 0 ? friends.map(friend => renderFriends(friend)) : 
                    <p className="empty-list">{friendsLoader ?  <TailSpin height = "20" width = "20" radius = "9" color = '#6C5CE7' ariaLabel = 'three-dots-loading'  wrapperStyle wrapperClass /> : "No Results found..."}</p>
                 }
            </div>
    </div>

    <Button styling="primary" onPress={inviteFriend} content="Undang Anggota"/>

    </>

  }

</>
)
}

export default ProfilGrupForm