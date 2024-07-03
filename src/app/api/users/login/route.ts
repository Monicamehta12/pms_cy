import { connectDB } from '@/app/config/connectDB';
import User from '@/app/models/User';
import { NextRequest, NextResponse } from 'next/server';
import uuidv4 from 'uuid';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(reqBody);

    //check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: 'User does not exist' }, { status: 400 });
    }

    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return Response.json({ error: 'Invalid password' }, { status: 400 });
    }

    const payload = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: 36000,
    });
    console.log("user",user)
    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
      user: user,
      token: token,
    });

    return response;
  } catch (error: any) {
    console.log("error", error)
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(email: string) {
  try {
    // const email = email;
    //check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: 'User does not exist' }, { status: 400 });
    }

    return user;
  } catch (error: any) {
    console.log("error", error)
    return Response.json({ error: error.message }, { status: 500 });
  }
}