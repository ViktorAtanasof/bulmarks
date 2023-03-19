import { useState } from "react";

export const CreateLandmark = () => {
    const [formData, setFormData] = useState({
        size: "large",
        name: "",
        type: "",
        place: "",
        address: "",
        description: "",
    });

    const {
        size,
        name,
        type,
        place,
        address,
        description,
    } = formData;

    const onChange = (e) => {
        //Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }));
        };
        //Text
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: e.target.value,
            }));
        };
    };

    return (
        <main className="max-w-md px-2 mx-auto">
            <h1 className="text-3xl text-center mt-6 font-bold">Mark a Landmark</h1>
            <form>
                <p className="text-lg mt-6 font-semibold">Small / Large</p>
                <div className="flex">
                    <button
                        type="button"
                        id="size"
                        value="small"
                        onClick={onChange}
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
                        onClick={onChange}
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
                </div>
                <label htmlFor="name" className="text-lg mt-6 font-semibold block">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Name"
                    minLength={"5"}
                    maxLength={"80"}
                    required
                    className="w-full px-4 py-2 text-xl 
                        text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700
                        focus:bg-white focus:border-slate-600 mb-6"
                />
                <label htmlFor="type" className="text-lg font-semibold block">Type</label>
                <input
                    type="text"
                    id="type"
                    value={type}
                    onChange={onChange}
                    placeholder="Type"
                    minLength={"5"}
                    maxLength={"30"}
                    required
                    className="w-full px-4 py-2 text-xl 
                        text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700
                        focus:bg-white focus:border-slate-600 mb-6"
                />
                <label htmlFor="place" className="text-lg font-semibold block">City / Town / Village</label>
                <input
                    type="text"
                    id="place"
                    value={place}
                    onChange={onChange}
                    placeholder="Location"
                    minLength={"5"}
                    maxLength={"20"}
                    required
                    className="w-full px-4 py-2 text-xl 
                        text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700
                        focus:bg-white focus:border-slate-600 mb-6"
                />
                <label htmlFor="address" className="text-lg font-semibold block">Address</label>
                <textarea
                    type="text"
                    id="address"
                    value={address}
                    onChange={onChange}
                    placeholder="Address"
                    required
                    className="w-full px-4 py-2 text-xl 
                        text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700
                        focus:bg-white focus:border-slate-600 mb-6"
                />
                <label htmlFor="description" className="text-lg font-semibold block">Description</label>
                <textarea
                    type="text"
                    id="description"
                    value={description}
                    onChange={onChange}
                    placeholder="Description"
                    required
                    className="w-full px-4 py-2 text-xl 
                        text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700
                        focus:bg-white focus:border-slate-600 mb-6"
                />
                <div className="mb-6">
                    <label htmlFor="images" className="text-lg font-semibold block">Images</label>
                    <p className="text-gray-600">The first image will be the cover (max 6 images)</p>
                    <input
                        type="file"
                        id="images"
                        onChange={onChange}
                        accept=".jpg,.png,.jpeg"
                        multiple
                        required
                        className="w-full px-3 py-1.5 text-gray-700 bg-white border 
                            border-gray-300 rounded transition duration-150 ease-in-out
                            focus:bg-white focus:border-slate-600"
                    />
                </div>
                <button
                    type="submit"
                    className="mb-6 w-full px-7 py-3 bg-green-600 text-white
                               font-medium text-sm uppercase rounded shadow-md
                               hover:bg-green-700 transition duration-150 ease-in-out
                               active:bg-green-800"
                >
                    Mark Landmark
                </button>
            </form>
        </main>
    );
};