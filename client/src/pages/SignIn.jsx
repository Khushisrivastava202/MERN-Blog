
import {Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link,useNavigate} from "react-router-dom";
import { useDispatch ,useSelector} from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice"
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData,setFormData]=useState({});
  const{loading, error:errorMessage}=useSelector(state => state.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()});
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.email || !formData.password) {
    return dispatch(signInFailure('Please fill all the fields'));
  }
  try {
    dispatch(signInStart());
    const res = await fetch("http://localhost:3000/signin", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } 
    if(res.ok){
      dispatch(signInSuccess(data));
      navigate('/');
    }
  } catch (error) {
    dispatch(signInFailure(error.message));

  }
};

    return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-10">
      {/* left side */}
      <div className="flex-1 ">
      <Link to="/">
      <Button outline gradientDuoTone="purpleToBlue" size="xl">TechTraverse</Button>
</Link>
 <h4 className="text-2xl font-bold mb-4 mt-4">Welcome Back to My Blog Project</h4>
        <p className="text-sm text-gray-600 mb-6">
          Explore engaging content and connect with the community. 
          <br/>Sign In to regain your personalized experience.
        </p>
        </div>
    
      {/* right side */}
      <div className="flex-1">
      <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
      
      <div>
        <Label value="Your Email"/>
        <TextInput type="email" placeholder="xyz@gmail.com" id="email" onChange={handleChange}/>
      </div>
      <div>
        <Label value="Your Password"/>
        <TextInput type="password" placeholder="**********" id="password" onChange={handleChange}/>
      </div>
      <Button gradientDuoTone="purpleToBlue" size="md" type="submit" disabled={loading}>{loading? (
        <>
        <Spinner size='sm' /> 
        <span className='pl-3' >Loading.....</span>
        </>
        ) : "Sign In"}</Button>


        <OAuth/>

      </form>
      <div className=" flex gap-2 text-sm mt-5">
        <span>Don't have an account?</span>
        <Link to="/signup"  className="text-blue-500">Sign Up</Link>
      </div>
  { errorMessage &&(
    <Alert className="mt-5"  color='failure'>
      {errorMessage}
    </Alert>
   )}
      </div>
      </div>
    </div>
  )
}
