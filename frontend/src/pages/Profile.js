import { getAuth, updateProfile } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { FcLandscape } from 'react-icons/fc';
import { LandmarkItem } from '../components/LandmarkItem';

export const Profile = () => {
    const auth = getAuth();
    const [changeDetail, setChangeDetail] = useState(false);
    const [landmarks, setLandmarks] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });

    const { username, email } = formData;
    const navigate = useNavigate();

    const onLogout = () => {
        auth.signOut();
        navigate('/');
    };

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== username) {
                await updateProfile(auth.currentUser, {
                    displayName: username,
                });

                const docRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(docRef, {
                    username,
                });
                toast.success('Profile details updated.');
            };
        } catch (error) {
            toast.error('Could not update the profile details.');
        }
    }

    useEffect(() => {
        const fetchUserLandmarks = async () => {
            const landmarkRef = collection(db, 'landmarks');
            const q = query(
                landmarkRef,
                where('userRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc')
            );
            const querySnap = await getDocs(q);
            let landmarks = [];
            querySnap.forEach((doc) => {
                return landmarks.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setLandmarks(landmarks);
            setLoading(false);
        };
        fetchUserLandmarks();
    }, [auth.currentUser.uid]);

    const onDelete = async (landmarkId) => {
        if(window.confirm('Are you sure you want to delete?')){
            await deleteDoc(doc(db, 'landmarks', landmarkId));
            const updatedLandmarks = landmarks.filter((landmark) => {
                return landmark.id !== landmarkId;
            });
            setLandmarks(updatedLandmarks);
            toast.success('Succesfully deleted the landmark.');
        };
    };

    const onEdit = (landmarkId) => {
        navigate(`/edit-landmark/${landmarkId}`);
    };

    return (
        <>
            <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
                <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
                <div className='w-full md:w-[50%] mt-6 px-3'>
                    <form>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            disabled={!changeDetail}
                            onChange={onChange}
                            className={`w-full px-4 py-2 text-xl mb-6
                                     text-gray-700 bg-gray-300 border border-gray-300
                                       rounded transition ease-in-out
                                       ${changeDetail && 'bg-zinc-50'}`}
                        />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            disabled
                            className='w-full px-4 py-2 text-xl mb-6
                                     text-gray-700 bg-gray-300 border border-gray-300
                                       rounded transition ease-in-out'
                        />
                        <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
                            <p className='flex items-center'>Do you want to change your username?
                                <span
                                    onClick={() => {
                                        changeDetail && onSubmit();
                                        setChangeDetail((prevState => !prevState));
                                    }}
                                    className='text-green-600 hover:text-green-700 hover:underline
                                                 transition ease-in-out duration-200 ml-1 cursor-pointer'
                                >
                                    {changeDetail ? "Save change" : "Edit"}
                                </span>
                            </p>
                            <p className='text-blue-600 hover:text-blue-800 hover:underline
                                            transition duration-200 ease-in-out cursor-pointer'
                                onClick={onLogout}
                            >
                                Sign out
                            </p>
                        </div>
                    </form>
                    <button
                        type="submit"
                        className='w-full bg-slate-600 text-blue-50 px-7 py-3 
                               text-sm font-medium uppercase rounded shadow-md
                             hover:bg-slate-700 transition duration-150 ease-in-out
                             active:bg-slate-800'>
                        <Link to="/create-landmark" className='flex justify-center items-center'>
                            <FcLandscape className='mr-2 text-2xl bg-blue-50 p-1 rounded-full w-7' />
                            Mark a landmark
                        </Link>
                    </button>
                </div>
            </section>
            <div className='max-w-6xl px-3 mt-6 mx-auto'>
                <h2 className='text-2xl text-center font-semibold mb-6 pb-4 border-b-gray-300 border-b-2'>My marked landmarks</h2>
                {!loading && landmarks?.length > 0 && (
                    <>
                        <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                            {landmarks.map((landmark) => {
                                return <LandmarkItem
                                    key={landmark.id}
                                    id={landmark.id}
                                    landmark={landmark.data}
                                    onDelete={() => onDelete(landmark.id)}
                                    onEdit={() => onEdit(landmark.id)}
                                />;
                            })}
                        </ul>
                    </>
                )}
                {landmarks?.length === 0 && (
                    <p className='text-[22px] text-center  italic mt-10'>You have no marked landmarks yet.</p>
                )}
            </div>
        </>
    );
};