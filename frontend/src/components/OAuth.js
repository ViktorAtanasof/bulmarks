import { FcGoogle } from 'react-icons/fc';

export const OAuth = () => {
    return (
        <button className="flex items-center justify-center w-full py-3 px-7
                         bg-red-700 text-blue-50 uppercase text-sm font-medium
                         hover:bg-red-800 transition duration-150 ease-in-out 
                         active:bg-red-900 shadow-md rounded">
            <FcGoogle className="text-2xl bg-blue-50 rounded-full mr-2" />
            Continue with Google
        </button>
    );
};