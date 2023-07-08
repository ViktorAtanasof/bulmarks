import { getAuth } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { Spinner } from "./Spinner";

export const FavouriteLandmark = ({ id }) => {
  const [favourites, setFavourites] = useState([]);
  const [favourited, setFavourited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const isOwner = user?.uid === ownerId;
  const userRef = user ? doc(db, "users", user?.uid) : null;

  useEffect(() => {
    const fetchLandmark = async () => {
      const docRef = doc(db, "landmarks", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOwnerId(docSnap.data().userRef);
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      if (user) {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFavourites(userData.favourites);
        }
      }
    };

    fetchLandmark();
    fetchUser();
  }, [id, user, userRef]);

  useEffect(() => {
    if (user && favourites.includes(id)) {
      setFavourited(true);
    } else {
      setFavourited(false);
    }
  }, [favourites, user, id]);

  const handleFavourite = async () => {
    try {
      const updateValue = favourited ? arrayRemove(id) : arrayUnion(id);
      await updateDoc(userRef, { favourites: updateValue });
      setFavourited(!favourited);
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      {user && !isOwner && (
        <div
          className={`flex items-center ${favourited ? "text-yellow-800" : "text-yellow-500"
            } cursor-pointer`}
          onClick={handleFavourite}
        >
          {favourited ? (
            <BsBookmarkFill className="mr-1" />
          ) : (
            <BsBookmark className="mr-1" />
          )}
          <p>{favourited ? "Favourited" : "Favourite"}</p>
        </div>
      )}
    </>
  );
};
