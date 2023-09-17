export const InputField = ({
    label,
    name,
    placeholder,
    register,
    errors,
    minLength,
    maxLength,
    required,
}) => {
    return (
        <>
            <label htmlFor={name} className="text-lg font-semibold block">
                {label}
            </label>
            <input
                type="text"
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