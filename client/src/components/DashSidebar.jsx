import { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiUser,  } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';

export default function DashSidebar() {

  const location = useLocation();
  const [tab,setTab]=useState('');

  const dispatch=useDispatch();

  useEffect(()=>{
    const urlParams= new URLSearchParams(location.search);
    const tabFromUrl=urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search]);
  
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

    }
  }catch(error){
      console.log(error.message);
  }

}


  return (
  <div>
    <Sidebar  className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item icon={HiChartPie}>
            Dashboard
          </Sidebar.Item> 
          <Link to='/dashboard?tab=profile'>
          <Sidebar.Item active={tab==='profile'} icon={HiUser} label="User" labelColor="dark" as='div'>
            Profile
          </Sidebar.Item>
        </Link>
          <Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>  
  </div>
  )
}
