import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDb, verifyUserDetails } from "@/lib/helpers";
import prisma from "@/prisma";
import bcrypt from 'bcrypt';


export const authOptions:AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {type: "text"},
                password: {type: "password"},
            },
            async authorize(credentials){
                // it check ans vlaidates user by matching if details like email already exist
                if(!credentials || !credentials.email || !credentials.password){
                    return null;
                }
                try{
                    await connectToDb();
                    // check for email
                    const user = await prisma.user.findFirst({
                        where: {email: credentials.email},
                    });
                    if(!user){
                        return null;
                    }
                    // check for password
                    // but some users directly logged in by github and google so
                    if(!user.password){
                        return null;
                    }
                    // check if actual password matched
                    const isPasswordCorrect  = await bcrypt.compare(
                        credentials.password, user.password);
                    // if password didnt matched then 
                    if(!isPasswordCorrect){
                        return null;
                    }
                    // if everything is fully correct
                    return {...user, id: user.id};
                } catch(err){
                    return null;
                } finally{
                    await prisma.$disconnect();
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    // when user login the callbacks are fired 
    callbacks: {
        session({session, token}) {
            if(session.user && token.sub){
                session.user.id = token.sub;
            }
            return session;
        },
        async signIn({account,user,profile}) {
            if(account?.provider==="github" || account?.provider==="google"){
                const newUser = await verifyUserDetails(user);
                if(typeof newUser !==null){
                    //@ts-ignore
                    user.id = newUser?.id;
                    if(profile && profile.sub){
                        profile.sub = newUser?.id; 
                    }
                }
            }
            return true;
        },
        async redirect(params) {
            return "/";
        },
    },
    pages: {
        signIn:"/login",
    }
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};