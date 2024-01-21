
import {Button, Label, TextInput } from "flowbite-react";
import { Link} from "react-router-dom";


export default function SignUp() {
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
      <form className="flex flex-col gap-4">
      <div>
        <Label value="Your username"/>
        <TextInput type="text" placeholder="Username" id="username"/>
      </div>
      <div>
        <Label value="Your Email"/>
        <TextInput type="text" placeholder="xyz@gmail.com" id="email"/>
      </div>
      <div>
        <Label value="Your Password"/>
        <TextInput type="text" placeholder="Password" id="Password"/>
      </div>
      <Button gradientDuoTone="purpleToBlue" size="md" type="submit">Sign Up</Button>

      </form>
      <div className=" flex gap-2 text-sm mt-5">
        <span>Have an account?</span>
        <Link to="/signin"  className="text-blue-500">Sign In</Link>
      </div>

      </div>
      </div>
    </div>
  )
}
