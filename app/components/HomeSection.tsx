import { getAllBlogs } from "@/lib/helpers";
import Image from "next/image";
import BlogItem from "./BlogItem";
import { BlogItemType } from "@/lib/types";


const HomeSection = async () => {
    const blogs = await getAllBlogs(6);

  return (<section className="w-full my-4 ">
    <div className="w-full flex xs: flex-col md:flex-row justify-center items-center">
        {/* 2 paragraphs and image on side */}
        <div className="p-8 w-3/4 flex flex-col gap-3">
            <p className="tracking-wide lg:text-6xl md:text-3xl xs:text-2xl font-semibold md:w-2/4 xs:4/4 text-start text-gray-700">
                Let the knowledge pour in.
            </p>
            <p className="tracking my-2 md:text-2xl xs:text-md font-semibold md:w-3/4 xs:w-full text-start text-gray-900">
                share and spread the word.
            </p>
        </div>
        {/* image */}
        <div className="md:w-2/4 xs:w-3/4 md:mx-2 xs:my-2">
                <Image 
                    className="w-full rounded-2xl drop-shadow-2xl" 
                    alt= "CarouselImage"
                     width={300} 
                     height={200}
                    src={"https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81"}
                />
        </div>
    </div>

    {/* to show the recomendation of 6 cards */}
    <hr className="p-3 my-4"/>

    <div className="flex flex-col justify-center items-center">
        <div className="p-4">
            <h2 className="text-2xl font-semibold">Recent Articles</h2>
        </div>
        {/* cointainer of the list items */}
        <div className="flex w-full flex-wrap justify-center">
            {blogs.slice(0,6).map((blog: BlogItemType)=>(
                <BlogItem {...blog} key={blog.id}/> 
            ))}
        </div>
        {/* option for explore more  */}
        <div className="w-full p-4 text-center">
                <button className="mx-auto mt-auto border-[1px] p-3 rounded-lg hover:bg-violet-600 hover:text-violet-100 duration-500 font-semibold ">
                    Explore More Articles
                </button>
        </div>
        
        <hr className="p-3 my-4 w-full"/>

    </div>

  </section>
 );
};

export default HomeSection;