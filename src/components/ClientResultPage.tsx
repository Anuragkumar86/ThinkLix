"use client"

import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import axiosInstance from '@/lib/axiosInstance';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface QuizAttemptWithData {
  id: string;
  score: number;
  timeTaken: number;
  userAnswers: Record<string, string>;
  createdAt: Date;
  quiz: {
    title: string;
    questions: {
      id: string;
      text: string;
      options: string[];
      correctAnswer: string;
    }[];
  };
}

async function fetchQuizAttempt(attemptId: string) {
  try {
    const response = await axiosInstance.get(`/api/quiz-attempt/${attemptId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch quiz attempt:", error);
    return null;
  }
}

interface ClientResultsPageProps {
  attemptId: string;
}

export default function ClientResultsPage({ attemptId }: ClientResultsPageProps) {
  const [quizAttempt, setQuizAttempt] = useState<QuizAttemptWithData | null>(null);
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<{ [key: string]: string }>({});
  const [loadingExplanation, setLoadingExplanation] = useState<string | null>(null);
  const [, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchQuizAttempt(attemptId);
        setQuizAttempt(data);
      } catch{
        setError("Failed to load quiz data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [attemptId]);


  // AI EXPLANATION LOGIC-----------------------------------------
  const getExplanation = async (
    questionText: string,
    questionId: string,
    options: string[],
    userAnswer: string
  ) => {

    if (!session || !session.user || !session.user.id) {
      
      console.error("You must be logged in to use this feature.");
      
      return;
    }

    const userId = session.user.id;
    setLoadingExplanation(questionId);
    setError(null);
    try {

      const response = await axiosInstance.post('/api/ai/explain', {
        question: questionText,
        options: options,
        userAnswer: userAnswer,
        userId: userId
      });
      setExplanation(prev => ({ ...prev, [questionId]: response.data.explanation }));
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        const backendMessage = err.response?.data?.message || "Failed to get explanation.";
        setError(backendMessage);
        toast.error(backendMessage);
      } else {
        setError("Unexpected error occurred.");
        toast.error("Unexpected error occurred.");
      }
    }
    finally {
      setLoadingExplanation(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
      </div>
    );
  }

  if (!quizAttempt) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Quiz Attempt Not Found</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Please check the URL and try again.</p>
      </div>
    );
  }

  const { score, timeTaken, userAnswers, quiz } = quizAttempt;
  const totalQuestions = quiz.questions.length;
  const isPass = score > totalQuestions / 2;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header and Summary Card */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
            Quiz Results
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Performance summary for: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{quiz.title}</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {/* Score Card */}
            <div className="bg-indigo-50 dark:bg-gray-700 p-5 rounded-xl">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Score</p>
              <p className="mt-1 text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {score} / {totalQuestions}
              </p>
            </div>

            {/* Status Card */}
            <div className={`p-5 rounded-xl ${isPass ? 'bg-green-50' : 'bg-red-50'} dark:bg-gray-700`}>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
              <p className={`mt-1 text-2xl font-bold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                {isPass ? 'Pass' : 'Fail'}
              </p>
            </div>

            {/* Time Taken Card */}
            <div className="bg-blue-50 dark:bg-gray-700 p-5 rounded-xl">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Taken</p>
              <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                {timeTaken}s
              </p>
            </div>
          </div>
        </div>

        {/* Individual Question Results */}
        <div className="space-y-8">
          {quiz.questions.map((question, index) => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            const statusColor = isCorrect ? 'bg-green-50 dark:bg-green-900/40' : 'bg-red-50 dark:bg-red-900/40';
            const borderColor = isCorrect ? 'border-green-400' : 'border-red-400';
            const userIcon = isCorrect ? '✅' : '❌';

            return (
              <div
                key={question.id}
                className={`p-6 sm:p-8 rounded-2xl shadow-sm border-2 ${borderColor} ${statusColor} transition-colors duration-200`}
              >
                <div className="flex items-start mb-4">
                  <span className="text-2xl mr-4">{userIcon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl sm:text-2xl text-gray-800 dark:text-gray-100 leading-relaxed">
                      {index + 1}. {question.text}
                    </h3>
                  </div>
                </div>

                <ul className="space-y-3 pl-10">
                  {question.options.map((option, optIndex) => {
                    const isUserSelected = option === userAnswer;
                    const isCorrectAnswer = option === question.correctAnswer;

                    const optionBg = isCorrectAnswer
                      ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100'
                      : isUserSelected && !isCorrect
                        ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';

                    const optionBorder = isUserSelected && !isCorrect ? 'border-red-500' : 'border-transparent';

                    return (
                      <li
                        key={optIndex}
                        className={`
                          relative p-3 rounded-lg border-2 ${optionBorder} transition-colors duration-200
                          ${optionBg}
                        `}
                      >
                        <span className="font-semibold">{String.fromCharCode(65 + optIndex)}. </span>
                        {option}
                        {isCorrectAnswer && <span className="absolute top-1/2 right-3 -translate-y-1/2 text-2xl">✔️</span>}
                        {isUserSelected && !isCorrect && <span className="absolute top-1/2 right-3 -translate-y-1/2 text-2xl">❌</span>}
                      </li>
                    );
                  })}
                </ul>

                {!isCorrect && (
                  <p className="mt-5 text-md text-red-700 dark:text-red-300 font-medium pl-10">
                    You chose: <span className="font-bold">{userAnswer}</span>
                  </p>
                )}
                {isCorrect && (
                  <p className="mt-5 text-md text-green-700 dark:text-green-300 font-medium pl-10">
                    You chose the correct answer.
                  </p>
                )}

                {/* AI EXLANATION LOGIC----------------------------------- */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => getExplanation(
                      question.text,
                      question.id,
                      question.options,
                      userAnswers[question.id]
                    )}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loadingExplanation === question.id}
                  >
                    {loadingExplanation === question.id ? (
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    ) : (
                      <Sparkles className="h-5 w-5 mr-2" />
                    )}
                    {loadingExplanation === question.id ? 'Loading...' : 'Summarize with AI'}
                  </button>
                </div>

                {explanation[question.id] && (
                  <div className="mt-6 p-4 rounded-xl bg-gray-100 dark:bg-gray-900 border-l-3 border-green-500 text-gray-700 dark:text-gray-300 shadow-2xl text-lg">
                    {/* Use ReactMarkdown to render the formatted explanation */}
                    <ReactMarkdown>
                      {explanation[question.id]}
                    </ReactMarkdown>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}