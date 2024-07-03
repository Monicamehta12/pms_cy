"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { errorToaster, successToaster } from "@/app/common/common";
import { useRouter } from 'next/navigation';
import TaskModal from "@/app/components/TaskModal";
import {
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

export interface Project {
    _id: string;
    projectName: string;
    technology: string;
    projectManager: string;
    startDate: string;
    endDate: string;
    status: string;
    details: string;
}

export interface User {
    userId: string;
    firstname: string;
}

export interface Task {
    _id?: string;
    date: string;
    estimatedDuration: string;
    finalTime: string;
    status: string;
    comment: string;
    reply: string;
    qa: boolean;
    codeQuality: boolean;
    approvedByClient: boolean;
    developerName: string;
}

function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

const getStatusBgColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'complete':
            return 'bg-green-600';
        case 'not complete':
            return 'bg-red-600';
        case 'on going':
            return 'bg-sky-500';
        case 'on hold':
            return 'bg-yellow-500';
        default:
            return 'bg-gray-300'; // default color if status is unknown
    }
};

export default function ProjectDetails({
    params
}: {
    params: { projectId: string };
}) {
    const token = localStorage.getItem('token');
    const [project, setProject] = useState<Project | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const projectId = params.projectId;
    const router = useRouter();
    const [projectManager, setProjectManager] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const usersQueryParam = new URLSearchParams(window.location.search).get('users');
        if (usersQueryParam) {
            const usersList = JSON.parse(decodeURIComponent(usersQueryParam));
            console.log(usersList)
            setUsers(usersList);
        }
        getProjectById();
        getTasks();
    }, []);


    const getProjectById = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };

            const response = await axios.get(`/api/projects?id=${projectId}`, config);
            console.log("res project", response.data);
            setProject(response.data);
            setProjectManager(response.data.projectManager)
            setEmployeeName(response.data.members)
        } catch (error) {
            console.log(error);
            errorToaster("Error fetching projects");
        }
    };

    const getTasks = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };
            const response = await axios.get(`/api/task?projectId=${projectId}`, config);

            console.log("res task", response.data);
            setTasks(response.data);
        } catch (error) {

        }
    }

    const handleAddTask = async (task: Task) => {
        try {
            const response = await axios.post('/api/task', { task, projectId });
            console.log("res task", response.data);
            setTasks([...tasks, response.data.task]);
            successToaster("Task added successfully");
        } catch (error) {
            console.error(error);
            errorToaster("Error adding task");
        }
    };

    //converting user ids to name 
    const projectManagerName = users.filter(data => projectManager === data.userId).map(data => data.firstname)
    console.log("projectManagerName", projectManagerName)

    console.log("employeeName", employeeName)

    const teamMembers = users.filter(data => employeeName.includes(data.userId)).map(data => data.firstname)
    console.log("teamMembers", teamMembers)

    const developer = users.filter(data => employeeName.includes(data.userId))
    console.log("developerName", developer)

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
        setIsEditMode(true);
    };

    const handleUpdateTask = async (updatedTask: Task) => {
        try {
            const response = await axios.put(`/api/task?id=${updatedTask._id}`, { task: updatedTask });
            console.log("res task", response.data);
    
            // Update the task in the state
            setTasks(tasks.map(task => (task._id === updatedTask._id ? response.data : task)));
            successToaster("Task updated successfully");
            setIsModalOpen(false);
            setIsEditMode(false);
        } catch (error) {
            console.error(error);
            errorToaster("Error updating task");
        }
    };

    const handleDeleteTask = async (task : Task) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };
            // console.log("taskId", taskId);
            const response = await axios.delete(`/api/task?id=${task._id}`, config);
            if (response.status === 200) {
                console.log(response)
                setTasks(tasks.filter((t) => t._id !== task._id));
                successToaster(response.data.message);
            } else {
                errorToaster('Failed to delete task');
            }
        } catch (error) {
            console.error('Error:', error);
            errorToaster('Failed to perform operation');
        }
    }

    const handleCloseModal = () => {
        setIsEditMode(false);
        setIsModalOpen(false)
        console.log("===selected task===",selectedTask)
    }

    return (
        <div className="h-full p-5">
            {project ?
                <>
                    <div className="flex justify-between">
                        <div>
                            <h2 className="text-xl">{project.projectName}</h2>
                            <div className="border-2 w-10 border-sky-500"></div>
                        </div>
                        <button
                            className="border-0 rounded-full px-4 py-2 text-center bg-sky-500"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Task
                        </button>
                    </div>
                    <div className="py-4">
                        <h5 className="py-2">Project Manager : <span className='text-primary'>{projectManagerName}</span></h5>
                        <h5 className="py-2">Technology : <span className='text-primary'>{project.technology}</span></h5>
                        <h5>Project Members : <span className='text-primary'>
                            {teamMembers}</span></h5>
                        <h5 className="py-2">Start Date : <span className='text-primary'>{formatDate(project.startDate)}</span></h5>
                        <h5 className="py-2">End Date : <span className='text-primary'>{formatDate(project.endDate)}</span></h5>
                        <div className="py-2">
                            <span>Status: </span>
                            <span className={`border-0 rounded-full px-4 py-2 text-center ${getStatusBgColor(project.status)}`}  >
                                {project.status}
                            </span>
                        </div>

                        <div className='mt-2'><h5>Details: </h5>{project.details}</div>

                    </div>
                    <div className='w-full py-5'>
                        <h5 className='py-2 border-top border-bottom'>Task Details Table:</h5>

                        <table className="w-full border-separate border border-slate-400">
                            <thead className=''>
                                <tr>
                                    <th className="border border-slate-300">Date</th>
                                    <th className="border border-slate-300">Estimated Duration</th>
                                    <th className="border border-slate-300">Final Time</th>
                                    <th className="border border-slate-300">Status</th>
                                    <th className="border border-slate-300">Comment</th>
                                    <th className="border border-slate-300">Reply</th>
                                    <th className="border border-slate-300">QA</th>
                                    <th className="border border-slate-300">Code Quality</th>
                                    <th className="border border-slate-300">Approved by client</th>
                                    <th className="border border-slate-300">Developer Name</th>
                                    <th className="border border-slate-300">Actions</th>
                                </tr>
                            </thead>
                            {/* {taskDetail.map((item, index) => (
                                    <tbody key={index}>
                                        <tr>
                                            <td>{item.date}</td>
                                            <td>{item.estimatedDuration}</td>
                                            <td>{item.finalTime}</td>
                                            <td>{item.status}</td>
                                            <td>{item.comment}</td>
                                            <td>{item.reply}</td>
                                            <td>{item.qa.toString()}</td>
                                            <td>{item.codeQuality.toString()}</td>
                                            <td>{item.approvedByClient.toString()}</td>
                                            <td>{users.filter(data => item.developerName === data.id).map(data => data.firstName)}</td>
                                            <td className='d-flex'>
                                                <button data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => getTaskDetailById(item.id)} className='btn btn-link'><i className="uil uil-edit-alt"></i></button>
                                                <button onClick={() => handleDelete(item.id)} className='btn btn-link'><i className="uil uil-trash-alt"></i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))} */}

                            <tbody>
                                {tasks.map((task, index) => (
                                    <tr key={index}>
                                        <td className="border border-slate-300">{formatDate(task.date)}</td>
                                        <td className="border border-slate-300">{task.estimatedDuration}</td>
                                        <td className="border border-slate-300">{task.finalTime}</td>
                                        <td className="border border-slate-300">{task.status}</td>
                                        <td className="border border-slate-300">{task.comment}</td>
                                        <td className="border border-slate-300">{task.reply}</td>
                                        <td className="border border-slate-300">{task.qa ? task.qa.toString() : 'False'}</td>

                                        <td className="border border-slate-300">{task.codeQuality ? task.codeQuality.toString() : 'False'}</td>

                                        <td className="border border-slate-300">{task.approvedByClient ? task.approvedByClient.toString()  : 'False'}</td>

                                        <td className="border border-slate-300">{users.filter(data => task.developerName === data.userId).map(data => data.firstname)}</td>
                                        <td className='flex items-center justify-center border border-slate-300'>
                                            <PencilSquareIcon className="h-[25px] mr-2 text-sky-500" onClick={() => handleEditTask(task)}></PencilSquareIcon>
                                            <TrashIcon className="h-[25px] text-red-500" onClick = {() => handleDeleteTask(task)}></TrashIcon>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </>
                : "Loading..."}
            <TaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                isEdit={isEditMode}
                // onClose={() => setIsModalOpen(false)}
                onSubmit={isEditMode ? handleUpdateTask : handleAddTask}
                developerName={developer}
                taskData={selectedTask}
            />
        </div>
    )
}
