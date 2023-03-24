import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LandmarkItem } from "../components/LandmarkItem";
import { db } from "../firebase";

export const Home = () => {
    // Small landmarks
    const [smallLandmarks, setSmallLandmarks] = useState(null);
    useEffect(() => {
        const fetchLandmarks = async () => {
            try {
                const landmarksRef = collection(db, 'landmarks');
                const q = query(
                    landmarksRef,
                    where('size', '==', 'small'),
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
                setSmallLandmarks(landmarks);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandmarks();
    }, []);

    //Large landmarks
    const [largeLandmarks, setLargeLandmarks] = useState(null);
    useEffect(() => {
        const fetchLandmarks = async () => {
            try {
                const landmarksRef = collection(db, 'landmarks');
                const q = query(
                    landmarksRef,
                    where('size', '==', 'large'),
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
                setLargeLandmarks(landmarks);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandmarks();
    }, []);

    return (
        <main>
            <section>
                <h1>Home</h1>
            </section>
            <section className="max-w-6xl mx-auto pt-4 space-y-6">
                {smallLandmarks && smallLandmarks.length > 0 && (
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
                {largeLandmarks && largeLandmarks.length > 0 && (
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
        </main>
    );
};