import { connectDB } from '@/app/config/connectDB';
import User from '@/app/models/User';
import { NextRequest, NextResponse } from 'next/server';
import uuidv4 from 'uuid';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDB();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    console.log("params", searchParams);
    const userId = searchParams.get('id');

    if (userId) {
      // Fetch user by ID
      const user = await User.findById(userId);
      if (user) {
        return NextResponse.json(user);
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    } else {
      // Fetch all users
      const users = await User.find();
      return NextResponse.json(users);
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
