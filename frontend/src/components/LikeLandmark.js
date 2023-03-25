import { getAuth } from 'firebase/auth';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { Spinner } from './Spinner';

export const LikeLandmark = ({
    id,
    likes
}) => {
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [ownerId, setOwnerId] = useState(null);
    const [likesCount, setLikesCount] = useState(likes.length);
    const auth = getAuth();
    const user = auth.currentUser;
    const isOwner = user?.uid === ownerId;

    useEffect(() => {
        const fetchLandmark = async () => {
            const docRef = doc(db, 'landmarks', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setOwnerId(docSnap.data().userRef);
                setLoading(false);
            }
        };
        fetchLandmark();
    }, [id]);

    const likesRef = doc(db, 'landmarks', id);

    useEffect(() => {
        if (user && likes.includes(user.uid)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [likes, user]);

    const handleLike = async () => {
        try {
            if (liked) {
                await updateDoc(likesRef, {
                    likes: arrayRemove(user.uid),
                });
                setLiked(false);
                console.log('unliked');
            } else {
                await updateDoc(likesRef, {
                    likes: arrayUnion(user.uid),
                });
                setLiked(true);
                console.log('liked');
            }
            const newLikesCount = liked ? likesCount - 1 : likesCount + 1;
            setLikesCount(newLikesCount);
        } catch (error) {
            toast.error('Idk.');
        }
    };

    return (
        <>
            <div onClick={handleLike}>
                {loading ? (
                    <Spinner />
                ) : user && !isOwner && (
                    !liked
                        ? (
                            <div className='flex items-center'>
                                <AiOutlineHeart className='cursor-pointer mr-1' />
                                <p> {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</p>
                            </div>
                        )
                        : (
                            <div className='flex items-center'>
                                <AiFillHeart className="text-red-700 cursor-pointer mr-1" />
                                <p> {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</p>
                            </div>
                        )
                )
                }
            </div>
            <div>
                {user && isOwner && (
                    <p> {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</p>
                )}
            </div>
        </>
    );
};