import { useState } from "react";
import { toast } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { handleGeolocation } from "../utils/handleGeolocation";
import { storeImage } from "../services/storageService";
import { SizeButton } from "../components/SizeButton";
import { InputField } from "../components/InputField";
import { AiOutlineInfoCircle } from 'react-icons/ai';

export const CreateLandmark = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState('large');
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            size: "large",
            name: "",
            type: "",
            place: "",
            address: "",
            description: "",
            latitude: 0,
            longitude: 0,
            images: {},
        }
    });

    const onChangeSize = (e) => {
        setValue('size', e.target.value);
        const newSize = watch('size');
        setSize(newSize);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        if (data.images?.length > 6) {
            setLoading(false);
            toast.error('Maximum 6 images are allowed.');
            return;
        };

        let geolocation;
        let location;
        if (geolocationEnabled) {
            const result = await handleGeolocation(data);
            geolocation = result.geolocation;
            location = result.location;
            if (location === undefined) {
                setLoading(false);
                toast.error('Please enter a correct address.');
                return;
            };
        } else {
            geolocation = { lat: data.latitude, lng: data.longitude };
        };

        const imgUrls = await Promise.all(
            [...data.images].map((img) => storeImage(img))
        ).catch((error) => {
            setLoading(false);
            toast.error('Images not uploaded.');
            return;
        });

        const formDataCopy = {
            ...data,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,
            likes: [],
        };
        delete formDataCopy.images;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;

        const docRef = await addDoc(collection(db, 'landmarks'), formDataCopy);
        setLoading(false);
        toast.success('Landmark added succesfully.');
        navigate(`/category/${formDataCopy.size}/${docRef.id}`);
    };

    if (loading) {
        return <Spinner />
    }

    return (
        <main className="max-w-md px-2 mx-auto">
            <h1 className="text-3xl text-center mt-6 font-bold">Mark a Landmark</h1>
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
                <InputField
                    label="City / Town / Village"
                    name="place"
                    placeholder="Location"
                    register={register}
                    errors={errors}
                    minLength={4}
                    maxLength={20}
                    required={true}
                    type="text"
                />
                <label htmlFor="address" className="text-lg font-semibold block">Address</label>
                <textarea
                    type="text"
                    id="address"
                    {...register('address', {
                        required: true,
                    })}
                    placeholder="Address"
                    className={`w-full px-4 py-2 text-xl 
                        text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700
                        focus:bg-white focus:border-slate-600 mb-4
                        ${errors.address && 'border-red-600 border-1'}`}
                />
                {errors.address && (
                    <div className='mb-4'>
                        {errors.address.type === 'required' && (
                            <p className="text-red-500">Address can't be an empty string.</p>
                        )}
                    </div>
                )}
                {!geolocationEnabled && (
                    <div className="flex space-x-6 justify-start mb-6">
                        <div>
                            <label htmlFor="latitude" className="text-lg font-semibold block">Latitude</label>
                            <input
                                type="number"
                                id="latitude"
                                {...register('latitude', {
                                    required: true,
                                })}
                                min="-90"
                                max="90"
                                className="w-full px-4 py-2 text-xl 
                             text-gray-700 bg-white border border-gray-300 
                             rounded transition duration-150 ease-in-out focus:text-gray-700
                             focus:bg-white focus:border-slate-600 text-center"
                            />
                        </div>
                        <div>
                            <label htmlFor="longitude" className="text-lg font-semibold block">Longitude</label>
                            <input
                                type="number"
                                id="longitude"
                                {...register('longitude', {
                                    required: true,
                                })}
                                min="-180"
                                max="180"
                                className="w-full px-4 py-2 text-xl 
                             text-gray-700 bg-white border border-gray-300 
                             rounded transition duration-150 ease-in-out focus:text-gray-700
                             focus:bg-white focus:border-slate-600 text-center "
                            />
                        </div>
                    </div>
                )}
                <label htmlFor="description" className="text-lg font-semibold block">Description</label>
                <textarea
                    type="text"
                    id="description"
                    {...register('description', {
                        required: true,
                        minLength: 3,
                        maxLength: 600,
                    })}
                    placeholder="Description"
                    className={`w-full px-4 py-2 text-xl 
                        text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700
                        focus:bg-white focus:border-slate-600 mb-4
                        ${errors.description && 'border-red-600 border-1'}`}
                />
                {errors.description && (
                    <div className='mb-4'>
                        {errors.description.type === 'required' && (
                            <p className="text-red-500">Description can't be an empty string.</p>
                        )}
                        {errors.description.type === 'minLength' && (
                            <p className="text-red-500">Description must be at least 3 characters long.</p>
                        )}
                        {errors.description.type === 'maxLength' && (
                            <p className="text-red-500">Description must be less than 600 characters long.</p>
                        )}
                    </div>
                )}
                <div className="mb-4 relative">
                    <label htmlFor="images" className="text-lg font-semibold block">Images</label>
                    <div className="group absolute left-16 top-2">
                        <AiOutlineInfoCircle
                            className="cursor-pointer"
                        />
                        <span className="absolute top-[-10px] left-5 whitespace-nowrap scale-0 
                                rounded bg-slate-700 p-2 text-xs text-white group-hover:scale-100"
                        >
                            Use horizontal images for the best visualization.
                        </span>
                    </div>
                    <p className="text-gray-600">The first image will be the cover (max 6 images)</p>
                    <input
                        type="file"
                        id="images"
                        {...register('images', {
                            required: true,
                        })}
                        accept=".jpg,.png,.jpeg"
                        multiple
                        className="w-full px-3 py-1.5 text-gray-700 bg-white border 
                            border-gray-300 rounded transition duration-150 ease-in-out
                            focus:bg-white focus:border-slate-600"
                    />
                    {errors.images && (
                        <div className="mb-4">
                            {errors.images.type === 'required' && (
                                <p className="text-red-500">At least 1 image is required.</p>
                            )}
                        </div>
                    )}
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