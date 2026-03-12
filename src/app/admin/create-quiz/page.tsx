

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"
import QuizCreationForm from "@/components/QuizCreationForm";


export default async function CreateQuizPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return redirect("/admin");
    }

    return (
        <div className="container mx-auto px-4 py-12 text-center bg-gray-300 min-h-screen">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                Create a New Quiz
            </h1>
            <p className="text-xl text-gray-700 mb-8">
                Build your quiz by adding a topic, details, and questions.
            </p>
            <div className="w-full max-w-4xl mx-auto">
               
                <QuizCreationForm />
            </div>
        </div>
    );
}
