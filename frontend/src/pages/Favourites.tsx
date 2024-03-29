import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { LandmarkItem } from "../components/LandmarkItem";
import { LandmarkData } from "../types/landmarkTypes";
import { UserData } from "../types/authTypes";
import { toast } from "react-toastify";

export const Favourites = () => {
  const auth = getAuth();
  const [favourites, setFavourites] = useState<LandmarkData[]>([]);
  const [loading, setLoading] = useState(true);
  const userRef = collection(db, "users");
  const landmarkRef = collection(db, "landmarks");

  const fetchUserFavorites = async (
    userData: UserData,
    landmarkRef: CollectionReference<DocumentData>
  ) => {
    const promises = userData.favourites.map((landmarkId) =>
      getDoc(doc(landmarkRef, landmarkId))
    );
    const landmarks = await Promise.all(promises);
    return landmarks.map((docSnap) => ({
      id: docSnap.id,
      data: docSnap.data() as LandmarkData["data"],
    }));
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const q = query(userRef, where("email", "==", auth.currentUser?.email));
        const userData = (await getDocs(q)).docs[0].data() as UserData;
        const userFavourites = await fetchUserFavorites(userData, landmarkRef);
        setFavourites(userFavourites);
      } catch (error) {
        toast.error("Error fetching user favorites");
        console.error("Error fetching user favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [auth.currentUser?.email, landmarkRef, userRef]);

  return (
    <>
      <section className="max-w-6xl px-3 mt-6 mx-auto">
        <h1 className="text-3xl text-center mt-6 font-bold text-secondary-color">
          My Favourites
        </h1>
        {!loading && favourites?.length > 0 && (
          <>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {favourites.map((landmark) => {
                return (
                  <LandmarkItem
                    key={landmark.id}
                    id={landmark.id}
                    landmark={landmark.data}
                  />
                );
              })}
            </ul>
          </>
        )}
        {!loading && favourites?.length === 0 && (
          <p className="text-[22px] text-center italic mt-10 text-secondary-color">
            You have no favourited landmarks yet.
          </p>
        )}
      </section>
    </>
  );
};
