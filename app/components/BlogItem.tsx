"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogItemType } from "@/lib/types";
import Image  from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

type Props = BlogItemType;

// function to limit the words on the blog 
function getTextFromHtml(html:string){
    const elm = document.createElement("span");
    elm.innerHTML = html;
    return elm.innerText.slice(0,300);
}

const deleteBlog = async(id:string, ) => {
    const res = await fetch(`http://localhost:3000/api/blog/${id}` , 
    {   cache:"no-store",
        method:"DELETE",
       
    });
};

const BlogItem = (props: Props) => {
    const handledelete =  async () => {
        try{
            toast.loading("Deleting Blog", {id: "delete"});
            await deleteBlog(props.id);
            toast.success(" Blog Deleted", {id: "delete"});
        } catch (err){
            toast.error(" Error Deleting Blog", {id: "delete"});
            console.log(err);     
        }
       
    }
  return (
        <Card className="hover:boder-slate-950 duration-500 flex flex-col w-[400px] h-[550px] mx-4 my-2 rounded-lg">
            <CardHeader>
                <Image width={400} height={100} 
                    className="h-48 rounded-sm" 
                    alt={props.title} 
                    src={props.imageUrl ?? "https://images.unsplash.com/photo-1659560893493-9b565e1a26a5"}/>
            </CardHeader>
            
            <CardTitle className="p-3">{props.title}</CardTitle>
            
            <CardContent className="w-full text-slate-900">
                <p  className="tracking-wide w-full px-2 py-1 text-left" >
                    {getTextFromHtml(props.description)}
                </p>
            </CardContent>

            <CardFooter className="w-full h-full p-3 flex justify-between items-center">
                <Link  href={`/blogd/view/${props.id}`} 
                    className=" mt-auto border-[1px] p-3 rounded-lg hover:bg-violet-600 hover:text-violet-100 duration-500 font-semibold ">
                        View More 
                </Link>
                {props.isProfile && (
                
                    <Link  href={`/blogd/edit/${props.id}`} 
                    className=" mt-auto border-[1px] p-3 rounded-lg hover:bg-violet-600 hover:text-violet-100 duration-500 font-semibold ">
                        Edit Blog 
                    </Link>
                )} 

                {props.isProfile && (
                    <button onClick={handledelete} className=" mt-auto border-[1px] p-3 rounded-lg hover:bg-violet-600 hover:text-violet-100 duration-500 font-semibold ">
                        Delete Blog
                    </button>
                )}      
                
                
            </CardFooter>
        </Card>
  );
};

export default BlogItem;