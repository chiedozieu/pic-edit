import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";


const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export async function POST(request) {
    try {
        const { userId } = await auth()
        if(!userId) {
            return NextResponse.json({error: "Unauthorized"}, { status: 401 })
        }
    } catch (error) {
        
    }
}