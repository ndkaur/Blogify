// searching a blog in the category 
import { connectToDb, generateErrorMessage, generateSuccessMessage } from "@/lib/helpers";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

// here we can attach categories to the blogs
export const GET = async (req:Request) => {
    // we can convert get the url and convert it into query params to get the data 
    const searchTitile = new URL(req.url).searchParams.get("title");
    try {
        await connectToDb();
        const blogs = await prisma.blog.findMany({
            where: { title: { contains: searchTitile ?? ""} },
        });
        return generateSuccessMessage({blogs}, 200);
    } catch (error) {
        return generateErrorMessage({error}, 500);
    } finally {
        await prisma.$disconnect();
    }
};