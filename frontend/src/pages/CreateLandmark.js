import { useState } from "react";
import { toast } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

export const CreateLandmark = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        size: "large",
        name: "",
        type: "",
        place: "",
        address: "",
        description: "",
        latitude: 0,
        longitude: 0,
        images: {},
    });

    const {
        size,
        name,
        type,
        place,
        address,
        description,
        latitude,
        longitude,
        images,
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

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (images?.length > 6) {
            setLoading(false);
            toast.error('Maximum 6 images are allowed.');
            return;
        };

        let geolocation = {};
        let location;
        if (geolocationEnabled) {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${address}
                &key=${process.env.REACT_APP_GEOCODE_API_KEY}`
            );
            const data = await response.json();
            console.log(data);
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

            location = data.status === 'ZERO_RESULTS' && undefined;
            if (location === undefined) {
                setLoading(false);
                toast.error('Please enter a correct address.');
                return;
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
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
            [...images].map((img) => storeImage(img))
        ).catch((error) => {
            setLoading(false);
            toast.error('Images not uploaded.');
            return;
        });

        const formDataCopy = {
            ...formData,
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
            <form onSubmit={onSubmit}>
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
                    minLength={"4"}
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
                {!geolocationEnabled && (
                    <div className="flex space-x-6 justify-start mb-6">
                        <div>
                            <label htmlFor="latitude" className="text-lg font-semibold block">Latitude</label>
                            <input
                                type="number"
                                id="latitude"
                                value={latitude}
                                onChange={onChange}
                                required
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
                                value={longitude}
                                onChange={onChange}
                                required
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