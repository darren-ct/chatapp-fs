import {useState,useContext, useEffect} from "react";
import { AppContext } from "../App";
import { ChatContext } from "./Chatbox";

import Input from "./basic/Input";
import Button from "./basic/Button";
import {TailSpin} from "react-loader-spinner"

import editIcon from "../assets/editimage.png";
import api from "../connection";

import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
    name : yup.string().min(3).required("Name is required"),
    number : yup.string().min(8),
    caption : yup.string().min(8),
    birth : yup.string().min(10)
  });


const ProfilSayaForm = ({preset,setErrMsg,setSuccessMsg,getMyProfile}) => {
       const{token} = useContext(AppContext);
       const{setProfile} = useContext(ChatContext)

       const {register, handleSubmit,formState:{errors},reset} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {...preset,birth:preset.birth.slice(0,10)}
       });


      const[image,setImage] = useState(preset.image);
      const[form,setForm] = useState({image:{value:null}});
      const[uploadLoader,setUploadLoader] = useState(false);

    // useEffect
      useEffect(()=>{
        if(form.image.value && typeof form.image.value !== "string"){
            const image = URL.createObjectURL(form.image.value);
            setImage(image)
         
            }
      },[form])

    //  Function
    const onSubmit = async(data) => {

        setErrMsg("");
        const formData = new FormData();

       try {

        if(form.image.value){
            formData.append("image",form.image.value);
        };

        formData.append("name",data.name);
        formData.append("number",data.number);
        formData.append("caption",data.caption);
        formData.append("birth",data.birth);

        setUploadLoader(true)

       const res =  await api.put("/myprofile", formData , {
            headers: {'Authorization':`Bearer ${token}`}
        })

        setProfile(res.data.data.image);

        setUploadLoader(false);
        setSuccessMsg("Profile changed!");

       } catch (err) {

        const payload = err.response.data;
        const message = payload.message;

        setErrMsg(message)
       }

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

    <label className="upload-img">
        <input type="file" onChange={onSelect} name="image"/>
        <img className="profile-image" src={!image ? "" : image} />
        <span>Foto Saya</span>
        <img src={editIcon} className="edit-icon" />
     </label>

    <form onSubmit={handleSubmit(onSubmit)}>

        <span className="fixed-label">Sahabataku_id : <p>{preset.id}</p></span>

        <span className="input-ph">Nama Tampilan Saya</span>
        <Input styling="outline" type="text" placeholder="Isi nama" name="name" errors={errors} register={register} />
       
        <span className="input-ph"> Caption saya</span>
        <Input styling="outline" type="text" placeholder="Isi caption" name="caption" errors={errors} register={register} />

        <span className="input-ph"> Nomor telepon</span>
        <Input styling="outline" type="text" placeholder="Isi nomor telepon" name="number" errors={errors} register={register} />

        <span className="input-ph"> Tanggal lahir</span>
        <Input styling="outline" type="text" placeholder="Format harus (YYYY/MM/DD)" name="birth" errors={errors} register={register} />

       
        <Button styling="primary" width="full" content="Edit Profil"/>
        
    </form>

    </>
  )
}

export default ProfilSayaForm