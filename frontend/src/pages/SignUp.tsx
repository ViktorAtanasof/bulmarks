import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { OAuth } from "../components/OAuth";
import { useForm } from "react-hook-form";
import { AuthFormData } from "../types/authTypes";

import lock from "../assets/images/lock.jpg";

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredentials.user;
      const { password, ...formDataCopy } = data;
      formDataCopy.timestamp = serverTimestamp();
      formDataCopy.favourites = [];

      await setDoc(doc(db, "users", user.uid), formDataCopy);

      updateProfile(user, {
        displayName: data.username?.replace(/\s/g, ""),
      });

      navigate("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold text-secondary-color">
        Sign Up
      </h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img src={lock} alt="key" className="w-full rounded-2xl" />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className={`w-full px-4 py-2 text-xl mb-4
              text-secondary-color bg-white dark:bg-ldark-color border border-gray-300 
              rounded transition duration-150 ease-in-out focus:text-accent-color
              focus:outline-none focus:ring-0 focus:border-accent-color dark:placeholder-gray-300
                                       ${
                                         errors.username &&
                                         "border-red-600 border-1 dark:border-2"
                                       }`}
              type="text"
              id="username"
              placeholder="Username"
              {...register("username", {
                required: true,
                minLength: 3,
                maxLength: 20,
              })}
            />
            {errors.username && (
              <div className="mb-4 px-1">
                {errors.username.type === "required" && (
                  <p className="text-red-500">
                    Username can't be an empty string.
                  </p>
                )}
                {errors.username.type === "minLength" && (
                  <p className="text-red-500">
                    Username must be at least 3 characters long.
                  </p>
                )}
                {errors.username.type === "maxLength" && (
                  <p className="text-red-500">
                    Username must be less than 20 characters long.
                  </p>
                )}
              </div>
            )}
            <input
              className={`w-full px-4 py-2 text-xl mb-4
              text-secondary-color bg-white dark:bg-ldark-color border border-gray-300 
              rounded transition duration-150 ease-in-out focus:text-accent-color
              focus:outline-none focus:ring-0 focus:border-accent-color dark:placeholder-gray-300
                                       ${
                                         errors.email &&
                                         "border-red-600 border-1 dark:border-2"
                                       }`}
              type="text"
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
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6 text-secondary-color">
                Have an account?
                <Link
                  to="/sign-in"
                  className="text-accent-color hover:text-[#03cb96ce] hover:underline ml-1"
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
              type="submit"
            >
              Sign up
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
