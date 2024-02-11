import { DocumentData, collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LandmarkItem } from "../components/LandmarkItem";
import { Spinner } from "../components/Spinner";
import { db } from "../firebase";
import { LandmarkData } from "../types/landmarkTypes";

export const Landmarks = () => {
    const [landmarks, setLandmarks] = useState<LandmarkData[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastFetchedLandmark, setLastFetchedLandmark] = useState<DocumentData | null>(null);
    const [hasMoreLandmarks, setHasMoreLandmarks] = useState(false);

    useEffect(() => {
        const fetchLandmarks = async () => {
            try {
                const landmarkRef = collection(db, 'landmarks');
                const q = query(
                    landmarkRef,
                    orderBy('timestamp', 'desc'),
                    limit(8),
                );
                const querySnap = await getDocs(q);
                setHasMoreLandmarks(querySnap.size >= 8);
                const lastVisible = querySnap.docs[querySnap.docs.length - 1];
                setLastFetchedLandmark(lastVisible);
                const landmarks: LandmarkData[] = [];
                querySnap.forEach((doc) => {
                    return landmarks.push({
                        id: doc.id,
                        data: doc.data() as LandmarkData['data'],
                    });
                });
                setLandmarks(landmarks);
                setLoading(false);
            } catch (error) {
                toast.error('Could not fetch landmarks.');
            }
        };
        fetchLandmarks();
    }, []);

    const onFetchMoreLandmarks = async () => {
        try {
            const landmarkRef = collection(db, 'landmarks');
            const q = query(
                landmarkRef,
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedLandmark),
                limit(4),
            );
            const querySnap = await getDocs(q);
            setHasMoreLandmarks(querySnap.size >= 4);
            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastFetchedLandmark(lastVisible);
            const landmarks: LandmarkData[] = [];
            querySnap.forEach((doc) => {
                return landmarks.push({
                    id: doc.id,
                    data: doc.data() as LandmarkData['data'],
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
            <h1 className="text-3xl text-center mt-6 mb-6 font-bold text-secondary-color">All landmarks</h1>
            {loading ? (
                <Spinner />
            ) : landmarks?.length > 0 ? (
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
                    {hasMoreLandmarks && (
                        <div className="flex justify-center items-center">
                            <button
                                onClick={onFetchMoreLandmarks}
                                className="bg-secondary-color px-3 py-1.5 text-primary-color border 
                                           mb-6 mt-6 hover:text-accent-color rounded
                                           transition duration-300 ease-in-out"
                            >
                                Load more</button>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-2xl text-center italic my-12 text-secondary-color">There are no landmarks available.</p>
            )}
        </div>
    );
};