// 'use client'
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';

// const Logout = () => {
//     const router = useRouter();

//     useEffect(() => {
//         const handleLogout = async () => {
//             try {
//                 // Call logout API
//                 const response = await fetch('/api/logout', {
//                     method: 'POST',
//                 });

//                 if (response.ok) {
//                     // Redirect to login page
//                     router.push('/auth/login');
//                 } else {
//                     throw new Error('Logout failed');
//                 }
//             } catch (error) {
//                 console.error('Logout error:', error);
//                 // Handle error or redirect to login page
//                 router.push('/auth/login');
//             }
//         };

//         handleLogout();
//     }, [router]);

//     return (
//         <div className="flex justify-center items-center h-screen">
//             <p className="text-gray-700 dark:text-gray-300">Logging out...</p>
//         </div>
//     );
// };

// export default Logout;