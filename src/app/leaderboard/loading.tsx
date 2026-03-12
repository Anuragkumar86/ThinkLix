export default function LeaderboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 p-4 sm:p-8 animate-pulse">
  
      <header className="text-center mb-10">
        <div className="h-10 w-80 bg-yellow-400/40 rounded-lg mx-auto mb-3"></div>
        <div className="h-5 w-64 bg-gray-300/40 dark:bg-gray-600 rounded mx-auto"></div>
      </header>

      <div className="max-w-4xl mx-auto">
        
        <div className="hidden sm:block bg-white rounded-2xl shadow-2xl overflow-hidden">
         
          <div className="grid grid-cols-10 gap-2 p-4 border-b border-gray-200 bg-indigo-50">
            <div className="h-4 w-10 bg-gray-300 rounded mx-auto"></div>
            <div className="h-4 w-12 bg-gray-300 rounded mx-auto"></div>
            <div className="h-4 w-24 bg-gray-300 rounded ml-4"></div>
            <div className="h-4 w-16 bg-gray-300 rounded mx-auto col-span-2"></div>
            <div className="h-4 w-16 bg-gray-300 rounded mx-auto col-span-2"></div>
          </div>

          <div className="divide-y divide-gray-100">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-10 items-center gap-2 p-4 hover:bg-indigo-50"
              >
                <div className="col-span-1 flex justify-center">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
                <div className="col-span-1 flex justify-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                </div>
                <div className="col-span-4 pl-4">
                  <div className="h-4 w-32 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="h-4 w-16 bg-gray-300 rounded mx-auto"></div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

  
        <div className="sm:hidden space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 w-28 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="flex justify-end mt-2 sm:mt-0 ml-auto">
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
