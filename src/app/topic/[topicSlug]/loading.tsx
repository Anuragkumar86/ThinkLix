
"use client";

export default function AllSubTopicsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-indigo-900 py-16 px-6 text-white animate-pulse">
      <div className="max-w-7xl mx-auto space-y-12">
       
        <div className="text-center space-y-4">
          <div className="h-10 w-2/3 bg-gray-700 rounded-lg mx-auto" />
          <div className="h-4 w-1/2 bg-gray-600 rounded mx-auto" />
        </div>

        <div className="flex justify-center">
          <div className="h-12 w-full max-w-md bg-gray-800 rounded-xl border border-cyan-700" />
        </div>

      
        <div className="hidden md:block bg-black bg-opacity-50 border border-cyan-700 rounded-3xl shadow-xl">
          <div className="divide-y divide-gray-700">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-6 px-6 py-4"
              >
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto" />
                <div className="h-6 bg-gray-700 rounded w-20 mx-auto" />
                <div className="h-8 bg-gray-600 rounded w-28 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 md:hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl shadow-xl border border-cyan-700 bg-gray-900 bg-opacity-50 p-6 space-y-4"
            >
              <div className="h-5 w-2/3 bg-gray-700 rounded" />
              <div className="h-4 w-1/2 bg-gray-700 rounded" />
              <div className="h-4 w-1/3 bg-gray-700 rounded" />
              <div className="flex gap-3 mt-2">
                <div className="h-8 w-20 bg-gray-600 rounded" />
                <div className="h-8 w-28 bg-gray-600 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

