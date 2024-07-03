import { connectDB } from '@/app/config/connectDB';
import User from '@/app/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const userId = uuidv4();
        reqBody.userId = userId

        const { firstname, lastname, username, email, password, confirmpassword, category } = reqBody;
        
        console.log("userId", userId);
        console.log(reqBody);
        console.log(email);
        //check if user already exists
        const user = await User.findOne({ email });
        console.log("user", user);
        if (user) {
            console.log("user exists");
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        } else {
            const salt = await bcryptjs.genSalt(10);
            const newPassword = await bcryptjs.hash(password, salt);
            reqBody.password = newPassword;
            console.log("reqbody.password...", newPassword);
            console.log("reqBody---",reqBody);
            const newUser = await User.create(reqBody);

            const response = NextResponse.json({
                message: 'Register successful',
                success: true,
                user: newUser,
            });

            return response;
        }
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}