import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import bulgaria from '../assets/images/bulgaria.jpg';
import { Spinner } from "../components/Spinner";
import { LandmarkCategory } from "../components/LandmarkCategory";
import { LandmarkData } from "../types/landmarkTypes";

export const Home = () => {
    const [loading, setLoading] = useState(true);
    const [smallLandmarks, setSmallLandmarks] = useState<LandmarkData[]>([]);
    const [largeLandmarks, setLargeLandmarks] = useState<LandmarkData[]>([]);

    useEffect(() => {
        const fetchLandmarks = async (size: 'large' | 'small') => {
            try {
                const landmarksRef = collection(db, 'landmarks');
                const q = query(
                    landmarksRef,
                    where('size', '==', size),
                    orderBy('timestamp', 'desc'),
                    limit(4),
                );
                const querySnap = await getDocs(q);
                const landmarks: LandmarkData[] = [];
                querySnap.forEach((doc) => {
                    return landmarks.push({
                        id: doc.id,
                        data: doc.data() as LandmarkData['data'],
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
                    alt="landscape"
                    />
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
                            {smallLandmarks?.length > 0 && (
                                <LandmarkCategory landmarks={smallLandmarks} category={"small"} />
                            )}
                            {largeLandmarks?.length > 0 && (
                                <LandmarkCategory landmarks={largeLandmarks} category={"large"} />
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