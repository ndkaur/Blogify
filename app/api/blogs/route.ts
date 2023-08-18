import { connectToDb, generateErrorMessage, generateSuccessMessage } from "@/lib/helpers";
import prisma from "@/prisma";
import { NextResponse } from "next/server";
import {v2,UploadApiResponse} from 'cloudinary';
import { resolve } from "path";
import { rejects } from "assert";


// to upload the blog 
// for uploading the file we need to convert it into the buffer 
// then store it to the cloudniary
async function uploadImage(file: Blob) {
    return new Promise<UploadApiResponse>(async (resolve, reject) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        v2.uploader.upload_stream({
        resource_type: "auto", 
        folder: "nextjs-full-stack-blog",
    },
        (err, result) => {
            if(err){
                console.log(err);
                return reject(err); 
            } else if (result){
                return resolve(result);
            }
        }
    )
    .end(buffer);
    });
}




// here we can attach blog to the category
export const GET = async () => {
    try {
        await connectToDb();
        const blogs = await prisma.category.findMany();
        return generateSuccessMessage({blogs}, 200);
    } catch (error) {
        return generateErrorMessage({error}, 500);
    } finally {
        await prisma.$disconnect();
    }
};


export const POST = async (req:Request) => {
    v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_secret: process.env.CLOUDINARY_API_KEY,
        api_key: process.env.CLOUDINARY_API_SECRET,
    });
    // storing the form data -> post data , image data
    try{
        const formData = await req.formData();
        const {title, description, location, userId, CategoryIds} = JSON.parse(formData.get("postData") as string);
        // validation check 
        if(!title || !description || !location || !userId || !CategoryIds){
            return generateErrorMessage({reason: "Invalid data"}, 422);
        }
        // when user uploads the image or sometimes they dont want to upload so null
        const file = formData.get("image") as Blob | null;
        let uploadedFile: UploadApiResponse | null = null;
        if(file) {
           uploadedFile =  await uploadImage(file);
        } else {
            uploadedFile = null;
        }
        // validation for the user and catergory id
        await connectToDb();
        const user = await prisma.user.findFirst({where: {id: userId}});
        const category = await prisma.user.findFirst({where: {id: CategoryIds}});

        // validation check
        if(!user || !category){
            return generateErrorMessage({reason: "Invalid user or category"}, 401);
        }

        const blog = await prisma.blog.create({
            data: {
                title,
                description,
                location,
                CategoryIds,
                userId,
                imageUrl: uploadedFile?.url ?? null,
            },
        });
        return generateSuccessMessage({blog},201);
    } catch (error){
        return generateErrorMessage({error}, 500);
    } finally {
        await prisma.$disconnect();
    }
};