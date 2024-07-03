"use client";
import { errorToaster } from "@/app/common/common";
import DashboardCards from "@/app/components/DashboardCards";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import clsx from "clsx";

export default function DashboardPage() {
    const [projectCounts, setProjectCounts] = useState({
        ongoing: 0,
        complete: 0,
        notComplete: 0,
        onHold: 0
    });

    const [recentProjects, setRecentProjects] = useState([]);
    const [userActivity, setUserActivity] = useState([]);
    const chartRef = useRef<Chart<"doughnut"> | null>(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            errorToaster("User Not LoggedIn..!!");
            window.location.href = "/login"
            return;
        }

        fetchData();
    }, []);

    useEffect(() => {
        const ctx = document.getElementById("projectStatusChart") as HTMLCanvasElement;

        // Destroy the previous chart instance if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Create a new chart instance
        chartRef.current = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Ongoing", "Complete", "Not Complete", "On Hold"],
                datasets: [
                    {
                        label: "# of Projects",
                        data: [
                            projectCounts.ongoing,
                            projectCounts.complete,
                            projectCounts.notComplete,
                            projectCounts.onHold,
                        ],
                        backgroundColor: ["#36a2eb", "#4ade80", "#ff6384", "#ffce56"],
                        hoverOffset: 4,
                    },
                ],
            },
        });
    }, [projectCounts]);


    const fetchData = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };

            const response = await axios.get('/api/projects', config);

            if (response) {
                const data = response.data.projects;
                console.log("__data", data);
                const counts = {
                    ongoing: data.filter((project: any) => project.status === "On Going").length,
                    complete: data.filter((project: any) => project.status === "Complete").length,
                    notComplete: data.filter((project: any) => project.status === "Not Complete").length,
                    onHold: data.filter((project: any) => project.status === "On Hold").length,
                };
                setProjectCounts(counts);
                setRecentProjects(data.slice(0, 5)); // Assuming the latest 5 projects are recent
                setUserActivity(data.slice(0, 5).map((project: any) => ({ // Mock user activity
                    user: project.developerName,
                    action: "updated",
                    project: project.projectName,
                    date: project.date,
                })));
            }
        } catch (error) {
            console.error("Error fetching project data:", error);
            errorToaster("Error fetching project data");
        }
    };

    return (
        <div className="h-full p-5">
            <h2 className="text-xl">Dashboard</h2>
            <div className="border-2 w-10 border-sky-500 "></div>
            <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCards title="Ongoing Projects" count={projectCounts.ongoing} />
                <DashboardCards title="Complete Projects" count={projectCounts.complete} />
                <DashboardCards title="Not Complete Projects" count={projectCounts.notComplete} />
                <DashboardCards title="On Hold Projects" count={projectCounts.onHold} />
            </div>
            <div className="flex justify-between">
                <div className="w-1/2 px-4 py-6 border rounded shadow-lg mr-4">
                    <h3>Recent Projects</h3>
                    <div className="border-2 w-10 border-sky-500 mb-4"></div>
                    <ul className="">
                        {recentProjects.map((project: any, i) => (
                            <li key={project._id} 
                            className={clsx(
                                'py-4',
                                {
                                  'border-t': i !== 0,
                                },
                              )}>
                                <strong>{project.projectName}</strong> - {project.status}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-1/2 px-4 py-6 border rounded shadow-lg ">
                    <h3>Project Status Chart</h3>
                    <div className="border-2 w-10 border-sky-500 mb-4"></div>
                    <div className="flex justify-center h-80 py-4 text-center">
                        <canvas id="projectStatusChart"></canvas>
                    </div>

                </div>
            </div>

            {/* <div className="py-4">
                <h3>User Activity</h3>
                <div className="border-2 w-10 border-sky-500 mb-4"></div>
                <ul>
                    {userActivity.map((activity: any, index: number) => (
                        <li key={index} className="mb-2">
                            <strong>{activity.user}</strong> {activity.action} <strong>{activity.project}</strong> on {activity.date}
                        </li>
                    ))}
                </ul>
            </div> */}

        </div>
    )
}