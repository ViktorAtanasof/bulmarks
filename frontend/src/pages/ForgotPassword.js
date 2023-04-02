import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import lock from '../assets/images/lock.jpg';

export const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
        }
    });

    const onSubmit = async (data) => {
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, data.email);
            toast.success('Email was sent.');
        } catch (error) {
            toast.error('Could not send reset password.');
        };
    };

    return (
        <section>
            <h1 className="text-3xl text-center mt-6 font-bold">Forgot Password</h1>
            <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
                <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
                    <img
                        src={lock}
                        alt="key"
                        className="w-full rounded-2xl"
                    />
                </div>
                <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            className={`w-full px-4 py-2 text-xl mb-4
                                     text-gray-700 bg-white border-gray-300 
                                       rounded transition ease-in-out
                                       ${errors.email && 'border-red-600 border-1'}`}
                            type="email"
                            id="email"
                            placeholder="Email address"
                            {...register('email', {
                                required: true,
                                pattern: /^[\w]+@[\w-]+\.+[\w-]{2,4}$/g,
                            })}
                        />
                        {errors.email && (
                            <div className='mb-4 px-1'>
                                {errors.email.type === 'required' && (
                                    <p className="text-red-500">Email can't be an empty string.</p>
                                )}
                                {errors.email.type === 'pattern' && (
                                    <p className="text-red-500">
                                        The email address you entered is not valid. It should be in the format <strong>username@example.com</strong>.
                                    </p>
                                )}
                            </div>
                        )}
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