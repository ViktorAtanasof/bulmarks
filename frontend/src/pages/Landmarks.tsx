import {
  DocumentData,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LandmarkItem } from "../components/LandmarkItem";
import { Spinner } from "../components/Spinner";
import { db } from "../firebase";
import { LandmarkData } from "../types/landmarkTypes";
import { LandmarkFilter } from "../components/LandmarkFilter";
import { LandmarkSort } from "../components/LandmarkSort";

export const Landmarks = () => {
  const [landmarks, setLandmarks] = useState<LandmarkData[]>([]);
  const [filteredLandmarks, setFilteredLandmarks] = useState<LandmarkData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [lastFetchedLandmark, setLastFetchedLandmark] =
    useState<DocumentData | null>(null);
  const [hasMoreLandmarks, setHasMoreLandmarks] = useState(false);
  const [landmarkTypes, setLandmarkTypes] = useState<string[]>([]);

  const fetchLandmarks = async (fetchMore = false) => {
    try {
      const landmarkRef = collection(db, "landmarks");
      let q;
      if (fetchMore) {
        q = query(
          landmarkRef,
          orderBy("timestamp", "desc"),
          startAfter(lastFetchedLandmark),
          limit(4)
        );
      } else {
        q = query(landmarkRef, orderBy("timestamp", "desc"), limit(8));
      }
      const querySnap = await getDocs(q);
      setHasMoreLandmarks(querySnap.size >= 8);
      const fetchedLandmarks: LandmarkData[] = [];
      querySnap.forEach((doc) => {
        fetchedLandmarks.push({
          id: doc.id,
          data: doc.data() as LandmarkData["data"],
        });
      });
      // Extract unique landmark types from fetched data
      const fetchedTypes = fetchedLandmarks.map(
        (landmark) => landmark.data.type
      );
      const uniqueTypes = [...new Set(fetchedTypes)];

      if (fetchMore) {
        setLandmarks((prevLandmarks) => [
          ...prevLandmarks,
          ...fetchedLandmarks,
        ]);
        setFilteredLandmarks((prevLandmarks) => [
          ...prevLandmarks,
          ...fetchedLandmarks,
        ]);
      } else {
        setLandmarks(fetchedLandmarks);
        setFilteredLandmarks(fetchedLandmarks);
        setLandmarkTypes(uniqueTypes);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedLandmark(lastVisible);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch landmarks");
      console.error("Could not fetch landmarks:", error);
    }
  };

  // fetchLandmarks is not changing between renders
  useEffect(() => {
    fetchLandmarks();
    // eslint-disable-next-line
  }, []);

  const handleFetchMoreLandmarks = () => {
    fetchLandmarks(true);
  };

  const handleFilterChange = (filteredLandmarks: LandmarkData[]) => {
    setFilteredLandmarks(filteredLandmarks);
  };

  const handleSortChange = (sortBy: string) => {
    if (!sortBy) {
      // TODO
      // If no sort option is selected, reset the sort options only, while keeping the filtered landmarks
      setFilteredLandmarks([...landmarks]);
      return;
    }

    let sortedLandmarks: LandmarkData[] = [...filteredLandmarks];

    switch (sortBy) {
      case "size-asc":
        sortedLandmarks.sort((a, b) => {
          // Sort by size string in ascending order
          if (a.data.size === "small") return -1;
          if (a.data.size === "large") return 1;
          return 0; // Treat other values as equal
        });
        break;
      case "size-desc":
        sortedLandmarks.sort((a, b) => {
          // Sort by size string in descending order
          if (a.data.size === "large") return -1;
          if (a.data.size === "small") return 1;
          return 0; // Treat other values as equal
        });
        break;
      case "likes-desc":
        sortedLandmarks.sort(
          (a, b) => b.data.likes.length - a.data.likes.length
        );
        break;
      default:
        break;
    }

    setFilteredLandmarks(sortedLandmarks);
  };

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 mb-6 font-bold text-secondary-color">
        All landmarks
      </h1>
      {loading ? (
        <Spinner />
      ) : landmarks?.length > 0 ? (
        <>
          <main>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between m-[10px]">
              <LandmarkFilter
                landmarks={landmarks}
                landmarkTypes={landmarkTypes}
                onFilterChange={handleFilterChange}
              />
              <LandmarkSort onSortChange={handleSortChange} />
            </div>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredLandmarks.map((landmark) => {
                return (
                  <LandmarkItem
                    key={landmark.id}
                    id={landmark.id}
                    landmark={landmark.data}
                  />
                );
              })}
            </ul>
          </main>
          {hasMoreLandmarks && (
            <div className="flex justify-center items-center">
              <button
                onClick={handleFetchMoreLandmarks}
                className="bg-secondary-color px-3 py-1.5 text-primary-color border 
                                           mb-6 mt-6 hover:text-accent-color rounded
                                           transition duration-300 ease-in-out"
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-2xl text-center italic my-12 text-secondary-color">
          There are no landmarks available.
        </p>
      )}
    </div>
  );
};
