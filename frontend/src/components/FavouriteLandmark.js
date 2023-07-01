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
    fetchLandmark();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      if (userRef) {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFavourites(userData.favourites);
        }
      }
    };
    fetchUser();
  }, [userRef]);

  useEffect(() => {
    if (user && favourites.includes(id)) {
      setFavourited(true);
    } else {
      setFavourited(false);
    }
  }, [favourites, user, id]);

  const handleFavourite = async () => {
    try {
      if (favourited) {
        await updateDoc(userRef, {
          favourites: arrayRemove(id),
        });
        setFavourited(false);
      } else {
        await updateDoc(userRef, {
          favourites: arrayUnion(id),
        });
        setFavourited(true);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <div>
        {loading ? (
          <Spinner />
        ) : (
          user &&
          !isOwner &&
          (!favourited ? (
            <div
              className="flex items-center text-yellow-500 cursor-pointer"
              onClick={handleFavourite}
            >
              <BsBookmark className="mr-1" />
              <p>{favourited ? "Favourited" : "Favourite"}</p>
            </div>
          ) : (
            <div
              className="flex items-center text-yellow-800 cursor-pointer"
              onClick={handleFavourite}
            >
              <BsBookmarkFill className="mr-1" />
              <p>{favourited ? "Favourited" : "Favourite"}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};
