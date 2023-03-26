import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { LandmarkItem } from "../components/LandmarkItem";
import { Spinner } from "../components/Spinner";
import { db } from "../firebase";

export const Category = () => {
    const [landmarks, setLandmarks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedLandmark, setLastFetchedLandmark] = useState(null);
    const params = useParams();

    useEffect(() => {
        const fetchLandmarks = async () => {
            try {
                const landmarkRef = collection(db, 'landmarks');
                const q = query(
                    landmarkRef,
                    where('size', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(8),
                );
                const querySnap = await getDocs(q);
                const lastVisible = querySnap.docs[querySnap.docs.length - 1];
                setLastFetchedLandmark(lastVisible);
                const landmarks = [];
                querySnap.forEach((doc) => {
                    return landmarks.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                setLandmarks(landmarks);
                setLoading(false);
            } catch (error) {
                toast.error('Could not fetch landmarks.');
            }
        };
        fetchLandmarks();
    }, [params.categoryName]);

    const onFetchMoreLandmarks = async () => {
        try {
            const landmarkRef = collection(db, 'landmarks');
            const q = query(
                landmarkRef,
                where('size', '==', params.categoryName),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedLandmark),
                limit(4),
            );
            const querySnap = await getDocs(q);
            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastFetchedLandmark(lastVisible);
            const landmarks = [];
            querySnap.forEach((doc) => {
                return landmarks.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setLandmarks((prevState) => {
                return [...prevState, ...landmarks]
            });
            setLoading(false);
        } catch (error) {
            toast.error('Could not fetch landmarks.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-3">
            <h1 className="text-3xl text-center mt-6 mb-6 font-bold">
                {params.categoryName === 'small' ? 'Small landmarks' : 'Large landmarks'}
            </h1>
            {loading ? (
                <Spinner />
            ) : landmarks && landmarks?.length > 0 ? (
                <>
                    <main>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {landmarks.map((landmark) => {
                                return <LandmarkItem
                                    key={landmark.id}
                                    id={landmark.id}
                                    landmark={landmark.data}
                                />
                            })}
                        </ul>
                    </main>
                    {lastFetchedLandmark && landmarks?.length > 8 && (
                        <div className="flex justify-center items-center">
                            <button
                                onClick={onFetchMoreLandmarks}
                                className="bg-white px-3 py-1.5 text-gray-700 border 
                                           border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded
                                           transition duration-150 ease-in-out"
                            >
                                Load more</button>
                        </div>
                    )}
                </>
            ) : (
                <p>There are no {params.categoryName === 'small' ? 'small' : 'large'} landmarks available.</p>
            )}
        </div>
    );
};