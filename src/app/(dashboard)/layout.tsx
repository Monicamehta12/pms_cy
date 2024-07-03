import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-full">
            <Navbar></Navbar>
            <div className="flex h-full overflow-hidden">
                <Sidebar></Sidebar>
                <div className="w-full mx-2 mb-2 bg-neutral-800 rounded border border-neutral-600 overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}
