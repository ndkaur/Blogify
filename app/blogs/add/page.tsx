// writing a blog using reach draft lib 
"use client"
import Image from "next/image";
import {Editor} from 'react-draft-wysiwyg';
import { useSession } from "next-auth/react";
import { ChangeEvent, useState , useRef} from "react";
import { categories } from "@/lib/utils";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import  { useForm } from 'react-hook-form';
import { EditorState , convertToRaw} from "draft-js";
import draftToHtml from "draftjs-to-html";
import {  toast } from  "react-hot-toast";

const BlogAdd = () => {
    const {data: session} = useSession(); 
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile , setImageFile] = useState<File | null>(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    const {register, handleSubmit , formState:{errors}} =  useForm();
    
    // to display the image user has chosen
    const handleImageChange = (e:ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        const file = e.target.files[0];
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file))
    }
    const handlePost  = async (data:any) => {
        const formData = new FormData;
        const postData = JSON.stringify({title:headingRef.current?.innerText, 
                description:converEditorDataToHTML(),
                location: data.location,
                userId: session?.user.id,
                CategoryIds: data.category,
            });
        formData.append('postData', postData);
        formData.append('image', data.image[0]);
        try { 
            toast.loading("Sharing your post with the World",{id:"postData"});
            
            await fetch("http:localhost:3000/api/blogs", {method: "POST", body: formData, cache:"no-store"})
            
            toast.success("Sent your post to the World",{id:"postData"});
        } catch(err){
            toast.error("Sending Failed!",{id:"postData"});
            return console.log(err);
        }
    };
    const converEditorDataToHTML = () => {
        return draftToHtml(convertToRaw(editorState.getCurrentContent()));
    }
    const  handleEditorStateChange = (e:any) => {
        setEditorState(e); 
    }
  return (
    <section className="w-full">  
        <div className="flex justify-between p-4 items-center">
            <div className="w-1/4">
                <span className="font-extrabold mx-3">Author: </span>
                <span className=" uppercase font-semibold">{session?.user?.name}</span>
            </div>
            <button onClick={handleSubmit(handlePost)} className="bg-violet-600 text-white px-6 focus:ring-violet-950 py-3 rounded-xl font-semibold shadow-xl hover:bg-violet-700">
                Publish
            </button>
        </div>
        {imageUrl && (
            <Image className="mx-auto my-20 rounded-lg shadow-xl border-[3px] border-slate-900" 
                src={imageUrl} alt="NewPost" width={800} height={400}/> )}
        {/* title for the blog heading */}
            <h1 
            ref={headingRef}
            contentEditable={true} 
            className="outline-none border-none font-serif mx-auto p-4 text-2xl text-center font-semibold w-full h-28 focus:border-none">
                Enter Title 
            </h1>
            {/*  enter text for blog */}
            {/* image */}
        <div className="w-full flex my-5 ">
            <input 
                type="file" 
                className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl "
                {...register("image", {required:true , onChange(event){
                    setImageUrl(URL.createObjectURL(event.target.files[0]))
                }} )}
                />
         </div>
        {/* location */}
         <div className="w-full flex my-5 ">
            <input 
                placeholder="Location Ex: Delhi,India"
                type ="text"
                className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl "
                {...register("location", {required:true})}
                />
         </div>
            {/* category */}
         <div className="w-full flex my-5 ">
            <select
                className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl "
                {...register("category",{required:true})}
                >
                    {categories.map((item)=> (
                        <option value={item.id}>{item.name}</option>
                    ))}
                </select>
         </div>

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

export default BlogAdd;