"use client"

import { EditorState , convertToRaw, convertFromHTML} from "draft-js";
import draftToHtml from "draftjs-to-html";
import {ContentState, Editor} from 'react-draft-wysiwyg';
import { useSession } from "next-auth/react";
import { useState , useRef, useEffect} from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {  toast } from  "react-hot-toast";
import React from 'react'
import { BlogItemType } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";



const getBlogById = async(id:string) => {
    const res = await fetch(`http://localhost:3000/api/blog/${id}` , 
    {cache:"no-store",});
    const data = await res.json();
    return data.blog;
};

const updateBlog = async(id:string, postData:any) => {
    const res = await fetch(`http://localhost:3000/api/blog/${id}` , 
    {   cache:"no-store",
        method:"PUT",
        body:JSON.stringify({...postData}),
    });
    const data = await res.json();
    return data.blog;
}; 


const EditBlog = ({params}: {params: {id: string}}) => {
    
    const {data: session} = useSession(); 
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [isLoading , setIsLoading] = useState(false); 
    
    const headingRef = useRef<HTMLHeadingElement | null>(null);

    useEffect(() => {
        setIsLoading(true);
        toast.loading("updating block details", { id: "loading"});
        getBlogById(params.id)
        .then((data: BlogItemType) => {
            const contentBlocks = convertFromHTML(data.description);
            const contentState = ContentState.createFromBlockArray(contentBlocks.contentBlocks);
            const initialState = EditorState.createWithContent(contentState);
            setEditorState(initialState);
            if(headingRef && headingRef.current) headingRef.current.innerText= data.title;
            setIsLoading(false);
            toast.success("Blog Details added", {id:"loading"});
        }).catch((err) => {
            console.log(err);
            toast.error("error in updating" , {id: "loading"});
        }).finally (
            ()=> {setIsLoading(false)
            });
    },[]);

    const converEditorDataToHTML = () => {
        return draftToHtml(convertToRaw(editorState.getCurrentContent()));
    }
    const  handleEditorStateChange = (e:any) => {
        setEditorState(e); 
    }

    const handlePost  = async (data:any) => {
        const postData = {title:headingRef.current?.innerText,
            description: converEditorDataToHTML(),
        };
        try { 
            toast.loading("Updating your Blog post",{id:"postUpdate"});
            await updateBlog(params.id, postData);
            toast.success("Updated successfully",{id:"postUpdate"});
        } catch(err){
            toast.error("Sending Failed!",{id:"postUpdate"});
            return console.log(err);
        }
    };
    
  return (
    <section className="w-full">  
        <div className="flex justify-between p-4 items-center">
            <div className="w-1/4">
                <span className="font-extrabold mx-3">Author: </span>
                <span className=" uppercase font-semibold">{session?.user?.name}</span>
            </div>
            <button onClick={(handlePost)} className="bg-violet-600 text-white px-6 focus:ring-violet-950 py-3 rounded-xl font-semibold shadow-xl hover:bg-violet-700">
                Publish
            </button>
        </div>
        {isLoading && (
            <p>
                <Skeleton className="w-[300px] h-[50px] rounded-lg  mx-auto"/>
            </p>
        )}
        {/* title for the blog heading */}
        {!isLoading && (
            <h1 
            ref={headingRef}
            contentEditable={true} 
            className="outline-none border-none font-serif mx-auto p-4 text-2xl text-center font-semibold w-full h-28 focus:border-none">
            </h1>
        )}
        {/* text writing editor */}
        <Editor 
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        editorStyle={{
            minHeight:"500vh", 
            height:"auto", 
            border: "1px solid #000", 
            padding:10,
        }} />
    </section>
  );
};


export default EditBlog;

// function convertFromHTML(arg0: any) {
//     throw new Error("Function not implemented.");
// }
