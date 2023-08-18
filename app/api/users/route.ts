import { connectToDb } from "@/lib/helpers";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

// we want to get records of multiple users 
export const GET = async () => {
    try {
        await connectToDb();
        const users = await prisma.user.findMany();
        return NextResponse.json({message: "Success", users}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Error", error}, { status: 500});
    } finally {
        await prisma.$disconnect();
    }
};