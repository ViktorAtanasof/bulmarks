import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { OAuth } from "../components/OAuth";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { AuthFormData } from "../types/authTypes";

import lock from "../assets/images/lock.jpg";

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/");
    } catch (error) {
      toast.error("Bad user credentials");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold text-secondary-color">
        Sign In
      </h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="relative md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img src={lock} alt="padlock" className="w-full rounded-2xl" />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 
                                    -translate-y-1/2 bg-[#f0f6ffdb] rounded p-5 md:p-10 lg:p-10"
          >
            <h3 className="font-bold my-2">FOR DEMO</h3>
            <p className="whitespace-nowrap">
              Email:{" "}
              <span className="font-medium text-blue-600">admin@gmail.com</span>
            </p>
            <p>
              Password:{" "}
              <span className="font-medium text-blue-600">123456</span>
            </p>
          </div>
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className={`w-full px-4 py-2 text-xl mb-4
              text-secondary-color bg-white dark:bg-ldark-color border border-gray-300 
              rounded transition duration-150 ease-in-out focus:text-accent-color
              focus:outline-none focus:ring-0 focus:border-accent-color dark:placeholder-gray-300
                                       ${
                                         errors.email &&
                                         "border-red-600 border-1 dark:border-2"
                                       }`}
              type="email"
              id="email"
              placeholder="Email address"
              {...register("email", {
                required: true,
                pattern: /^[\w]+@[\w-]+\.+[\w-]{2,4}$/g,
              })}
            />
            {errors.email && (
              <div className="mb-4 px-1">
                {errors.email.type === "required" && (
                  <p className="text-red-500">
                    Email can't be an empty string.
                  </p>
                )}
                {errors.email.type === "pattern" && (
                  <p className="text-red-500">
                    The email address you entered is not valid. It should be in
                    the format <strong>username@example.com</strong>.
                  </p>
                )}
              </div>
            )}
            <div className="relative">
              <input
                className={`w-full px-4 py-2 text-xl mb-4
                text-secondary-color bg-white dark:bg-ldark-color border border-gray-300 
                rounded transition duration-150 ease-in-out focus:text-accent-color
                focus:outline-none focus:ring-0 focus:border-accent-color dark:placeholder-gray-300
                                       ${
                                         errors.password &&
                                         "border-red-600 border-1 dark:border-2"
                                       }`}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                {...register("password", {
                  required: true,
                  minLength: 6,
                  maxLength: 20,
                })}
              />
              {errors.password && (
                <div className="mb-4 px-1">
                  {errors.password.type === "required" && (
                    <p className="text-red-500">
                      Password can't be an empty string.
                    </p>
                  )}
                  {errors.password.type === "minLength" && (
                    <p className="text-red-500">
                      Password must be at least 6 characters long.
                    </p>
                  )}
                  {errors.password.type === "maxLength" && (
                    <p className="text-red-500">
                      Password must be less than 20 characters long.
                    </p>
                  )}
                </div>
              )}
              {showPassword ? (
                <AiFillEyeInvisible
                  className="absolute right-3 top-3 text-xl cursor-pointer text-accent-color"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <AiFillEye
                  className="absolute right-3 top-3 text-xl cursor-pointer text-accent-color"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg text-secondary-color">
              <p className="mb-6">
                Don't have an account?
                <Link
                  to="/sign-up"
                  className=" text-accent-color hover:text-[#209475cb] hover:underline ml-1"
                >
                  Sign up
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <button
              className="w-full bg-slate-600 text-blue-50 px-7 py-3 
                                   text-sm font-medium uppercase rounded shadow-md
                                   hover:bg-slate-700 transition duration-150 ease-in-out
                                   active:bg-slate-800"
              type="submit"
            >
              Sign in
            </button>
            <div
              className="flex my-4 items-center 
                                   before:border-t before:flex-1 before:border-gray-300
                                   after:border-t after:flex-1 after:border-gray-300"
            >
              <p className="text-center font-semibold mx-4 text-secondary-color">
                OR
              </p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};
