'use client';

import { useRouter } from "next/navigation";  

export default function ExitButton() {
    const router = useRouter();

    // logic to handle exit button
    const handleExit = () => {
        router.push("/menu");
    };

    return (
        <button onClick={handleExit}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
        >Exit</button>
    );
}