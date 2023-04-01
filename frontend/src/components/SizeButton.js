export const SizeButton = ({
    onChangeSize,
    size,
}) => {
    return (
        <>
            <button
                type="button"
                id="size"
                value="small"
                onClick={onChangeSize}
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                                    hover:shadow-lg focus:shadow-lg active:shadow-lg transition
                                    duration-150 ease-in-out w-full ${size === "large"
                        ?
                        'bg-white text-black'
                        :
                        'bg-slate-600 text-white'
                    }`}
            >
                Small
            </button>
            <button
                type="button"
                id="size"
                value="large"
                onClick={onChangeSize}
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                                    hover:shadow-lg focus:shadow-lg active:shadow-lg transition
                                    duration-150 ease-in-out w-full ${size === "small"
                        ?
                        'bg-white text-black'
                        :
                        'bg-slate-600 text-white'
                    }`}
            >
                Large
            </button>
        </>
    );
};