
import {Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link,useNavigate} from "react-router-dom";


export default function SignUp() {
  const [formData,setFormData]=useState({});

  const [errorMessage,setErrorMessage]=useState(null);
  const [loading,setLoading]=useState(false);

  const navigate=useNavigate();

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()});
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.username || !formData.email || !formData.password) {
    setErrorMessage('Please fill out all fields');
    return;
  }
  try {
    setLoading(true);
    setErrorMessage(null);

    const res = await fetch("http://localhost:3000/signup", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
      } 
    setLoading(false);
    if(res.ok){
      navigate('/signin');
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    setErrorMessage('User with username or email already exist');
    setLoading(false);
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
 <h4 className="text-2xl font-bold mb-4 mt-4">Welcome to My Blog Project</h4>
        <p className="text-sm text-gray-600 mb-6">
          Explore engaging content and connect with the community. 
          <br/>Sign up to personalize your experience.
        </p>
        </div>
    
      {/* right side */}
      <div className="flex-1">
      <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
      <div>
        <Label value="Your username"/>
        <TextInput type="text" placeholder="Username" id="username" onChange={handleChange}/>
      </div>
      <div>
        <Label value="Your Email"/>
        <TextInput type="email" placeholder="xyz@gmail.com" id="email" onChange={handleChange}/>
      </div>
      <div>
        <Label value="Your Password"/>
        <TextInput type="password" placeholder="Password" id="password" onChange={handleChange}/>
      </div>
      <Button gradientDuoTone="purpleToBlue" size="md" type="submit" disabled={loading}>{loading? (
        <>
        <Spinner size='sm' /> 
        <span className='pl-3' >Loading.....</span>
        </>
        ) : "Sign Up"}</Button>

      </form>
      <div className=" flex gap-2 text-sm mt-5">
        <span>Have an account?</span>
        <Link to="/signin"  className="text-blue-500">Sign In</Link>
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
