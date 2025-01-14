'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Stage1Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const choice = searchParams.get('choice'); // Get the selected choice from query params

    const images = {
        Choice1: [
          { src: '/images/choice1/c1.png', caption: 'Tonga' },
          { src: '/images/choice1/c2.png', caption: 'Somalia' },
          { src: '/images/choice1/c3.png', caption: 'Bulgaria' },
          { src: '/images/choice1/c4.png', caption: 'Vietnam' },
          { src: '/images/choice1/c5.png', caption: 'Madagascar' },
          { src: '/images/choice1/c6.png', caption: 'Canada' },
        ],
        Choice2: [
          { src: '/images/choice2/c1.png', caption: 'Marill' },
          { src: '/images/choice2/c2.png', caption: 'Charizard' },
          { src: '/images/choice2/c3.png', caption: 'Bellsprout' },
          { src: '/images/choice2/c4.png', caption: 'Skuntank' },
          { src: '/images/choice2/c5.png', caption: 'Turtonator' },
          { src: '/images/choice2/c6.png', caption: 'Glalie' },
        ],
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Stage Page</h1>
        <p className="text-lg text-gray-600">
            Selected Choice: <span className="font-bold text-gray-900">{choice}</span>
        </p>
        <p className="text-gray-500 mt-4">This page is empty for now. More details coming soon.</p>
        </div>
    );
}
