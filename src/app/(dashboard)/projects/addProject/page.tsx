"use client";
import { useState, useEffect } from "react";
import Select from 'react-select';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { errorToaster, successToaster } from "@/app/common/common";

export default function AddProjectPage() {
    const router = useRouter();
    const [mentors, setMentors] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [formData, setFormData] = useState({
        projectName: '',
        technology: [],
        projectManager: '',
        startDate: '',
        endDate: '',
        members: [],
        status: "",
        details: ""
    });

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };

            const response = await axios.get('/api/users', config);
            console.log(response);
            const mentors = response.data.filter((data: any) => data.category === "mentor");
            console.log("mentors", mentors)
            const employees = response.data.filter((data: any) => data.category === "employee");
            console.log("employees", employees)
            setMentors(mentors);
            setEmployees(employees);
            // console.log("users", users);
        } catch (error) {
            console.log(error);
            errorToaster("Error fetching users");
        }
    };

    const techOptions = ['React', 'Angular', 'Node', 'Vue', 'Next']

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (selectedOption: any, name: string) => {
        setFormData({ ...formData, [name]: selectedOption });
    };

    const handleMultiSelectChange = (selectedOptions: any, name: string) => {
        const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setFormData({ ...formData, [name]: values });
    };

    console.log("==mentors===", mentors)
    console.log("==employees===", employees)

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userCategory = localStorage.getItem('userCategory')

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        };

        // Proceed if userCategory is 'mentor', otherwise show message
        if (userCategory === 'mentor') {
            console.log("formdata", formData);
            // const data = new FormData();
            const formDataCopy = {
                ...formData,
                technology: formData.technology.join(','),
                members: formData.members.join(',')
            };
            console.log("formDataCopy", formDataCopy);
            try {
                const response = await axios.post('/api/projects', formDataCopy, config);
                if (response.status === 200) {
                    successToaster('Project added successfully');
                    router.push('/projects');
                } else {
                    errorToaster('Failed to add project');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            errorToaster('User is not authorized to add project.');
            // Optionally, you can show a message or prevent form submission here
        }
    };

    return (
        <div className="h-full p-5 overflow-auto">
            <h2 className="text-xl">Add Project</h2>
            <div className="border-2 w-10 border-sky-500 "></div>
            <div className="py-4">
                <form className="flex flex-col gap-5 p-5 border-neutral-600 rounded-lg bg-neutral-700" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label className="text-sky-400">Project Name:</label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            required
                            className="p-2 bg-neutral-100 border border-neutral-900 rounded-md text-sky-400"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sky-400">Technology:</label>
                        <Select
                            isMulti
                            name="technology"
                            options={techOptions.map((option: any) => ({ value: option, label: option }))}
                            className="basic-multi-select text-sky-400"
                            classNamePrefix="select"
                            onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'technology')}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sky-400">Project Manager:</label>
                        <select className="text-sky-400 bg-neutral-100 border border-neutral-900 rounded-md p-3"
                            name='projectManager' onChange={handleChange}>
                            <option>Select Manager</option>
                            {mentors.map((data: any, index) => (
                                <option key={index} value={data.userId}>{data.firstname}</option>
                            ))}
                        </select>
                        {/* <Select
                            options={projectManagers}
                            onChange={(selectedOption: any) => handleSelectChange(selectedOption, 'projectManager')}
                            required
                            className="text-sky-400 bg-neutral-100 border border-neutral-900 rounded-md"
                        /> */}
                    </div>
                    <div className="flex">
                        <div className="flex flex-col gap-2 w-1/2 mr-2">
                            <label className="text-sky-400">Start Date:</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="p-2 bg-neutral-100 border border-neutral-900 rounded-md text-sky-400"
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="text-sky-400">End Date:</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                className="p-2 bg-neutral-100 border border-neutral-900 rounded-md text-sky-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sky-400">Add Members:</label>
                        <Select
                            isMulti
                            name="members"
                            options={employees.map((employee: any) => ({ value: employee.userId, label: employee.firstname }))}
                            className="basic-multi-select text-sky-400"
                            classNamePrefix="select"
                            onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'members')}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sky-400">Project Status:</label>
                        <select className="text-sky-400 bg-neutral-100 border border-neutral-900 rounded-md p-3"
                            name='status' onChange={handleChange}>
                            <option>Select Status</option>
                            <option value="Complete">Complete</option>
                            <option value="Not Complete">Not Complete</option>
                            <option value="On Hold">On Hold</option>
                            <option value="On Going">On Going</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sky-400">Details:</label>
                        <textarea
                            id="details"
                            name='details'
                            className="text-sky-400 bg-neutral-100 border border-neutral-900 rounded-md text-sky-400"
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <button type="submit" className="p-2 bg-sky-500 text-white rounded-md hover:bg-sky-700 w-1/3 mx-auto">Add Project</button>
                </form>
            </div>
        </div>
    )
}