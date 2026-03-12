"use client";

import axiosInstance from "@/lib/axiosInstance";
import { disableQuizLock } from "@/lib/quizLock";
import { Question, Quiz } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFullscreenQuiz } from "@/hooks/useFullSceenQuiz";


interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

interface UserAnswers {
  [key: string]: string;
}

export default function QuizClientComponent({ quiz }: { quiz: QuizWithQuestions }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<number>(quiz.timeLimit);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [, setTotalAnswered] = useState<number>(0)
  const [isSubmitModelOpen, setIsSubmitModelOpen] = useState<boolean>(false)
  const [confirmSubmmit, setConfirmSubmmit] = useState("")


  const handleSubmitQuiz = useCallback(async () => {

    if (quizSubmitted) return; 
    setQuizSubmitted(true);
    
    try {
      const res = await axiosInstance.post("/api/quiz/submit", {
        quizId: quiz.id,
        userAnswers,
        timeTaken: quiz.timeLimit - timeLeft,
      });


      toast.success("Test Submitted Successfully", { duration: 7000, style: { background: "green", color: "white" } });
     
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          
        }
      }

      disableQuizLock();
      setQuizSubmitted(true);

      router.replace(`/topic/${res.data.Quiz.topic.name.replaceAll(" ", "-")}`);



    } catch {
      toast.error("Submission Failed");
      setQuizSubmitted(false);
    }
  }, [quiz.id, userAnswers, timeLeft, router]);


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleSubmitQuiz]);

  // -------------------------------------------------------------------
  // FULLSCREEN HOOK
  // -------------------------------------------------------------------
  const { fullscreenExited, setFullscreenExited, violationCount } =
    useFullscreenQuiz(quizSubmitted, handleSubmitQuiz);

  // -------------------------------------------------------------------
  // QUESTION HANDLERS
  // -------------------------------------------------------------------
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }));

    setTotalAnswered(curr => curr + 1)

  };

  const currentQuestion: Question | null = quiz.questions[currentQuestionIndex];

  // -------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------
  if (quizSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50">
        <h1 className="text-3xl font-semibold text-gray-800">
          Quiz Submitted Successfully
        </h1>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50">
        <h1 className="text-2xl text-gray-700 animate-pulse">
          Loading questions...
        </h1>
      </div>
    );
  }

  // ------------------------------------------------------------

  const handleManualSubmit = () => {
    setIsSubmitModelOpen(true);
  };






  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-radial-[at_50%_75%] from-stone-500 via-blue-500 to-indigo-900 to-90%">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-6 py-10 px-2 md:px-10 h-full">

        {/* Main quiz area - Left */}
        <div className="flex-1 bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl shadow-xl p-8 flex flex-col h-full">
          {/* Scrollable Question Area */}
          <div className="overflow-y-auto flex-1">
            <h2
              className="text-2xl font-bold text-white mb-6 break-words"
              style={{ whiteSpace: "pre-line" }}
            >
              {currentQuestionIndex + 1}. {currentQuestion.text}
            </h2>

            <div className="flex flex-col gap-4 mb-8">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === option;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionSelect(currentQuestion.id, option)}
                    className={`flex items-center w-full rounded-lg px-6 py-5 border-2 shadow transition text-lg font-medium break-words text-left
                    ${isSelected
                        ? "bg-green-400 border-green-500 text-black"
                        : "bg-gray-700 border-gray-300 text-white hover:bg-gray-500 hover:border-green-300"
                      }`}
                  >
                    <span
                      className={`font-bold mr-5 ${isSelected ? "text-green-600" : "text-gray-400"
                        }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 break-words">{option}</span>
                    {isSelected && (
                      <span className="ml-4 bg-green-500 text-white rounded-full flex items-center justify-center w-7 h-7">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6 flex-shrink-0">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-7 py-3 rounded-xl font-semibold transition ${currentQuestionIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500 font-bold"
                }`}
            >
              ⬅️ Previous
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={isLastQuestion}
              className={`px-7 py-3 rounded-xl font-semibold transition ${isLastQuestion
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-pink-500 text-white hover:bg-pink-600 font-bold "
                }`}
            >
              Next ➡️
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-[330px] flex-shrink-0 h-full">
          <div className="bg-radial-[at_25%_25%] from-gray-500 to-zinc-900 to-75% rounded-2xl shadow-xl p-8 flex flex-col items-center h-full sticky top-8 overflow-y-auto">
            <div>
              <button
                onClick={handleManualSubmit}
                className="px-7 py-3 rounded-xl transition bg-green-500 text-white hover:bg-green-600 font-bold cursor-pointer"
              >
                Submit Test
              </button>
            </div>

            {/* Timer */}
            <div className="mt-12 p-4 w-full bg-yellow-500 rounded-xl flex flex-col items-center">
              <span className="text-2xl font-bold text-pink-700">
                {`${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
                  timeLeft % 60
                ).padStart(2, "0")}`}
              </span>
              <span className="text-sm text-gray-900">Time Remaining</span>
            </div>

            <h3 className="text-lg font-bold text-black my-5">Questions</h3>

            <div className="grid grid-cols-4 md:grid-cols-5 gap-5">
              {quiz.questions.map((q, idx) => {
                const isAnswered = !!userAnswers[q.id];
                const isActive = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`flex items-center justify-center rounded-full w-11 h-11 text-[1.05rem] font-bold border-2 focus:outline-none transition
                    ${isActive
                        ? "border-blue-600 ring-2 ring-blue-500"
                        : isAnswered
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-red-400 bg-red-400 text-white"
                      } hover:scale-105`}
                  >
                    Q{idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {fullscreenExited && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-xl px-8 py-12 text-center shadow-xl max-w-lg mx-4">
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              You left fullscreen
            </h3>
            <p className="mb-5 text-red-700 font-bold">
              The test must be taken in fullscreen. Warning {violationCount}/3.
              <br />
              After 3 violations, the test will auto-submit.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-700 transition"
                onClick={async () => {
                  try {
                    await document.documentElement.requestFullscreen();
                    setFullscreenExited(false);
                  } catch {
                    toast.error("Unable to re-enter fullscreen.");
                  }
                }}
              >
                Return to Test
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-gray-600 transition"
                onClick={() => {
                  if (
                    confirm(
                      "Are you sure you want to leave the test? Your answers will be lost. Your test will auto-submit"
                    )
                  ) {
                    disableQuizLock();
                    handleSubmitQuiz();
                    // router.back();
                  }
                }}
              >
                Leave Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {isSubmitModelOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-bold mb-3">Confirm Submission</h2>
            <p className="mb-4">
              Please type <b>confirm</b> to submit your quiz.
            </p>
            <input
              className="border p-2 w-full mb-4 rounded"
              value={confirmSubmmit}
              onChange={(e) => setConfirmSubmmit(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsSubmitModelOpen(false);
                  setConfirmSubmmit("");
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmSubmmit.toLowerCase() === "confirm") {
                    handleSubmitQuiz();
                    setIsSubmitModelOpen(false);
                    setConfirmSubmmit("");
                  } else {
                    toast.error("Please type 'confirm' to submit.");
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}