import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LandmarkItem } from "../components/LandmarkItem";
import { db } from "../firebase";
import bulgaria from '../assets/images/bulgaria.webp';
import { Spinner } from "../components/Spinner";

export const Home = () => {
    const [loading, setLoading] = useState(true);
    const [smallLandmarks, setSmallLandmarks] = useState(null);
    const [largeLandmarks, setLargeLandmarks] = useState(null);

    useEffect(() => {
        const fetchLandmarks = async (size) => {
            try {
                const landmarksRef = collection(db, 'landmarks');
                const q = query(
                    landmarksRef,
                    where('size', '==', size),
                    orderBy('timestamp', 'desc'),
                    limit(4),
                );
                const querySnap = await getDocs(q);
                const landmarks = [];
                querySnap.forEach((doc) => {
                    return landmarks.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                if (size === 'small') {
                    setSmallLandmarks(landmarks);
                  } else if (size === 'large') {
                    setLargeLandmarks(landmarks);
                  }
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandmarks('small');
        fetchLandmarks('large');
    }, []);

    return (
        <main>
            <section className="relative">
                <img
                    className="w-full h-[500px] object-cover brightness-75"
                    src={bulgaria}
                    alt="landscape" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                text-center text-white">
                    <p className="text-sm md:text-2xl tracking-widest">EXPLORE THE BEST</p>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl">
                        <span className="text-[#3c637a]">Bul</span>garian Land<span className="text-[#03cb97]">marks</span>
                    </h1>
                </div>
            </section>
            <div>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <section className="max-w-6xl mx-auto pt-4 space-y-6">
                            {smallLandmarks && smallLandmarks?.length > 0 && (
                                <div className="m-2 mb-6">
                                    <h2 className="px-3 text-2xl mt-6 font-semibold">Small landmarks</h2>
                                    <Link to="/category/small">
                                        <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                                            Show more small landmarks
                                        </p>
                                    </Link>
                                    <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                                        {smallLandmarks.map((landmark) => (
                                            <LandmarkItem
                                                key={landmark.id}
                                                landmark={landmark.data}
                                                id={landmark.id}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </section>
                        <section className="max-w-6xl mx-auto pt-4 space-y-6">
                            {largeLandmarks && largeLandmarks?.length > 0 && (
                                <div className="m-2 mb-6">
                                    <h2 className="px-3 text-2xl mt-6 font-semibold">Large landmarks</h2>
                                    <Link to="/category/large">
                                        <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                                            Show more large landmarks
                                        </p>
                                    </Link>
                                    <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                                        {largeLandmarks.map((landmark) => (
                                            <LandmarkItem
                                                key={landmark.id}
                                                landmark={landmark.data}
                                                id={landmark.id}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </section>
                    </>
                )}
                {smallLandmarks?.length === 0 && largeLandmarks?.length === 0 && (
                    <p className="text-4xl text-center italic">No landmarks available.</p>
                )}
            </div>
        </main>
    );
};