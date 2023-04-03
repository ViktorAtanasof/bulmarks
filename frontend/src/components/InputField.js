export const InputField = ({
    label,
    name,
    placeholder,
    register,
    errors,
    minLength,
    maxLength,
    required,
    type,
}) => {
    return (
        <>
            <label htmlFor={name} className="text-lg font-semibold block">
                {label}
            </label>
            <input
                type={type}
                id={name}
                placeholder={placeholder}
                {...register(name, {
                    required: required,
                    minLength: minLength,
                    maxLength: maxLength,
                })}
                className={`w-full px-4 py-2 text-xl 
                      text-gray-700 bg-white border border-gray-300 
                      rounded transition duration-150 ease-in-out focus:text-gray-700
                      focus:bg-white focus:border-slate-600 mb-4
                      ${errors[name] && 'border-red-600 border-1'}`}
            />
            {errors[name] && (
                <div className="mb-4">
                    {errors[name].type === 'required' && (
                        <p className="text-red-500">{placeholder} can't be an empty string.</p>
                    )}
                    {errors[name].type === 'minLength' && (
                        <p className="text-red-500">
                            {placeholder} must be at least {minLength} characters long.
                        </p>
                    )}
                    {errors[name].type === 'maxLength' && (
                        <p className="text-red-500">
                            {placeholder} must be less than {maxLength} characters long.
                        </p>
                    )}
                </div>
            )}
        </>
    );
};


/* 
import React from 'react';

function InputField(props) {
  return (
    <>
      <label htmlFor={name} className="text-lg font-semibold block">
        {label}
      </label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        {...register(name, {
          required: required,
          minLength: minLength,
          maxLength: maxLength,
        })}
        className={`w-full px-4 py-2 text-xl 
                    text-gray-700 bg-white border border-gray-300 
                    rounded transition duration-150 ease-in-out focus:text-gray-700
                    focus:bg-white focus:border-slate-600 mb-4
                    ${errors[name] && 'border-red-600 border-1'}`}
      />
      {errors[name] && (
        <div className="mb-4">
          {errors[name].type === 'required' && (
            <p className="text-red-500">{label} can't be an empty string.</p>
          )}
          {errors[name].type === 'minLength' && (
            <p className="text-red-500">
              {label} must be at least {minLength} characters long.
            </p>
          )}
          {errors[name].type === 'maxLength' && (
            <p className="text-red-500">
              {label} must be less than {maxLength} characters long.
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default InputField; */




/* 
<main className="max-w-md px-2 mx-auto">
  <h1 className="text-3xl text-center mt-6 font-bold">Edit Landmark</h1>
  <form onSubmit={handleSubmit(onSubmit)}>
    <p className="text-lg mt-6 font-semibold">Small / Large</p>
    <div className="flex">
      <SizeButton onChangeSize={onChangeSize} size={size} />
    </div>
    <InputField
      label="Name"
      name="name"
      placeholder="Name"
      register={register}
      errors={errors}
      minLength={5}
      maxLength={80}
      required={true}
      type="text"
    />
    <InputField
      label="Type"
      name="type"
      placeholder="Type"
      register={register}
      errors={errors}
      minLength={5}
      maxLength={30}
      required={true}
      type="text"
    />
  </form>
</main> */
