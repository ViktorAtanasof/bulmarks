import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';

export const OAuth = () => {
    const navigate = useNavigate();

    const onGooogleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const username = user.displayName.split(' ').join('');
            
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if(!docSnap.exists()) {
                await setDoc(docRef, {
                    username: username,
                    email: user.email,
                    timestamp: serverTimestamp()
                });
            }
            navigate('/');
        } catch(error) {
            toast.error('Could not authorize with Google.');
            console.log(error);
        }
    };

    return (
        <button type="button" onClick={onGooogleClick} className="flex items-center justify-center w-full py-3 px-7
                         bg-red-700 text-blue-50 uppercase text-sm font-medium
                         hover:bg-red-800 transition duration-150 ease-in-out 
                         active:bg-red-900 shadow-md rounded">
            <FcGoogle className="text-2xl bg-blue-50 rounded-full mr-2" />
            Continue with Google
        </button>
    );
};