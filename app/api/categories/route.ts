import { connectToDb, generateErrorMessage, generateSuccessMessage } from "@/lib/helpers";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

// here we can attach categories to the blogs
export const GET = async () => {
    try {
        await connectToDb();
        const categories = await prisma.category.findMany();
        return generateSuccessMessage({categories}, 200);
    } catch (error) {
        return generateErrorMessage({error}, 500);
    } finally {
        await prisma.$disconnect();
    }
};

// we need data from front end so 
export const POST = async (req:Request) => {
    try {
        const {name} = await req.json();
        await connectToDb();
        const category = await prisma.category.create({data: {name}});
        return generateSuccessMessage({category}, 200);
    } catch (error) {
        return generateErrorMessage({error}, 500);
    } finally {
        await prisma.$disconnect();
    }
};