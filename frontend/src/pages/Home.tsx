import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import bulgaria from "../assets/images/bulgaria.jpg";
import { Spinner } from "../components/Spinner";
import { LandmarkCategory } from "../components/LandmarkCategory";
import { Landmark, LandmarkData } from "../types/landmarkTypes";

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [landmarks, setLandmarks] = useState<{
    small: LandmarkData[];
    large: LandmarkData[];
  }>({ small: [], large: [] });

  useEffect(() => {
    const fetchLandmarks = async () => {
      try {
        const landmarksRef = collection(db, "landmarks");
        const smallQuery = query(
          landmarksRef,
          orderBy("timestamp", "desc"),
          where("size", "==", "small"),
          limit(4)
        );
        const largeQuery = query(
          landmarksRef,
          orderBy("timestamp", "desc"),
          where("size", "==", "large"),
          limit(4)
        );

        // Fetch data from both queries concurrently
        const [smallSnapshots, largeSnapshots] = await Promise.all([
          getDocs(smallQuery),
          getDocs(largeQuery),
        ]);

        const smallLandmarks = smallSnapshots.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as Landmark,
        }));
        const largeLandmarks = largeSnapshots.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as Landmark,
        }));

        setLandmarks({ small: smallLandmarks, large: largeLandmarks });
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLandmarks();
  }, []);

  // const fetchLandmarks = async () => {
  //   try {
  //     const landmarksRef = collection(db, "landmarks");
  //     const queries = [
  //       query(
  //         landmarksRef,
  //         orderBy("timestamp", "desc"),
  //         where("size", "==", "small"),
  //         limit(4)
  //       ),
  //       query(
  //         landmarksRef,
  //         orderBy("timestamp", "desc"),
  //         where("size", "==", "large"),
  //         limit(4)
  //       ),
  //     ];

  //     // Fetch data from both queries concurrently
  //     const snapshots = await Promise.all(queries.map(getDocs));

  //     const smallLandmarks: LandmarkData[] = [];
  //     const largeLandmarks: LandmarkData[] = [];

  //     // Process results for each query
  //     snapshots.forEach((snapshot, index) => {
  //       const size = index === 0 ? "small" : "large";
  //       const sizeArray = size === "small" ? smallLandmarks : largeLandmarks;

  //       snapshot.forEach((doc) => {
  //         const data = doc.data() as Landmark;
  //         sizeArray.push({ id: doc.id, data });
  //       });
  //     });

  //     setLandmarks({ small: smallLandmarks, large: largeLandmarks });
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <main>
      <section className="relative">
        <img
          className="w-full h-[500px] object-cover brightness-75"
          src={bulgaria}
          alt="landscape"
          width={2400}
          height={1798}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                text-center text-white"
        >
          <p className="text-sm md:text-2xl tracking-widest">
            EXPLORE THE BEST
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl">
            <span className="text-[#3c637a]">Bul</span>garian Land
            <span className="text-accent-color">marks</span>
          </h1>
        </div>
      </section>
      {loading ? (
        <Spinner />
      ) : (
        <section className="max-w-6xl mx-auto pt-4 space-y-6">
          {landmarks.small?.length === 0 && landmarks.large?.length === 0 && (
            <p className="text-4xl text-center italic my-12 text-secondary-color">
              No landmarks available
            </p>
          )}
          {landmarks.small?.length > 0 && (
            <LandmarkCategory landmarks={landmarks.small} category={"small"} />
          )}
          {landmarks.large?.length > 0 && (
            <LandmarkCategory landmarks={landmarks.large} category={"large"} />
          )}
        </section>
      )}
    </main>
  );
};
