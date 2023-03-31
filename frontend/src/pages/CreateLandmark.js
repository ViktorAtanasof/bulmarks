import { useState } from "react";
import { toast } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

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

        let geolocation = {};
        let location;
        if (geolocationEnabled) {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${data.address}
                &key=${process.env.REACT_APP_GEOCODE_API_KEY}`
            );
            const fetchedData = await response.json();
            geolocation.lat = fetchedData.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = fetchedData.results[0]?.geometry.location.lng ?? 0;

            location = fetchedData.status === 'ZERO_RESULTS' && undefined;
            if (location === undefined) {
                setLoading(false);
                toast.error('Please enter a correct address.');
                return;
            }
        } else {
            geolocation.lat = data.latitude;
            geolocation.lng = data.longitude;
        };

        const storeImage = async (img) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const filename = `${auth.currentUser.uid}-${img.name}-${uuidv4()}`;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            });
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
                </div>
                <label htmlFor="name" className="text-lg mt-6 font-semibold block">Name</label>
                <input
                    type="text"
                    id="name"
                    {...register('name', {
                        required: true,
                        minLength: 5,
                        maxLength: 80,
                    })}
                    placeholder="Name"
                    className={`w-full px-4 py-2 text-xl 
                        text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700
                        focus:bg-white focus:border-slate-600 mb-4
                        ${errors.name && 'border-red-600 border-1'}`}
                />
                {errors.name && (
                    <div className='mb-4'>
                        {errors.name.type === 'required' && (
                            <p className="text-red-500">Name can't be an empty string.</p>
                        )}
                        {errors.name.type === 'minLength' && (
                            <p className="text-red-500">Name must be at least 5 characters long.</p>
                        )}
                        {errors.name.type === 'maxLength' && (
                            <p className="text-red-500">Password must be less than 80 characters long.</p>
                        )}
                    </div>
                )}
                <label htmlFor="type" className="text-lg font-semibold block">Type</label>
                <input
                    type="text"
                    id="type"
                    {...register('type', {
                        required: true,
                        minLength: 5,
                        maxLength: 30,
                    })}
                    placeholder="Type"
                    className={`w-full px-4 py-2 text-xl 
                        text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700
                        focus:bg-white focus:border-slate-600 mb-4
                        ${errors.type && 'border-red-600 border-1'}`}
                />
                {errors.type && (
                    <div className='mb-4'>
                        {errors.type.type === 'required' && (
                            <p className="text-red-500">Type can't be an empty string.</p>
                        )}
                        {errors.type.type === 'minLength' && (
                            <p className="text-red-500">Type must be at least 5 characters long.</p>
                        )}
                        {errors.type.type === 'maxLength' && (
                            <p className="text-red-500">Type must be less than 30 characters long.</p>
                        )}
                    </div>
                )}
                <label htmlFor="place" className="text-lg font-semibold block">City / Town / Village</label>
                <input
                    type="text"
                    id="place"
                    {...register('place', {
                        required: true,
                        minLength: 4,
                        maxLength: 20,
                    })}
                    placeholder="Location"
                    className={`w-full px-4 py-2 text-xl 
                        text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700
                        focus:bg-white focus:border-slate-600 mb-4
                        ${errors.place && 'border-red-600 border-1'}`}
                />
                {errors.place && (
                    <div className='mb-4'>
                        {errors.place.type === 'required' && (
                            <p className="text-red-500">Place can't be an empty string.</p>
                        )}
                        {errors.place.type === 'minLength' && (
                            <p className="text-red-500">Place must be at least 4 characters long.</p>
                        )}
                        {errors.place.type === 'maxLength' && (
                            <p className="text-red-500">Place must be less than 20 characters long.</p>
                        )}
                    </div>
                )}
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
                        maxLength: 700,
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
                            <p className="text-red-500">Description must be less than 700 characters long.</p>
                        )}
                    </div>
                )}
                <div className="mb-4">
                    <label htmlFor="images" className="text-lg font-semibold block">Images</label>
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