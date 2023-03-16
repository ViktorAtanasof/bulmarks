import { useState } from 'react';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");


    const onChange = (e) => {
        setEmail(e.target.value);
    };

    return (
        <section>
            <h1 className="text-3xl text-center mt-6 font-bold">Forgot Password</h1>
            <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
                <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
                    <img
                        src="https://images.pexels.com/photos/101808/pexels-photo-101808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="key"
                        className="w-full rounded-2xl"
                    />
                </div>
                <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
                    <form>
                        <input
                            className="w-full px-4 py-2 text-xl mb-6
                                     text-gray-700 bg-white border-gray-300 
                                       rounded transition ease-in-out"
                            type="email"
                            id="email"
                            placeholder="Email address"
                            value={email}
                            onChange={onChange}
                        />
                    <button
                        className="w-full bg-slate-600 text-blue-50 px-7 py-3 
                                   text-sm font-medium uppercase rounded shadow-md
                                   hover:bg-slate-700 transition duration-150 ease-in-out
                                   active:bg-slate-800"
                        type='submit'
                    >
                        Reset password
                    </button>
                    <div
                        className="flex my-4 items-center 
                                   before:border-t before:flex-1 before:border-gray-300
                                   after:border-t after:flex-1 after:border-gray-300"
                    >
                        <p className="text-center font-semibold mx-4">OR</p>
                    </div>
                    <Link
                        to="/sign-in"
                        className="flex items-center justify-center w-full py-3 px-7
                        bg-blue-600 text-blue-50 uppercase text-sm font-medium
                        hover:bg-blue-800 transition duration-150 ease-in-out 
                        active:bg-blue-900 shadow-md rounded"
                    >
                        Go back
                    </Link>
                    </form>
                </div>
            </div>
        </section>
    );
};