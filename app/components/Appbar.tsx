"use client";
import React from 'react'
import Logo from './Logo';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

// links for authenticated users
const authlinks = [
      {id:"1-1", name:"Blogs", url:"/blogs"},
      {id:"1-2", name:"Write", url:"/blogs/add"},
      {id:"1-3", name: "Profile", url: "/Profile"},
      {id:"1-4", name: "Search", url: "/search"},
];

// links for non authenticated users
const nonAuthLinks = [
      {id:"2-1", name:"Blogs", url:"/blogs"},
      {id:"2-2", name:"Login", url:"/login"},
      {id:"2-3", name: "Register", url: "/register"},
];

const Appbar = () => {
  // to find if user is auth or nonauth
  const {status} = useSession();
  return (
  <section className='sticky w-full bg-gray-100'>
    <nav className='flex items-center justify-between px-8 py-4 bg-transparent'>
        <div><Logo/></div>
        <div className='flex items-center gap-4 p-2'>
          {(status === "authenticated" ? authlinks : nonAuthLinks).map((item) => (
            <Link 
                key ={item.id}
                href={item.url} 
                className='text-gray-900 text-lg font-semibold hover:text-violet-600 duration-300 '>
                {item.name}
            </Link>
          )
          )}
          <button onClick={() => signOut()}>LOGOUT</button>
        </div>
    </nav>
  </section>
  );
};

export default Appbar;

 
