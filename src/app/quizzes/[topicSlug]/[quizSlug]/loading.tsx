
"use client";

export default function QuizSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-indigo-900 py-10 px-6 text-white animate-pulse">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-6 h-full">
     
        <div className="flex-1 bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl shadow-xl p-8 flex flex-col h-full">
         
          <div className="h-8 w-3/4 bg-gray-700 rounded mb-6" />
          
          <div className="space-y-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-14 bg-gray-700 rounded-lg w-full" />
            ))}
          </div>

          <div className="flex justify-between mt-10">
            <div className="h-10 w-28 bg-gray-600 rounded-lg" />
            <div className="h-10 w-28 bg-gray-600 rounded-lg" />
          </div>
        </div>

        
        <div className="w-full md:w-[330px] flex-shrink-0 h-full">
          <div className="bg-gradient-to-b from-gray-800 to-black rounded-2xl shadow-xl p-6 flex flex-col items-center h-full space-y-6">
            
          
            <div className="h-10 w-32 bg-green-600 rounded-lg" />

           
            <div className="h-16 w-full bg-yellow-600 rounded-lg" />

           
            <div className="grid grid-cols-5 gap-3 w-full mt-4">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-10 bg-gray-700 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

