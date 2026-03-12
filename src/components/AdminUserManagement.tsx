"use client"

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


interface User {
    id: string;
    name: string;
    email: string;
    coins: number;
    totalScore: number;
    role: string;
}

export default function AdminUserManagement() {
    const { data: session, status, update } = useSession();
    const [error, setError] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            
            if (status !== 'authenticated' || session?.user?.role !== "ADMIN") {
                
                setError("Unauthorized access. This page is for administrators only.");
                return;
            }

            try {
                
                const response = await axios.get("/api/admin/maintain-user");
                setUsers(response.data.users);
                setError(""); 
            } catch{
                setError("Unable to fetch Users. Please check the API.");
            }
        };

       
        if (status === 'authenticated') {
            getUsers();
        }
    }, [session, status]); 

    const handleRoleChange = async (user: User) => {
     
        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

        try {
            
            await axios.post("/api/admin/update-user-role", {
                userId: user.id,
                newRole: newRole,
            });

            
            await update();

          
            const response = await axios.get("/api/admin/maintain-user");
            setUsers(response.data.users);

            
            toast.success("User role updated successfully!");

        } catch{
            setError("Unable to update user Role. Please try again.");
            toast.error("Failed to update user role.");
        }
    };

    if (error) {
        return <div className="bg-red-600 text-3xl text-white font-bold p-8 rounded-lg text-center mx-auto max-w-lg mt-12">
            {error}
        </div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">All Users</h1>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white border-collapse">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-100 transition-colors">
                                <td className="py-4 px-6 whitespace-nowrap">{user.name}</td>
                                <td className="py-4 px-6 whitespace-nowrap">{user.email}</td>
                                <td className="py-4 px-6 whitespace-nowrap">{user.role}</td>
                                <td className="py-4 px-6 whitespace-nowrap">
                                    <button
                                        onClick={() => handleRoleChange(user)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
                                    >
                                        Change Role
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
