import { connectToDb } from "@/lib/helpers";
import prisma from "@/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export const POST =  async (req: Request) => {
    // we need to get the name , password , email from teh users body 
    // to store it inside the db 
    const {name, email, password} = await req.json();
    if(!name || !email || !password){
        return NextResponse.json({message: "Invalid Data"}, {status:422})
    }
    // if correct credentials
    try {
        await connectToDb();
        // we can provide name email directly for new user 
        // but for password it needs to be encypted first for safety
        const hashedPassword = await bcrypt.hash(password, 10);
        const user  = await prisma.user.create({
            data:{email, name, password:hashedPassword},
        });
        return NextResponse.json(
            {
                message: "User Successfully Created",
                ...user,
            },
            {status: 201}
        );
    } catch (error:any){
        return NextResponse.json(
            {
                message: "Server Error",
                ...error,
            },
            {status: 500}
        );
    } finally {
        await prisma.$disconnect();
    }
};