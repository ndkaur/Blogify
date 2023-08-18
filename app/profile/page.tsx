// profile page 
// image 
// email  
//  count of blogs written by user 


import Image from "next/image";
import {AiOutlineMail} from 'react-icons/ai';
import BlogItem from "../components/BlogItem";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getUserById } from "@/lib/helpers";
import { UserItemType } from "@/lib/types";

const ProfilePage = async () => {
    const sessionData = await getServerSession(authOptions);
    const userData: UserItemType = await getUserById(sessionData?.user.id?? "");
  return (
   <section className="w-full h-full flex flex-col"> 
        {/* user image */}
        <div className="mx-auto">
            <Image src={sessionData?.user.image ?? "/usericon.png"} alt="UserProfile" width={200} height={200}className="w-20 p-3" />
        </div>
        {/* user name  */}
        <div className=" mx-auto my-2 w-auto">
            <h1 className="text-xl w-auto font-semibold bg-slate-100 px-4 py-2">
                {sessionData?.user.name}
            </h1>
        </div>
        {/* email */}
        <div className="mx-auto my-2 w-auto flex items-cente gap-3">
            <span><AiOutlineMail/></span> {""}
            <p className="text-xl font-semibold bg-slate-100">
                {sessionData?.user.email}
                </p>
        </div>
        {/* // count of user articles */}
        <hr className="p-2"/>
        <div className="w-full h-full felx flex-col ">
            <div className="w-2/4 mx-auto">
                <p className="text-center bg-slate-100 p-3 rounded-md font-semibold "> 
                Blog count {userData._count.blogs}
                </p>
            </div>
            {/* display all blogs by user */}
            <div className="flex flex-wrap justify-center p-4 my-3">
                {userData?.blogs.map((blog)=> <BlogItem{...blog} key={blog.id} isProfile={true}/>)}
                
            </div>
        </div>
   </section>
  );
};

export default ProfilePage;