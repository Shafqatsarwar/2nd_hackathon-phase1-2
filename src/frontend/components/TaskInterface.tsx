"use client";

import { useState, useEffect, useCallback } from "react";

import { fetcher } from "../utils/fetcher";

interface Task {
    id: number;
    title: string;
    completed: boolean;
    user_id: string;
    priority?: string;
    is_recurring?: boolean;
    recurrence_interval?: string;
}

interface TaskInterfaceProps {
    userId: string;
    token: string;
    title?: string;
    isCompact?: boolean;
}

export default function TaskInterface({ userId, token, title = "Evolution Task Matrix", isCompact = false }: TaskInterfaceProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [priority, setPriority] = useState("medium");
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceInterval, setRecurrenceInterval] = useState("daily");
    const [loading, setLoading] = useState(true);

    const fetchTasks = useCallback(async () => {
        try {
            const url = `/api/${userId}/tasks`;
            console.log("Fetching tasks from:", url); // Diagnostic
            const data = await fetcher(url, token);
            setTasks(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId, token]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const addTask = async () => {
        if (!newTitle) return;
        try {
            const res = await fetch(`/api/${userId}/tasks`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: newTitle,
                    priority: priority,
                    is_recurring: isRecurring,
                    recurrence_interval: isRecurring ? recurrenceInterval : null
                })
            });
            if (res.ok) {
                const newTask = await res.json();
                setTasks([...tasks, newTask]);
                setNewTitle("");
                setPriority("medium");
                setIsRecurring(false);
                setRecurrenceInterval("daily");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTask = async (id: number) => {
        try {
            const res = await fetch(`/api/${userId}/tasks/${id}/complete`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const updatedTask = await res.json();
                setTasks(tasks.map(t => t.id === id ? updatedTask : t));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async (id: number) => {
        try {
            const res = await fetch(`/api/${userId}/tasks/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setTasks(tasks.filter(t => t.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };


    if (loading) return <div className="text-slate-500 py-10 text-center animate-pulse">Scanning matrix...</div>;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                {title}
            </h2>

            <div className={`bg-slate-900/50 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-sm ${isCompact ? 'p-4 mb-4' : 'p-6 mb-8'}`}>
                <div className={`flex gap-4 ${isCompact ? 'flex-col gap-3' : ''}`}>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Add to the evolution..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                    />
                    {isCompact ? (
                        <div className="flex items-center gap-2 justify-between">
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Med</option>
                                <option value="high">High</option>
                            </select>
                            <button
                                onClick={addTask}
                                className="bg-white text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-neutral-200 transition-colors active:scale-95 cursor-pointer"
                            >
                                Add
                            </button>
                        </div>
                    ) : (
                        <>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>

                            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3">
                                <input
                                    type="checkbox"
                                    checked={isRecurring}
                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                    className="w-4 h-4 accent-purple-500"
                                    id="recurring-check"
                                />
                                <label htmlFor="recurring-check" className="text-sm text-slate-300 cursor-pointer select-none">Repeat</label>
                                {isRecurring && (
                                    <select
                                        value={recurrenceInterval}
                                        onChange={(e) => setRecurrenceInterval(e.target.value)}
                                        className="bg-transparent text-sm text-purple-300 border-none focus:ring-0 cursor-pointer"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                )}
                            </div>
                            <button
                                onClick={addTask}
                                className="bg-white text-black font-bold px-6 rounded-xl hover:bg-neutral-200 transition-colors active:scale-95 cursor-pointer"
                            >
                                Add
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <div className="text-center py-10 text-slate-600 border border-dashed border-slate-800 rounded-2xl">
                        No active evolution branches detected.
                    </div>
                ) : (
                    tasks.map(task => (
                        <div
                            key={task.id}
                            className={`flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl transition hover:border-slate-600 group ${task.completed ? 'opacity-50' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition cursor-pointer ${task.completed ? 'bg-purple-600 border-purple-600' : 'border-slate-700 group-hover:border-purple-500'}`}
                                >
                                    {task.completed && <span className="text-[10px] text-white">✓</span>}
                                </button>
                                <span
                                    onClick={() => toggleTask(task.id)}
                                    className={`transition cursor-pointer select-none ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}
                                >
                                    {task.title}
                                </span>
                                {task.priority && (
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${task.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                        task.priority === 'low' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                        }`}>
                                        {task.priority}
                                    </span>
                                )}
                                {task.is_recurring && (
                                    <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full flex items-center gap-1" title={task.recurrence_interval || "Recurring"}>
                                        <span>↻</span> {task.recurrence_interval}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
