import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link ,useLocation, useNavigate} from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import {FaMoon,FaSun } from "react-icons/fa"
import {useSelector,useDispatch} from 'react-redux'
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";


export default function Header() {

  const path=useLocation().pathname;
  const navigate=useNavigate();

  const dispatch=useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const handleSignOut=async()=>{
    try{
      const res=await fetch('http://localhost:3000/signout',{
        method:'POST',
      });
      const data=await res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        dispatch(signoutSuccess());  
        navigate('/signin');
      }
    }catch(error){
        console.log(error.message);
    }
  }

  return (
    <Navbar className="border-b-2">
      <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <Button outline gradientDuoTone="purpleToBlue">TechTraverse</Button>
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
         className=" hidden lg:inline"/>
      </form>
      <button className="w-10 h-12 lg:hidden text-gray-500 rounded-full">
  <AiOutlineSearch />
</button>
<div className="flex gap-2 md:order-2">
<Button className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'dark' ? <FaMoon />  : <FaSun />}
        </Button>
   {currentUser? (
    <Dropdown arrowIcon={false} inline label={
      <Avatar alt='user' img={currentUser.profilePicture} rounded />
    }>
    <Dropdown.Header >
    <span className="block text-sm font-medium truncate">@{currentUser.username}</span> 
    <span className="block text-sm">{currentUser.email}</span> 
    </Dropdown.Header>
    <Link to={'/dashboard?tab=profile'}>
    <Dropdown.Item>Profile</Dropdown.Item>
    </Link>
    <Dropdown.Divider/>
    <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
    </Dropdown>
   ) :
    (
      <Link to="/signin">
          <Button gradientDuoTone="purpleToBlue" size="sm">Sign In</Button>
      </Link>
    )}
  <Navbar.Toggle/>
</div>
  <Navbar.Collapse>
  <Navbar.Link active ={path==="/"} as={"div"}>
    <Link to="/">Home</Link>
  </Navbar.Link>
  <Navbar.Link active ={path==="/about"} as={"div"}>
    <Link to="/about">About</Link>
  </Navbar.Link>
  <Navbar.Link active ={path==="/project"} as={"div"}>
    <Link to="/project">Projects</Link>
  </Navbar.Link>
  </Navbar.Collapse>
    </Navbar>
  );
}
