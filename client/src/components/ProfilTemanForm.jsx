import {useState,useContext} from "react";
import { AppContext } from "../App";
import { MainContext } from "../pages/Main";
import { MessageContext } from "./Messagebox";


import Input from "./basic/Input";
import Button from "./basic/Button";
import {TailSpin} from "react-loader-spinner"

import api from "../connection";

import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
    name : yup.string().min(3).required("Name is required")
  });


const ProfilTemanForm = ({preset,setErrMsg,setSuccessMsg,id}) => {
       const{token} = useContext(AppContext);
       const{getChats,getPins,getFriends,filter} = useContext(MainContext);
       const{setProfile} = useContext(MessageContext)

       const {register, handleSubmit,formState:{errors}} = useForm({
        resolver: yupResolver(schema),
        defaultValues: preset
       });

      const[uploadLoader,setUploadLoader] = useState(false);

    //  Function
    const onSubmit = async(data) => {
        setErrMsg("");

       try {
        setUploadLoader(true)
        const res = await api.put(`/profile/${id}`, {name:data.name} , {
            headers: {'Authorization':`Bearer ${token}`}
        })
      
        setProfile(res.data.data.profile);
        setUploadLoader(false);
      
        setSuccessMsg("Profile changed!");

        //Render
        if(filter === "pesan"){
          getChats()
        } else if(filter === "pin") {
          getPins()
        } else if (filter === "teman") {
          getFriends()
        };
        
       } catch (err) {
        
        const payload = err.response.data;
        const message = payload.message;
        setErrMsg(message)
       }
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
        <img className="profile-image" src={!preset.image ? "" : preset.image} />
        <span>Foto Profil</span>  
     </label>

        
        <span className="fixed-label">Sahabataku_id : <p>{preset.id}</p></span>

        <span className="input-ph">Nama Tampilan Saya</span>
        <Input styling="outline" type="text" placeholder="Isi nama" name="name" errors={errors} register={register} />
       
        <span className="fixed-label">Nomor Telepon : <p>{preset.number}</p></span>
        <span className="fixed-label">Caption : <p>{preset.caption}</p></span>
        <span className="fixed-label">Tanggal lahir : <p>{preset.birth.slice(0,10)}</p></span>

       
        <Button styling="primary" width="full" content="Edit Profil"/>
        
    </form>

    </>
  )
}

export default ProfilTemanForm