import prisma from "@/lib/prisma";
import AllQuizzesTopics from "@/components/AllQuizzesTopics";
import { Prisma, Topic } from "@prisma/client";

async function getTopics() {
  return prisma.topic.findMany({
    orderBy: { name: "asc" },
  });
}

export default async function QuizzesPage() {
  let topics: Topic[] | null = null;
  let errorMessage: string | null = null;

  try {
    topics = await getTopics();
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P1001') {
      errorMessage = "Our database is currently unavailable. Please check back soon.";
    } else {
      console.error("Failed to fetch topics:", err);
      errorMessage = "An unexpected error occurred. Please try refreshing the page.";
    }
  }

  
  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Server Unavailable
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg">
          {errorMessage}
        </p>
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          No quizzes found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg">
          There are no quiz topics available at this time.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AllQuizzesTopics topics={topics} />
    </div>
  );
}
