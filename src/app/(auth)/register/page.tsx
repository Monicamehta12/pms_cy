"use client";

import { useState, useContext } from 'react';
import {
    UserIcon,
    IdentificationIcon,
    EnvelopeIcon,
    LockClosedIcon,
    ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { MdLockOutline } from "react-icons/md"
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { successToaster } from "@/app/common/common";
import "react-toastify/dist/ReactToastify.css";

// import router from "next/router";

export default function RegisterPage() {
    const router = useRouter();

    const dropdownOptions = [
        { key: 'select-category', label: 'Select Category', value: '' },
        { key: 'mentor', label: 'Mentor', value: 'mentor' },
        { key: 'employee', label: 'Employee', value: 'employee' },
    ];

    const [formData2, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmpassword: '',
        category: ''
    });

    const { firstname, lastname, username, email, password, confirmpassword, category } = formData2;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData2, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const data = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
            confirmpassword: confirmpassword,
            category: category
        };

        try {
            const response = await axios.post('/api/users/signup', data, config);
            if (response) {
                console.log("response", response);
                successToaster("User registered successfully!");
                router.push('/login');
            }
            // router.push('/posts');
        } catch (e: any) {
            console.log('error ', e.message);
        }
    };


    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-20">
            <div className="bg-white rounded-2xl shadow-2xl w-3/5 ">
                <div className="p-5">
                    <div className="flex items-center text-left font-bold">
                        {/* <span className="text-sky-500">Company</span>Name */}
                        <img src="images/logo.png" alt="Web Wizards Logo" className="h-8" />
                        <span className="ml-2 text-sky-500">Web Wizards</span>
                    </div>
                    <div className="py-3 text-center">
                        <h2 className="text-3xl font-bold text-sky-500 mb-2">Create an Account</h2>
                        <div className="border-2 w-10 border-sky-500 mb-8 mx-auto"></div>
                    </div>
                    <form className="py-3 flex flex-col items-center" onSubmit={(e) => onSubmit(e)}>
                        <div className="bg-gray-100 w-3/4 p-2 flex items-center mb-3">
                            <UserIcon className="text-gray-400 m-2 w-4" />
                            <input type="text"
                                name="firstname"
                                placeholder="First Name"
                                className="bg-gray-100 outline-none text-sm flex-1 text-sky-400"
                                onChange={(e) => onChange(e)} />
                        </div>

                        <div className="bg-gray-100 w-3/4 p-2 flex items-center mb-3">
                            <UserIcon className="text-gray-400 m-2 w-4" />
                            <input type="text"
                                name="lastname"
                                placeholder="Last Name"
                                className="bg-gray-100 outline-none text-sm flex-1 text-sky-400"
                                onChange={(e) => onChange(e)} />
                        </div>

                        <div className="bg-gray-100 w-3/4 p-2 flex items-center mb-3">
                            <IdentificationIcon className="text-gray-400 m-2 w-4" />
                            <input type="text"
                                name="username"
                                placeholder="Username"
                                className="bg-gray-100 outline-none text-sm flex-1 text-sky-400"
                                onChange={(e) => onChange(e)} />
                        </div>

                        <div className="bg-gray-100 w-3/4 p-2 flex items-center mb-3">
                            <EnvelopeIcon className="text-gray-400 m-2 w-4" />
                            <input type="email"
                                name="email"
                                placeholder="Email Address"
                                className="bg-gray-100 outline-none text-sm flex-1 text-sky-400"
                                onChange={(e) => onChange(e)} />
                        </div>

                        <div className="bg-gray-100 w-3/4 p-2 flex items-center mb-3">
                            <LockClosedIcon className="text-gray-400 m-2 w-4" />
                            <input type="password"
                                name="password"
                                placeholder="Password"
                                className="bg-gray-100 outline-none text-sm flex-1 text-sky-400"
                                onChange={(e) => onChange(e)} />
                        </div>

                        <div className="bg-gray-100 w-3/4 p-2 flex items-center mb-3">
                            <LockClosedIcon className="text-gray-400 m-2 w-4" />
                            <input type="password"
                                name="confirmpassword"
                                placeholder="Confirm Password"
                                className="bg-gray-100 outline-none text-sm flex-1 text-sky-400"
                                onChange={(e) => onChange(e)} />
                        </div>

                        <div className="bg-gray-100 w-3/4 p-2 flex items-center mb-3">
                            <ChevronUpDownIcon className="text-gray-400 m-2 w-4" />
                            <select className="text-gray-400 bg-gray-100 w-full" name="category" onChange={(e) => onChange(e)}>
                                <option className="text-gray-400 m-2 border-0">Please choose one option</option>
                                {dropdownOptions.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <input type="submit" value="Sign Up" className="border-2 border-sky-500 text-sky-500 rounded-full px-12 py-2
                inline-block font-semibold hover:bg-sky-500 hover:text-white"/>
                    </form>
                </div>
            </div>
        </main>
    )
}