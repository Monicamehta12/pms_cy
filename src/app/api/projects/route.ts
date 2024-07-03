import Project from '@/app/models/Project';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/app/models/User';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
    const status = searchParams.get('option');

    const authToken = request.headers.get('x-auth-token');
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET!);
    const emailID = decoded.user?.email;

    if (!emailID) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const user = await User.findOne({ email: emailID });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let projects = [];
    const userID = user.userId;
    if (user.category === 'mentor') {
      projects = await Project.find({ projectManager: userID });
    } else {
      projects = await Project.find({ members: { $regex: new RegExp(userID, 'i') } });
    }

    if (projectId) {
      const project = projects.find(p => p._id.toString() === projectId);
      if (project) {
        return NextResponse.json(project);
      } else {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
    }

    if (status) {
      projects = projects.filter(project => project.status === status);
    }

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     console.log("params", searchParams);
//     const projectId = searchParams.get('id');

//     const status = searchParams.get('option');
//     console.log("status", status);
//     if(status){
//       const projects = await Project.find({ status });
//       if(projects){
//         return NextResponse.json({ projects });
//       }
//       else{
//         return NextResponse.json({ message: "No project found" });
//       }
//     }

//     if (projectId) {
//       // Fetch user by ID
//       const project = await Project.findById(projectId);
//       if (project) {
//         return NextResponse.json(project);
//       } else {
//         return NextResponse.json({ error: 'Project not found' }, { status: 404 });
//       }
//     } else {
//       // Check if user exists
//       if (request.headers) {
//         const headers = request.headers;
//         const authToken = headers.get('x-auth-token');
//         if (authToken) {
//           console.log(authToken); // Log the x-auth-token value
//           const decoded = jwt.verify(authToken, process.env.JWT_SECRET!);
//           console.log('----decoded----', decoded);

//           // Correctly extract email from the decoded token
//           const emailID = decoded.user?.email;
//           console.log("Email...", emailID);

//           if (emailID) {
//             const user = await User.findOne({ email: emailID });
//             console.log('User Found:', user);
//             let projects = [];
//             if (user) {
//               const userID = user.userId;
//               console.log("userId", userID);
//               if (user.category === 'mentor') {
//                 projects = await Project.find({ projectManager: userID });
//               } else {
//                 // Use Mongoose query to find projects where the user is a member
//                 projects = await Project.find({
//                   members: { $regex: new RegExp(userID, 'i') }
//                 });
//               }

//               console.log("projects", projects);
//               const response = NextResponse.json({
//                 success: true,
//                 projects: projects
//               });

//               return response;
//             } else {
//               console.log('User not found in database');
//               return NextResponse.json({ error: 'User not found' }, { status: 404 });
//             }
//           } else {
//             console.log('Email not found in token');
//             return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
//           }
//         } else {
//           console.log('x-auth-token not found');
//           return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }
//       }
//     }
//   } catch (error: any) {
//     console.log("error", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { projectName, technology, projectManager, startDate, endDate, document, members } = data;
    console.log("data", data);

    const project = new Project(data);
    await project.save();
    console.log("project", project);

    const response = NextResponse.json({
      message: 'Register successful',
      success: true,
      project: project,
    });

    return response;
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
  }

  const data = await request.json();
  const project = await Project.findByIdAndUpdate(id, data, { new: true });

  if (!project) {
    return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(project, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  console.log("hello delete")
  const url = new URL(request.url);
  console.log("url", url)
  const id = url.searchParams.get('id');
  console.log("id", id)

  // const { id } = request.query;

  if (!id) {
    return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
  }

  const projectExists = await Project.findById(id);
  if (!projectExists) {
    return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  }
  else {
    const project = await Project.findByIdAndDelete(id);
    const response = NextResponse.json({
      success: true,
      message: "Project deleted Successfully"
    });
    return response;
  }
}
