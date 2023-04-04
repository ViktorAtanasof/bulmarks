import { Link } from "react-router-dom";

export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-blue-50 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-700 sm:text-4xl lg:text-5xl">
                404 Not Found
            </h1>
            <p className="max-w-md mt-4 text-center text-gray-500 sm:text-lg lg:text-xl sm:mt-6 lg:mt-8">
                The page you are looking for does not exist.
            </p>
            <Link
                to="/"
                className="inline-block px-6 py-3 mt-8 text-lg 
                font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
                Go back to home
            </Link>
        </div>
    );
};