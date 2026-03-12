export default function FieldSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-fuchsia-100 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 py-12 px-0 animate-pulse">
    
      <div className="h-12 w-72 bg-gradient-to-r from-indigo-200 via-fuchsia-200 to-yellow-200 dark:from-indigo-700 dark:via-fuchsia-600 dark:to-yellow-400 rounded-lg mx-auto mb-4"></div>
     
      <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-8"></div>

      <div className="max-w-xl mx-auto mb-12">
        <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl shadow-md"></div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full px-2 sm:px-3 md:px-4 lg:px-8 xl:px-16">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl shadow-lg p-8 flex flex-col items-center text-center bg-gray-200 dark:bg-gray-800"
          >
            <div className="bg-white/60 dark:bg-gray-700 rounded-full p-6 mb-4 border shadow-lg w-20 h-20"></div>
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
