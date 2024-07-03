import { useEffect, useState } from "react";

export interface User {
    userId: string;
    firstname: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEdit: boolean;
    onSubmit: (task: Task) => void;
    developerName: User[];
    taskData?: Task | null;
}

interface Task {
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

export default function TaskModal({ isOpen, onClose, isEdit, onSubmit, developerName, taskData }: ModalProps) {
    const formatDate = (date: string) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // const [task, setTask] = useState<Task>(taskData || {
    //     date: "",
    //     estimatedDuration: "",
    //     finalTime: "",
    //     status: "",
    //     comment: "",
    //     reply: "",
    //     qa: false,
    //     codeQuality: false,
    //     approvedByClient: false,
    //     developerName: "",
    // });

    // useEffect(() => {
    //     if (taskData) {
    //         setTask(taskData);
    //     }
    // }, [taskData]);

    const initialTaskState: Task = {
        date: "",
        estimatedDuration: "",
        finalTime: "",
        status: "",
        comment: "",
        reply: "",
        qa: false,
        codeQuality: false,
        approvedByClient: false,
        developerName: "",
    };

    const [task, setTask] = useState<Task>(initialTaskState);

    useEffect(() => {
        if (isEdit && taskData) {
            setTask({
                ...taskData,
                date: taskData.date ? formatDate(taskData.date) : "",
            });
        } else {
            setTask(initialTaskState);
        }
    }, [isEdit, taskData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setTask(prevTask => ({
                ...prevTask,
                [name]: checked,
            }));
        } else {
            setTask(prevTask => ({
                ...prevTask,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(task);
        onClose();
    };

    // if (!isOpen) return null;

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="h-3/4 w-[52rem] bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col text-neutral-800">
                        <h2 className="text-xl">{isEdit ? "Update Task" : "Add Task"}</h2>
                        <div className="border-2 w-10 border-sky-500 mb-4"></div>
                        <form onSubmit={handleSubmit} className="h-100 overflow-auto custom-scrollbar">
                            <div className="mb-4">
                                <label className="block mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={task.date}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full border p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Estimated Duration</label>
                                <input
                                    type="text"
                                    name="estimatedDuration"
                                    value={task.estimatedDuration}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full border p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Final Time</label>
                                <input
                                    type="text"
                                    name="finalTime"
                                    value={task.finalTime}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full border p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Status</label>
                                <select className="border w-full p-2"
                                    value={task.status}
                                    name='status' onChange={(e) => handleChange(e)}>
                                    <option>Select Status</option>
                                    <option value="Complete">Complete</option>
                                    <option value="Not Complete">Not Complete</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="On Going">On Going</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Comment</label>
                                <input
                                    type="text"
                                    name="comment"
                                    value={task.comment}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full border p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Reply</label>
                                <input
                                    type="text"
                                    name="reply"
                                    value={task.reply}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full border p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">
                                    <input
                                        type="checkbox"
                                        name="qa"
                                        checked={task.qa}
                                        onChange={(e) => handleChange(e)}
                                        className="mr-2"
                                    />
                                    QA
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">
                                    <input
                                        type="checkbox"
                                        name="codeQuality"
                                        checked={task.codeQuality}

                                        onChange={(e) => handleChange(e)}
                                        className="mr-2"
                                    />
                                    Code Quality
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">
                                    <input
                                        type="checkbox"
                                        name="approvedByClient"
                                        checked={task.approvedByClient}

                                        onChange={(e) => handleChange(e)}
                                        className="mr-2"
                                    />
                                    Approved by client
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Developer Name</label>
                                <select className="w-full border p-2"
                                    name='developerName'
                                    value={task.developerName}
                                    onChange={(e) => handleChange(e)}>
                                    <option>Select Developer</option>
                                    {developerName.map((data: any, index: any) => (
                                        <option key={index} value={data.userId}>{data.firstname}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded">
                                    {isEdit ? "Update Task" : "Add Task"}

                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            )}
        </>
    );
}
