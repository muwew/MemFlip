'use client'

import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push(`/menu`)
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-800">Thank you!</h1>

        <p className="text-xl text-gray-800 mb-6">
            Thank you for participating in our study. Your responses have been recorded. Do inform the 
            invigilator that you have completed the study and you may exit the tab.
        </p>

        <button
          onClick={() => handleBack()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-green-700"
        >
          Reset
        </button>
    </div>
  );
}
