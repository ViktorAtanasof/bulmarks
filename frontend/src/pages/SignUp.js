import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '../firebase';
import { serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { OAuth } from '../components/OAuth';

import lock from '../assets/images/lock.jpg';


export const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    
    const { username, email, password } = formData;
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const onClickPasswordIcon = () => {
        setShowPassword((prevState) => !prevState);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const trimmedUsername = username.split(' ').join('');
            updateProfile(auth.currentUser, {
                displayName: trimmedUsername,
            })
            const user = userCredentials.user;
            const formDataCopy = {...formData};
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, "users", user.uid), formDataCopy);
            navigate("/");
        } catch(error) {
            toast.error("Something went wrong.")
        }
    }

    return (
        <section>
            <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
            <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
                <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
                    <img
                        src={lock}
                        alt="key"
                        className="w-full rounded-2xl"
                    />
                </div>
                <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
                    <form onSubmit={onSubmit}>
                        <input
                            className="w-full px-4 py-2 text-xl mb-6
                                     text-gray-700 bg-white border-gray-300 
                                       rounded transition ease-in-out"
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={onChange}
                        />
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
                        <div className="relative mb-6">
                            <input
                                className="w-full px-4 py-2 text-xl 
                                     text-gray-700 bg-white border-gray-300 
                                       rounded transition ease-in-out"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={onChange}
                            />
                            {showPassword ? (
                                <AiFillEyeInvisible
                                    className="absolute right-3 top-3 text-xl cursor-pointer"
                                    onClick={onClickPasswordIcon}
                                />
                            ) : (
                                <AiFillEye
                                    className="absolute right-3 top-3 text-xl cursor-pointer"
                                    onClick={onClickPasswordIcon}
                                />
                            )}
                        </div>
                        <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
                            <p className="mb-6">Have an account?
                                <Link
                                    to="/sign-in"
                                    className="text-green-600 hover:text-green-700 hover:underline ml-1"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                        <button
                            className="w-full bg-slate-600 text-blue-50 px-7 py-3 
                                   text-sm font-medium uppercase rounded shadow-md
                                   hover:bg-slate-700 transition duration-150 ease-in-out
                                   active:bg-slate-800"
                            type='submit'
                        >
                            Sign up
                        </button>
                        <div
                            className="flex my-4 items-center 
                                   before:border-t before:flex-1 before:border-gray-300
                                   after:border-t after:flex-1 after:border-gray-300"
                        >
                            <p className="text-center font-semibold mx-4">OR</p>
                        </div>
                        <OAuth />
                    </form>
                </div>
            </div>
        </section>
    );
};