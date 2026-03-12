
"use client"
import { Field, Topic } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import TopicsSkeleton from "./skeleton/AllTopicsSkeleton";

type FieldWithTopics = Field & { topics: Topic[] };

interface SpecificFieldTopicsProps {
  field: FieldWithTopics;
}

const colors = [
  "bg-red-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-pink-200",
  "bg-blue-200",
  "bg-purple-200",
  "bg-indigo-200",
  "bg-gray-200",
  "bg-teal-200",
  "bg-lime-200"
];

export default function SpecificFieldTopics({ field }: SpecificFieldTopicsProps) {

    const [searchTerm, setSearchTerm] = useState("")
    const { status } = useSession()
    

    const filteredTopics = useMemo(() => {
        if(!searchTerm) return field.topics;

        const lower = searchTerm.toLowerCase();
        return field.topics.filter((topic) =>
            topic.name.toLowerCase().includes(lower)
            
        )

    }, [searchTerm, field])

    if (status === "loading") {
        return <div>
          <TopicsSkeleton />
        </div>
      }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-fuchsia-100 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 pt-20 px-0">
      <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-fuchsia-500 to-yellow-500 dark:from-indigo-300 dark:via-fuchsia-400 dark:to-yellow-200 mb-4 text-center drop-shadow-lg">
        Explore Topics
      </h1>
      <p className="text-xl text-center text-gray-700 dark:text-gray-300 mb-8">
        Choose a topic to view its quizzes and subtopics.
      </p>

      {/* Search Box */}
      <div className="max-w-xl mx-auto mb-12">
        <input
          type="search"
          aria-label="Search topics"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-gray-800 px-5 py-3 text-gray-900 dark:text-gray-100 shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition"
        />
      </div>

      {/* Grid of Topic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full px-2 sm:px-3 md:px-4 lg:px-8 xl:px-16">
        {filteredTopics.length ? (
          filteredTopics.map((topic, index) => {
            const cardColor = colors[index % colors.length]; // cycle colors
            return (
              <Link
                href={`/topic/${topic.name.toLowerCase().replace(/\s/g, "-")}`}
                key={topic.id}
                className="group relative transform transition-all"
              >
                <div
                  className={`rounded-3xl shadow-lg hover:shadow-2xl p-8 flex flex-col items-center text-center hover:scale-[1.03] transition-all duration-300 cursor-pointer ${cardColor}`}
                >
                  <div className="bg-white/70 rounded-full p-4 mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 border shadow-lg">
                    <svg
                      className="w-10 h-10 text-gray-800 group-hover:text-fuchsia-500 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.409 9.176 5 7.5 5S4.168 5.409 3 6.253v13C4.168 18.591 5.824 18 7.5 18s3.332.409 4.5 1.253m0-13C13.168 5.409 14.824 5 16.5 5S19.832 5.409 21 6.253v13C19.832 18.591 18.176 18 16.5 18S13.168 18.409 12 19.253"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                    {topic.name}
                  </h2>
                </div>
                <span className="absolute inset-0 rounded-3xl group-hover:ring-4 group-hover:ring-fuchsia-200/50 transition-all pointer-events-none"></span>
              </Link>
            );
          })

        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No topics found matching &quot;{searchTerm}&quot;.
          </p>
        )}
      </div>
    </div>
  );
}
