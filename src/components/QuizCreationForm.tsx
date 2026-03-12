"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";


interface QuestionData {
    text: string;
    options: string[];
    correctAnswer: string;
}


interface QuizPayload {
    fieldName: string;
    topicName: string;
    quizTitle: string;
    quizDescription: string;
    quizTimeLimit: number;
    questions: QuestionData[];
}

export default function QuizCreationForm() {

    const [formData, setFormData] = useState<QuizPayload>({
        fieldName: "",
        topicName: "",
        quizTitle: "",
        quizDescription: "",
        quizTimeLimit: 0,
        questions: [],
    });

    const [bulkQuestions, setBulkQuestions] = useState("");


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

   
    const handleQuizChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "quizTimeLimit" ? parseInt(value, 10) : value,
        });
    };

    
    const handleBulkImport = () => {
        
        const questionBlocks = bulkQuestions.split("---").filter(block => block.trim() !== "");

        const newQuestions: QuestionData[] = [];

        for (const block of questionBlocks) {
           
            const parts = block.split("|").map(part => part.trim());

            if (parts.length >= 6) { 
                const [text, ...options] = parts;
                const correctAnswer = options.pop() || "";
                newQuestions.push({
                    text,
                    options,
                    correctAnswer
                });
            } else {
                toast.error(`Invalid format in one of the question blocks.`);
                return;
            }
        }

        setFormData({
            ...formData,
            questions: [...formData.questions, ...newQuestions],
        });
        setBulkQuestions("");
        toast.success(`${newQuestions.length} questions added successfully!`);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.questions.length === 0) {
            toast.error("Please add at least one question.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.post("/api/admin/create-quiz", formData);
            toast.success("Quiz created successfully!");
            setFormData({
                fieldName: "",
                topicName: "",
                quizTitle: "",
                quizDescription: "",
                quizTimeLimit: 0,
                questions: [],
            });
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                const errorMessage = err.response?.data?.message || "Failed to create quiz.";
                setError(errorMessage);
                toast.error(errorMessage);
            }
            const errorMessage = "Failed to create quiz.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-400 rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Create a New Quiz</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="fieldName" className="block text-gray-700 font-medium mb-2">Field Name</label>
                        <input
                            type="text"
                            id="fieldName"
                            name="fieldName"
                            value={formData.fieldName}
                            onChange={handleQuizChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., JavaScript Fundamentals"
                        />
                    </div>

                    <div>
                        <label htmlFor="topicName" className="block text-gray-700 font-medium mb-2">Topic Name</label>
                        <input
                            type="text"
                            id="topicName"
                            name="topicName"
                            value={formData.topicName}
                            onChange={handleQuizChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., JavaScript Fundamentals"
                        />
                    </div>
                    <div>
                        <label htmlFor="quizTitle" className="block text-gray-700 font-medium mb-2">Quiz Title</label>
                        <input
                            type="text"
                            id="quizTitle"
                            name="quizTitle"
                            value={formData.quizTitle}
                            onChange={handleQuizChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., ES6 Features Quiz"
                        />
                    </div>
                    <div>
                        <label htmlFor="quizDescription" className="block text-gray-700 font-medium mb-2">Quiz Description</label>
                        <textarea
                            id="quizDescription"
                            name="quizDescription"
                            value={formData.quizDescription}
                            onChange={handleQuizChange}
                            required
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="A brief description of the quiz..."
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="quizTimeLimit" className="block text-gray-700 font-medium mb-2">Time Limit (in seconds)</label>
                        <input
                            type="number"
                            id="quizTimeLimit"
                            name="quizTimeLimit"
                            value={formData.quizTimeLimit}
                            onChange={handleQuizChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 600 (for 10 minutes)"
                        />
                    </div>
                </div>

                <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Bulk Question Import</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Paste your questions here using the format: <br />
                        **Question text | Option 1 | Option 2 | Option 3 | Option 4 | Correct Answer**<br />
                        Separate each question with three dashes: **---**
                    </p>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono"
                        rows={10}
                        value={bulkQuestions}
                        onChange={(e) => setBulkQuestions(e.target.value)}
                        placeholder="Paste your questions here..."
                    ></textarea>
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={handleBulkImport}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-md"
                        >
                            Import Questions
                        </button>
                    </div>
                </div>

                {/* Display a preview of added questions */}
                {formData.questions.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Added Questions ({formData.questions.length})</h2>
                        <ul className="list-disc pl-5 text-left">
                            {formData.questions.map((q, index) => (
                                <li key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                                    <p className="font-medium text-gray-800">Q{index + 1}: {q.text}</p>
                                    <p className="text-sm text-gray-600 mt-2">Correct Answer: {q.correctAnswer}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`py-4 px-10 rounded-full text-white font-bold transition-all duration-200 shadow-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                    >
                        {loading ? "Creating Quiz..." : "Create Quiz"}
                    </button>
                </div>
            </form>
        </div>
    );
}
