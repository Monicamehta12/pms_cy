'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useContext, useEffect  } from 'react';
import { MdLockOutline } from "react-icons/md"
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { errorToaster, successToaster } from "@/app/common/common";

import { useActionState } from 'react';
// import { authenticate } from '@/app/lib/actions';
import { FaFacebookF, FaGoogle, FaLinkedinIn, FaRegEnvelope } from "react-icons/fa";

export default function Login() {
    // const [errorMessage, formAction, isPending] = useActionState(
    //     authenticate,
    //     undefined,
    // );

    const [errorMessage, setErrorMessage] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Load saved credentials from localStorage if available
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            setFormData((prev) => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [error, setError] = useState();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setRememberMe(checked);
        if (checked) {
            console.log("Remember Me checked.");
        } else {
            console.log("Remember Me unchecked.");
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let formValid = true;
        const emailPattern =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (email === '') {
            formValid = false;
            setEmailError('Please enter email');
        }
        else if (password === '') {
            formValid = false
            setPasswordError('Please enter password');
        } else if (!email.match(emailPattern)) {
            formValid = false;
            setEmailError('Please enter email in valid format');
        } else {
            formValid = true;
            setEmailError('');
        }

        if (formValid) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const data = {
                email: email,
                password: password,
            };

            try {
                const response = await axios.post('/api/users/login', data, config);
                if (response) {
                    console.log("response", response);

                    localStorage.setItem('token', response.data.token);

                    localStorage.setItem('userCategory', response.data.user.category);
                    successToaster("User logged in successfully!");
                    router.push('/dashboard');
                }
            } catch (err: any) {
                console.log(err);
                setError(err.response.data.errors || 'something went wrong');
                errorToaster("Invalid email and password");
            }
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-20">
            <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
                {/* Sign In */}
                <div className="w-3/5 p-5">
                    <div className="flex items-center text-left font-bold">
                        {/* <span className="text-sky-500">Company</span>Name */}
                        <img src="images/logo.png" alt="Web Wizards Logo" className="h-8" />
                        <span className="ml-2 text-sky-500">Web Wizards</span>
                    </div>
                    <div className="py-10 text-center">
                        <h2 className="text-3xl font-bold text-sky-500 mb-2">Sign in to Account</h2>
                        <div className="border-2 w-10 border-sky-500 mb-10 mx-auto"></div>
                        <div className="flex justify-center my-2">
                            <a href="#" className="border-2 border-gray-200 rounded-full p-3 mx-1">
                                <FaFacebookF className="text-sm" />
                            </a>
                            <a href="#" className="border-2 border-gray-200 rounded-full p-3 mx-1">
                                <FaLinkedinIn className="text-sm" />
                            </a>
                            <a href="#" className="border-2 border-gray-200 rounded-full p-3 mx-1">
                                <FaGoogle className="text-sm" />
                            </a>
                        </div>

                        {/* Social login section */}
                        <p className="text-gray-400 my-3">or use your email account</p>
                        <form className="flex flex-col items-center"
                            // action={formAction}
                            onSubmit={(e) => onSubmit(e)}
                        >
                            <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                                <FaRegEnvelope className="text-gray-400 m-2" />
                                <input type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="bg-gray-100 outline-none text-sm flex-1 text-sky-400"
                                    onChange={(e) => onChange(e)} />
                            </div>
                            {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
                            <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                                <MdLockOutline className="text-gray-400 m-2" />
                                <input type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="bg-gray-100 outline-none text-sm flex-1 text-sky-400"
                                    onChange={(e) => onChange(e)} />
                            </div>
                            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                            {/* <div className="flex justify-between w-64 mb-5">
                                <label htmlFor="remember" className="flex items-center text-xs">
                                    <input type="checkbox"
                                        name="remember" id="remember" className="mr-1" />Remember me
                                </label>
                                <a href="/forgot-password" className="text-xs">Forgot Password?</a>
                            </div> */}
                            <div className="flex justify-between w-64 mb-5">
                                <label htmlFor="remember" className="flex items-center text-xs">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={handleRememberMeChange}
                                        // onChange={(e) => setRememberMe(e.target.checked)}
                                        className="mr-1"
                                    />
                                    Remember me
                                </label>
                                <Link href="/forgot-password" className="text-xs">Forgot Password?</Link>
                            </div>

                            <input type="submit" value="Sign In" className="border-2 border-sky-500 text-sky-500 rounded-full px-12 py-2
                inline-block font-semibold hover:bg-sky-500 hover:text-white"/>

                            {/* <button className="border-2 border-sky-500 text-sky-500 rounded-full px-12 py-2
                inline-block font-semibold hover:bg-sky-500 hover:text-white" aria-disabled={isPending}>
                                Log in
                            </button>

                            <div
                                className="flex h-8 items-end space-x-1"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {errorMessage && (
                                    <>
                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                        <p className="text-sm text-red-500">{errorMessage}</p>
                                    </>
                                )}
                            </div> */}
                        </form>
                    </div>
                </div>

                {/* Sign up */}
                <div className="w-2/5 bg-sky-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12 text-center">
                    <h2 className="text-3xl font-bold mb-2">Hello, Friends!</h2>
                    <div className="border-2 w-10 border-white mb-10 mx-auto"></div>
                    <Link href="/register" className="border-2 border-white rounded-full px-12 py-2
           inline-block font-semibold hover:bg-white hover:text-sky-500">Sign Up</Link>
                </div>
            </div>
         </main>
    );
}