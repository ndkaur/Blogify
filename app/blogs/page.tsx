// design the blogs page whose link present on navigation bar 
"use client";
import {  categories } from "@/lib/utils";
import { AiOutlineSearch } from "react-icons/ai";
import BlogItem from "../components/BlogItem";
import { BlogItemType } from "@/lib/types";
import { useEffect, useState } from "react";

const getBlogs = async () => {
    const res = await fetch("http://localhost:3000/api/blogs",{
        next: { revalidate:60},
    });
    const data = await res.json();
    
    return data.blogs;
}

const BlogsPage =  () => {
    const [blogs, setBlogs] = useState<BlogItemType[]>([]);
    const [filters, setFilters] = useState<{category:typeof categories}>();
    
    useEffect(() => {
        getBlogs().then((data) => {
            setBlogs(data);
        }) .catch((err)=> {

        });
    },[])
  return (
    <section className="w-full h-full">
        <div className="flex flex-col gap-3 my-10 p-8">
            <h4 className="text-3xl font-semibold">
                Explore Articles on Various Categories
            </h4>
            <p className="text-xl font-semibold">
                Articles for enhancing knowledge
            </p>
        </div>
        <nav className="bg-gray-100 border w-full flex my-4 sticky top-0 bg-center gap-4 h-20 md:p-8 xs:p-2 justify-center items-center">
            <div className="mr-auto flex md:w-1/4 xs:w-2/4 items-center gap-6">
                <p className="font-semibold text-2xl">Filter</p>
                <select name="category" id="select" className="md:px-5 xs:px-2 w-3/4 mx-2 py-3 rounded-lg">
                    {categories.map((item)=>(
                    <option className="rounded-md bg-gray-100" 
                    key={item.id} 
                    value={item.id}>
                        {item.name}
                    </option>
                    ))}
                </select>
            </div>
            {/* search bar  */}
            <div className="w-2/4 flex ml-auto md:gap-6 xs:gap-2 items-center">
                <p className="font-semibold text-2xl">Search</p>
                <input type="text" className="w-3/4 px-4 py-2 rounded-lg"/>
                <AiOutlineSearch classname="cursor-pointer"/>

            </div>
        </nav>

        <div className="flex gap-4 flex-wrap justify-center my-1">
            {blogs.map((blog:BlogItemType)=> (
                <BlogItem {...blog} key={blog.id}/>
            ))}
        </div>              
        
    </section>
  );
};

export default BlogsPage;