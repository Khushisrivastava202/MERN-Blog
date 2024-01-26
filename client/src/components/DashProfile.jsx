import {Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import {useSelector} from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../Firebase';
import {updateStart,updateSuccess,updateFailure} from '../redux/user/userSlice.js'
import { useDispatch} from 'react-redux';

export default function DashProfile() {
  
  const {currentUser}=useSelector((state)=>state.user);
  const [imageFile,setImageFile]=useState(null);
  const [imageFileUrl,setImageFileUrl]=useState(null);
  const [formData,setFormData]=useState({});
  const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
  const [updateUserError,setUpdateUserError]=useState(null)
  const filePickerRef=useRef();
  const dispatch=useDispatch();
  const handleImageChnage = (e)=>{
    const file=e.target.files[0];
    if(file){
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(()=>{
    if(imageFile){
      uploadImage();
    }
  },[imageFile])
  
  const uploadImage=async ()=>{
      const storage= getStorage(app);
      const fileName= new Date().getTime()+imageFile.name;
      const storageRef=ref(storage,fileName);
      const uploadTask=uploadBytesResumable(storageRef,imageFile);
      uploadTask.on(
        'state_changed',
        // (snapshot)=>{
        //   const progress= (snapshot.bytesTransferred / snapshot.totalBytes)*100;
        //   setImageFileUploadProgress(progress.toFixed(0));
        // },
        // (error)=>{
        //   setImgeFileUpoadError('Could Not upload Image(File must be less than 2MB')
        // },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
              setImageFileUrl(downloadURL);
              setFormData({...formData,profilePicture:downloadURL});
          });
        }
      );
    };
    const handleChange=(e)=>{
      setFormData({...formData,[e.target.id]:e.target.value})
      };

    const handleSubmit=async (e)=>{
      e.preventDefault();
      setUpdateUserError(null);
      setUpdateUserSuccess(null);
      if(Object.keys(formData).length===0){
        setUpdateUserError("No changes made")
        return;
      }
      try{
        dispatch(updateStart());
          const res=await fetch(`http://localhost:3000/update/${currentUser._id}`,{
          method:'PUT',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify(formData),
        });
        const data=await res.json();
        if(data.success===false){
          dispatch(updateFailure(data.message));
          setUpdateUserError(data.message);
        }if(res.ok){
          dispatch(updateSuccess(data));
          setUpdateUserSuccess("User's profile updated successfully")
        }
      }catch(error){
        dispatch(updateFailure(error.message));
        setUpdateUserError(error.message);

      }
    }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'  >
<h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>      
<form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
<input hidden type='file' accept='image/*' onChange={handleImageChnage} ref={filePickerRef}/>
<div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' 
onClick={()=>filePickerRef.current.click()}>
  <img src={imageFileUrl || currentUser.profilePicture} alt="user"  className='rounded-full w-full h-full border-2 object-cover border-[lightgray]'/>
</div>
{/* {imageFileUplaodError && <Alert color='failure'>{imageFileUplaodError}</Alert>} */}
<TextInput  type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
<TextInput  type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
<TextInput  type='password' id='password' placeholder='password' onChange={handleChange}/>
<Button outline gradientDuoTone="purpleToBlue" type='submit'>Update</Button>

</form>
<div className='text-red-500 text-center mt-5'>
  <span className='cursor-pointer'>Delete Account</span>
</div>
{updateUserSuccess && (
  <Alert color='success' className='mt-5'>
    {updateUserSuccess}
  </Alert>
)}
{updateUserError && (
  <Alert color='failure' className='mt-5'>
    {updateUserError}
  </Alert>
)}

    </div>
  );
}
