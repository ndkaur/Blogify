import { connectToDb,
    generateErrorMessage,
    generateSuccessMessage } from "@/lib/helpers";
import prisma from "@/prisma";

// CRUD

// creating reading a blog 
export const GET = async (req:Request, 
    {params}:{params: {id: string}}) => {
    try {
        const id = params.id;
        await connectToDb();
        const blog = await prisma.blog.findFirst({
            where: { id },
        });
        return generateSuccessMessage({blog},200);
    } catch (error) {
        return generateErrorMessage({error},500);
    } finally {
        await prisma.$disconnect();
    }
};

// updating a blog
export const PUT = async (req:Request, 
    {params}:{params: {id: string}}) => {
    try {
        // functionality of upadating the title of the blog
        const  {title, description} =  await req.json();
        // validation
        if(!title || !description)
            return generateErrorMessage({reason: "Invalid Data"}, 422);

        const id = params.id;
        await connectToDb();
        const blog = await prisma.blog.update({
            where: { id },
            data: {
                title,
                description,
            }
        });
        return generateSuccessMessage({blog},200);
    } catch (error) {
        return generateErrorMessage({error},500);
    } finally {
        await prisma.$disconnect();
    }
};


// deleting a blog 
export const DELETE = async (req:Request, 
    {params}:{params: {id: string}}) => {
    try {
        const id = params.id;
        await connectToDb();
        const blog = await prisma.blog.delete({
            where: { id },
        });
        return generateSuccessMessage({blog},200);
    } catch (error) {
        return generateErrorMessage({error},500);
    } finally {
        await prisma.$disconnect();
    }
};