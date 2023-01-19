import React, { useEffect } from 'react'
import '../css/navBar.css'
import {  useUserAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'   

import { async } from '@firebase/util'
export default function Navbar() { 
  const { user, logOut } = useUserAuth();

  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      console.log(error)
    }
  }
 
  return ( 
    <nav className='navBar'> 
    <div className='links-cont'>  
     <a className='link' href="/"> الصفحة الرئسية </a> 
     <a className='link' href="/about-us"> نبذة عنا</a> 
     <a className='link' href="/sell"> بيع</a>
     <a className='link' href="/buy"> إشترى</a> 
    </div> 
    <span className='logoName'>
    {user?.phoneNumber ? (
        <a className='account-link' href={'/account'}> <img className='accountImg' src={'/userIcon.png'} height={'35px'} 
        width={'35px'} /> </a>
      ) : ( <a className='sign-in' href="/sign-in">sign up</a>
      )} 
      <span className='logo'>BSES</span> 
    </span>  
    
    </nav>
  
  )
} 
 