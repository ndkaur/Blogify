"use client"
import React, { useState } from "react"
import { AiOutlineSearch } from "react-icons/ai";
import {useForm} from "react-hook-form";
import { BlogItemType } from "@/lib/types";
import toast from "react-hot-toast";
import BlogItem from "../components/BlogItem";

const Search = () => {
    const [blogs, setBlogs] = useState<BlogItemType[]>([]);
    const {handleSubmit, register} = useForm();
    const handleSearch = async ({search}: {search:string}) => {
       let str = search;
       if(search.includes(" ")){
        str = search.split(" ").join("%20");
       }
       toast.loading("Searching", {id:"SEARCH"});
       try{
            const res = await fetch(
                `http://localhost:3000/api/blogs/search?title=${str}`,
                {cache: "no-store"}
        );
        const data = await res.json();
        setBlogs(data.blogs);
        toast.success("Fetch successful", {id:"SEARCH"});
       } catch(err){
            toast.error("Fetching Failed", {id:"SEARCH"});
       }

       
    }
  return (
    <section className="w-full h-full">
        <h2 className="text-3xl text-center font-bold font-serif">Search from the blogs</h2>
    {/* search bas */}
    <div className="flex md:w-2/4 xs:w-3/4 mx-auto items-center justify-between bg-slate-100 my-4 px-6 py-4 rounded-xl text-gray-900 font-semibold">
        <input type="text"  
            className="bg-transparent border-none outline-none p-1 w-full"
            {...register("search", {required:true})}    
        />
        <AiOutlineSearch 
            //@ts-ignore
            OnClick = {handleSubmit(handleSearch)}
            size={40} 
            className="hover:bg-slate-300 p-2 rounded-full cursor-pointer "/>
    </div>
    <div className="felx flex-wrap">
        {blogs?.map((blog) => (
            <BlogItem {...blog} key={blog.id}/>
        ))}

    </div>
    </section> 
  )
}

export default Search;

function BlogItemType(arg0: never[]) {
    throw new Error("Function not implemented.");
}
