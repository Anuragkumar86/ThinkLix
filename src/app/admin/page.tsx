import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminUserManagement from "@/components/AdminUserManagement";
import Link from "next/link"; 

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Access Denied
                    </h1>
                    <p className="text-lg text-gray-400">
                        You do not have permission to view this page.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Redirecting to the homepage...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 text-center bg-gray-50 min-h-screen">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                Admin Dashboard
            </h1>
            <p className="text-xl text-gray-700">
                Manage users and create new quizzes from here.
            </p>

            <div className="mt-12 w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Quiz Management
                </h2>
                <p className="text-gray-600 mb-6">
                    Create new topics and questions for your quizzes.
                </p>
                <Link href="/admin/create-quiz">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-md cursor-pointer">
                        Create New Quiz
                    </button>
                </Link>
            </div>

            <div className="mt-12 w-full max-w-6xl mx-auto">
                <AdminUserManagement />
            </div>
        </div>
    );
}
