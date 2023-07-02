import { getAuth } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { Spinner } from "./Spinner";

export const LikeLandmark = ({ id, likes }) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState(null);
  const [likesCount, setLikesCount] = useState(likes.length);
  const auth = getAuth();
  const user = auth.currentUser;
  const isOwner = user?.uid === ownerId;

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
    if (user && likes.includes(user.uid)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [likes, user]);

  const handleLike = async () => {
    try {
      const likesRef = doc(db, "landmarks", id);
      const updateValue = liked ? arrayRemove(user.uid) : arrayUnion(user.uid);
      await updateDoc(likesRef, { likes: updateValue });
      setLiked(!liked);
      const newLikesCount = liked ? likesCount - 1 : likesCount + 1;
      setLikesCount(newLikesCount);
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
          className={`flex items-center ${
            liked ? "text-red-800" : "text-rose-500"
          } cursor-pointer`}
          onClick={handleLike}
        >
          {liked ? (
            <AiFillHeart className="mr-1" />
          ) : (
            <AiOutlineHeart className="mr-1" />
          )}
          <p>
            {likesCount} {likesCount === 1 ? "Like" : "Likes"}
          </p>
        </div>
      )}

      {user && isOwner && (
        <p className="text-red-800">
          {likesCount} {likesCount === 1 ? "Like" : "Likes"}
        </p>
      )}
    </>
  );
};
